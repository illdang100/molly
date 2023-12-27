import React, { useEffect, useState } from "react";
import styles from "../css/AddVaccine.module.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Button } from "../components/Button";
import axios from "axios";

const AddVaccine = (props) => {
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

  let now = new Date();
  let nowMonth =
    now.getMonth() + 1 < 10
      ? `0${now.getMonth() + 1}`
      : `${now.getMonth() + 1}`;
  let nowDate = now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`;

  const [form, setForm] = useState({
    year: `${now.getFullYear()}`,
    month: nowMonth,
    date: nowDate,
  });

  const [viewYear, setViewYear] = useState(false);
  const [viewMonth, setViewMonth] = useState(false);
  const [viewDate, setViewDate] = useState(false);

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

  const handleAddVaccine = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      petId: props.petId,
      vaccinationName: props.vaccineName,
      vaccinationDate: `${form.year}-${form.month}-${form.date}`,
    };
    // props.onClick();
    // window.location.reload();

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/pet/vaccination`,
        data,
        config
      );
      console.log(response);
      if (response.data.code === 1) {
        console.log(response.data);
        console.log("백신 이력 추가 완료");
        props.onClick();
        window.location.reload();
      } else {
        console.log("백신 이력 추가 실패");
      }
    };

    fetchData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <div>
          <h1>💉 접종 기록 추가</h1>
        </div>
        <div>
          <ul
            onClick={() => {
              setViewYear(!viewYear);
            }}
          >
            <div className={styles.year}>
              <div className={styles.defaultyear}>{form.year}</div>
              {viewYear ? (
                <div className={styles.dropdownBtn}>
                  <MdExpandLess size="25px" color="white" />
                </div>
              ) : (
                <div className={styles.dropdownBtn}>
                  <MdExpandMore size="25px" color="white" />
                </div>
              )}
              {viewYear && <YearDropdown form={form} setValue={setForm} />}
            </div>
          </ul>
          <ul
            onClick={() => {
              setViewMonth(!viewMonth);
            }}
          >
            <div className={styles.month}>
              <div className={styles.defaultmonth}>{form.month}</div>
              {viewMonth ? (
                <div className={styles.dropdownBtn}>
                  <MdExpandLess size="25px" color="white" />
                </div>
              ) : (
                <div className={styles.dropdownBtn}>
                  <MdExpandMore size="25px" color="white" />
                </div>
              )}
              {viewMonth && <MonthDropdown form={form} setValue={setForm} />}
            </div>
          </ul>
          <ul
            onClick={() => {
              setViewDate(!viewDate);
            }}
          >
            <div className={styles.date}>
              <div className={styles.defaultdate}>{form.date}</div>
              {viewDate ? (
                <div className={styles.dropdownBtn}>
                  <MdExpandLess size="25px" color="white" />
                </div>
              ) : (
                <div className={styles.dropdownBtn}>
                  <MdExpandMore size="25px" color="white" />
                </div>
              )}
              {viewDate && <DateDropdown form={form} setValue={setForm} />}
            </div>
          </ul>
        </div>
        <div className={styles.btn}>
          <Button name="취소" onClick={props.onClick} />
          <Button name="등록" onClick={handleAddVaccine} />
        </div>
      </div>
    </div>
  );
};

const YearDropdown = (props) => {
  let now = new Date();

  return (
    <div className={styles.yearDropdown}>
      <li
        onClick={() => {
          props.setValue({ ...props.form, year: `${now.getFullYear()}` });
        }}
      >
        {now.getFullYear()}
      </li>
      <li
        onClick={() => {
          props.setValue({ ...props.form, year: `${now.getFullYear() - 1}` });
        }}
      >
        {now.getFullYear() - 1}
      </li>
      <li
        onClick={() => {
          props.setValue({ ...props.form, year: `${now.getFullYear() - 2}` });
        }}
      >
        {now.getFullYear() - 2}
      </li>
    </div>
  );
};

const MonthDropdown = (props) => {
  return (
    <div className={styles.monthDropdown}>
      {Array(12)
        .fill(0)
        .map((data, index) => {
          if (index < 9) {
            return (
              <li
                key={index}
                onClick={() => {
                  props.setValue({ ...props.form, month: `0${index + 1}` });
                }}
              >
                0{index + 1}
              </li>
            );
          } else {
            return (
              <li
                key={index}
                onClick={() => {
                  props.setValue({ ...props.form, month: `${index + 1}` });
                }}
              >
                {index + 1}
              </li>
            );
          }
        })}
    </div>
  );
};

const DateDropdown = (props) => {
  let days = [];

  let month = parseInt(props.form.month).toString();
  let date = new Date(props.form.year, month, 0).getDate();

  for (let d = 1; d <= date; d++) {
    if (d < 10) {
      days.push("0" + d.toString());
    } else {
      days.push(d.toString());
    }
  }

  return (
    <div className={styles.dateDropdown}>
      {days.map((data, index) => {
        return (
          <li
            key={index}
            onClick={() => {
              props.setValue({ ...props.form, date: data });
            }}
          >
            {data}
          </li>
        );
      })}
    </div>
  );
};

export default AddVaccine;
