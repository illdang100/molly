import React, { forwardRef, useEffect, useState } from "react";
import styles from "../../css/Medicine.module.css";
import { FiPlus } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import MedicineHistory from "./MedicineHistory";
import axios from "axios";

const Medicine = (props) => {
  const [medicineName, setMedicineName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [medicine, setMedicine] = useState([]);
  const [loading, setLoading] = useState(false);
  //const medicineNo = useRef(props.text.medication === null || props.text.medication.length === 0? 1 : props.text.medication[props.text.medication.length-1].medicationId + 1);

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

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/api/auth/pet/medication/${props.petId}`)
      .then((response) => {
        console.log(response);
        setMedicine(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // useState(() => {
  //     console.log("render")
  //     setLoading(true);

  //     setMedicine([])
  //     setLoading(false)
  // }, [])

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

  const registerMedicine = () => {
    console.log("register");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      petId: props.petId,
      medicationName: medicineName,
      medicationStartDate: props.dateFormat(startDate),
      medicationEndDate: props.dateFormat(endDate),
    };

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/pet/medication`,
        data,
        config
      );
      console.log(response);
      if (response.data.code === 1) {
        if (medicine !== null && medicineName !== "") {
          setMedicine([
            ...medicine,
            {
              medicationId: response.data.data.medicationId,
              medicationStartDate: props.dateFormat(startDate),
              medicationEndDate: props.dateFormat(endDate),
              medicationName: medicineName,
            },
          ]);
        } else if (medicineName !== "" && medicine === null) {
          setMedicine([
            {
              medicationId: response.data.data.medicationId,
              medicationStartDate: props.dateFormat(startDate),
              medicationEndDate: props.dateFormat(endDate),
              medicationName: medicineName,
            },
          ]);
        }
        console.log("복용약 추가 완료");
      } else {
        console.log("복용약 추가 실패");
      }
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className={styles.medicineContainer}>
        <div className={styles.modalContainer}>
          <span onClick={props.onClick}>
            <TiDeleteOutline color="#FDFDFD" size="35px" />
          </span>
          <h1>복용약 이력 추가</h1>
          <p style={{ marginLeft: "100px" }}>loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.medicineContainer}>
      <div className={styles.modalContainer}>
        <span
          onClick={() => {
            props.onClick();
            window.location.reload();
          }}
        >
          <TiDeleteOutline color="#FDFDFD" size="35px" />
        </span>
        <h1>복용약 이력 추가</h1>
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
            className={styles.plus}
            onClick={() => {
              registerMedicine();
              setMedicineName("");
              console.log(medicine);
            }}
          >
            <FiPlus color="#AFA79F" size="18px" />
          </span>
        </div>
        {medicine !== null || props.text.medication !== null
          ? medicine.map((data) => {
              return (
                <MedicineHistory
                  key={data.medicationId}
                  data={data}
                  medicine={medicine}
                  setMedicine={setMedicine}
                  dateFormat={props.dateFormat}
                  petId={props.petId}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.custominput} onClick={onClick} ref={ref}>
    {value}
  </button>
));

export default Medicine;
