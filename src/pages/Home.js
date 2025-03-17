import React from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴

const Home = () => {
  return (
    <div>
      {/* Left Section */}
      <div className="left-fiexd-div">
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group left-fiexd-input">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="내 캐릭터 검색하기"
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm">확인</i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Center Section */}
      <div className="content" style={{ textAlign: "center" }}>
        <h1 className="name-custom-font">ㄴMaple Fighterㄱ</h1>
        <div className="logo-div" style={{ textAlign: "center" }}>
          <img className="main-logo" src="images/MapleFighter.jpg" alt="이미지" />
        </div>

        <div className="logo-div" style={{ textAlign: "bottom" }}>
          <img className="botton-logo-div" src="images/vsLogo.jpg" alt="이미지" />
        </div>
      </div>

      {/* Right Section */}
      <div className="right-fiexd-div">
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group right-fiexd-input">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="비교대상 검색하기"
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm">확인</i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
};

export default Home;
