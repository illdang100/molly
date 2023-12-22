import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "../css/First.module.css";
import styled from "styled-components";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios";
import cookie from "react-cookies";

let CustomNavLink = styled(NavLink)`
  color: #afa79f;
  font-size: 18px;
  font-weight: 600;
  &:link {
    text-decoration: none;
  }
  &.active {
    color: #827870;
    font-weight: 900;
  }
`;

const First = () => {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const accessToken = cookie.load("accessToken");
    const refreshToken = cookie.load("refreshToken");
    const accountId = cookie.load("accountId");

    if (
      accessToken !== null &&
      refreshToken !== null &&
      accountId !== null &&
      accessToken !== undefined &&
      refreshToken !== undefined
    ) {
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

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  const handleLogout = () => {
    axios.delete(`http://localhost:8080/api/account/logout`, {
      headers: {
        "Refresh-Token": localStorage.getItem("refreshToken"),
      },
    });

    localStorage.clear();
    setLogin(false);
  };

  const inputForm = useRef();
  const handleScroll = () => {
    inputForm.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ zIndex: "3" }}>
      <div className={styles.bannerBackground}>
        <header
          className={styles.header}
          style={
            scrollPosition > 100
              ? { backgroundColor: "white", transition: "0.7s" }
              : null
          }
        >
          <div className={styles.user}>
            {login ? (
              <h4 onClick={handleLogout}>로그아웃</h4>
            ) : (
              <h4 onClick={() => navigate("/login")}>로그인</h4>
            )}
          </div>
          <div className={styles.container}>
            <div style={{ flexGrow: "0.5" }} />
            <div className={styles.logo}>
              <img
                src={process.env.PUBLIC_URL + "/molly-logo.png"}
                alt="molly-logo"
                width="140px"
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
                <div>
                  <CustomNavLink
                    style={({ isActive }) => (isActive ? "active" : "")}
                    to="/list/ALL/ALL"
                  >
                    Community
                  </CustomNavLink>
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
            <div style={{ flexGrow: "1" }} />
          </div>
        </header>
        <div className={styles.banner}>
          <h1>반려동물 일정관리</h1>
          <h1>몰리에서 쉽고 간편하게</h1>
          <span onClick={handleScroll}>
            <SlArrowDown size="50px" color="#ffffffd2" />
          </span>
          {/* <span>
            <MdArrowForwardIos size="50px" color="rgba(235, 231, 227, 80)" />
          </span> */}
        </div>
      </div>
      <div ref={inputForm} className={styles.detail}>
        <div>
          <h1>👩‍⚕️ 반려동물 예방접종을 맞아야 하는 이유?</h1>
          <p>
            반려동물의 전염병 예방과 건강관리 및 적정한 치료, 반려동물의
            질병으로 인한 일반인의 위생상의 문제를 방지하기 위해 예방접종이
            필요합니다. 일반적으로 반려동물의 예방접종은 생후 6주부터 접종을
            시작하는데, 급격한 환경의 변화가 있을 경우 적응기간을 가진 후 접종을
            진행해야 하며, 예방접종의 시기와 종류를 반드시 확인해야 합니다.
            특별자치시장, 시장, 군수, 구청장은 광견병 예방주사를 맞지 않은 개,
            고양이 등이 건물 밖에서 배회하는 것을 발견하였을 경우에 소유자의
            부담으로 억류하거나 살처분 또는 그 밖에 필요한 조치를 할 수 있으므로
            광견병 예방접종은 꼭 실시해야 합니다.
          </p>
        </div>
        <div>
          <h1>🐶 몰리에서는</h1>
          <div style={{ marginTop: "30px", padding: "0 20px" }}>
            <p>예방접종 일정관리</p>
            <p>
              반려동물을 등록하면 예정된 예방접종을 달력으로 한 눈에 확인할 수
              있습니다.
            </p>
            <p>커뮤니티</p>
            <p>
              반려동물을 키우는 사람들과 소통할 수 있습니다. 궁금한 점을
              물어보고 도움을 얻어보세요!
            </p>
            <p>주변 동물병원</p>
            <p>
              내 위치를 기반으로 가까운 동물 병원 위치와 야간 동물 병원을
              알려드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default First;
