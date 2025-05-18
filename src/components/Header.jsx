import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 모바일에서 메뉴아이콘 클릭시 실행
  const toggleVisibility = () => {
    const div = document.getElementById("toDiv");
    const costumHeader = document.getElementsByClassName("costum_header");
    const MAIN_MEUM_NUM = 0;
    const isShown = div.classList.contains("show");

    if (isShown) {
      div.classList.remove("show");
      costumHeader[MAIN_MEUM_NUM].style.height = "3.5rem";
    } else {
      div.classList.add("show");
      costumHeader[MAIN_MEUM_NUM].style.height = "14rem";
    }
  };

  // 각 메뉴의 path와 현재 위치 비교 후 클래스 적용
  const getMenuClass = (path) => {
    return pathname === path ? "active-menu" : "passive-menu";
  };

  return (
    <div className="header_section">
      <div className="costum_header">
        <img
          className="menu-logo-div"
          onClick={() => navigate("/")}
          src="images/MapleFighter.jpg"
          alt="이미지"
        />
        <h4 className="main-menu-name" onClick={() => navigate("/")}>
          Maple-Fighter
        </h4>

        <div className="small_menu">
          <ul>
            <li onClick={() => navigate("/")}>
              <a className={getMenuClass("/")}>메인화면</a>
            </li>
            <li onClick={() => navigate("/CharPotialComp")}>
              <a className={getMenuClass("/CharPotialComp")}>
                잠재능력 시행횟수 비교 분석 (개발중)
              </a>
            </li>
            <li onClick={() => navigate("/Contact")}>
              <a className={getMenuClass("/Contact")}>Contact Me</a>
            </li>
            <li onClick={() => navigate("/PrivacyPolicy")}>
              <a className={getMenuClass("/PrivacyPolicy")}>
                개인정보 처리방침
              </a>
            </li>
          </ul>
        </div>

        <div className="toggle-div">
          <img
            className="toggle-icon"
            src="images/toggle-icon.png"
            onClick={toggleVisibility}
          />
        </div>

        <nav id="toDiv" className="Header_mobile-navigation-menus">
          <ul>
            <li
              onClick={() => navigate("/")}
              className={`mobile-navigation ${getMenuClass("/")}`}
            >
              메인화면
            </li>
          </ul>
          <ul>
            <li
              onClick={() => navigate("/CharPotialComp")}
              className={`mobile-navigation ${getMenuClass("/CharPotialComp")}`}
            >
              잠재능력 시행횟수 비교 분석 (개발중)
            </li>
          </ul>
          <ul>
            <li
              onClick={() => navigate("/Contact")}
              className={`mobile-navigation ${getMenuClass("/Contact")}`}
            >
              Contact Me
            </li>
          </ul>
          <ul>
            <li
              onClick={() => navigate("/PrivacyPolicy")}
              className={`mobile-navigation ${getMenuClass("/PrivacyPolicy")}`}
            >
              개인정보 처리방침
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
