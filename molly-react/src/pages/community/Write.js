import React, { useState } from 'react';
import Header from '../../components/Header';
import Board from '../../components/community/Board';
import styled from 'styled-components';
import styles from '../../css/Write.module.css';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

let CustomBody = styled.div`
  margin-top: 290px;
  padding: 0 5%;
`;

const Write = () => {

  const [boardView, setBoardView] = useState(false);
  const [boardValue, setBoardValue] = useState('전체게시판');
  const [petView, setPetView] = useState(false);
  const [petValue, setPetValue] = useState('선택 안함');
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const customUploadAdapter = (loader) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append("file", file);

            axios
              .post("https://mo11y.shop/api/v0/file/upload", formData)
              .then((res) => {
                resolve({
                  default: res.data.data.uri,
                });
              })
              .catch((err) => reject(err));
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <div>
      <Header />
      <CustomBody>
        <div style={{ position: "relative", width: "75%", margin: "auto" }}>
          <Board />
          <div className={styles.header}>
            <ul onClick={() => { setBoardView(!boardView) }}>
              <div className={styles.sort}>
                <span className={styles.default}>{boardValue}</span>
                {boardView ? <span className={styles.boardCategory}><MdExpandLess size="25px" color="#AFA79F" /></span> :
                  <span className={styles.boardCategory}><MdExpandMore size="25px" color="#AFA79F" /></span>}
                {boardView && <BoardDropdown setValue={setBoardValue} />}
              </div>
            </ul>
            <ul onClick={() => { setPetView(!petView) }}>
              <div className={styles.sort}>
                <span className={styles.petdefault}>{petValue}</span>
                {petView ? <span className={styles.boardCategory}><MdExpandLess size="25px" color="#AFA79F" /></span> :
                  <span className={styles.boardCategory}><MdExpandMore size="25px" color="#AFA79F" /></span>}
                {petView && <PetDropdown setValue={setPetValue} />}
              </div>
            </ul>
          </div>
          <div className={styles.title}>
            <input placeholder="제목을 입력하세요."></input>
          </div>
          {/* 
          <div className={styles.board}>
            <textarea placeholder="내용을 입력하세요."></textarea>
          </div> */}
          <section>
            <CKEditor
              editor={ClassicEditor}
              data=""
              config={{ extraPlugins: [uploadPlugin] }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                setContent(editor.getData());
                console.log({ event, editor, content });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </section>
        </div>
      </CustomBody>
    </div>
  );
};

const BoardDropdown = (props) => {
  return (
    <div className={styles.dropdown}>
      <li onClick={() => { props.setValue('전체게시판') }}>전체게시판</li>
      <li onClick={() => { props.setValue('의료게시판') }}>의료게시판</li>
      <li onClick={() => { props.setValue('자유게시판') }}>자유게시판</li>
    </div>
  )
}

const PetDropdown = (props) => {
  return (
    <div className={styles.petdropdown}>
      <li onClick={() => { props.setValue('선택 안함') }}>선택 안함</li>
      <li onClick={() => { props.setValue('강아지') }}>강아지</li>
      <li onClick={() => { props.setValue('고양이') }}>고양이</li>
      <li onClick={() => { props.setValue('토끼') }}>토끼</li>
    </div>
  )
}

export default Write;