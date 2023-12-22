import React, { useEffect, useState } from "react";
import styles from "../css/ManagerHome.module.css";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";
import { SyncLoader } from "react-spinners";

let CustomNavLink = styled(NavLink)`
  color: #afa79f;
  &:link {
    text-decoration: none;
  }
  &.active {
    color: #827870;
    font-weight: 900;
  }
`;

let CustomBody = styled.div`
  margin: 120px 0 50px;
  padding: 0 10%;
`;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    try {
      const errResponseStatus = error.response.status;
      const prevRequest = error.config;
      const errMsg = error.response.data.msg;

      if (errResponseStatus === 400 && errMsg === "만료된 토큰입니다") {
        const preRefreshToken = localStorage.getItem("refreshToken");
        if (preRefreshToken) {
          async function issuedToken() {
            const config = {
              headers: {
                "Refresh-Token": preRefreshToken,
              },
            };
            return await axios
              .post(`http://localhost:8080/api/token/refresh`, null, config)
              .then(async (res) => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                const reAccessToken = res.headers.get("Authorization");
                const reRefreshToken = res.headers.get("Refresh-token");
                localStorage.setItem("accessToken", reAccessToken);
                localStorage.setItem("refreshToken", reRefreshToken);

                prevRequest.headers.Authorization = reAccessToken;

                return await axios(prevRequest);
              })
              .catch((e) => {
                console.log("토큰 재발급 실패");
                if (e.response.status === 401) {
                  alert(e.response.data.msg);
                  window.location.replace("/");
                } else if (e.response.status === 403) {
                  alert(e.response.data.msg);
                  axios.delete(`http://localhost:8080/api/account/logout`, {
                    headers: {
                      "Refresh-Token": localStorage.getItem("refreshToken"),
                    },
                  });
                  localStorage.clear();
                  window.location.replace("/");
                }
              });
          }
          return await issuedToken();
        } else {
          throw new Error("There is no refresh token");
        }
      } else if (errResponseStatus === 400) {
        console.log(error.response.data);
      } else if (errResponseStatus === 401) {
        console.log("인증 실패");
        window.location.replace("/login");
      } else if (errResponseStatus === 403) {
        alert("권한이 없습니다.");
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const ManagerHome = () => {
  const [list, setList] = useState({});
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("board");
  const [page, setPage] = useState(0);
  const [detailView, setDetailView] = useState(false);
  const [id, setId] = useState(0);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    setLoading(true);
    setPage(0);
    getFetchData();
  }, [category]);

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const accountId = params.get("accountId");

    if (accessToken !== null && refreshToken !== null && accountId !== null) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accountId", accountId);
      setLogin(true);
    } else if (
      localStorage.getItem("accessToken") !== "null" &&
      localStorage.getItem("refreshToken") !== "null" &&
      localStorage.getItem("accessToken") !== null &&
      localStorage.getItem("refreshToken") !== null
    ) {
      setLogin(true);
    }
  }, []);

  // useEffect(() => {
  //   console.log("render");
  //   setLoading(true);

  //   setList({
  //     content: [],
  //     pageable: {
  //       sort: {
  //         empty: false,
  //         unsorted: false,
  //         sorted: true,
  //       },
  //       offset: 0,
  //       pageSize: 3,
  //       pageNumber: 0,
  //       paged: true,
  //       unpaged: false,
  //     },
  //     sort: {
  //       empty: false,
  //       unsorted: false,
  //       sorted: true,
  //     },
  //     size: 3,
  //     number: 0,
  //     first: true,
  //     last: false,
  //     numberOfElements: 3,
  //     empty: false,
  //   });
  //   setContent([]);
  //   setLoading(false);
  // }, [category]);

  const getFetchData = () => {
    let params;
    const pageNum = page;

    params = {
      page: pageNum,
      size: 10,
    };

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
      params: params,
    };

    category === "board"
      ? axiosInstance
          .get(`/api/admin/board-complaints`, config)
          .then((response) => {
            console.log(response.data.data);
            setList(response.data.data);
            setContent(response.data.data.content);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          })
      : axiosInstance
          .get(`/api/admin/comment-complaints`, config)
          .then((response) => {
            console.log(response.data.data);
            setList(response.data.data);
            setContent(response.data.data.content);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          });
  };

  const fetchMoreData = async () => {
    setPage((prev) => prev + 1);

    setLoading(true);
    let params;
    const pageNum = page;

    params = {
      page: pageNum,
      size: 10,
    };

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
      params: params,
    };

    category === "board"
      ? axiosInstance
          .get(`/api/admin/board-complaints`, config)
          .then((response) => {
            console.log(response.data.data);
            setList(response.data.data);
            setContent(content.concat(response.data.data.content));
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          })
      : axiosInstance
          .get(`/api/admin/comment-complaints`, config)
          .then((response) => {
            console.log(response.data.data);
            setList(response.data.data);
            setContent(content.concat(response.data.data.content));
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          });
    setLoading(false);
  };

  const handleLogout = () => {
    axios.delete(`http://localhost:8080/api/account/logout`, {
      headers: {
        "Refresh-Token": localStorage.getItem("refreshToken"),
      },
    });

    localStorage.clear();
    setLogin(false);
  };

  if (loading) {
    return (
      <CustomBody>
        <header className={styles.header}>
          <div>
            <div className={styles.logo}>
              <img
                src={process.env.PUBLIC_URL + "/molly-logo.png"}
                alt="molly-logo"
                width="130px"
              />
            </div>
            <div className={styles.navcontainer}>
              <nav className={styles.navigation}>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/manager/home"
                  >
                    Home
                  </CustomNavLink>
                </div>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/manager/list/ALL/ALL"
                  >
                    Community
                  </CustomNavLink>
                </div>
              </nav>
            </div>
            <div className={styles.logout}>
              {login ? (
                <span onClick={handleLogout}>로그아웃</span>
              ) : (
                <span
                  onClick={() => {
                    navigate("/manager/login");
                  }}
                >
                  로그인
                </span>
              )}
            </div>
          </div>
        </header>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "300px",
          }}
        >
          <SyncLoader
            color="#BF7A09"
            loading
            margin={5}
            size={10}
            speedMultiplier={1}
          />
        </div>
      </CustomBody>
    );
  }

  return (
    <div>
      <header className={styles.header}>
        <div>
          <div className={styles.logo}>
            <img
              src={process.env.PUBLIC_URL + "/molly-logo.png"}
              alt="molly-logo"
              width="130px"
            />
          </div>
          <div className={styles.navcontainer}>
            <nav className={styles.navigation}>
              <div>
                <CustomNavLink
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/manager/home"
                >
                  Home
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/manager/list/ALL/ALL"
                >
                  Community
                </CustomNavLink>
              </div>
            </nav>
          </div>
          <div className={styles.logout}>
            {login ? (
              <span onClick={handleLogout}>로그아웃</span>
            ) : (
              <span
                onClick={() => {
                  navigate("/manager/login");
                }}
              >
                로그인
              </span>
            )}
          </div>
        </div>
      </header>
      <CustomBody>
        <div className={styles.accuse}>
          <h1>🚨 신고목록</h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "50%", marginRight: "20px" }}>
              <div className={styles.category}>
                <div
                  onClick={() => setCategory("board")}
                  style={
                    category === "board" ? { backgroundColor: "#ebe7e3" } : null
                  }
                >
                  게시글
                </div>
                <div
                  onClick={() => setCategory("comment")}
                  style={
                    category === "comment"
                      ? { backgroundColor: "#ebe7e3" }
                      : null
                  }
                >
                  댓글
                </div>
              </div>
              <div className={styles.accuseBoard}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#AFA79F", fontWeight: "500" }}>
                    신고자
                  </span>
                  <span style={{ color: "#AFA79F", fontWeight: "500" }}>
                    신고대상자
                  </span>
                </div>
                {content.map((item) => {
                  return (
                    <div
                      key={item.complaintId}
                      onClick={() => {
                        setDetailView(true);
                        setId(item.complaintId);
                      }}
                    >
                      <div>
                        <p>{item.reporterEmail}</p>
                        <span>{item.createdAt}</span>
                      </div>
                      <p>{item.reportedEmail}</p>
                    </div>
                  );
                })}
                {list.last === false && (
                  <div className={styles.plus}>
                    <p onClick={fetchMoreData}>더보기</p>
                  </div>
                )}
              </div>
            </div>
            {detailView && <AccuseDetail id={id} category={category} />}
          </div>
        </div>
      </CustomBody>
    </div>
  );
};

