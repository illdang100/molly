import React, { useEffect, useState } from "react";
//import Board from './Board';
import styles from "../css/ManagerBoardDetail.module.css";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineThumbUpAlt } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import { Button } from "../components/Button";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import styled from "styled-components";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";

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
  margin: 120px 0 0px;
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

const ManagerBoard = () => {
  let { id, commentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState({});
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [likeCnt, setLikeCnt] = useState(0);
  const [loginModal, setLoginModal] = useState(false);
  const [suspend, setSuspend] = useState(false);
  const [accuseEmail, setAccuseEmail] = useState("");
  const [login, setLogin] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    axiosInstance
      .get(`/api/admin/board/${id}`, config)
      .then((response) => {
        console.log(response.data.data);
        setText(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   setText({
  //     boardOwner: false,
  //     title: "강아지 자랑",
  //     category: "MEDICAL",
  //     petType: "CAT",
  //     content:
  //       "<p>제 강아지 예쁘죠?</p><figure><img src='/img/test.png'></img></figure><figure><img src='/img/CAT-logo.png'></figure>",
  //     writerNick: null,
  //     writerEmail: "writer@naver.com",
  //     createdAt: "2023-03-01 11:00:34",
  //     views: 392,
  //     writerProfileImage: null,
  //     comments: [
  //       {
  //         commentOwner: true,
  //         commentId: 19,
  //         commentAccountEmail: "testmolly@naver.com",
  //         commentWriteNick: "dfsf",
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: null,
  //       },
  //       {
  //         commentOwner: false,
  //         commentId: 1111,
  //         commentAccountEmail: "testmolly@naver.com",
  //         commentWriteNick: null,
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: null,
  //       },
  //       {
  //         commentOwner: false,
  //         commentId: 1111,
  //         commentAccountEmail: "testmolly@naver.com",
  //         commentWriteNick: null,
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: null,
  //       },
  //     ],
  //     thumbsUp: false,
  //     likyCnt: 100,
  //   });
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    if (text.thumbsUp === true) setLike(true);
    setLikeCnt(text.likyCnt);
  }, [text]);

  const deleteBoard = () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    if (text.boardOwner === false) {
      axiosInstance
        .delete(`/api/admin/board/${id}`, config)
        .then((response) => {
          console.log(response);
          console.log("삭제 완료");
          window.location.replace("/manager/list/ALL/ALL");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (text.boardOwner === true) {
        axiosInstance
          .delete(`/api/auth/board/${id}`, config)
          .then((response) => {
            console.log(response);
            console.log("삭제 완료");
            window.location.replace("/manager/list/ALL/ALL");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

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

  const handleLogout = () => {
    axios.delete(`http://localhost:8080/api/account/logout`, {
      headers: {
        "Refresh-Token": localStorage.getItem("refreshToken"),
      },
    });

    localStorage.clear();
    setLogin(false);
  };

  const handleLike = () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    if (localStorage.getItem("accessToken") === null) {
      handleLoginModal();
    } else {
      const fetchData = async function fetch() {
        let response;
        response = await axiosInstance.post(
          `/api/auth/board/${id}/liky`,
          null,
          config
        );
        console.log(response);
        if (response.data.code === 1) {
          setLike(response.data.data.thumbsUp);
          setLikeCnt(response.data.data.likyCount);
        } else {
          console.log("좋아요 실패");
        }
      };

      fetchData();
    }
  };

  const handleComment = () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    const data = {
      commentContent: comment,
    };

    if (localStorage.getItem("accessToken") === null) {
      handleLoginModal();
    } else {
      if (comment !== "") {
        const fetchData = async function fetch() {
          let response;
          response = await axiosInstance.post(
            `/api/auth/board/${id}/comment`,
            data,
            config
          );
          console.log(response);
          if (response.status === 201) {
            window.location.reload();
          } else {
            console.log("댓글 작성 실패");
          }
        };

        fetchData();
      }
    }
  };

  const handleCommentDelete = (commentId, owner) => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    owner === false
      ? axiosInstance
          .delete(`/api/admin/board/${id}/comment/${commentId}`, config)
          .then((response) => {
            console.log(response);
            window.location.reload();
          })
          .catch((e) => {
            console.log(e);
          })
      : axiosInstance
          .delete(`/api/auth/board/${id}/comment/${commentId}`, config)
          .then((response) => {
            console.log(response);
            window.location.reload();
          })
          .catch((e) => {
            console.log(e);
          });
  };

  const handleLoginModal = () => {
    setLoginModal(!loginModal);
  };

  const handleSuspend = (email) => {
    setSuspend(!suspend);
    setAccuseEmail(email);
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
          style={{ position: "relative", width: "75%", margin: "300px auto" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SyncLoader
              color="#BF7A09"
              loading
              margin={5}
              size={10}
              speedMultiplier={1}
            />
          </div>
        </div>
      </CustomBody>
    );
  }

  if (Object.keys(text).length === 0) {
    return null;
  }

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
        style={{ position: "relative", width: "75%", margin: "280px auto 0" }}
      >
        <div className={styles.boardTop}></div>
        <div className={styles.board}>
          <div className={styles.top}>
            <h2>{text.title}</h2>
            <div>
              <span>
                <div className={styles.profileuser}>
                  <img
                    className={styles.profileimg}
                    src={
                      text.writerProfileImage
                        ? text.writerProfileImage
                        : text.writerProfileImage === ""
                        ? process.env.PUBLIC_URL + "/img/profile.png"
                        : process.env.PUBLIC_URL + "/img/profile.png"
                    }
                    alt="프로필 이미지"
                  />
                </div>
              </span>
              <span>
                {text.writerNick === null ? "(알 수 없음)" : text.writerNick}
              </span>
              <span>{text.createdAt}</span>
            </div>
            {text.boardOwner === false ? (
              <>
                <span onClick={deleteBoard}>삭제</span>
                <span onClick={() => handleSuspend(text.writerEmail)}>
                  정지
                </span>
              </>
            ) : (
              <>
                <span onClick={deleteBoard}>삭제</span>
                <span onClick={() => navigate(`/manager/board/${id}/update`)}>
                  수정
                </span>
              </>
            )}
            <span>조회수 {text.views}</span>
          </div>
          <div className={styles.middle}>{ReactHtmlParser(text.content)}</div>
          <div className={styles.count}>
            {like === true ? (
              <span onClick={handleLike}>
                <IoMdThumbsUp color="#B27910" size="18px" />
              </span>
            ) : (
              <span onClick={handleLike}>
                <MdOutlineThumbUpAlt color="#B27910" size="18px" />
              </span>
            )}
            <span>{likeCnt}</span>
            <span>
              <FaComment color="#B27910" size="13px" />
            </span>
            <span>{text.comments.length}</span>
          </div>
        </div>
        {text.comments.map((item) => {
          return (
            <div
              className={styles.comment}
              style={
                String(item.commentId) === commentId
                  ? { backgroundColor: "#F5E7E7" }
                  : null
              }
            >
              <div className={styles.commentinfo}>
                <div>
                  <span>
                    <div className={styles.profilecommentuser}>
                      <img
                        className={styles.profileimg}
                        src={
                          item.commentProfileImage
                            ? item.commentProfileImage
                            : item.commentProfileImage === ""
                            ? process.env.PUBLIC_URL + "/img/profile.png"
                            : process.env.PUBLIC_URL + "/img/profile.png"
                        }
                        alt="프로필 이미지"
                      />
                    </div>
                  </span>
                  <span>
                    {item.commentWriteNick === null
                      ? "(알 수 없음)"
                      : item.commentWriteNick}
                  </span>
                  <span>{item.commentCreatedAt}</span>
                </div>
                {item.commentOwner === false ? (
                  <>
                    <span
                      onClick={() => {
                        handleCommentDelete(item.commentId, item.commentOwner);
                      }}
                      style={{ color: "#A19C97", fontWeight: "600" }}
                    >
                      삭제
                    </span>
                    <span
                      onClick={() => handleSuspend(item.commentAccountEmail)}
                      style={{ color: "#A19C97", fontWeight: "600" }}
                    >
                      정지
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      handleCommentDelete(item.commentId, item.commentOwner);
                    }}
                    style={{ color: "#A19C97", fontWeight: "600" }}
                  >
                    삭제
                  </span>
                )}
                <div>
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.footer}>
          <input
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleComment();
              }
            }}
          ></input>
          <Button onClick={handleComment} name={"등록"} />
        </div>
      </div>
      {suspend && (
        <Suspend
          onClick={handleSuspend}
          email={accuseEmail}
          setSuspend={setSuspend}
        />
      )}
    </CustomBody>
  );
};

const Suspend = (props) => {
  useEffect(() => {
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  let { id, commentId } = useParams();
  const now = new Date();
  const [suspendDate, setSuspendDate] = useState(1);
  const [modal, setModal] = useState(false);
  const [reason, setReason] = useState("");
  const [select, setSelect] = useState({
    spam: false,
    pornography: false,
    illegal: false,
    harmful: false,
    offensive: false,
    personal: false,
    unpleasant: false,
    animal: false,
    fake: false,
  });

  const handleClick = () => {
    setModal(!modal);
  };

  const handleSuspend = (email) => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    const data = {
      suspensionPeriod: Number(suspendDate),
      reason: reason,
      reportedEmail: email,
    };

    const fetchData = async function fetch() {
      let response;
      commentId !== undefined
        ? (response = await axiosInstance.post(
            `/api/admin/suspend/comment/${commentId}`,
            data,
            config
          ))
        : (response = await axiosInstance.post(
            `/api/admin/suspend/board/${id}`,
            data,
            config
          ));
      console.log(response);
      if (response.data.code === 1) {
        setModal(true);
      } else if (response.data.code === -1) {
        alert(response.data.msg);
      } else {
        console.log("정지 실패");
      }
    };

    fetchData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <span onClick={props.onClick}>✕</span>
        <div className={styles.accuseDetail}>
          <div>
            <p>신고대상자</p>
            <p>{props.email}</p>
          </div>
        </div>
        <h4>사유선택</h4>
        <div className={styles.reason}>
          <div
            onClick={() => {
              setSelect({
                spam: true,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("SPAM_PROMOTION");
            }}
            style={
              select.spam
                ? {
                    border: "1.5px solid #B27910",
                    borderRadius: "15px 15px 0 0",
                  }
                : {
                    borderRadius: "15px 15px 0 0",
                  }
            }
          >
            {select.spam ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>스팸홍보/도배글입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: true,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("PORNOGRAPHY");
            }}
            style={
              select.pornography
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.pornography ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>음란물입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: true,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("ILLEGAL_INFORMATION");
            }}
            style={
              select.illegal
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.illegal ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>불법정보를 포함하고 있습니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: true,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("HARMFUL_TO_MINORS");
            }}
            style={
              select.harmful
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.harmful ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>청소년에게 유해한 내용입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: true,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("OFFENSIVE_EXPRESSION");
            }}
            style={
              select.offensive
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.offensive ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>욕설/생명경시/혐오/차별적 표현입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: true,
                unpleasant: false,
                animal: false,
                fake: false,
              });
              setReason("PERSONAL_INFORMATION_EXPOSURE");
            }}
            style={
              select.personal
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.personal ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>개인정보 노출 게시물입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: true,
                animal: false,
                fake: false,
              });
              setReason("UNPLEASANT_EXPRESSION");
            }}
            style={
              select.unpleasant
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.unpleasant ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>불쾌한 표현이 있습니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: true,
                fake: false,
              });
              setReason("ANIMAL_CRUELTY");
            }}
            style={
              select.animal
                ? {
                    border: "1.5px solid #B27910",
                  }
                : null
            }
          >
            {select.animal ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>동물 학대 관련 내용입니다.</p>
          </div>
          <div
            onClick={() => {
              setSelect({
                spam: false,
                pornography: false,
                illegal: false,
                harmful: false,
                offensive: false,
                personal: false,
                unpleasant: false,
                animal: false,
                fake: true,
              });
              setReason("FAKE_INFORMATION");
            }}
            style={
              select.fake
                ? {
                    border: "1.5px solid #B27910",
                    borderRadius: "0 0 15px 15px",
                  }
                : {
                    borderRadius: "0 0 15px 15px",
                  }
            }
          >
            {select.fake ? (
              <span>
                <RiCheckboxCircleFill color="#B27910" size="25px" />
              </span>
            ) : (
              <span>
                <RiCheckboxBlankCircleLine color="#ded8d3" size="25px" />
              </span>
            )}
            <p>가짜 정보를 유포하고 있습니다.</p>
          </div>
        </div>
        <div className={styles.accusePeriod}>
          <span>정지 기간</span>
          <input
            type="number"
            min="1"
            value={suspendDate}
            onChange={(e) => {
              setSuspendDate(e.target.value);
            }}
          ></input>
          <span>해제 날짜</span>
          <div>
            {dateFormat(
              new Date(now.setDate(now.getDate() + Number(suspendDate)))
            )}
          </div>
        </div>
        <div
          className={styles.accuseBtn}
          onClick={() => handleSuspend(props.email)}
        >
          정지하기
        </div>
      </div>
      {modal && (
        <SuspendConfirmModal
          onClick={handleClick}
          setSuspend={props.setSuspend}
        />
      )}
    </div>
  );
};

function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;

  return date.getFullYear() + "-" + month + "-" + day;
}

const SuspendConfirmModal = (props) => {
  useEffect(() => {
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  const handleClick = () => {
    props.onClick();
    props.setSuspend();
  };

  return (
    <div className={styles.confirmContainer}>
      <div className={styles.confirmModal}>
        <p>정지가 완료되었습니다.</p>
        <div>
          <Button name="확인" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default ManagerBoard;
