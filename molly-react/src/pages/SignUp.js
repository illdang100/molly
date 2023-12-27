import React, { useEffect, useRef, useState } from "react";
import styles from "../css/SignUp.module.css";
import { Button } from "../components/Button";
import axios from "axios";

const SignUp = () => {
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

  const [imgFile, setImgFile] = useState("");
  const [nickname, setNickName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [duplicate, setDuplicate] = useState(0);
  const [effective, setEffective] = useState(false);
  const [effectiveColor, setEffectiveColor] = useState("");

  const imgRef = useRef();
  let color = disabled ? "#D6CCC3" : "#B27910";

  // const accessToken = cookie.load("accessToken");
  // const refreshToken = cookie.load("refreshToken");
  // const accountId = cookie.load("accountId");

  // localStorage.setItem("accessToken", accessToken);
  // localStorage.setItem("refreshToken", refreshToken);
  // localStorage.setItem("accountId", accountId);

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
          if (error.response.data.msg === "사용 불가능한 닉네임입니다.") {
            setDisabled(true);
            setDuplicate(1);
          }
        } else if (errResponseStatus === 401) {
          console.log("인증 실패");
          //window.location.replace("/login");
        } else if (errResponseStatus === 403) {
          alert("권한이 없습니다.");
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nickname", nickname);
    if (imgRef.current.files[0] !== undefined) {
      formData.append("accountProfileImage", imgRef.current.files[0]);
    }

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/account/save`,
        formData
      );
      console.log(response);
      if (response.data.code === 1) {
        window.location.replace("/");
      } else if (response.data.code === -1) {
        console.log(response.data.msg);
      }
    };

    fetchData();
  };

  const checkDuplicate = (e) => {
    setDisabled(true);
    setDuplicate(0);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      nickname: nickname,
    };

    if (effective === false) {
      setEffectiveColor("red");
    } else if (effective === true) {
      setEffectiveColor("#827870");

      const fetchData = async function fetch() {
        const response = await axiosInstance.post(
          `/api/auth/account/duplicate`,
          data,
          config
        );
        console.log(response);
        if (response.data.code === 1) {
          setDisabled(false);
          setDuplicate(2);
        }
      };

      fetchData();
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length <= 10) {
      setNickName(e.target.value);
    } else {
      setNickName(e.target.value.slice(0, 10));
    }
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  const checkNickname = (e) => {
    const regExp = /^[가-힣a-zA-Z]{1,10}$/;
    if (regExp.test(e.target.value) === true) {
      setEffective(true);
    } else {
      setEffective(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="profileImg">
            <div className={styles.profileuser}>
              <img
                className={styles.profileimg}
                src={
                  imgFile
                    ? imgFile
                    : process.env.PUBLIC_URL + "/img/profile.png"
                }
                alt="프로필 이미지"
              />
            </div>
          </label>
          <label className={styles.profilelabel} htmlFor="profileImg">
            프로필 이미지 추가
          </label>
          <input
            name="accountProfileImage"
            className={styles.profileinput}
            type="file"
            accept="image/*"
            id="profileImg"
            onChange={saveImgFile}
            ref={imgRef}
          />
          <div className={styles.modal}>
            <span
              style={{ color: `${effectiveColor}` }}
              className={styles.nicknameguide}
            >
              한글/영어를 사용하여 10자 이내로 작성
            </span>
            <input
              name="nickname"
              type="text"
              value={nickname}
              onChange={handleChange}
              placeholder="닉네임"
              required
              onBlur={checkNickname}
              maxLength="10"
            />
            <span onClick={checkDuplicate}>중복확인</span>
          </div>
          {duplicate === 0 ? null : duplicate === 1 ? (
            <span style={{ color: "red" }} className={styles.duplicatepass}>
              사용 불가능한 닉네임입니다.
            </span>
          ) : (
            <span className={styles.duplicatepass}>
              사용 가능한 닉네임입니다.
            </span>
          )}
          <span>
            <Button disabled={disabled} name="저장" bgcolor={color} />
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
