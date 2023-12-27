import React, { useEffect, useState } from "react";
import styles from "../../css/Accuse.module.css";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import axios from "axios";
import { Button } from "../Button";

const Accuse = (props) => {
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
  const [modal, setModal] = useState(false);

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

  const handleAccuse = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      reason: reason,
      reportedEmail: props.accuseEmail,
    };

    if (reason !== "") {
      if (props.type === "board") {
        axiosInstance
          .post(`/api/auth/board/${props.boardId}/report`, data, config)
          .then((response) => {
            if (response.data.code === 1) {
              console.log(response.data.msg);
              setModal(true);
            }
          });
      } else {
        axiosInstance
          .post(`/api/auth/comment/${props.commentId}/report`, data, config)
          .then((response) => {
            if (response.data.code === 1) {
              console.log(response.data.msg);
              setModal(true);
            }
          });
      }
    }
  };

  const handleClick = () => {
    setModal(!modal);
    props.onClick();
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <span onClick={props.onClick}>✕</span>
        <h1>🚨 신고하기</h1>
        <div className={styles.accuseDetail}>
          <div>
            <p>작성자</p>
            <p>{props.accuseName}</p>
          </div>
          <div>
            <p>내용</p>
            <p>{props.accuseContent}</p>
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
        <div
          className={styles.accuseBtn}
          onClick={() => {
            handleAccuse();
          }}
        >
          신고하기
        </div>
      </div>
      {modal && <AccuseConfirmModal onClick={handleClick} />}
    </div>
  );
};

const AccuseConfirmModal = (props) => {
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

  return (
    <div className={styles.confirmContainer}>
      <div className={styles.confirmModal}>
        <p>신고가 완료되었습니다.</p>
        <div>
          <Button name="확인" onClick={props.onClick} />
        </div>
      </div>
    </div>
  );
};

export default Accuse;
