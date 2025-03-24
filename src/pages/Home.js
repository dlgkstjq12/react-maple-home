import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴

const API_KEY = "test_480e2ee8dc30e0385a5d6c49ca46ff97e82c1266b2cbfe3ad54ec58eb6113c34efe8d04e6d233bd35cf2fabdeb93fb0d"; // 여기에 API 키 입력

function Home () {
    
    //Hook ------------ 역할  언제 사용?
    //useState -------- 상태 값을 관리하고 변경 시 렌더링 UI에 영향을 주는 값 관리 (예: 버튼 클릭 시 카운트 증가)
    //useEffect ------- 컴포넌트의 생명주기 이벤트 처리   API 호출, 이벤트 리스너 등록/해제, 데이터 변경 감지
    //useRef ---------- DOM 요소 접근 or 렌더링 영향 없는 값 저장 특정 요소에 포커스, 이전 값 저장, 렌더링 횟수 확인
    
    
    //메이플 API 관련 호출 함수
    //1. 캐릭터 식별자(ocid)를 조회합니다.
    //2. 조회한 ocid를 사용해서, 캐릭터 추가 정보 조회
    //x-nxopen-api-key :: API KEY
    //character_name :: 캐릭터 이름 
    const [characterName, setCharacterName] = useState("");
    const [compareCharacterName, compareSetCharacterName] = useState("");
    const [characterData, setCharacterData] = useState(null);
    const [compareCharacterData, compareSetCharacterData] = useState(null);

    const [error, setError] = useState(null);
    const left = 'left';
    const right = 'right';
    
    const leftInfo = function (){
      fetchCharacterInfo(left);
    }
    
    const rightInfo = function (){
      fetchCharacterInfo(right);
    }
    
    //날짜 변환함수
    //2020-03-27T00:00+09:00 ==> 2020년 03월 27일
    function dataCustom(paramDate){
        let dateSet = paramDate;
        const date = new Date(dateSet);

        const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
        return formattedDate;
    }
    
    //캐릭터 정보 API에서 받아온 데이터 변환하는 함수
    function customSetting (returnData){
        let customData = returnData;
        
        //캐릭터 생성날짜 관련 데이터 변환
        customData.character_date_create = dataCustom(customData.character_date_create);
        
        return customData;
    }
    
    const fetchCharacterInfo = async (param) => {
        
        if (!param) return;
        
        let useCharName;
        
        if(param === left){
            if (!characterName) return;
            useCharName = characterName;
        }else{
            if (!compareCharacterName) return;
            useCharName = compareCharacterName;
        }

      //ocid 조회후, 조회한 ocid를 가지고 캐릭터 정보 조회함
      const ocidUrl = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(useCharName)}`;
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
    
            const returnData = await infoResponse.json();
            const infoData = customSetting(returnData);

            //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
            if(param === left){
                setCharacterData(infoData);
            }else if(param === right){
                compareSetCharacterData(infoData);
            }
            setError(null);
          } catch (err) {
            setError("캐릭터 정보를 불러오는 데 실패했습니다.");
            if(param === left){
                setCharacterData(null);
            }else if(param === right){
                compareSetCharacterData(null);
            }
          }
          
      } catch (err) {
        setError("캐릭터 정보를 불러오는 데 실패했습니다.");
        if(param === left){
             setCharacterData(null);
         }else if(param === right){
             compareSetCharacterData(null);
         }
      }
    };
    
    //엔터키 안눌려지게끔 처리
    const inputRef = useRef(null);

     useEffect(() => {
       const inputElement = inputRef.current;
       if (!inputElement) return; // 요소가 없으면 실행 안 함

       const handleKeyDown = (event) => {
         if (event.key === "Enter") {
           event.preventDefault();
           console.log("Enter 키 입력 방지");
         }
       };

       inputElement.addEventListener("keydown", handleKeyDown);

       return () => {
         inputElement.removeEventListener("keydown", handleKeyDown);
       };
     }, []);

    
  return (
    <div>
      {/* Left Section */}
      <div className="left-fiexd-div">
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group left-fiexd-input">
            <input
              type="text"
              id="charSearch"
              ref={inputRef}
              className="form-control bg-light border-0 small"
              placeholder="내 캐릭터 검색하기"
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
            <div className="input-group input-group-append">
              <button className="btn btn-primary" type="button" onClick={leftInfo}>
                <i className="fas fa-search fa-sm">확인</i>
              </button>
            </div>
          </div>
          <div className="input-group char-div left-fiexd-info">
              {error && <p style={{ color: "red" }}>{error}</p>}
              {characterData && (
                <div>
                  <h2>{characterData.character_name}</h2>
                  <img className="main-logo" src={characterData.character_image} alt="이미지" />
                  <p>월드: {characterData.world_name}</p>
                  <p>길드: {characterData.character_guild_name}</p>
                  <p>직업: {characterData.character_class}</p>
                  <p>레벨: {characterData.character_level}</p>
                  <p>경험치량: {characterData.character_exp_rate} %</p>
                  <p>캐릭터 생성일: {characterData.character_date_create}</p>
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
                id="charSearch"
                ref={inputRef}
                className="form-control bg-light border-0 small"
                placeholder="캐릭터 검색하기"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={compareCharacterName}
                onChange={(e) => compareSetCharacterName(e.target.value)}
              />
              <div className="input-group input-group-append">
                <button className="btn btn-primary" type="button" onClick={rightInfo}>
                  <i className="fas fa-search fa-sm">확인</i>
                </button>
              </div>
            </div>
            <div className="input-group char-div right-fiexd-info">
                {error && <p style={{ color: "red" }}>{error}</p>}
                {compareCharacterData && (
                  <div>
                    <h2>{compareCharacterData.character_name}</h2>
                    <img className="main-logo" src={compareCharacterData.character_image} alt="이미지" />
                    <p>월드: {compareCharacterData.world_name}</p>
                    <p>길드: {compareCharacterData.character_guild_name}</p>
                    <p>직업: {compareCharacterData.character_class}</p>
                    <p>레벨: {compareCharacterData.character_level}</p>
                    <p>경험치량: {compareCharacterData.character_exp_rate} %</p>
                    <p>캐릭터 생성일: {compareCharacterData.character_date_create}</p>
                  </div>
                )}
            </div>
          </form>
      </div>

      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
}

export default Home;
