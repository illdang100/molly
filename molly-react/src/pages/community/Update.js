import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import styled from "styled-components";
import Header from "../../components/Header";
import Board from "../../components/community/Board";
import styles from "../../css/Write.module.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { SyncLoader } from "react-spinners";

let CustomBody = styled.div`
  margin-top: 190px;
  padding: 0 5%;
`;

const Update = () => {
  let { id } = useParams();
  const [boardView, setBoardView] = useState(false);
  const [boardValue, setBoardValue] = useState("MEDICAL");
  const [petView, setPetView] = useState(false);
  const [petValue, setPetValue] = useState("NOT_SELECTED");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState({});
  const userId = localStorage.getItem("accountId");
  const [tooltip, setTooltip] = useState(false);

  const navigate = useNavigate();

  const titleRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setLoading(true);

    if (
      localStorage.getItem("accessToken") !== null ||
      localStorage.getItem("accessToken") !== ""
    ) {
      const config = {
        headers: {
          AccountId: userId,
        },
      };

      axiosInstance
        .get(`/api/board/${id}`, config)
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
        .get(`/api/board/${id}`)
        .then((response) => {
          console.log(response.data.data);
          setText(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    console.log("ckeditor render");
    const config = {
      headers: {
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

  // useEffect(() => {
  //   setLoading(true);
  //   setText({
  //     owner: true,
  //     title: "강아지 자랑",
  //     category: "MEDICAL",
  //     petType: "CAT",
  //     content:
  //       "<h2>안녕하세요.</h2><p><i>하는 것은 있으며, 실현에 얼마나 이것이다. 사랑의 바이며, 뜨고, 봄날의 것은 있는 일월과 피에 철환하였는가? 인생을 청춘의 이 이것이다. 설레는 동산에는 피가 듣기만 이것을 고동을 우리의 그것은 뿐이다. 것은 공자는 가치를 방지하는 그들의 것이다. 품으며, 속잎나고, 살았으며, 그러므로 보내는 말이다. 따뜻한 청춘의 따뜻한 때에, 그들의 간에 것이다. 곳이 이것을 심장은 그와 온갖 새 같은 가치를 주는 철환하였는가? 풍부하게 모래뿐일 이상을 힘차게 우리 살았으며, 열매를 가장 풀이 교향악이다. 생의 넣는 되려니와, 아니더면, 새 내려온 노년에게서 힘있다. 생명을 가치를 용기가 인간에 가치를 그들은 약동하다.</i><br><br>꽃이 청춘 대고, 교향악이다. 인생을 동력은 이상의 노년에게서 영락과 이상의 같은 보라. 피는 속잎나고, 우리 피부가 있는가? 풍부하게 목숨을 고동을 인생에 자신과 것이다. 생생하며, 청춘이 끝까지 아니한 청춘의 인생에 끓는 새가 것이다. 아니더면, 천자만홍이 풀밭에 보라. 그것은 주는 있는 피어나는 가지에 싸인 있으랴? 그들의 것이 얼마나 인간은 듣기만 청춘 못할 사람은 들어 부패뿐이다. 얼마나 영원히 그들은 위하여서 천지는 이것은 없으면 피고, 부패뿐이다. 미인을 놀이 어디 사랑의 같이 할지니, 이 부패뿐이다.<br><br>설레는 같은 살 위하여 얼음 바이며, 무한한 고동을 이 것이다. 온갖 자신과 것이 간에 밥을 철환하였는가? 보내는 이상의 끓는 생의 인도하겠다는 얼마나 것이다. 인생의 생생하며, 들어 있음으로써 그들의 굳세게 얼마나 새가 내는 사막이다. 피부가 있는 때에, 이상, 스며들어 끓는 내려온 고행을 이것을 아니다. 구하기 두기 실현에 피에 피가 곧 것이다. 가치를 크고 풍부하게 간에 아름다우냐? 피고 가치를 못하다 내려온 두기 아니한 대중을 무한한 쓸쓸하랴? 그들의 인간의 청춘을 따뜻한 생의 보는 피어나기 황금시대다. 얼음과 타오르고 못할 굳세게 고동을 눈이 있다.</p>",
  //     writerNick: "홀리몰리",
  //     createdAt: "2023-03-01 11:00:34",
  //     views: 392,
  //     writerProfileImage:
  //       "https://dimg.donga.com/wps/NEWS/IMAGE/2017/01/27/82617772.2.jpg",
  //     boardImages: [],
  //     comments: [
  //       {
  //         commentUserId: 1,
  //         commentWriteNick: "일당백",
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage:
  //           "https://dimg.donga.com/wps/NEWS/IMAGE/2017/01/27/82617772.2.jpg",
  //       },
  //       {
  //         commentUserId: 2343,
  //         commentWriteNick: "일당백",
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: "",
  //       },
  //       {
  //         commentUserId: 2343,
  //         commentWriteNick: "일당백",
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: "",
  //       },
  //     ],
  //     thumbsUp: false,
  //     likyCnt: 100,
  //   });
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    setTitle(text.title);
    setBoardValue(text.category);
    setPetValue(text.petType);
  }, [text]);

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

  const customUploadAdapter = (loader) => {
    let imgId = JSON.parse(localStorage.getItem("imgId"));

    return {
      upload() {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append("boardImage", file);

            axiosInstance
              .post(`/api/auth/board/image`, formData)
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
      window.location.href.includes("manager")
        ? axiosInstance
            .put(`/api/admin/board/${id}`, data, config)
            .then((response) => {
              if (response.data.code === 1) {
                localStorage.removeItem("imgId");
                navigate(`/manager/board/${id}`, {
                  replace: true,
                });
              }
            })
        : axiosInstance
            .put(`/api/auth/board/${id}`, data, config)
            .then((response) => {
              if (response.data.code === 1) {
                localStorage.removeItem("imgId");
                navigate(`/board/${id}/${boardValue}/${petValue}`, {
                  replace: true,
                });
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

  if (loading) {
    return (
      <div>
        <Header />
        <CustomBody>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SyncLoader
              color="#BF7A09"
              loading
              margin={5}
              size={10}
              speedMultiplier={1}
            />
          </div>
        </CustomBody>
      </div>
    );
  }

  if (Object.keys(text).length === 0) {
    return null;
  }

  return (
    <div>
      <Header />
      <CustomBody>
        <div style={{ position: "relative", width: "75%", margin: "auto" }}>
          <Board />
          <div className={styles.header}>
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
              data={text.content}
              config={{ extraPlugins: [uploadPlugin] }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                setContent(editor.getData());
                console.log({ event, editor, content });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </section>
          <div className={styles.footer}>
            {tooltip && <p>글자수를 초과하였습니다.</p>}
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

export default Update;
