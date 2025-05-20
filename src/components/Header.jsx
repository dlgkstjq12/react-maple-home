import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
        <img className="menu-logo-div" onClick={() => navigate("/")} src="images/MapleFighter.jpg" alt="이미지"/>
        <h4 className="main-menu-name" onClick={() => navigate("/")}>
          Maple-Fighter
        </h4>
        <div className="small_menu">
          <ul>
            <li onClick={() => navigate("/")}>
              <Link className={getMenuClass("/")}>
                메인화면
              </Link>
            </li>
            <li onClick={() => navigate("/CharPotialComp")}>
              <Link className={getMenuClass("/CharPotialComp")}>
                잠재능력 시행횟수 비교 분석 (개발중)
              </Link>
            </li>
            <li onClick={() => navigate("/Contact")}>
              <Link className={getMenuClass("/Contact")}>
                Contact Me
              </Link>
            </li>
            <li onClick={() => navigate("/PrivacyPolicy")}>
              <Link className={getMenuClass("/PrivacyPolicy")}>
                개인정보 처리방침
              </Link>
            </li>
          </ul>
        </div>

        <div className="toggle-div">
          <img className="toggle-icon" src="images/toggle-icon.png" onClick={toggleVisibility}/>
        </div>

        <nav id="toDiv" className="Header_mobile-navigation-menus">
          <ul>
            <li onClick={() => navigate("/")}>
              <Link className={`mobile-navigation ${getMenuClass("/")}`} onClick={toggleVisibility}>
                메인화면
              </Link>
            </li>
          </ul>
          <ul>
            <li onClick={() => navigate("/CharPotialComp")}>
              <Link className={`mobile-navigation ${getMenuClass("/CharPotialComp")}`} onClick={toggleVisibility}>
                잠재능력 시행횟수 비교 분석 (개발중)
              </Link>
            </li>
          </ul>
          <ul>
            <li onClick={() => navigate("/Contact")}>
              <Link className={`mobile-navigation ${getMenuClass("/Contact")}`} onClick={toggleVisibility}>
                Contact Me
              </Link>
            </li>
          </ul>
          <ul>
            <li onClick={() => navigate("/PrivacyPolicy")}>
              <Link className={`mobile-navigation ${getMenuClass("/PrivacyPolicy")}`} onClick={toggleVisibility}>
                개인정보 처리방침
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
