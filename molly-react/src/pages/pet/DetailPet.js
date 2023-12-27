import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../css/DetailPet.module.css";
import Header from "../../components/Header";
import styled from "styled-components";
import { Button } from "../../components/Button";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { IoMdSettings } from "react-icons/io";
import Surgery from "../../components/pet/Surgery";
import Medicine from "../../components/pet/Medicine";
import Vaccine from "../../components/pet/Vaccine";

let CustomBody = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;
`;

const DetailPet = () => {
  let { id } = useParams();
  const [text, setText] = useState({});
  const [loading, setLoading] = useState(false);
  const [surgeryModal, setSurgeryModal] = useState(false);
  const [medicineModal, setMedicineModal] = useState(false);
  const [vaccineModal, setVaccineModal] = useState(false);
  const [petKind, setPetKind] = useState([]);

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/api/auth/pet/${id}`)
      .then((response) => {
        setText(response.data.data);
        if (response.data.data.petType === "DOG") {
          axiosInstance
            .get(`/api/auth/pet/dog-species`)
            .then((response) => {
              setPetKind(response.data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (response.data.data.petType === "CAT") {
          axiosInstance
            .get(`/api/auth/pet/cat-species`)
            .then((response) => {
              setPetKind(response.data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (response.data.data.petType === "RABBIT") {
          axiosInstance
            .get(`/api/auth/pet/rabbit-species`)
            .then((response) => {
              setPetKind(response.data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   setText({
  //     userId: 32492,
  //     petId: 1234,
  //     petType: "DOG",
  //     petName: "molly",
  //     species: "MALTESE",
  //     profileImage:
  //       "https://dimg.donga.com/wps/NEWS/IMAGE/2017/01/27/82617772.2.jpg",
  //     birthdate: "2013-08-07",
  //     gender: "FEMALE",
  //     neuteredStatus: false,
  //     weight: 3.4,
  //     caution: "",
  //     surgery: [
  //       {
  //         surgeryId: 1,
  //         surgeryName: "수직이도성형술",
  //         surgeryDate: "2023-01-01",
  //       },
  //     ],
  //     medication: [
  //       {
  //         medicationId: 1432,
  //         medicationName: "넥스가드",
  //         medicationStartDate: "2023-02-01",
  //         medicationEndDate: "2023-02-15",
  //       },
  //     ],
  //     vaccination: [
  //       {
  //         vaccinationId: 1,
  //         vaccinationName: "종합백신1차",
  //         vaccinationDate: "2018-01-01",
  //       },
  //       {
  //         vaccinationId: 1,
  //         vaccinationName: "종합백신1차",
  //         vaccinationDate: "2018-01-01",
  //       },
  //     ],
  //   });

  //   setPetKind([
  //     {
  //       speciesKo: "말티즈",
  //       speciesEn: "MALTESE",
  //     },
  //     {
  //       speciesKo: "포메라니안",
  //       speciesEn: "POMERANIAN",
  //     },
  //     {
  //       speciesKo: "프렌치 불도그",
  //       speciesEn: "FRENCH_BULLDOG",
  //     },
  //     {
  //       speciesKo: "말티즈",
  //       speciesEn: "MALTESEd",
  //     },
  //     {
  //       speciesKo: "포메라니안",
  //       speciesEn: "POMERANIAN",
  //     },
  //     {
  //       speciesKo: "프렌치 불도그",
  //       speciesEn: "FRENCH_BULLDOG",
  //     },
  //   ]);

  //   setLoading(false);
  // }, []);

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

  const navigate = useNavigate();

  const now = new Date();
  const start = new Date(text?.birthdate);

  const timeDiff = now.getTime() - start.getTime();
  const day = Math.floor(timeDiff / (1000 * 60 * 60 * 24) + 1);

  const calFood = () => {
    if (day <= 60) return text.weight * 7;
    else if (day <= 90) return text.weight * 6;
    else if (day <= 150) return text.weight * 5;
    else if (day <= 365) return text.weight * 3;
    else if (day >= 365 && day <= 1825) return text.weight * 2.5;
    else if (day >= 1825) return text.weight * 2;
  };

  const deletePet = () => {
    axiosInstance
      .delete(`/api/auth/pet/${id}`)
      .then((response) => {
        console.log(response);
        console.log("삭제 완료");
        window.location.replace("/home");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSurgeryModal = () => {
    setSurgeryModal(!surgeryModal);
  };

  const handleMedicineModal = () => {
    setMedicineModal(!medicineModal);
  };

  const handleVaccineModal = () => {
    setVaccineModal(!vaccineModal);
  };

  function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
  }

  if (loading) {
    return (
      <div>
        <Header />
        <CustomBody>
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
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.profile}>
              <img
                className={styles.profileimg}
                src={
                  text.profileImage !== null
                    ? text.profileImage
                    : process.env.PUBLIC_URL + "/img/profile.png"
                }
                alt="프로필 이미지"
                width="70px"
              />
            </div>
            <h1>{text.petName}</h1>
            <div>
              <h4>품종</h4>
              {petKind.map((i) => {
                if (i.speciesEn === text.species)
                  return <span>{i.speciesKo}</span>;
              })}
              <br />
              <h4>생일</h4>
              <span style={{ marginRight: "30px" }}>{text.birthdate}</span>
              <br />
              <h4>성별</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  readOnly={true}
                  value="암컷"
                  checked={text.gender === "FEMALE" ? true : false}
                />
                <span>암컷</span>
                <input
                  type="radio"
                  readOnly={true}
                  value="수컷"
                  checked={text.gender === "FEMALE" ? false : true}
                />
                <span>수컷</span>
              </label>
              <br />
              <h4>몸무게</h4>
              <span>{text.weight} kg</span>
              <br />
              <h4>중성화</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  readOnly={true}
                  value="함"
                  checked={text.neuteredStatus}
                />
                <span>함</span>
                <input
                  type="radio"
                  readOnly={true}
                  value="안 함"
                  checked={!text.neuteredStatus}
                />
                <span>안 함</span>
              </label>
              <br />
              <h4 style={{ marginRight: "27px" }}>수술이력</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  readOnly={true}
                  value="있음"
                  checked={
                    text.surgery === null || text.surgery.length === 0
                      ? false
                      : true
                  }
                />
                <span>있음</span>
                <input
                  type="radio"
                  readOnly={true}
                  value="없음"
                  checked={
                    text.surgery === null || text.surgery.length === 0
                      ? true
                      : false
                  }
                />
                <span>없음</span>
              </label>
              <span style={{ cursor: "pointer" }} onClick={handleSurgeryModal}>
                <IoMdSettings color="#827870" size="18px" />
              </span>
              {surgeryModal && (
                <Surgery
                  onClick={handleSurgeryModal}
                  dateFormat={dateFormat}
                  text={text}
                  petId={id}
                />
              )}
              <br />
              {text.surgery !== null
                ? text.surgery.map((item) => {
                    return (
                      <div className={styles.surgery}>
                        <span>{item.surgeryDate}</span>
                        <span>{item.surgeryName}</span>
                      </div>
                    );
                  })
                : null}
              <div className={styles.medicine}>
                <h4>복용약</h4>
                <div>
                  {text.medication !== null
                    ? text.medication.map((item) => {
                        return (
                          <div className={styles.medicineinfo}>
                            <p>{item.medicationName}</p>
                            <span>{item.medicationStartDate} ~</span>
                            <span>{item.medicationEndDate}</span>
                          </div>
                        );
                      })
                    : null}
                </div>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={handleMedicineModal}
                >
                  <IoMdSettings color="#827870" size="18px" />
                </span>
                {medicineModal && (
                  <Medicine
                    onClick={handleMedicineModal}
                    dateFormat={dateFormat}
                    text={text}
                    petId={id}
                  />
                )}
              </div>
              <h4>주의할 점</h4>
              {text.caution === "" ? null : <p>{text.caution}</p>}
            </div>
          </div>
          <div className={styles.weight}></div>
          <div className={styles.care}>
            <div className={styles.health}>
              <h4>🦴 건강관리</h4>
              <span>권장 사료량</span>
              <span>{calFood()}g</span>
              <div style={{ height: "10px" }} />
              <span>권장 음수량</span>
              <span>{text.weight * 80}ml</span>
              <div style={{ height: "10px" }} />
              <span>권장 운동량</span>
              <span>
                {text.weight < 2
                  ? (30 * text.weight * 1.3).toFixed(2)
                  : (text.weight * 70 * 1.3).toFixed(2)}
                kcal
              </span>
            </div>
            <h4 style={{ marginTop: "60px" }}>💉 예방접종 이력</h4>
            <span
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "215px",
                left: "120px",
              }}
              onClick={handleVaccineModal}
            >
              <IoMdSettings color="#827870" size="18px" />
            </span>
            {vaccineModal && (
              <Vaccine
                onClick={handleVaccineModal}
                dateFormat={dateFormat}
                text={text}
                petId={id}
              />
            )}
            {text.vaccination !== null
              ? text.vaccination.map((item) => {
                  return (
                    <div className={styles.vaccine}>
                      <span>{item.vaccinationDate}</span>
                      <span>{item.vaccinationName}</span>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <div className={styles.btn}>
          <Button name="삭제하기" onClick={deletePet} />
          <Button
            name="수정하기"
            onClick={() => {
              navigate(`/updatepet/${id}`);
            }}
          />
        </div>
      </CustomBody>
    </div>
  );
};

export default DetailPet;
