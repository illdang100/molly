import React, { useEffect, useState } from "react";
import styles from "../../css/ManagerBoardList.module.css";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { IoMdThumbsUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import ManagerBoard from "./ManagerBoard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const ManagerBoardList = () => {
  let { category, pet } = useParams();
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currPage, setCurrPage] = useState(page);
  const [view, setView] = useState(false);
  const [value, setValue] = useState("createdDate");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    let params;
    const pageNum = page - 1;

    search === ""
      ? (params = {
          category: category === "undefined" ? "ALL" : category,
          petType: pet,
          sort: `${value},desc`,
          page: pageNum,
          size: 15,
        })
      : (params = {
          category: category === "undefined" ? "ALL" : category,
          petType: pet,
          searchWord: search,
          sort: `${value},desc`,
          page: pageNum,
          size: 15,
        });

    const config = {
      params: params,
    };

    axiosInstance
      .get(`/api/board/list`, config)
      .then((response) => {
        console.log(response.data.data);
        setList(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [category, pet, page, value, search]);

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

  // useEffect(() => {
  //   console.log("render");
  //   setLoading(true);

  //   setList({
  //     content: [
  //       {
  //         boardId: 1,
  //         title: "notice board1",
  //         writerNick: "관리자",
  //         createdAt: "2023-05-10 19:59:54",
  //         content:
  //           "<p>본명은 트찰라. 아프리카 대륙에 존재하는 가공의 국가 와칸다의 국왕이다. 블랙 팬서라는 작명이 실존했던 미국의 흑인 정당 흑표당(Black Panther Party)에서 따왔다는 말도 있다. 이에 대해서는 블랙팬서가 최초등장한 판타스틱포 362화가 1966년 7월에 나왔고 흑표당은 3개월 뒤인 10월에 창당했으므로 관계가 없다는 의견도 있으나, 정당은 하루아침에 갑자기 창당되는 것이 아니며 실제로 흑표당은 결사조직에서 정당으로 발전했다. 이 정도로 시기가 겹친다면 오히려 관계가 있다는 주장 쪽에 무게가 실린다. 다만 흑표당이 탄생한 후 이 캐릭터의 이름은 한동안 그냥 팬서라고만 알려지다 아예 '블랙 레오파드'로 변경했고 오래 가지 못하고 다시 블랙팬서로 돌아왔다. 1971년 판타스틱 포 No. 119 단 한권의 이슈에서만 블랙 레오파드라고 불렸고 이름 변경 이슈는 단 몇개월만에 일어났다 마무리되었다.</p>",
  //         views: 43,
  //         commentCount: 43,
  //         likyCount: 43,
  //         hasImage: false,
  //         notice: true,
  //       },
  //       {
  //         boardId: 2,
  //         title: "notice board3",
  //         writerNick: "dd",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<h1>notice content3</h1>",
  //         views: 31,
  //         commentCount: 31,
  //         likyCount: 31,
  //         hasImage: false,
  //         notice: true,
  //       },
  //       {
  //         boardId: 17,
  //         title: "notice board2",
  //         writerNick: "관리자",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<img src='/img/marker.png'></img>",
  //         views: 4,
  //         commentCount: 4,
  //         likyCount: 4,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 62,
  //         title: "test board34",
  //         writerNick: null,
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content34</p>",
  //         views: 98,
  //         commentCount: 98,
  //         likyCount: 98,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //       {
  //         boardId: 11,
  //         title: "test board6",
  //         writerNick: "일당백1",
  //         createdAt: "2023-05-10 19:59:54",
  //         content: "<p>test content6</p>",
  //         views: 96,
  //         commentCount: 100,
  //         likyCount: 100,
  //         hasImage: false,
  //         notice: false,
  //       },
  //     ],
  //     pageable: {
  //       sort: {
  //         unsorted: false,
  //         sorted: true,
  //         empty: false,
  //       },
  //       pageSize: 5,
  //       pageNumber: 0,
  //       offset: 0,
  //       paged: true,
  //       unpaged: false,
  //     },
  //     last: false,
  //     totalPages: 21,
  //     totalElements: 103,
  //     first: true,
  //     numberOfElements: 5,
  //     size: 5,
  //     number: 0,
  //     sort: {
  //       unsorted: false,
  //       sorted: true,
  //       empty: false,
  //     },
  //     empty: false,
  //   });

  //   setLoading(false);
  // }, [category, pet, page, value, search]);

  let firstNum = currPage - (currPage % 5) + 1;
  let lastNum = currPage - (currPage % 5) + 5;

  if (loading) {
    return (
      <div
        style={{
          position: "relative",
          width: "75%",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <SyncLoader
            color="#BF7A09"
            loading
            margin={5}
            size={10}
            speedMultiplier={1}
          />
        </div>
      </div>
    );
  }

  if (Object.keys(list).length === 0) {
    return null;
  }

  return (
    <div style={{ position: "relative", width: "75%", margin: "auto" }}>
      <ManagerBoard pet={pet} setSearch={setSearch} />
      <div className={styles.header}>
        <div className={styles.petTap}>
          <span
            onClick={() => {
              navigate(`/manager/list/${category}/ALL`);
            }}
            style={
              pet === "ALL" ? { color: "#f16340", fontWeight: "700" } : null
            }
          >
            전체
          </span>
          <span
            onClick={() => {
              navigate(`/manager/list/${category}/DOG`);
            }}
            style={
              pet === "DOG" ? { color: "#f16340", fontWeight: "700" } : null
            }
          >
            강아지
          </span>
          <span
            onClick={() => {
              navigate(`/manager/list/${category}/CAT`);
            }}
            style={
              pet === "CAT" ? { color: "#f16340", fontWeight: "700" } : null
            }
          >
            고양이
          </span>
          <span
            onClick={() => {
              navigate(`/manager/list/${category}/RABBIT`);
            }}
            style={
              pet === "RABBIT" ? { color: "#f16340", fontWeight: "700" } : null
            }
          >
            토끼
          </span>
        </div>
        <ul
          onClick={() => {
            setView(!view);
          }}
        >
          <div className={styles.sort}>
            <span className={styles.default}>
              {value === "createdDate"
                ? "최신순 정렬"
                : value === "likyCnt"
                ? "추천순 정렬"
                : value === "views"
                ? "조회순 정렬"
                : "댓글순 정렬"}
            </span>
            {view ? (
              <MdExpandLess size="25px" color="#AFA79F" />
            ) : (
              <MdExpandMore size="25px" color="#AFA79F" />
            )}
            {view && <Dropdown setValue={setValue} />}
          </div>
        </ul>
      </div>
      <div className={styles.board}>
        {list.content !== null
          ? list.content.map((item, index) => {
              return (
                <List
                  key={item.index}
                  pet={pet}
                  category={category}
                  id={item.boardId}
                  title={item.title}
                  detail={item.content}
                  time={item.createdAt}
                  writer={item.writerNick}
                  good={item.likyCount}
                  comment={item.commentCount}
                  notice={item.notice}
                />
              );
            })
          : [
              {
                boardId: 0,
                title: "",
                writerNick: "",
                createdAt: "",
                content: "",
                views: 0,
                commentCount: 0,
                likyCount: 0,
                hasImage: false,
                notice: true,
              },
            ].map((item, index) => {
              return (
                <List
                  key={item.index}
                  pet={pet}
                  category={category}
                  id={item.boardId}
                  title={item.title}
                  detail={item.content}
                  time={item.createdAt}
                  writer={item.writerNick}
                  good={item.likyCount}
                  comment={item.commentCount}
                  notice={item.notice}
                />
              );
            })}
      </div>
      <div className={styles.footer}>
        <div>
          <button
            onClick={() => {
              setPage(page - 1);
              setCurrPage(page - 2);
            }}
            disabled={page === 0}
          >
            &lt;
          </button>
          <button
            onClick={() => setPage(firstNum)}
            aria-current={page === firstNum ? "page" : null}
          >
            {firstNum}
          </button>
          {Array(4)
            .fill()
            .map((_, i) => {
              if (firstNum + 1 + i > list.totalPages) {
                return null;
              } else {
                if (i <= 2) {
                  return (
                    <button
                      border="true"
                      key={i + 1}
                      onClick={() => {
                        setPage(firstNum + 1 + i);
                      }}
                      aria-current={page === firstNum + 1 + i ? "page" : null}
                    >
                      {firstNum + 1 + i}
                    </button>
                  );
                } else if (i >= 3) {
                  return (
                    <button
                      border="true"
                      key={i + 1}
                      onClick={() => setPage(lastNum)}
                      aria-current={page === lastNum ? "page" : null}
                    >
                      {lastNum}
                    </button>
                  );
                }
              }
            })}
          <button
            onClick={() => {
              setPage(page + 1);
              setCurrPage(page);
            }}
            disabled={page === list.totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

const Dropdown = (props) => {
  return (
    <div className={styles.dropdown}>
      <li
        onClick={() => {
          props.setValue("createdDate");
        }}
      >
        최신순 정렬
      </li>
      <li
        onClick={() => {
          props.setValue("likyCnt");
        }}
      >
        추천순 정렬
      </li>
      <li
        onClick={() => {
          props.setValue("views");
        }}
      >
        조회순 정렬
      </li>
      <li
        onClick={() => {
          props.setValue("commentCnt");
        }}
      >
        댓글순 정렬
      </li>
    </div>
  );
};

const List = (props) => {
  let navigate = useNavigate();

  if (props.notice === true) {
    return (
      <div
        onClick={() => {
          navigate(`/manager/board/${props.id}`);
        }}
        className={styles.listManager}
      >
        <span>공지</span>
        <h3 style={{ cursor: "pointer" }}>{props.title}</h3>
        <span>{props.time}</span>
        <span>{props.writer}</span>
        <div>
          <span>
            <IoMdThumbsUp color="#B27910" size="18px" />
          </span>
          <span>{props.good}</span>
          <span>
            <FaComment color="#B27910" size="13px" />
          </span>
          <span>{props.comment}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div
        onClick={() => {
          navigate(`/manager/board/${props.id}`);
        }}
        className={styles.list}
      >
        <h3 style={{ cursor: "pointer" }}>{props.title}</h3>
        <span>{props.time}</span>
        <span>{props.writer === null ? "(알 수 없음)" : props.writer}</span>
        <div>
          <span>
            <IoMdThumbsUp color="#B27910" size="18px" />
          </span>
          <span>{props.good}</span>
          <span>
            <FaComment color="#B27910" size="13px" />
          </span>
          <span>{props.comment}</span>
        </div>
      </div>
    );
  }
};

export default ManagerBoardList;
