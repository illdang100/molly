import React, { useEffect, useState } from "react";
import ManagerBoardList from "../../components/community/ManagerBoardList";
import styled from "styled-components";
import styles from "../../css/ManagerHome.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

let CustomNavLink = styled(NavLink)`
  color: #afa79f;
  &:link {
    text-decoration: none;
  }
  &.active {
    color: #827870;
    font-weight: 900;
  }
`;

let CustomBody = styled.div`
  margin-top: 190px;
  padding: 0 5%;
`;

const List = () => {
  const [login, setLogin] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const accountId = params.get("accountId");

    if (accessToken !== null && refreshToken !== null && accountId !== null) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accountId", accountId);
      setLogin(true);
    } else if (
      localStorage.getItem("accessToken") !== "null" &&
      localStorage.getItem("refreshToken") !== "null" &&
      localStorage.getItem("accessToken") !== null &&
      localStorage.getItem("refreshToken") !== null
    ) {
      setLogin(true);
    }
  }, []);

  const handleLogout = () => {
    axios.delete(`https://mo11y.shop/api/account/logout`, {
      headers: {
        "Refresh-Token": localStorage.getItem("refreshToken"),
      },
    });

    localStorage.clear();
    setLogin(false);
  };

  return (
    <div>
      <header className={styles.header}>
        <div>
          <div className={styles.logo}>
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
                  to="/manager/home"
                >
                  Home
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/manager/list/ALL/ALL"
                >
                  Community
                </CustomNavLink>
              </div>
            </nav>
          </div>
          <div className={styles.logout}>
            {login ? (
              <span onClick={handleLogout}>로그아웃</span>
            ) : (
              <span
                onClick={() => {
                  navigate("/manager/login");
                }}
              >
                로그인
              </span>
            )}
          </div>
        </div>
      </header>
      <CustomBody>
        <ManagerBoardList />
      </CustomBody>
    </div>
  );
};

export default List;