const AccuseDetail = (props) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    if (props.category === "board") {
      axiosInstance
        .get(`/api/admin/board-complaint/${props.id}`, config)
        .then((response) => {
          console.log(response.data.data);
          setText(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axiosInstance
        .get(`/api/admin/comment-complaint/${props.id}`, config)
        .then((response) => {
          console.log(response.data.data);
          setText(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.id]);

  // useEffect(() => {
  //   console.log("detail render");
  //   setLoading(true);
  //   setText({
  //     commentComplaintId: 1,
  //     boardId: 3,
  //     commentId: 19,
  //     reportedItemId: 2,
  //     reporterEmail: "jyj000217@gmail.com",
  //     reportedEmail: "kakao_1234@naver.com",
  //     createdAt: "2023-06-07 12:29:35",
  //     reason: "스팸홍보/도배글입니다.",
  //   });
  //   setLoading(false);
  // }, [props.id]);

  const deleteAccuse = () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    if (props.category === "board") {
      axiosInstance
        .delete(`/api/admin/board-complaint/${props.id}`, config)
        .then((response) => {
          console.log(response);
          console.log("삭제 완료");
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axiosInstance
        .delete(`/api/admin/comment-complaint/${props.id}`, config)
        .then((response) => {
          console.log(response);
          console.log("삭제 완료");
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  if (loading) {
    <div className={styles.accuseDetail}>
      <SyncLoader
        color="#BF7A09"
        loading
        margin={5}
        size={10}
        speedMultiplier={1}
      />
    </div>;
  }

  if (Object.keys(text).length === 0) {
    return null;
  }

  return (
    <div className={styles.accuseDetail}>
      <div>
        <span>신고자</span>
        <span>{text.reporterEmail}</span>
        <br />
        <div style={{ height: "20px" }}></div>
        <span>신고대상자</span>
        <span>{text.reportedEmail}</span>
      </div>
      <div className={styles.accuseReason}>
        <p>{text.reason}</p>
        <p>{text.createdAt}</p>
      </div>
      <div className={styles.accuseBtn}>
        <Button
          name="이동"
          onClick={() => {
            text.commentId !== undefined
              ? navigate(`/manager/board/${text.boardId}/${text.commentId}`)
              : navigate(`/manager/board/${text.boardId}`);
          }}
        />
        <Button name="삭제" onClick={deleteAccuse} />
      </div>
    </div>
  );
};

export default ManagerHome;
