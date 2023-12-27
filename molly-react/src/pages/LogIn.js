import React from 'react';
import styles from '../css/Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const KAKAO_AUTH_URL = `https://mo11y.shop/oauth2/authorization/kakao`;
  const GOOGLE_AUTH_URL = `https://mo11y.shop/oauth2/authorization/google`;
  
  
  const kakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  }

  const googleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  }

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div onClick={() => navigate('/')}>
          <img src={process.env.PUBLIC_URL + '/molly-logo-title.png'} alt="molly-logo" width="120px"/>
        </div>
        <p>반려동물 예방접종 일정관리 사이트</p>
        <p>간편 로그인 👋</p>
        <div onClick={kakaoLogin}>
          <img src='img/kakao_login_medium_wide.png' alt="kakao"/>
        </div>
        <div style={{marginTop: "10px"}} onClick={googleLogin}>
          <img src='img/google_login.png' alt="kakao" width="81%"/>
        </div>
      </div>
    </div>
  );
};

export default Login;