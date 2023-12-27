import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styles from "../css/UserInfo.module.css";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";

const UserInfo = () => {
  const [user, setUser] = useState({}); // user 정보
  const [imgFile, setImgFile] = useState(""); // 이미지 파일 저장
  const [edit, setEdit] = useState(false); // 수정 버튼 on/off
  const [nickname, setNickName] = useState(""); // 닉네임 input value
  const [disabled, setDisabled] = useState(true); // 저장 버튼 활성화
  const [cursor, setCursor] = useState(""); // 저장 버튼 마우스 커서
  const [duplicate, setDuplicate] = useState(0); // 닉네임 안내 문구
  const [effective, setEffective] = useState(false); // 닉네임 유효성
  const [effectiveColor, setEffectiveColor] = useState(""); // 안내 문구 색 설정
  const [modal, setModal] = useState(false); // 프로필 이미지 업로드 모달
  const [save, setSave] = useState(false); // 저장 여부
  const [loading, setLoading] = useState(false); // 로딩 여부
  const [accountLogo, setAccountLogo] = useState("");
  const [email, setEmail] = useState("");

  let color = disabled ? "#D6CCC3" : "#B27910";

  const imgRef = useRef();

  //유저 정보 get
  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/api/auth/account`)
      .then((response) => {
        setUser(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   setUser({
  //     profileImage: "이미지 URL",
  //     nickname: "사용자 닉네임",
  //     provider: "kakao",
  //     email: "ddd@naver.com",
  //   });
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    setImgFile(user.profileImage);
    setNickName(user.nickname);
    setAccountLogo(user.provider);
    setEmail(user.email);
  }, [user]);

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

  // 닉네임 input value
  const handleChange = (e) => {
    if (e.target.value.length <= 10) {
      setNickName(e.target.value);
    } else {
      setNickName(e.target.value.slice(0, 10));
    }
  };

  // 이미지 업로드 patch
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };

    const formData = new FormData();
    if (imgRef.current.files[0] !== undefined) {
      formData.append("accountProfileImage", imgRef.current.files[0]);
    }

    const fetchData = async function fetch() {
      const response = await axiosInstance.patch(
        `/api/auth/account/profile-image`,
        formData
      );
      if (response.data.code === 1) {
        console.log("사용자 이미지 수정 완료");
        setModal(!modal);
      }
    };

    fetchData();
  };

  // 닉네임 유효성 검사
  const checkNickname = (e) => {
    const regExp = /^[가-힣a-zA-Z]{1,10}$/;
    if (regExp.test(e.target.value) === true) {
      setEffective(true);
    } else {
      setEffective(false);
    }
  };

  // 닉네임 중복 검사
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
          setCursor("pointer");
          setDuplicate(2);
        } else {
          setDisabled(true);
          setCursor("");
          setDuplicate(1);
        }
      };

      fetchData();
    }
  };

  // 기본 이미지 변경 delete
  const deleteImg = () => {
    setImgFile(null);

    const fetchData = async function fetch() {
      const response = await axiosInstance.delete(
        `/api/auth/account/profile-image`
      );
      if (response.data.code === 1) {
        console.log("기본 이미지 변경 완료");
        setModal(!modal);
      }
    };

    fetchData();
  };

  const handleModal = () => {
    setModal(!modal);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   console.log(imgRef.current.files[0]);
  // }

  // 닉네임 수정 patch
  const handleNicknameSave = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      nickname: nickname,
    };

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/account/nickname`,
        data,
        config
      );
      console.log(response);
      if (response.data.code === 1) {
        setEdit(!edit);
        setSave(true);
        console.log("닉네임 수정 완료");
      } else {
        console.log("유효성 검사 실패");
      }
    };

    fetchData();
  };

  const handleLeave = () => {
    axiosInstance
      .delete(`/api/auth/account`)
      .then((response) => {
        console.log(response);
        console.log("탈퇴 완료");
        localStorage.clear();
        window.location.replace("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className={styles.box} style={{ marginLeft: "100px" }}>
          loading
        </div>
      </div>
    );
  }

  if (Object.keys(user).length === 0) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className={styles.box}>
        <div className={styles.container}>
          <div className={styles.profile}>
            <form encType="multipart/form-data">
              <div className={styles.profileuser} onClick={handleModal}>
                <img
                  className={styles.profileimg}
                  src={
                    imgFile !== null
                      ? imgFile
                      : process.env.PUBLIC_URL + "/img/profile.png"
                  }
                  alt="프로필 이미지"
                />
              </div>
              {modal && <Profile onClick={handleModal} deleteImg={deleteImg} />}
              <input
                name="accountProfileImage"
                className={styles.profileinput}
                type="file"
                accept="image/*"
                id="profileImg"
                onChange={saveImgFile}
                ref={imgRef}
              />
            </form>
            {edit ? (
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
                {duplicate === 0 ? null : duplicate === 1 ? (
                  <span
                    style={{ color: "red" }}
                    className={styles.duplicatepass}
                  >
                    사용 불가능한 닉네임입니다.
                  </span>
                ) : (
                  <span className={styles.duplicatepass}>
                    사용 가능한 닉네임입니다.
                  </span>
                )}
                <span className={styles.cancle}>
                  <span
                    onClick={() => {
                      setEdit(false);
                    }}
                  >
                    취소
                  </span>
                </span>
                <span className={styles.save}>
                  <button
                    disabled={disabled}
                    style={{ color: `${color}`, cursor: `${cursor}` }}
                    onClick={handleNicknameSave}
                  >
                    저장
                  </button>
                </span>
              </div>
            ) : (
              <div className={styles.modal}>
                <div className={styles.nickname}>{nickname}</div>
                <span
                  className={styles.editicon}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  <MdModeEdit color="#827870" size="25px" />
                </span>
              </div>
            )}
            <div></div>
            <div></div>
          </div>
          <div className={styles.info}>
            <div>
              <h1>회원가입 정보</h1>
              {accountLogo === "kakao" ? (
                <img
                  src={process.env.PUBLIC_URL + "/img/kakao-account.png"}
                  alt="kakao 로고"
                  width="40px"
                  height="40px"
                />
              ) : (
                <img
                  src={process.env.PUBLIC_URL + "/img/google-account.png"}
                  alt="google 로고"
                  width="50px"
                />
              )}
              <p>{email}</p>
            </div>
            <div>
              <h1>탈퇴하기</h1>
              <button onClick={handleLeave}>탈퇴하기</button>
            </div>
            <p>
              탈퇴 시 작성하신 반려동물 등록 정보가 모두 삭제되며 복구되지
              않습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = (props) => {
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
    <div className={styles.modalContainer}>
      <div className={styles.profileUpdate}>
        <div>
          <h1>프로필 사진 바꾸기</h1>
        </div>
        <div>
          <label htmlFor="profileImg">
            <h2>사진 업로드</h2>
          </label>
        </div>
        <div>
          <h2 htmlFor="profileImg" onClick={props.deleteImg}>
            기본 이미지로 변경
          </h2>
        </div>
        <div>
          <p onClick={props.onClick}>취소</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
