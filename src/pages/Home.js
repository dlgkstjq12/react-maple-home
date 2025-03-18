import React, { useState } from 'react';
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴

const API_KEY = "test_480e2ee8dc30e0385a5d6c49ca46ff97e82c1266b2cbfe3ad54ec58eb6113c34efe8d04e6d233bd35cf2fabdeb93fb0d"; // 여기에 API 키 입력

function Home () {
    
    
    //메이플 API 관련 호출 함수
    //1. 캐릭터 식별자(ocid)를 조회합니다.
    //x-nxopen-api-key :: API KEY
    //character_name :: 캐릭터 이름 
    const [characterName, setCharacterName] = useState("");
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);
    
    const fetchCharacterInfo = async () => {
        
      debugger;
        
      if (!characterName) return;
      
      //ocid 조회후, 조회한 ocid를 가지고 캐릭터 정보 조회함
      const ocidUrl = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`;
      try {
        const response = await fetch(ocidUrl, {
          method: "GET",
          headers: { "x-nxopen-api-key": API_KEY },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        const charInfoUrl = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=`+data.ocid;
        
          //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
          try {
            const infoResponse = await fetch(charInfoUrl, {
              method: "GET",
              headers: { "x-nxopen-api-key": API_KEY },
            });
    
            if (!infoResponse.ok) {
              throw new Error(`API 요청 실패! 상태 코드: ${infoResponse.status}`);
            }
    
            const infoData = await infoResponse.json();
            
            //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
            setCharacterData(infoData);
            setError(null);
          } catch (err) {
            setError("캐릭터 정보를 불러오는 데 실패했습니다.");
            setCharacterData(null);
          }
          
      } catch (err) {
        setError("캐릭터 정보를 불러오는 데 실패했습니다.");
        setCharacterData(null);
      }
    };

    
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
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={fetchCharacterInfo}>
                <i className="fas fa-search fa-sm">확인</i>
              </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {characterData && (
              <div>
                <h2>{characterData.character_name}</h2>
                <img className="main-logo" src={characterData.character_image} alt="이미지" />
                <p>월드: {characterData.world_name}</p>
                <p>직업: {characterData.character_class}</p>
                <p>레벨: {characterData.character_level}</p>
              </div>
            )}
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
}

export default Home;
