import React, { useState } from "react";
import styles from "../css/ManagerLogin.module.css";
import { useNavigate } from "react-router-dom";

const ManagerLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch(`https://mo11y.shop/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id,
        password: password,
      }),
    })
      .then((res) => {
        console.log(res);
        let accessToken = res.headers.get("Authorization");
        let refreshToken = res.headers.get("Refresh-token");
        let accountId = res.headers.get("Account-Id");
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accountId", accountId);

        return res.json();
      })
      .then((res) => {
        if (res.code === 1) {
          console.log(res.msg);
          window.location.replace("/manager/home");
        } else {
          console.log(res.msg);
        }
      });
  };

  const handleChangeId = (e) => {
    setId(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div onClick={() => navigate("/")}>
          <img
            src={process.env.PUBLIC_URL + "/molly-logo-title.png"}
            alt="molly-logo"
            width="120px"
          />
        </div>
        <p>반려동물 예방접종 일정관리 사이트</p>
        <div>
          <p>관리자 로그인</p>
        </div>
      </div>
      <div className={styles.input}>
        <div>
          <input
            value={id}
            onChange={handleChangeId}
            type="text"
            placeholder="id"
          ></input>
          <input
            value={password}
            onChange={handleChangePassword}
            type="password"
            placeholder="password"
          ></input>
          <button onClick={handleLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
