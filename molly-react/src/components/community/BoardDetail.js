import React, { useEffect, useState } from "react";
//import Board from './Board';
import styles from "../../css/BoardDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineThumbUpAlt } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import { Button } from "../Button";
import Accuse from "./Accuse";
import LoginModal from "./LoginModal";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const BoardDetail = () => {
  let { id, category, pet } = useParams();
  const [boardAccuseModal, setBoardAccuseModal] = useState(false);
  const [commentAccuseModal, setCommentAccuseModal] = useState(false);
  const [accuseComment, setAccuseComment] = useState({
    commentId: "",
    accuseNick: "",
    accuseContent: "",
    accuseEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState({});
  const [commentList, setCommentList] = useState([]);
  const userId = localStorage.getItem("accountId");
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [likeCnt, setLikeCnt] = useState(0);
  const [loginModal, setLoginModal] = useState(false);
  const navigate = useNavigate();

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
          setCommentList(response.data.data.comments);
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
          setCommentList(response.data.data.comments);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

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
          alert(error.response.data.msg);
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

  // useEffect(() => {
  //   setLoading(true);
  //   setText({
  //     boardOwner: true,
  //     title: "강아지 자랑",
  //     category: "MEDICAL",
  //     petType: "CAT",
  //     content:
  //       "<p>제 강아지 예쁘죠?</p><figure><img src='/img/test.png'></img></figure>",
  //     writerNick: null,
  //     writerEmail: "writer@naver.com",
  //     createdAt: "2023-03-01 11:00:34",
  //     views: 392,
  //     writerProfileImage: null,
  //     comments: [
  //       {
  //         commentId: 1111,
  //         commentOwner: true,
  //         commentAccountEmail: "testmolly@naver.com",
  //         commentWriteNick: "dfsf",
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: null,
  //       },
  //       {
  //         commentId: 1111,
  //         commentOwner: false,
  //         commentAccountEmail: "testmolly@naver.com",
  //         commentWriteNick: null,
  //         commentCreatedAt: "2023-03-02 12:39:11",
  //         content: "예쁘네요",
  //         commentProfileImage: null,
  //       },
  //       {
  //         commentId: 1111,
  //         commentOwner: false,
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

  //   setCommentList([
  //     {
  //       commentId: 1,
  //       commentOwner: true,
  //       commentAccountEmail: "testmolly@naver.com",
  //       commentWriteNick: "dfsf",
  //       commentCreatedAt: "2023-03-02 12:39:11",
  //       content: "예쁘네요",
  //       commentProfileImage: null,
  //     },
  //     {
  //       commentId: 2,
  //       commentOwner: false,
  //       commentAccountEmail: "testmolly@naver.com",
  //       commentWriteNick: null,
  //       commentCreatedAt: "2023-03-02 12:39:11",
  //       content: "예쁘네요",
  //       commentProfileImage: null,
  //     },
  //     {
  //       commentId: 3,
  //       commentOwner: false,
  //       commentAccountEmail: "testmolly@naver.com",
  //       commentWriteNick: null,
  //       commentCreatedAt: "2023-03-02 12:39:11",
  //       content: "예쁘네요",
  //       commentProfileImage: null,
  //     },
  //   ]);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    if (text.thumbsUp === true) setLike(true);
    setLikeCnt(text.likyCnt);
  }, [text]);

  const handleBoardAccuseClick = () => {
    setBoardAccuseModal(!boardAccuseModal);
  };

  const handleCommentAccuseClick = () => {
    setCommentAccuseModal(!commentAccuseModal);
  };

  const deleteBoard = () => {
    axiosInstance
      .delete(`/api/auth/board/${id}`)
      .then((response) => {
        console.log(response);
        console.log("삭제 완료");
        window.location.replace("/list/ALL/ALL");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleLike = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (localStorage.getItem("accessToken") === null) {
      handleLoginModal();
    } else {
      const fetchData = async function fetch() {
        const response = await axiosInstance.post(
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
          const response = await axiosInstance.post(
            `/api/auth/board/${id}/comment`,
            data,
            config
          );
          console.log(response);
          if (response.status === 201) {
            if (commentList !== null) {
              setCommentList([
                ...commentList,
                {
                  commentId: response.data.data.commentId,
                  commentOwner: true,
                  commentAccountEmail: response.data.data.commentAccountEmail,
                  commentWriteNick: response.data.data.commentWriteNick,
                  commentCreatedAt: response.data.data.commentCreatedAt,
                  content: comment,
                  commentProfileImage: response.data.data.commentProfileImage,
                },
              ]);
              setComment("");
            } else {
              setCommentList([
                {
                  commentId: response.data.data.commentId,
                  commentOwner: true,
                  commentAccountEmail: response.data.data.commentAccountEmail,
                  commentWriteNick: response.data.data.commentWriteNick,
                  commentCreatedAt: response.data.data.commentCreatedAt,
                  content: comment,
                  commentProfileImage: response.data.data.commentProfileImage,
                },
              ]);
              setComment("");
            }
          } else {
            console.log("댓글 작성 실패");
          }
        };

        fetchData();
      }
    }
  };

  const handleCommentDelete = (commentId) => {
    axiosInstance
      .delete(`/api/auth/board/${id}/comment/${commentId}`)
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

  if (loading) {
    return (
      <div style={{ position: "relative", width: "75%", margin: "auto" }}>
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
    );
  }

  if (Object.keys(text).length === 0) {
    return null;
  }

  return (
    <div style={{ position: "relative", width: "75%", margin: "auto" }}>
      <div className={styles.boardTop}>
        <div>
          <h4 onClick={() => navigate(`/list/${category}/ALL`)}>
            {category === "FREE"
              ? "자유게시판"
              : category === "MEDICAL"
              ? "의료게시판"
              : "전체게시판"}
          </h4>
          <h4>{`>`}</h4>
          <h4 onClick={() => navigate(`/list/${category}/${pet}`)}>
            {pet === "DOG"
              ? "강아지"
              : pet === "CAT"
              ? "고양이"
              : pet === "RABBIT"
              ? "토끼"
              : "전체"}
          </h4>
        </div>
      </div>
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
          <span
            onClick={() => {
              handleBoardAccuseClick();
            }}
          >
            신고
          </span>
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
          {text.boardOwner && (
            <>
              <span
                onClick={() => {
                  navigate(`/board/${id}/${category}/update`);
                }}
              >
                수정
              </span>
              <span onClick={deleteBoard}>삭제</span>
            </>
          )}
        </div>
      </div>
      {commentList !== null || text.comments !== null
        ? commentList.map((item) => {
            return (
              <div className={styles.comment}>
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
                  {item.commentOwner ? (
                    <span
                      onClick={() => {
                        setCommentList(
                          commentList.filter(
                            (comment) => comment.commentId !== item.commentId
                          )
                        );
                        handleCommentDelete(item.commentId);
                      }}
                      style={{ color: "#A19C97", fontWeight: "600" }}
                    >
                      삭제
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        handleCommentAccuseClick();
                        setAccuseComment({
                          commentId: item.commentId,
                          accuseNick: item.commentWriteNick,
                          accuseContent: item.content,
                          accuseEmail: item.commentAccountEmail,
                        });
                      }}
                    >
                      신고
                    </span>
                  )}
                  <div>
                    <p>{item.content}</p>
                  </div>
                </div>
                {commentAccuseModal && (
                  <Accuse
                    type="comment"
                    commentId={accuseComment.commentId}
                    onClick={handleCommentAccuseClick}
                    accuseName={accuseComment.accuseNick}
                    accuseContent={accuseComment.accuseContent}
                    accuseEmail={accuseComment.accuseEmail}
                  />
                )}
              </div>
            );
          })
        : null}
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
      {boardAccuseModal && (
        <Accuse
          type="board"
          boardId={id}
          onClick={handleBoardAccuseClick}
          accuseName={text.writerNick}
          accuseContent={text.title}
          accuseEmail={text.writerEmail}
        />
      )}
      {loginModal && <LoginModal setLoginModal={handleLoginModal} />}
    </div>
  );
};

export default BoardDetail;
