import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    
    const navigate = useNavigate();
    
    //모바일에서 메뉴아이콘 클릭시 실행
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
        costumHeader[MAIN_MEUM_NUM].style.height = "10rem";
      }
    }

    return (
        <div className="header_section">
          <div className="costum_header">
            <img className="menu-logo-div" onClick={() => navigate('/')} src="images/MapleFighter.jpg" alt="이미지" />
            <h4 className="main-menu-name" onClick={() => navigate('/')}>Maple-Fighter</h4>
            <div class="small_menu">
              <ul>
                <li onClick={() => navigate('/')}><a> 메인화면</a></li>
                <li onClick={() => navigate('/CharPotialComp')}><a>잠재능력 시행횟수 비교 분석 (개발중)</a></li>
                <li onClick={() => navigate('/Contact')}><a>Contact Me</a></li>
                <li onClick={() => navigate('/PrivacyPolicy')}><a>개인정보 처리방침</a></li>
              </ul>
            </div>
            <div class="toggle-div">
                <img className="toggle-icon" src="images/toggle-icon.png" onClick={toggleVisibility} />
            </div>
            <nav id="toDiv" class="Header_mobile-navigation-menus">
               <ul>
                    <li onClick={() => navigate('/')} className="mobile-navigation">메인화면</li>
               </ul>
               <ul>
                    <li onClick={() => navigate('/CharPotialComp')} className="mobile-navigation">잠재능력 시행횟수 비교 분석 (개발중)</li>
               </ul>
               <ul>
                    <li onClick={() => navigate('/Contact')} className="mobile-navigation">Contact Me</li>
               </ul>
               <ul>
                    <li onClick={() => navigate('/PrivacyPolicy')} className="mobile-navigation">개인정보 처리방침</li>
               </ul>
            </nav>
         </div>
       </div>
    )
};

export default Header;
