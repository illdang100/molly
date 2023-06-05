import React from "react";
import Header from "../components/Header";
import styles from "../css/Hospital.module.css";
import styled from "styled-components";
import HospitalMap from "../components/hospital/HospitalMap";

let CustomBody = styled.div`
  margin: 140px 10% 0;
`;

const Hospital = () => {
  return (
    <div>
      <Header />
      <CustomBody>
        <div className={styles.map}>
          <HospitalMap />
        </div>
      </CustomBody>
    </div>
  );
};

export default Hospital;
