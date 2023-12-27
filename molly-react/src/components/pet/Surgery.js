import React, { forwardRef, useEffect, useRef, useState } from "react";
import styles from "../../css/Surgery.module.css";
import { FiPlus } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import SurgeryHistory from "./SurgeryHistory";
import axios from "axios";
import { Button } from "../../components/Button.js";

const Surgery = (props) => {
  const [surgery, setSurgery] = useState(
    props.text.surgery === null
      ? "없음"
      : props.text.surgery.length !== 0
      ? "있음"
      : "없음"
  ); // 수술 라디오 버튼
  const [surgeryDate, setSurgeryDate] = useState(new Date());
  const [surgeryName, setSurgeryName] = useState("");
  const [surgeryHistory, setSurgeryHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const surgeryNo = useRef(
    props.text.surgery === null || props.text.surgery.length === 0
      ? 1
      : props.text.surgery[props.text.surgery.length - 1].surgeryId + 1
  );

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
      .get(`/api/auth/pet/surgery/${props.petId}`)
      .then((response) => {
        console.log(response);
        setSurgeryHistory(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // useEffect(() => {
  //     setLoading(true);

  //     setSurgeryHistory([])
  //     setLoading(false);
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

  const handleSurgeryButton = (e) => {
    setSurgery(e.target.value);
  };

  const handleSurgeryFalseButton = (e) => {
    setSurgery(e.target.value);
    setConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setConfirm(!confirm);
    setSurgery("없음");

    for (let i = 0; i < surgeryHistory.length; i++) {
      const config = {
        data: {
          petId: props.petId,
          surgeryId: surgeryHistory[i].surgeryId,
        },
      };

      axiosInstance.delete(`/api/auth/pet/surgery`, config).then((response) => {
        console.log(response);
        console.log("모든 수술 이력 삭제");
      });
    }
  };

  const handleCancleConfirm = () => {
    setConfirm(!confirm);
    setSurgery("있음");
  };

  const registerSurgery = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      petId: props.petId,
      surgeryName: surgeryName,
      surgeryDate: props.dateFormat(surgeryDate),
    };

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/pet/surgery`,
        data,
        config
      );
      console.log(response);
      if (response.data.code === 1) {
        let updateSurgery = surgeryHistory;
        updateSurgery.splice(surgeryHistory.length - 1, 1, {
          surgeryId: response.data.data.surgeryId,
          surgeryDate: props.dateFormat(surgeryDate),
          surgeryName: surgeryName,
        });
        setSurgeryHistory(updateSurgery);
        console.log("수술이력 추가 완료");
      } else {
        console.log("수술이력 추가 실패");
      }
    };

    fetchData();
  };

  if (loading) {
    return (
      <div className={styles.surgeryContainer}>
        <div className={styles.modalContainer}>
          <span onClick={props.onClick}>
            <TiDeleteOutline color="#FDFDFD" size="35px" />
          </span>
          <h1>수술 이력 추가</h1>
          <p style={{ marginLeft: "100px" }}>loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.surgeryContainer}>
      <div className={styles.modalContainer}>
        <span
          onClick={() => {
            props.onClick();
            window.location.reload();
          }}
        >
          <TiDeleteOutline color="#FDFDFD" size="35px" />
        </span>
        <h1>수술 이력 추가</h1>
        <label className={styles.radio}>
          <input
            type="radio"
            id="true"
            onChange={handleSurgeryButton}
            value="있음"
            checked={surgery === "있음"}
          />
          <label htmlFor="true">
            <span>있음</span>
          </label>
          <input
            type="radio"
            id="false"
            onChange={handleSurgeryFalseButton}
            value="없음"
            checked={surgery === "없음"}
          />
          <label htmlFor="false">
            <span>없음</span>
          </label>
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
                if (surgeryHistory !== null && surgeryName !== "") {
                  setSurgeryHistory([
                    ...surgeryHistory,
                    {
                      surgeryId: surgeryNo.current++,
                      surgeryDate: props.dateFormat(surgeryDate),
                      surgeryName: surgeryName,
                    },
                  ]);
                } else if (surgeryName !== "" && surgeryHistory === null) {
                  setSurgeryHistory([
                    {
                      surgeryId: surgeryNo.current++,
                      surgeryDate: props.dateFormat(surgeryDate),
                      surgeryName: surgeryName,
                    },
                  ]);
                }
                registerSurgery();
                setSurgeryName("");
              }}
            >
              <FiPlus color="#AFA79F" size="18px" />
            </span>
            <div>
              {surgeryHistory !== null || props.text.surgery !== null
                ? surgeryHistory.map((data, index) => {
                    return (
                      <SurgeryHistory
                        petId={props.petId}
                        data={data}
                        key={data.surgeryId}
                        surgeryHistory={surgeryHistory}
                        setSurgeryHistory={setSurgeryHistory}
                        dateFormat={props.dateFormat}
                      />
                    );
                  })
                : null}
            </div>
          </div>
        ) : (
          confirm && (
            <ConfirmModal
              onClickDelete={handleDeleteConfirm}
              onClickCancle={handleCancleConfirm}
            />
          )
        )}
      </div>
    </div>
  );
};

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.custominput} onClick={onClick} ref={ref}>
    {value}
  </button>
));

const ConfirmModal = (props) => {
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
    <div className={styles.confirmModal}>
      <div className={styles.confirm}>
        <div>
          <p>수술 이력이 모두 삭제됩니다.</p>
          <div>
            <Button name="취소" onClick={props.onClickCancle} />
            <Button name="확인" onClick={props.onClickDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surgery;
