import React, { forwardRef, useEffect, useState } from "react";
import styles from "../../css/Vaccine.module.css";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import axios from "axios";

const VaccineHistory = (props) => {
  const [edit, setEdit] = useState(false);
  const [vaccine, setVaccine] = useState(false);
  const [editVaccineValue, setEditVaccineValue] = useState(
    props.data.vaccinationName
  );
  const [editVaccineDate, setEditVaccineDate] = useState(
    new Date(props.data.vaccinationDate)
  );

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

  const UpdateVaccine = (vaccinationId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      vaccinationId: vaccinationId,
      vaccinationName: editVaccineValue,
      vaccinationDate: props.dateFormat(editVaccineDate),
    };

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/pet/vaccination/${props.petId}`,
        data,
        config
      );
      console.log(response);
      if (response.status === 200) {
        console.log("백신 수정 완료");
      }
    };

    fetchData();
  };

  const DeleteVaccine = (vaccinationId) => {
    const config = {
      data: {
        petId: props.petId,
        vaccinationId: vaccinationId,
      },
    };

    axiosInstance
      .delete(`/api/auth/pet/vaccination`, config)
      .then((response) => {
        console.log(response);
        console.log("백신 이력 삭제");
      });
  };

  return (
    <div>
      {edit ? (
        <div key={props.key} className={styles.editVaccine}>
          <ul>
            <div
              onClick={() => {
                setVaccine(!vaccine);
              }}
              className={styles.editSort}
            >
              <span className={styles.default}>{editVaccineValue}</span>
              {vaccine ? (
                <span style={{ position: "absolute", right: "8px" }}>
                  <MdExpandLess size="25px" color="#AFA79F" />
                </span>
              ) : (
                <span style={{ position: "absolute", right: "8px" }}>
                  <MdExpandMore size="25px" color="#AFA79F" />
                </span>
              )}
              {vaccine && <VaccineDropdown setValue={setEditVaccineValue} />}
            </div>
          </ul>
          <div
            className={styles.datepicker}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <DatePicker
              locale={ko}
              selected={editVaccineDate}
              onChange={(date) => setEditVaccineDate(date)}
              dateFormat="yyyy/MM/dd"
              customInput={<CustomInput />}
            />
          </div>
          <span
            className={styles.check}
            onClick={() => {
              const newVaccine = props.vaccineHistory.map((item) => {
                if (item.vaccinationId === props.data.vaccinationId) {
                  console.log(item.vaccinationId);
                  return {
                    vaccinationId: props.data.vaccinationId,
                    vaccinationName: editVaccineValue,
                    vaccinationDate: props.dateFormat(editVaccineDate),
                  };
                } else {
                  return item;
                }
              });
              props.setVaccineHistory(newVaccine);
              UpdateVaccine(props.data.vaccinationId);
              setEdit(!edit);
            }}
          >
            <AiFillCheckCircle color="#AFA79F" size="18px" />
          </span>
        </div>
      ) : (
        <div key={props.key} className={styles.vaccineHistory}>
          <span>{editVaccineValue}</span>
          <span>{props.dateFormat(editVaccineDate)}</span>
          <span
            onClick={() => {
              props.setVaccineHistory(
                props.vaccineHistory.filter(
                  (vaccineHistory) =>
                    vaccineHistory.vaccinationId !== props.data.vaccinationId
                )
              );
              DeleteVaccine(props.data.vaccinationId);
            }}
          >
            <TiDelete size="18px" color="#827870" />
          </span>
          <span
            onClick={() => {
              setEdit(true);
            }}
          >
            <MdModeEdit color="#827870" size="18px" />
          </span>
        </div>
      )}
    </div>
  );
};

const VaccineDropdown = (props) => {
  return (
    <div className={styles.dropdown}>
      <li
        onClick={() => {
          props.setValue("종합백신 1차");
        }}
      >
        종합백신 1차
      </li>
      <li
        onClick={() => {
          props.setValue("종합백신 2차");
        }}
      >
        종합백신 2차
      </li>
      <li
        onClick={() => {
          props.setValue("컨넬코프 1차");
        }}
      >
        컨넬코프 1차
      </li>
    </div>
  );
};

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.custominput} onClick={onClick} ref={ref}>
    {value}
  </button>
));

export default VaccineHistory;
