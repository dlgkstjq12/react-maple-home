import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    
    const navigate = useNavigate();
    const mainMove = () => {
        navigate('/'); // 특정 파일로 이동
    }
    
    //모바일에서 메뉴아이콘 클릭시 실행
    const toggleVisibility = () => {
       const div = document.getElementById("toDiv");
       const costumHeader = document.getElementsByClassName("costum_header");
       const MAIN_MEUM_NUM = 0;
       
       // 현재 display 스타일 확인
       if (window.getComputedStyle(div).display === "none") {
           div.style.display = "block";
           costumHeader[MAIN_MEUM_NUM].style.height = "10rem";
       } else {
           div.style.display = "none";
           costumHeader[MAIN_MEUM_NUM].style.height = "3rem";
       }
    }

    return (
        <div className="header_section">
          <div className="costum_header">
            <img className="menu-logo-div" onClick={mainMove} src="images/MapleFighter.jpg" alt="이미지" />
            <h4 className="main-menu-name" onClick={mainMove}>Maple-Fighter</h4>
            <div class="small_menu">
              <ul>
                <li onclick="moveSections(0)"><a> 메인화면</a></li>
                <li onclick="moveSections(1)"><a>잠재능력 설정 비교 분석</a></li>
              </ul>
            </div>
            <div class="toggle-div">
                <img className="toggle-icon" src="images/toggle-icon.png" onclick={toggleVisibility} />
            </div>
            <nav id="toDiv" class="Header_mobile-navigation-menus">
               <ul>
                    <li onclick="mobileMoveSection(0)"><a class="mobile-navigation">【Top】</a></li>
               </ul>
               <ul>
                    <li onclick="mobileMoveSection(1)"><a class="mobile-navigation">【Skill】</a></li>
               </ul>
            </nav>
         </div>
       </div>
    )
};

export default Header;
