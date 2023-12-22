import React, { forwardRef, useState } from "react";
import styles from "../../css/Surgery.module.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { AiFillCheckCircle } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";

const SurgeryHistory = (props) => {
  const [editSurgeryName, setEditSurgeryName] = useState(
    props.data.surgeryName
  );
  const [editSurgeryDate, setEditSurgeryDate] = useState(
    new Date(props.data.surgeryDate)
  );
  const [edit, setEdit] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
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

  const UpdateSurgery = (surgeryId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      surgeryId: surgeryId,
      surgeryName: editSurgeryName,
      surgeryDate: props.dateFormat(editSurgeryDate),
    };

    const fetchData = async function fetch() {
      const response = await axiosInstance.post(
        `/api/auth/pet/surgery/${props.petId}`,
        data,
        config
      );
      console.log(response);
      if (response.status === 200) {
        console.log("수술이력 수정완료");
      }
    };

    fetchData();
  };

  const DeleteSurgery = (surgeryId) => {
    const config = {
      data: {
        petId: props.petId,
        surgeryId: surgeryId,
      },
    };

    axiosInstance.delete(`/api/auth/pet/surgery`, config).then((response) => {
      console.log(response);
      console.log("수술 삭제");
    });
  };

  return (
    <div>
      {edit ? (
        <div className={styles.surgeryEdit}>
          <div
            className={styles.datepicker}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <DatePicker
              locale={ko}
              selected={editSurgeryDate}
              onChange={(date) => setEditSurgeryDate(date)}
              dateFormat="yyyy/MM/dd"
              customInput={<CustomInput />}
            />
          </div>
          <input
            className={styles.surgeryname}
            type="text"
            onChange={(e) => {
              setEditSurgeryName(e.target.value);
            }}
            value={editSurgeryName}
          ></input>
          <span
            className={styles.check}
            onClick={() => {
              if (editSurgeryName !== "") {
                const newSurgery = props.surgeryHistory.map((item) => {
                  if (item.surgeryId === props.data.surgeryId) {
                    console.log(item.surgeryId);
                    return {
                      surgeryId: props.data.surgeryId,
                      surgeryDate: props.dateFormat(editSurgeryDate),
                      surgeryName: editSurgeryName,
                    };
                  } else {
                    return item;
                  }
                });
                props.setSurgeryHistory(newSurgery);
                UpdateSurgery(props.data.surgeryId);
                setEdit(!edit);
              }
            }}
          >
            <AiFillCheckCircle color="#AFA79F" size="18px" />
          </span>
        </div>
      ) : (
        <div key={props.index} className={styles.surgeryHistory}>
          <span>{props.dateFormat(editSurgeryDate)}</span>
          <span>{editSurgeryName}</span>
          <span
            onClick={() => {
              props.setSurgeryHistory(
                props.surgeryHistory.filter(
                  (surgeryHistory) =>
                    surgeryHistory.surgeryId !== props.data.surgeryId
                )
              );
              DeleteSurgery(props.data.surgeryId);
            }}
          >
            <TiDelete size="18px" color="#827870" />
          </span>
          <span
            style={{ cursor: "pointer" }}
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

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.custominput} onClick={onClick} ref={ref}>
    {value}
  </button>
));

export default SurgeryHistory;
