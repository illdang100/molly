import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import styled from "styled-components";
import Board from "../../components/community/Board";
import styles from "../../css/ManagerWrite.module.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { BsFillCheckSquareFill } from "react-icons/bs";

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
  margin-top: 190px;
  padding: 0 5%;
`;

const ManagerWrite = () => {
  console.log(window.location.href);
  const [boardView, setBoardView] = useState(false);
  const [boardValue, setBoardValue] = useState("MEDICAL");
  const [petView, setPetView] = useState(false);
  const [petValue, setPetValue] = useState("NOT_SELECTED");
  const [tooltip, setTooltip] = useState(false);
  const [login, setLogin] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const navigate = useNavigate();

  const titleRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // const test = `<p>dddd</p><img src="bcdefghijkl"></img><p>aaa</p>`;
  // const test2 = "<p>dddd</p><p>aaa</p>";
  // const arr = [...test];
  // const arr2 = [...test2];

  // console.log(arr, arr2);

  // for(var i=0; i < arr.length; i++){
  //     for(var j=0; j < arr2.length; j++){
  //         if(arr[i] === arr2[j]){
  //             arr.splice(i, 1);
  //         }
  //     }
  // }

  // console.log(arr)

  // let slice = [];
  // let imgUrl = [];
  // for(let i=0; i<arr.length; i++) {
  //     if(arr[i] === "s" && arr[i+1] === "r" && arr[i+2] === "c") {
  //         for(let k=i+5; k<arr.length; k++) {
  //             console.log(arr[k])
  //             slice.push(arr[k])
  //         }
  //         for(let j=0; j<slice.indexOf('"'); j++) {
  //             imgUrl.push(slice[j])
  //         }
  //     }
  // }
  // console.log(imgUrl)

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
    axios.delete(`https://mo11y.shop/api/account/logout`, {
      headers: {
        "Refresh-Token": localStorage.getItem("refreshToken"),
      },
    });

    localStorage.clear();
    setLogin(false);
  };

  useEffect(() => {
    console.log("ckeditor render");
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    const data = {
      boardImageIds: JSON.parse(localStorage.getItem("imgId")),
    };

    return () => {
      axiosInstance
        .post(`/api/auth/board/quit`, data, config)
        .then((response) => {
          if (response.data.code === 1) {
            console.log(response.data.msg);
            localStorage.removeItem("imgId");
          }
        });
    };
  }, []);

  const axiosInstance = axios.create({
    baseURL: "https://mo11y.shop",
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
                .post(`https://mo11y.shop/api/token/refresh`, null, config)
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
                    axios.delete(`https://mo11y.shop/api/account/logout`, {
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
          alert(error.response.data.msg);
          return error.response;
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

  const customUploadAdapter = (loader) => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    };
    let imgId = JSON.parse(localStorage.getItem("imgId"));

    return {
      upload() {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append("boardImage", file);

            axiosInstance
              .post(`/api/auth/board/image`, formData, config)
              .then((res) => {
                console.log(res);
                imgId !== null
                  ? imgId.push(res.data.data.boardImageId)
                  : (imgId = [res.data.data.boardImageId]);
                localStorage.setItem("imgId", JSON.stringify(imgId));
                resolve({
                  default: res.data.data.storedBoardImageUrl,
                });
              })
              .catch((err) => reject(err));
            // const reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onloadend = () => {
            //   resolve({
            //     default: reader.result,
            //   });
            // };
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const handleSubmit = () => {
    if (title.length < 1) {
      titleRef.current.focus();
      return;
    }

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    const data = {
      title: title,
      content: content,
      category: boardValue,
      petType: petValue,
      boardImageIds: JSON.parse(localStorage.getItem("imgId")),
    };

    console.log(data);

    if (content.length < 5000) {
      axiosInstance.post(`/api/admin/board`, data, config).then((response) => {
        if (response.data.code === 1) {
          localStorage.removeItem("imgId");
          navigate(`/manager/list/ALL/ALL`, { replace: true });
        }
      });
    } else {
      setTooltip(true);
    }
  };

  const handleCancle = () => {
    console.log("cancle");

    const config = {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    };

    const data = {
      boardImageIds: JSON.parse(localStorage.getItem("imgId")),
    };

    axiosInstance
      .post(`/api/auth/board/quit`, data, config)
      .then((response) => {
        if (response.data.code === 1) {
          console.log(response.data.msg);
          localStorage.removeItem("imgId");
          navigate(-1, { replace: true });
        }
      });
  };

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
        <div style={{ position: "relative", width: "75%", margin: "auto" }}>
          <Board />
          <div className={styles.managerTop}>
            <ul
              onClick={() => {
                setBoardView(!boardView);
              }}
            >
              <div className={styles.sort}>
                <span className={styles.default}>
                  {boardValue === "MEDICAL" ? "의료게시판" : "자유게시판"}
                </span>
                {boardView ? (
                  <span className={styles.boardCategory}>
                    <MdExpandLess size="25px" color="#AFA79F" />
                  </span>
                ) : (
                  <span className={styles.boardCategory}>
                    <MdExpandMore size="25px" color="#AFA79F" />
                  </span>
                )}
                {boardView && <BoardDropdown setValue={setBoardValue} />}
              </div>
            </ul>
            <ul
              onClick={() => {
                setPetView(!petView);
              }}
            >
              <div className={styles.sort}>
                <span className={styles.petdefault}>
                  {petValue === "DOG"
                    ? "강아지"
                    : petValue === "CAT"
                    ? "고양이"
                    : petValue === "RABBIT"
                    ? "토끼"
                    : "선택 안 함"}
                </span>
                {petView ? (
                  <span className={styles.boardCategory}>
                    <MdExpandLess size="25px" color="#AFA79F" />
                  </span>
                ) : (
                  <span className={styles.boardCategory}>
                    <MdExpandMore size="25px" color="#AFA79F" />
                  </span>
                )}
                {petView && <PetDropdown setValue={setPetValue} />}
              </div>
            </ul>
          </div>
          <div className={styles.title}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              ref={titleRef}
            ></input>
          </div>
          <section>
            <CKEditor
              editor={ClassicEditor}
              data=""
              config={{ extraPlugins: [uploadPlugin] }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                setContent(editor.getData());
                //console.log({ event, editor, content });
              }}
              onBlur={(event, editor) => {
                //console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                //console.log("Focus.", editor);
              }}
            />
          </section>
          <div className={styles.footer}>
            {tooltip && <p>글자수를 초과하였습니다.</p>}
            <div className={styles.notification}>
              <span>
                <BsFillCheckSquareFill color="#b27910" />
              </span>
              <span>공지글</span>
            </div>
            <span
              className={styles.numberOfChar}
            >{`${content.length}/5000`}</span>
            <span className={styles.cancleBtn}>
              <Button name="취소" onClick={handleCancle} />
            </span>
            <span className={styles.submitBtn}>
              <Button name="완료" onClick={handleSubmit} />
            </span>
          </div>
        </div>
      </CustomBody>
    </div>
  );
};

const BoardDropdown = (props) => {
  return (
    <div className={styles.dropdown}>
      <li
        onClick={() => {
          props.setValue("MEDICAL");
        }}
      >
        의료게시판
      </li>
      <li
        onClick={() => {
          props.setValue("FREE");
        }}
      >
        자유게시판
      </li>
    </div>
  );
};

const PetDropdown = (props) => {
  return (
    <div className={styles.petdropdown}>
      <li
        onClick={() => {
          props.setValue("NOT_SELECTED");
        }}
      >
        선택 안함
      </li>
      <li
        onClick={() => {
          props.setValue("DOG");
        }}
      >
        강아지
      </li>
      <li
        onClick={() => {
          props.setValue("CAT");
        }}
      >
        고양이
      </li>
      <li
        onClick={() => {
          props.setValue("RABBIT");
        }}
      >
        토끼
      </li>
    </div>
  );
};

export default ManagerWrite;
