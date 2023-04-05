import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/First.module.css'
import styled from 'styled-components';
import { MdArrowForwardIos } from 'react-icons/md';

let CustomNavLink = styled(NavLink)`
  color: #AFA79F;
  &:link {
    text-decoration: none;
  }
  &.active {
    color: #827870;
    font-weight: 900;
  }
`;

const First = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const accountId = params.get('accountId');
  const accessToken = params.get('accessToken');

  return (
    <div style={{zIndex:"3"}}>
      <header className={styles.header}>
        <div className={styles.user}>
          <h4 onClick={() => navigate('/login')}>로그인</h4>
        </div>
        <div className={styles.container}>
          <div style={{flexGrow: "1"}} />
          <div className={styles.logo}>
            <img src={process.env.PUBLIC_URL + '/molly-logo.png'} alt="molly-logo" width="120px"/>
          </div>
          <div className={styles.navcontainer}>
            <nav className={styles.navigation}>
              <div>
                <CustomNavLink 
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/home">
                    Home
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink 
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/calendar">
                    Calendar
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink
                  style={({ isActive }) => (isActive ? "active" : "")} 
                  to="/list">
                    Community
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink 
                  style={({ isActive }) => (isActive ? "active" : "")}
                  to="/hospital">
                    Hospital
                </CustomNavLink>
              </div>
              <div>
                <CustomNavLink
                  style={({ isActive }) => (isActive ? "active" : "")} 
                  to="/about">
                    About
                </CustomNavLink>
              </div>
            </nav>
          </div>
          <div style={{flexGrow: "1"}} />
        </div>
      </header>
      <div className={styles.banner}>
        <h1>molly</h1>
        <span><MdArrowForwardIos size="50px" color="rgba(235, 231, 227, 40)"/></span>
      </div>
      {console.log(accountId, accessToken)}
    </div>
  );
};

export default First;