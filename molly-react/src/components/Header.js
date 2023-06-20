import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../css/Header.module.css";
import styled from "styled-components";
import { RiAccountCircleLine } from "react-icons/ri";
import { TbDog, TbBell } from "react-icons/tb";
//import { useSelector } from 'react-redux';
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteId } from "../pages/store/user.js";

let CustomNavLink = styled(NavLink)`
  color: #afa79f;
  font-weight: 600;
  &:link {
    text-decoration: none;
  }
  &.active {
    color: #827870;
    font-weight: 900;
  }
`;

const Header = () => {
  const userDropdownRef = useRef(null);
  const petDropdownRef = useRef(null);
  const alarmRef = useRef(null);
  const [userView, setUserView] = useState(false);
  const [petView, setPetView] = useState(false);
  const [alarmView, setAlarmView] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alarmLoading, setAlarmLoading] = useState(false);
  const [iconView, setIconView] = useState(true);
  const [pet, setPet] = useState(null);
  const [alarm, setAlarm] = useState(null);
  const dispatch = useDispatch();

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  useEffect(() => {
    const handleOutsideClose = (e) => {
      if (userView && !userDropdownRef.current.contains(e.target))
        setUserView(false);
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [userView]);

  useEffect(() => {
    const handleOutsideClose = (e) => {
      if (petView && !petDropdownRef.current.contains(e.target))
        setPetView(false);
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [petView]);

  useEffect(() => {
    const handleOutsideClose = (e) => {
      if (alarmView && !alarmRef.current.contains(e.target))
        setAlarmView(false);
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [alarmView]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
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

  // useEffect(() => {
  //   setLoading(true);
  //   setPet([
  //     {
  //       petId: 13,
  //       petName: "몰리",
  //       petType: "DOG",
  //       birthdate: "2013-08-07",
  //       vaccination: [
  //         {
  //           vaccinationName: "종합백신1차",
  //           vaccinationDate: "2023-03-14",
  //         },
  //       ],
  //       vaccinePredict: [
  //         {
  //           vaccinationName: "종합백신2차",
  //           vaccinationDate: "2023-05-13",
  //         },
  //         {
  //           vaccinationName: "종합백신3차",
  //           vaccinationDate: "2023-05-30",
  //         },
  //       ],
  //     },
  //     {
  //       petId: 14,
  //       petName: "보리",
  //       petType: "CAT",
  //       birthdate: "2019-01-10",
  //       vaccination: [
  //         {
  //           vaccinationName: "종합백신1차",
  //           vaccinationDate: "2020-08-30",
  //         },
  //       ],
  //       vaccinePredict: [
  //         {
  //           vaccinationName: "종합백신2차",
  //           vaccinationDate: "2023-09-30",
  //         },
  //       ],
  //     },
  //   ]);
  //   setAlarm([
  //     {
  //       petId: 13,
  //       petName: "몰리",
  //       petType: "DOG",
  //       birthdate: "2013-08-07",
  //       vaccination: [
  //         {
  //           vaccinationName: "종합백신1차",
  //           vaccinationDate: "2023-03-14",
  //         },
  //       ],
  //       vaccinePredict: [
  //         {
  //           vaccinationName: "종합백신2차",
  //           vaccinationDate: "2023-05-13",
  //         },
  //         {
  //           vaccinationName: "종합백신3차",
  //           vaccinationDate: "2023-05-30",
  //         },
  //       ],
  //     },
  //     {
  //       petId: 14,
  //       petName: "보리",
  //       petType: "CAT",
  //       birthdate: "2019-01-10",
  //       vaccination: [
  //         {
  //           vaccinationName: "종합백신1차",
  //           vaccinationDate: "2020-08-30",
  //         },
  //       ],
  //       vaccinePredict: [
  //         {
  //           vaccinationName: "종합백신2차",
  //           vaccinationDate: "2023-09-30",
  //         },
  //       ],
  //     },
  //   ]);
  //   setLoading(false);
  // }, []);

  const handlePetClick = () => {
    setLoading(true);

    if (
      localStorage.getItem("accessToken") !== null ||
      localStorage.getItem("accessToken") !== ""
    ) {
      const config = {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      axiosInstance
        .get(`/api/auth/home`, config)
        .then((response) => {
          setIconView(true);
          console.log(response);
          setPet(response.data.data.pet);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    setPetView(!petView);
  };

  const handleAlarmClick = () => {
    setAlarmLoading(true);

    if (
      localStorage.getItem("accessToken") !== null ||
      localStorage.getItem("accessToken") !== ""
    ) {
      const config = {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      axiosInstance
        .get(`/api/auth/home`, config)
        .then((response) => {
          setIconView(true);
          console.log(response);
          setAlarm(response.data.data.pet);
          setAlarmLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    setAlarmView(!alarmView);
  };

  return (
    <div style={{ zIndex: "4", position: "fixed" }}>
      {scrollPosition < 100 ? (
        <header className={styles.header}>
          <div>
            <div className={styles.logo} onClick={() => navigate("/")}>
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
                    to="/home"
                  >
                    Schedule
                  </CustomNavLink>
                </div>
                <div style={{ position: "relative" }}>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/list/ALL/ALL"
                  >
                    Community
                  </CustomNavLink>
                  {/* {categoryView && (
                    <div className={styles.category}>
                      <CategoryDropdown />
                    </div>
                  )} */}
                </div>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/hospital"
                  >
                    Hospital
                  </CustomNavLink>
                </div>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/about"
                  >
                    About
                  </CustomNavLink>
                </div>
              </nav>
            </div>
            <div className={styles.icon}>
              {iconView && (
                <>
                  <div
                    ref={userDropdownRef}
                    onClick={() => {
                      setUserView(!userView);
                    }}
                  >
                    <span>
                      <RiAccountCircleLine color="#AFA79F" size="29px" />
                    </span>
                    {userView && (
                      <div className={styles.userinfo}>
                        <UserDropdown dispatch={dispatch} />
                      </div>
                    )}
                  </div>
                  <div ref={petDropdownRef} onClick={handlePetClick}>
                    <span>
                      <TbDog color="#AFA79F" size="29px" />
                    </span>
                    {petView && (
                      <div className={styles.petinfo}>
                        <PetDropdown pet={pet} loading={loading} />
                      </div>
                    )}
                  </div>
                  <div ref={alarmRef} onClick={handleAlarmClick}>
                    <span>
                      <TbBell color="#AFA79F" size="29px" />
                    </span>
                    {alarmView && (
                      <div className={styles.alarm}>
                        <AlarmDropdown alarm={alarm} loading={alarmLoading} />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className={styles.changeheader}>
          <div>
            <div className={styles.changelogo} onClick={() => navigate("/")}>
              <img
                src={process.env.PUBLIC_URL + "/molly-logo.png"}
                alt="molly-logo"
                width="130px"
              />
            </div>
            <div className={styles.changenavcontainer}>
              <nav className={styles.changenavigation}>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/home"
                  >
                    Schedule
                  </CustomNavLink>
                </div>
                <div style={{ position: "relative" }}>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/list/ALL/ALL"
                  >
                    Community
                  </CustomNavLink>
                  {/* {categoryView && (
                    <div className={styles.category} style={{ left: "8px" }}>
                      <CategoryDropdown />
                    </div>
                  )} */}
                </div>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/hospital"
                  >
                    Hospital
                  </CustomNavLink>
                </div>
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/about"
                  >
                    About
                  </CustomNavLink>
                </div>
              </nav>
            </div>
          </div>
        </header>
      )}
    </div>
  );
};

// const CategoryDropdown = () => {
//   let navigate = useNavigate();

//   return (
//     <div className={styles.categoryDropdown}>
//       <li
//         onClick={() => {
//           navigate("/list/ALL/ALL");
//         }}
//       >
//         전체게시판
//       </li>
//       <li
//         onClick={() => {
//           navigate("/list/MEDICAL/ALL");
//         }}
//       >
//         의료게시판
//       </li>
//       <li
//         onClick={() => {
//           navigate("/list/FREE/ALL");
//         }}
//       >
//         자유게시판
//       </li>
//     </div>
//   );
// };

const UserDropdown = (props) => {
  let navigate = useNavigate();

  return (
    <div className={styles.userdropdown}>
      <li
        onClick={() => {
          navigate("/userinfo");
        }}
      >
        사용자 정보
      </li>
      <li
        onClick={() => {
          axios
            .delete(`http://localhost:8080/api/account/logout`, {
              headers: {
                "Refresh-Token": localStorage.getItem("refreshToken"),
              },
            })
            .then((response) => {
              console.log(response);
              localStorage.clear();
              props.dispatch(deleteId());
              window.location.replace("/");
            });
        }}
      >
        로그아웃
      </li>
    </div>
  );
};

const PetDropdown = (props) => {
  let navigate = useNavigate();
  // let state = useSelector((state) => state);
  // const [pet] = useState(state.pet);
  if (props.loading) {
    return (
      <div className={styles.petdropdown}>
        <li style={{ borderRadius: "10px" }}>loading</li>
      </div>
    );
  }

  return (
    <div className={styles.petdropdown}>
      {props.pet === null ? (
        <li
          style={{ borderRadius: "10px" }}
          onClick={() => {
            navigate("/registerpet");
          }}
        >
          추가하기
        </li>
      ) : props.pet.length === 0 ? (
        <li
          style={{ borderRadius: "10px" }}
          onClick={() => {
            navigate("/registerpet");
          }}
        >
          추가하기
        </li>
      ) : (
        <>
          {props.pet.map((item, index) => {
            return (
              item.petName !== "" && (
                <li
                  onClick={() => {
                    navigate(`/detailpet/${item.petId}`);
                  }}
                >
                  <img
                    className={styles.petimg}
                    src={
                      process.env.PUBLIC_URL + `/img/${item.petType}-logo.png`
                    }
                    alt="puppy"
                    width="36px"
                  />
                  {item.petName}
                </li>
              )
            );
          })}
          <li
            onClick={() => {
              navigate("/registerpet");
            }}
          >
            추가하기
          </li>
        </>
      )}
    </div>
  );
};

const AlarmDropdown = (props) => {
  const today = new Date();
  let count = 0;

  if (props.loading) {
    return (
      <div className={styles.alarmdropdown}>
        <li style={{ padding: "10px", color: "#AFA79F" }}>loading</li>
      </div>
    );
  }

  return (
    <div className={styles.alarmdropdown}>
      {props.alarm === null ? (
        <li>
          <p>💉접종알림</p>
          <p>알림이 없습니다.</p>
        </li>
      ) : props.alarm.length === 0 ? (
        <li>
          <p>💉접종알림</p>
          <p>알림이 없습니다.</p>
        </li>
      ) : (
        props.alarm.map((item) => {
          return item.vaccinePredict.map((vaccine, index) => {
            const dday = new Date(`${vaccine.vaccinationDate} 00:00:00`);
            const gapNum = dday - today;
            const day = Math.ceil(Math.ceil(gapNum / (1000 * 60 * 60 * 24)));
            if (Math.abs(day) === 0) {
              count++;
              return (
                <li>
                  <p>💉접종알림</p>
                  <p>
                    {item.petName}의 {vaccine.vaccinationName}가 오늘
                    예정입니다.
                  </p>
                </li>
              );
            } else if (day >= 0 && day <= 7) {
              count++;
              return (
                <li>
                  <p>💉접종알림</p>
                  <p>
                    {item.petName}의 {vaccine.vaccinationName}가 {Math.abs(day)}
                    일 남았습니다.
                  </p>
                </li>
              );
            }
          });
        })
      )}
      {count === 0 &&
        props.alarm !== null &&
        props.alarm.length !==
          0(
            <li>
              <p>💉접종알림</p>
              <p>알림이 없습니다.</p>
            </li>
          )}
    </div>
  );
};

export default Header;
