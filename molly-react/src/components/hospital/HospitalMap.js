import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import styles from "../../css/HospitalMap.module.css";
import {
  MdOutlineStarOutline,
  MdOutlineStarHalf,
  MdOutlineStar,
  MdSearch,
} from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import useDidMountEffect from "../../pages/useDidMountEffect";

const libraries = ["places"];
const mapContainerStyle = {
  width: "65%",
  height: "400px",
};

const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const options = {
  disableDefaultUI: true,
  styles: myStyles,
};

const HospitalMap = () => {
  const [map, setMap] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [search, setSearch] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  let count = 0;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCvNXc4xAKwBK99wTMBapkko0Oqs4Kdqro",
    libraries,
  });

  // useEffect(() => {
  //   setLoading(true);

  //   const config = {
  //     headers: {
  //       Authorization: localStorage.getItem("accessToken"),
  //     },
  //   };

  //   axiosInstance
  //     .get("/api/auth/hospital", config)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data.code === 1) {
  //         setLoading(false);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }, []);

  useDidMountEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          if (map !== null) {
            const service = new window.google.maps.places.PlacesService(map);

            const request = {
              location,
              radius: "10000",
              query: "동물병원",
            };

            service.textSearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const sortedResults = results.sort((a, b) => {
                  const aOpenNow = a.opening_hours && a.opening_hours.open_now;
                  const bOpenNow = b.opening_hours && b.opening_hours.open_now;

                  if (aOpenNow && !bOpenNow) {
                    return -1; // a가 영업 중이고 b가 영업 종료인 경우 a를 앞으로
                  } else if (!aOpenNow && bOpenNow) {
                    return 1; // b가 영업 중이고 a가 영업 종료인 경우 b를 앞으로
                  }
                  return 0; // 영업 여부가 같거나 정보가 없는 경우 순서 변경 없음
                });

                setSearchResults(sortedResults);
              }
            });
          }
        },
        (error) => {
          console.error("Error getting the user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [map]);

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

  const onMapLoad = (map) => {
    setMap(map);
  };

  const onPlacesChanged = () => {
    if (map && searchQuery !== "") {
      const service = new window.google.maps.places.PlacesService(map);

      const request = {
        location: map.getCenter(),
        radius: "10000",
        query: `${searchQuery} 동물병원`,
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const sortedResults = results.sort((a, b) => {
            const aOpenNow = a.opening_hours && a.opening_hours.open_now;
            const bOpenNow = b.opening_hours && b.opening_hours.open_now;

            if (aOpenNow && !bOpenNow) {
              return -1; // a가 영업 중이고 b가 영업 종료인 경우 a를 앞으로
            } else if (!aOpenNow && bOpenNow) {
              return 1; // b가 영업 중이고 a가 영업 종료인 경우 b를 앞으로
            }
            return 0; // 영업 여부가 같거나 정보가 없는 경우 순서 변경 없음
          });

          setSearchResults(sortedResults);
          setSearch(true);
        }
      });
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCurrent = () => {
    setSearchQuery("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          if (map !== null) {
            const service = new window.google.maps.places.PlacesService(map);

            const request = {
              location,
              radius: "10000",
              query: "동물병원",
            };

            service.textSearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const sortedResults = results.sort((a, b) => {
                  const aOpenNow = a.opening_hours && a.opening_hours.open_now;
                  const bOpenNow = b.opening_hours && b.opening_hours.open_now;

                  if (aOpenNow && !bOpenNow) {
                    return -1; // a가 영업 중이고 b가 영업 종료인 경우 a를 앞으로
                  } else if (!aOpenNow && bOpenNow) {
                    return 1; // b가 영업 중이고 a가 영업 종료인 경우 b를 앞으로
                  }
                  return 0; // 영업 여부가 같거나 정보가 없는 경우 순서 변경 없음
                });

                setSearchResults(sortedResults);
              }
            });
          }
        },
        (error) => {
          console.error("Error getting the user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          marginTop: "200px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SyncLoader
          color="#BF7A09"
          loading
          margin={5}
          size={10}
          speedMultiplier={1}
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "-20px" }}>
      <div className={styles.search}>
        <input
          placeholder="지역을 입력하세요"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onPlacesChanged();
            }
          }}
        />
        <span onClick={onPlacesChanged}>
          <MdSearch color="#AFA79F" />
        </span>
      </div>
      <div className={styles.map}>
        <div></div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={
              !search ? currentLocation : searchResults[0].geometry.location
            }
            zoom={13}
            options={options}
            onLoad={onMapLoad}
          >
            <Marker
              position={currentLocation}
              icon={{
                url: process.env.PUBLIC_URL + "/img/marker.png",
                scaledSize: new window.google.maps.Size(26, 32),
              }}
            ></Marker>
            {searchResults.map((result) => (
              <>
                <Marker
                  key={result.place_id}
                  position={result.geometry.location}
                  icon={{
                    url: process.env.PUBLIC_URL + "/img/hospital-marker.png",
                    scaledSize: new window.google.maps.Size(26, 32),
                  }}
                  onClick={() => handleMarkerClick(result)}
                />
              </>
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.geometry.location}
                onCloseClick={() => setSelectedMarker(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -25),
                }}
              >
                <div className={styles.infoWindow}>
                  <p>{selectedMarker.name}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
        <div className={styles.night}>
          <span className={styles.currentLocation} onClick={handleCurrent}>
            <BiCurrentLocation color="#A19C97" size="25px" />
          </span>
          <h3>야간 동물 병원 🌙</h3>
          {searchResults.map((result, index) => {
            if (result.name.includes("24시")) {
              count++;
              return (
                <div>
                  <p>{result.name}</p>
                </div>
              );
            } else if (count === 0 && index === searchResults.length - 1) {
              return (
                <div>
                  <p>근처에 야간 동물병원이 없습니다.</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div style={{ marginTop: "20px", color: "#9B9B9B" }}>
        반경 10km 이내로 조회됩니다.
      </div>
      <div>
        {searchResults.map((result) => (
          <div key={result.place_id} className={styles.hospitalList}>
            <div>
              <h3>{result.name}</h3>
              <p>{result.formatted_address}</p>
            </div>
            <div>
              <p>{result.rating}</p>
              <div>
                {result.rating === 0 ? (
                  Array(5)
                    .fill()
                    .map(() => {
                      return (
                        <MdOutlineStarOutline size="18px" color="#EBC351" />
                      );
                    })
                ) : result.rating > 0 && result.rating < 1 ? (
                  <>
                    <MdOutlineStarHalf size="18px" color="#EBC351" />{" "}
                    {Array(4)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating === 1 ? (
                  <>
                    <MdOutlineStar size="18px" color="#EBC351" />{" "}
                    {Array(4)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating > 1 && result.rating < 2 ? (
                  <>
                    <MdOutlineStar size="18px" color="#EBC351" />{" "}
                    <MdOutlineStarHalf size="18px" color="#EBC351" />{" "}
                    {Array(3)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating === 2 ? (
                  <>
                    {Array(2)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    {Array(3)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating > 2 && result.rating < 3 ? (
                  <>
                    {Array(2)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    <MdOutlineStarHalf size="18px" color="#EBC351" />{" "}
                    {Array(2)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating === 3 ? (
                  <>
                    {Array(3)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    {Array(2)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating > 3 && result.rating < 4 ? (
                  <>
                    {Array(3)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    <MdOutlineStarHalf size="18px" color="#EBC351" />{" "}
                    {Array(1)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating === 4 ? (
                  <>
                    {Array(4)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    {Array(1)
                      .fill()
                      .map(() => {
                        return (
                          <MdOutlineStarOutline size="18px" color="#EBC351" />
                        );
                      })}
                  </>
                ) : result.rating > 4 && result.rating < 5 ? (
                  <>
                    {Array(4)
                      .fill()
                      .map(() => {
                        return <MdOutlineStar size="18px" color="#EBC351" />;
                      })}{" "}
                    <MdOutlineStarHalf size="18px" color="#EBC351" />
                  </>
                ) : (
                  Array(5)
                    .fill()
                    .map(() => {
                      return <MdOutlineStar size="18px" color="#EBC351" />;
                    })
                )}
              </div>
              <p>{`(${result.user_ratings_total})`}</p>
            </div>
            <div className={styles.open}>
              {result.opening_hours &&
              result.opening_hours.open_now === true ? (
                <h4>영업 중</h4>
              ) : result.opening_hours &&
                result.opening_hours.open_now === false ? (
                <h4>영업 종료</h4>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalMap;
