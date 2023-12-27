import React, { forwardRef, useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import styles from "../../css/RegisterPet.module.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../../components/Button.js";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import axios from "axios";
import { useDispatch } from "react-redux";
import { registerPet } from "../store/petSlice";
import RegisterVaccine from "../../components/pet/RegiterVaccine";

const RegisterPet = () => {
  const [petType, setPetType] = useState("DOG"); // dog, cat, rabbit
  const [typeView, setTypeView] = useState(false); // 동물 종류 드롭다운 버튼
  const [pet, setPet] = useState(false); // 동물 품종 드롭다운 버튼
  const [petValue, setPetValue] = useState({}); // 동물 품종
  const [petKind, setPetKind] = useState([]);
  const [gender, setGender] = useState([]); // 성별 라디오 버튼
  const [neutered, setNeutered] = useState([]); // 중성화 라디오 버튼
  const [surgery, setSurgery] = useState([]); // 수술 라디오 버튼
  const [modal, setModal] = useState(false); // 예방접종 이력 추가 모달
  const [imgFile, setImgFile] = useState("");
  const surgeryNo = useRef(1);
  const medicineNo = useRef(1);

  const [birthdayDate, setBirthdayDate] = useState(new Date());
  const [surgeryDate, setSurgeryDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [surgeryName, setSurgeryName] = useState("");
  const [medicineName, setMedicineName] = useState("");

  const [surgeryHistory, setSurgeryHistory] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [vaccineHistory, setVaccineHistory] = useState([]);

  const [petNickName, setPetNickName] = useState(""); // 동물 이름 input
  const [weight, setWeight] = useState(""); // 몸무게 input
  const [caution, setCaution] = useState(""); // 주의할 점 input
  const [loading, setLoading] = useState(false);

  const imgRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/api/auth/pet/dog-species`)
      .then((response) => {
        console.log(response);
        setPetKind(response.data.data);
        setPetValue(response.data.data[0]);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    if (petType === "DOG") {
      axiosInstance
        .get(`/api/auth/pet/dog-species`)
        .then((response) => {
          console.log(response);
          setPetValue(response.data.data[0]);
          setPetKind(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (petType === "CAT") {
      axiosInstance
        .get(`/api/auth/pet/cat-species`)
        .then((response) => {
          console.log(response);
          setPetValue(response.data.data[0]);
          setPetKind(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axiosInstance
        .get(`/api/auth/pet/rabbit-species`)
        .then((response) => {
          console.log(response);
          setPetValue(response.data.data[0]);
          setPetKind(response.data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    setLoading(false);
  }, [petType]);

  // useEffect(() => {
  //   setLoading(true);
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
  //   ]);
  //   setPetValue({
  //     speciesKo: "말티즈",
  //     speciesEn: "MALTESE",
  //   });
  //   setLoading(false);
  // }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   if (petType === "DOG") {
  //     setPetValue({
  //       speciesKo: "말티즈",
  //       speciesEn: "MALTESE",
  //     });
  //     setPetKind([
  //       {
  //         speciesKo: "말티즈",
  //         speciesEn: "MALTESE",
  //       },
  //       {
  //         speciesKo: "포메라니안",
  //         speciesEn: "POMERANIAN",
  //       },
  //       {
  //         speciesKo: "프렌치 불도그",
  //         speciesEn: "FRENCH_BULLDOG",
  //       },
  //       {
  //         speciesKo: "말티즈",
  //         speciesEn: "MALTESE",
  //       },
  //       {
  //         speciesKo: "포메라니안",
  //         speciesEn: "POMERANIAN",
  //       },
  //       {
  //         speciesKo: "ㅇㅇ",
  //         speciesEn: "POMERANIAN",
  //       },
  //     ]);
  //   } else if (petType === "CAT") {
  //     setPetValue({
  //       speciesKo: "노르웨이 숲",
  //       speciesEn: "NORWEGIAN_FOREST",
  //     });
  //     setPetKind([
  //       {
  //         speciesKo: "노르웨이 숲",
  //         speciesEn: "NORWEGIAN_FOREST",
  //       },
  //       {
  //         speciesKo: "네벨룽",
  //         speciesEn: "NEBELUNG",
  //       },
  //       {
  //         speciesKo: "네바 마스커레이드",
  //         speciesEn: "NEVA_MASQUERADE",
  //       },
  //       {
  //         speciesKo: "데본렉스",
  //         speciesEn: "DEVON_REX",
  //       },
  //     ]);
  //   } else {
  //     setPetValue({
  //       speciesKo: "앙고라 토끼",
  //       speciesEn: "ANGORA_RABBIT",
  //     });
  //     setPetKind([
  //       {
  //         speciesKo: "앙고라 토끼",
  //         speciesEn: "ANGORA_RABBIT",
  //       },
  //       {
  //         speciesKo: "롭이어",
  //         speciesEn: "ROBYEAR",
  //       },
  //       {
  //         speciesKo: "렉스",
  //         speciesEn: "REX",
  //       },
  //     ]);
  //   }
  //   setLoading(false);
  // }, [petType]);

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

  const handleGenderButton = (e) => {
    setGender(e.target.value);
  };

  const handleNeuteredButton = (e) => {
    setNeutered(e.target.value);
  };

  const handleSurgeryButton = (e) => {
    setSurgery(e.target.value);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  let neuteredStatus;
  neutered === "함" ? (neuteredStatus = false) : (neuteredStatus = true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("petType", petType);
    formData.append("petName", petNickName);
    formData.append("species", petValue.speciesEn);
    if (imgRef.current.files[0] !== undefined) {
      formData.append("petProfileImage", imgRef.current.files[0]);
    }
    formData.append("birthdate", dateFormat(birthdayDate));
    formData.append("gender", gender);
    formData.append("neuteredStatus", neuteredStatus);
    formData.append("weight", Number(weight));
    formData.append("caution", caution);

    for (let i = 0; i < surgeryHistory.length; i++) {
      formData.append(
        "surgery[" + i + "].surgeryName",
        surgeryHistory[i].surgeryName
      );
      formData.append(
        "surgery[" + i + "].surgeryDate",
        surgeryHistory[i].surgeryDate
      );
    }

    for (let i = 0; i < medicine.length; i++) {
      formData.append(
        "medication[" + i + "].medicationName",
        medicine[i].medicationName
      );
      formData.append(
        "medication[" + i + "].medicationStartDate",
        medicine[i].medicationStartDate
      );
      formData.append(
        "medication[" + i + "].medicationEndDate",
        medicine[i].medicationEndDate
      );
    }

    for (let i = 0; i < vaccineHistory.length; i++) {
      formData.append(
        "vaccination[" + i + "].vaccinationName",
        vaccineHistory[i].vaccinationName
      );
      formData.append(
        "vaccination[" + i + "].vaccinationDate",
        vaccineHistory[i].vaccinationDate
      );
    }

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(`/api/auth/pet`, formData);
      console.log(response);
      if (response.data.code === 1) {
        const petId = response.data.data.petId;
        dispatch(registerPet({ name: petNickName, petId: petId }));
        window.location.replace(`/detailpet/${petId}`);
      } else {
        console.log("동물 등록 실패");
      }
    };

    fetchData();
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
      <div className={styles.container}>
        <Header />
        <div className={styles.board}>loading</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.board}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <img
              className={styles.petimg}
              src={process.env.PUBLIC_URL + `/img/${petType}-logo.png`}
              alt="pet-icon"
              width="90px"
            />
            {typeView ? (
              <span
                onClick={() => {
                  setTypeView(!typeView);
                }}
                style={{
                  position: "absolute",
                  top: "22px",
                  left: "-50px",
                  cursor: "pointer",
                }}
              >
                <MdExpandLess size="32px" color="#AFA79F" />
              </span>
            ) : (
              <span
                onClick={() => {
                  setTypeView(!typeView);
                }}
                style={{
                  position: "absolute",
                  top: "22px",
                  left: "-50px",
                  cursor: "pointer",
                }}
              >
                <MdExpandMore size="32px" color="#AFA79F" />
              </span>
            )}
            <h1>반려동물 등록</h1>
          </div>
          <div className={styles.dropdowncontainer}>
            {typeView && (
              <TypeDropdown setPetType={setPetType} setTypeView={setTypeView} />
            )}
          </div>
          <div className={styles.upload}>
            <label htmlFor="profileImg">
              <div className={styles.profilepet}>
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
              {imgFile && (
                <div className={styles.delete}>
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setImgFile("");
                    }}
                  >
                    <RiDeleteBin6Line size="18px" color="#F9F9F9" />
                  </span>
                </div>
              )}
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
            <input
              className={styles.name}
              placeholder="이름"
              type="text"
              value={petNickName}
              onChange={(e) => {
                setPetNickName(e.target.value);
              }}
              required
            ></input>
          </div>
          <div
            className={styles.boarddetail}
            style={petType === "RABBIT" ? { marginTop: "-40px" } : null}
          >
            <h4>품종</h4>
            <div
              className={styles.sort}
              style={{ borderRadius: pet ? "10px 10px 0 0" : "10px" }}
            >
              <span className={styles.default}>
                {petValue === undefined ||
                petValue === null ||
                Object.keys(petValue).length === 0
                  ? "선택하세요"
                  : petValue.speciesKo}
              </span>
              {pet ? (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPet(!pet);
                  }}
                >
                  <MdExpandLess size="25px" color="#AFA79F" />
                </span>
              ) : (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPet(!pet);
                  }}
                >
                  <MdExpandMore size="25px" color="#AFA79F" />
                </span>
              )}
              {pet && (
                <PetDropdown
                  setValue={setPetValue}
                  petKind={petKind}
                  setPet={setPet}
                />
              )}
            </div>
            <div className={styles.info}>
              <h4>생일</h4>
              <div
                className={styles.datepicker}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <DatePicker
                  locale={ko}
                  selected={birthdayDate}
                  onChange={(date) => {
                    setBirthdayDate(date);
                  }}
                  dateFormat="yyyy/MM/dd"
                  customInput={<CustomInput />}
                />
              </div>
              <h4 style={{ marginLeft: "80px" }}>몸무게</h4>
              <input
                className={styles.weight}
                type="number"
                step="0.001"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                required
              ></input>
              <span
                style={{
                  color: "#827870",
                  fontSize: "14px",
                  marginLeft: "-25px",
                }}
              >
                kg
              </span>
              <br />
              <h4>성별</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  onChange={handleGenderButton}
                  value="MALE"
                  checked={gender === "MALE"}
                />
                <span>암컷</span>
                <input
                  type="radio"
                  onChange={handleGenderButton}
                  value="FEMALE"
                  checked={gender === "FEMALE"}
                />
                <span>수컷</span>
              </label>
              <br />
              <h4>중성화</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  onChange={handleNeuteredButton}
                  value="안 함"
                  checked={neutered === "안 함"}
                />
                <span>함</span>
                <input
                  type="radio"
                  onChange={handleNeuteredButton}
                  value="함"
                  checked={neutered === "함"}
                />
                <span>안 함</span>
              </label>
              <br />
              <h4>수술이력</h4>
              <label className={styles.radio}>
                <input
                  type="radio"
                  onChange={handleSurgeryButton}
                  value="있음"
                  checked={surgery === "있음"}
                />
                <span>있음</span>
                <input
                  type="radio"
                  onChange={handleSurgeryButton}
                  value="없음"
                  checked={surgery === "없음"}
                />
                <span>없음</span>
              </label>
              {surgery === "있음" ? (
                <div className={styles.surgery}>
                  <div
                    className={styles.datepicker}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <DatePicker
                      locale={ko}
                      selected={surgeryDate}
                      onChange={(date) => {
                        setSurgeryDate(date);
                      }}
                      dateFormat="yyyy/MM/dd"
                      customInput={<CustomInput />}
                    />
                  </div>
                  <input
                    className={styles.surgeryname}
                    placeholder="수술명"
                    type="text"
                    onChange={(e) => {
                      setSurgeryName(e.target.value);
                    }}
                    value={surgeryName}
                  ></input>
                  <span
                    onClick={() => {
                      if (surgeryName !== "")
                        setSurgeryHistory([
                          ...surgeryHistory,
                          {
                            surgeryId: surgeryNo.current++,
                            surgeryDate: dateFormat(surgeryDate),
                            surgeryName: surgeryName,
                          },
                        ]);
                      setSurgeryName("");
                    }}
                  >
                    <FiPlus color="#AFA79F" size="18px" />
                  </span>
                  <div>
                    {surgeryHistory.map((data, index) => {
                      return (
                        <div key={index} className={styles.surgeryHistory}>
                          <span>{data.surgeryDate}</span>
                          <span>{data.surgeryName}</span>
                          <span
                            onClick={() => {
                              setSurgeryHistory(
                                surgeryHistory.filter(
                                  (surgeryHistory) =>
                                    surgeryHistory.surgeryId !== data.surgeryId
                                )
                              );
                            }}
                          >
                            <TiDelete size="18px" color="#827870" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <br />
              <h4>복용약</h4>
              <div className={styles.drug}>
                <input
                  placeholder="복용약명"
                  type="text"
                  onChange={(e) => {
                    setMedicineName(e.target.value);
                  }}
                  value={medicineName}
                ></input>
                <p>start</p>
                <div
                  className={styles.datepicker}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DatePicker
                    locale={ko}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy/MM/dd"
                    customInput={<CustomInput />}
                  />
                </div>
                <p>end</p>
                <div
                  className={styles.datepicker}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DatePicker
                    locale={ko}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy/MM/dd"
                    customInput={<CustomInput />}
                  />
                </div>
                <span
                  onClick={() => {
                    if (medicineName !== "")
                      setMedicine([
                        ...medicine,
                        {
                          medicineId: medicineNo.current++,
                          medicationStartDate: dateFormat(startDate),
                          medicationEndDate: dateFormat(endDate),
                          medicationName: medicineName,
                        },
                      ]);
                    setMedicineName("");
                  }}
                >
                  <FiPlus color="#AFA79F" size="18px" />
                </span>
              </div>
              <div className={styles.medicineContainer}>
                {medicine.map((data, index) => {
                  return (
                    <div className={styles.medicineData} key={index}>
                      <p>{data.medicationName}</p>
                      <span>
                        {data.medicationStartDate} ~ {data.medicationEndDate}
                      </span>
                      <span
                        onClick={() => {
                          setMedicine(
                            medicine.filter(
                              (medicine) =>
                                medicine.medicineId !== data.medicineId
                            )
                          );
                        }}
                      >
                        <TiDelete size="18px" color="#827870" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <br />
              <h4>주의할 점</h4>
              <div className={styles.caution}>
                <input
                  type="text"
                  value={caution}
                  onChange={(e) => {
                    setCaution(e.target.value);
                  }}
                ></input>
              </div>
              <br />
              <h4>예방접종 이력</h4>
              <button
                style={{ cursor: "pointer" }}
                onClick={handleModal}
                type="button"
              >
                추가
              </button>
            </div>
            <div style={{ marginLeft: "500px", marginBottom: "10px" }}>
              <Button name="등록" />
            </div>
          </div>
          {modal && (
            <RegisterVaccine
              onClick={handleModal}
              vaccineHistory={vaccineHistory}
              setVaccineHistory={setVaccineHistory}
              dateFormat={dateFormat}
              petType={petType}
            />
          )}
        </form>
      </div>
    </div>
  );
};

const TypeDropdown = (props) => {
  return (
    <div className={styles.typedropdown}>
      <li
        onClick={() => {
          props.setPetType("DOG");
          props.setTypeView(false);
        }}
      >
        <img
          src={process.env.PUBLIC_URL + `/img/DOG-logo.png`}
          alt="pet-icon"
          width="90px"
        />
      </li>
      <li
        onClick={() => {
          props.setPetType("CAT");
          props.setTypeView(false);
        }}
      >
        <img
          src={process.env.PUBLIC_URL + `/img/CAT-logo.png`}
          alt="pet-icon"
          width="80px"
        />
      </li>
      <li
        onClick={() => {
          props.setPetType("RABBIT");
          props.setTypeView(false);
        }}
      >
        <img
          src={process.env.PUBLIC_URL + `/img/RABBIT-logo.png`}
          alt="pet-icon"
          width="70px"
        />
      </li>
    </div>
  );
};

const PetDropdown = (props) => {
  const [search, setSearch] = useState("");

  return (
    <div className={styles.dropdown}>
      <div onClick={() => props.setPet(false)}>
        {search === ""
          ? props.petKind.map((item) => {
              return (
                <li
                  onClick={() => {
                    props.setValue(item);
                  }}
                >
                  {item.speciesKo}
                </li>
              );
            })
          : props.petKind.map((item) => {
              if (item.speciesKo === search) {
                return (
                  <li
                    onClick={() => {
                      props.setValue(item);
                    }}
                  >
                    {item.speciesKo}
                  </li>
                );
              }
            })}
      </div>
      <div className={styles.kindSearch}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="검색"
        ></input>
      </div>
    </div>
  );
};

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.custominput} onClick={onClick} ref={ref}>
    {value}
  </button>
));

export default RegisterPet;
