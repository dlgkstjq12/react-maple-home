import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
import { Helmet } from 'react-helmet';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

// 🔹 필수 스케일과 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CharPotialComp () {
    
    const API_KEY = process.env.REACT_APP_API_KEY;
    //Hook ------------ 역할  언제 사용?
    //useState -------- 상태 값을 관리하고 변경 시 렌더링 UI에 영향을 주는 값 관리 (예: 버튼 클릭 시 카운트 증가)
    //useEffect ------- 컴포넌트의 생명주기 이벤트 처리   API 호출, 이벤트 리스너 등록/해제, 데이터 변경 감지
    //useRef ---------- DOM 요소 접근 or 렌더링 영향 없는 값 저장 특정 요소에 포커스, 이전 값 저장, 렌더링 횟수 확인
    
    
    //메이플 API 관련 호출 함수
    //1. 캐릭터 식별자(ocid)를 조회합니다.
    //2. 조회한 ocid를 사용해서, 캐릭터 추가 정보 조회
    //x-nxopen-api-key :: API KEY
    //character_name :: 캐릭터 이름 
    //항목들 정리
    const [firstCharacterName, setFirstCharacterName] = useState("");
    const [firstCharacterData, setFirstCharacterData] = useState(null);
    const [firstCharacterDetailData, setfirstCharacterDetailData] = useState(null);
    
    const [error, setError] = useState(null);
    
    //차트보여주기위해 사용할 객체들
    const [showChart, setShowChart] = useState(false);
    const [firstChartData, setFirstChartData] = useState(null);

    const [thousChartOptions, setThousChartOptions] = useState(null);
    const [perChartOptions, setPerChartOptions] = useState(null);
    
    const [chartKey, setChartKey] = useState(0); // 차트 리렌더링을 위한 키
    
    //자주검색하는 검색어 셋팅
    const [input, setInput] = useState(null);
    
    
    //화면에 출력할 캐릭터 정보들
    //type :: p (퍼센트) / s (초) / c (콤마)
    const useStatArray = [
        [
            {
                "type":"c",
                "left_stat_name": "최소스탯공격력"
            },
            {
                "type":"c",
                "left_stat_name": "전투력"
            },
            {
                "type":"p",
                "left_stat_name": "데미지"
            },
            {
                "type":"p",
                "left_stat_name": "보스 몬스터 데미지"
            },
            {
                "type":"p",
                "left_stat_name": "최종 데미지"
            },
            {
                "type":"p",
                "left_stat_name": "방어율 무시"
            },
            {
                "type":"p",
                "right_stat_name": "크리티컬 데미지"
            },
            {
                "type":"s",
                "right_stat_name": "버프 지속시간"
            },
            {
                "type":"p",
                "right_stat_name": "아이템 드롭률"
            },
            {
                "type":"p",
                "right_stat_name": "메소 획득량"
            }
        ]
    ];
    
    //api에서 가져오는 데이터중 핵심데이터 순번
    const CP = 42;          //전투력
    const BOSS_DMG = 3;     //보스공격력데미지
    const PIERCE_DMG = 5;   //방어력무시데미지
    const FINAL_DMG = 4;    //최종데미지

    //캐릭터별 구분 상수
    const first = 'first';
    
    const firstInfo = function (){
      fetchCharacterInfo(first);
    }
    
    
    function saveSearchTerm(term){
        const limit = 3;
        const data = JSON.parse(localStorage.getItem('searchTerms') || '[]');
        const freq = {};
        if(term != null && term !== ''){
            data.push(term);
        }
        
        localStorage.setItem('searchTerms',JSON.stringify(data));
                
        data.forEach(term => {
          freq[term] = (freq[term] || 0) + 1;
        });
        
        //상위 3개만 추출
        const showArray = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([term]) => term);
            
        setInput(showArray);
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
        customData.character_date_create = dataCustom(customData.character_date_create);            //캐릭터 생성날짜 관련 데이터 변환
        return customData;
    }
    
    //콤마찍는 공통함수
    function formatNumberString(str) {
        const num = Number(str.replace(/[^0-9.-]/g, '')); // 숫자만 추출
        if (isNaN(num)) return str; // 변환할 수 없는 경우 원래 문자열 반환
        return num.toLocaleString();
    }
    
    //캐릭터 상세정보 API에서 받아온 데이터 변환하는 함수
    function customDetailSetting (returnData){
        let customData = returnData.final_stat;
        for(var i = 0; i < customData.length; i++){
            if (Array.isArray(useStatArray[0]) && 
                useStatArray[0].some(innerItem => innerItem.left_stat_name == customData[i].stat_name)) {
                switch (useStatArray[0].find(statItem => statItem.left_stat_name === customData[i].stat_name).type) {
                  case "c":
                    customData[i].stat_value = formatNumberString(customData[i].stat_value);
                    break;
                  case "p":
                    customData[i].stat_value = customData[i].stat_value+"%";
                    break;
                  case "s":
                    customData[i].stat_value = customData[i].stat_value+"초";
                    break;
                  default:
                    alert("캐릭터 정보 셋팅 실패");
                }
            }
            if (Array.isArray(useStatArray[0]) && 
                useStatArray[0].some(innerItem => innerItem.right_stat_name == customData[i].stat_name)) {
                switch (useStatArray[0].find(statItem => statItem.right_stat_name === customData[i].stat_name).type) {
                    case "c":
                      customData[i].stat_value = formatNumberString(customData[i].stat_value);
                      break;
                    case "p":
                      customData[i].stat_value = customData[i].stat_value+"%";
                      break;
                    case "s":
                      customData[i].stat_value = customData[i].stat_value+"초";
                      break;
                  default:
                    alert("캐릭터 정보 셋팅 실패");
                }
            }
        }
        
        return customData;
    }
    
    //캐릭터 정보 셋팅해주는 함수
    function setCharacterInfo(delimiter, infoData) {
        switch (delimiter) {
          case first:
            setFirstCharacterData(infoData);
            break;
          default:
            alert("캐릭터 정보 셋팅 실패");
        }
    }
    
    //캐릭터 상세 정보 셋팅해주는 함수
    function setCharacterDetailInfo(delimiter, infoData) {
        switch (delimiter) {
          case first:
            setfirstCharacterDetailData(infoData);
            break;
          default:
            alert("캐릭터 상세 정보 셋팅 실패");
        }
    }
    
    //콤마붙은 문자형 숫자데이터를 숫자로 변경하는 함수
    //'42,333,222' => 42333222 
    function removeCommasAndParseNumber(str) {
      if (typeof str !== 'string') return NaN;
      const cleaned = str.replace(/,/g, '');
      const number = Number(cleaned);
      return isNaN(number) ? NaN : number;
    }
    
    // 이미지를 클릭하면 차트를 표시하는 함수
    const handleLogoClick = () => {
        
        let labelArray = [];
        let firstDataArray = [];    //전투력
        let secondDataArray = [];   //보공
        let thirdDataArray = [];    //방무
        let fourthDataArray = [];   //최종데미지
        
        //모든 데이터 넣을 배열
        let totalDataMap = [];

        //캐릭터별로 전투력, 보공, 방무, 최종데미지 셋팅
        if(firstCharacterName != null){
            labelArray.push(firstCharacterName);
            firstDataArray.push(removeCommasAndParseNumber(firstCharacterDetailData[CP].stat_value));
            secondDataArray.push(formatNumberString(firstCharacterDetailData[BOSS_DMG].stat_value));
            thirdDataArray.push(formatNumberString(firstCharacterDetailData[PIERCE_DMG].stat_value));
            fourthDataArray.push(formatNumberString(firstCharacterDetailData[FINAL_DMG].stat_value));
            totalDataMap.push({name : firstCharacterName, cp : firstDataArray[0], boss_dmg : secondDataArray[0], pierce_dmg : thirdDataArray[0], final_dmg : fourthDataArray[0]});
        }
        
        //해상도에 따라서 비율 고정, 변화 셋팅
        const viewportWidth = window.innerWidth;
        const smallSize = 480;// 모바일 해상도 기준
        const ratioSetting = (viewportWidth > smallSize) ? true : false;
        const sizeSetting = (viewportWidth > smallSize) ? 25 : 12;

        //천단위 표시 옵션
        const newThousOptions = {
            maintainAspectRatio: ratioSetting, // ❗비율 고정 끄기
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: { font: { size: sizeSetting } }, // 범례 글씨 크기
                },
                title: { display: true, text: "캐릭터별 비교", font: { size: sizeSetting } },
                tooltip: {
                  titleFont: {
                    size: sizeSetting  // 제목 글씨 크기
                  },
                  bodyFont: {
                    size: sizeSetting  // 본문 글씨 크기
                  },
                  footerFont: {
                    size: sizeSetting  // 푸터 글씨 크기 (있을 경우)
                  }
                },
            },
            scales: {
                x: { ticks: { font: { size: sizeSetting } } },
                y: { ticks: { font: { size: sizeSetting } } },
            },
        };
        
        //퍼센트 표시 옵션
        const newPerOptions = {
            maintainAspectRatio: ratioSetting, // ❗비율 고정 끄기
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: { font: { size: sizeSetting } }, // 범례 글씨 크기
                },
                title: { display: true, text: "캐릭터별 비교 (%)", font: { size: sizeSetting } },
                tooltip: {
                  titleFont: {
                    size: sizeSetting  // 제목 글씨 크기
                  },
                  bodyFont: {
                    size: sizeSetting  // 본문 글씨 크기
                  },
                  footerFont: {
                    size: sizeSetting  // 푸터 글씨 크기 (있을 경우)
                  },
                  callbacks: {
                    label: function(context) {
                      const value = typeof context.parsed === 'number'
                        ? context.parsed
                        : context.parsed.y || context.parsed.value || 0;
                      return value + '%';
                    }
                  }
                },
            },
            scales: {
                x: { ticks: { font: { size: sizeSetting } } },
                y: { ticks: { font: { size: sizeSetting } } },
            },
        };
        
        setThousChartOptions(newThousOptions);
        setPerChartOptions(newPerOptions);
        
        setShowChart(true);
        setChartKey(prevKey => prevKey + 1); // 차트 리렌더링을 위해 키 변경
    };


    const fetchCharacterInfo = async (param) => {
        if (!param) return;
        
        let useCharName;
        
        switch (param) {
          case first:
            if (!firstCharacterName) return;
            useCharName = firstCharacterName;
            saveSearchTerm(useCharName);
            break;
          default:
            alert("검색 실패");
        }
        
        debugger;
        
      //url뒤에 넣을 파라미터셋팅할 변수
      let params = {
        character_name : useCharName
      };
      
      //URLSearchParams를 사용해서 객체를 query string으로 변환
      let queryString = new URLSearchParams(params).toString();

      //1. ocid 조회후, 조회한 ocid를 가지고, 캐릭터별 잠재능력 재설정 정보 조회
      const ocidUrl = `https://open.api.nexon.com/maplestory/v1/id?${queryString}`;
      try {
        const response = await fetch(ocidUrl, {
          method: "GET",
          headers: { "x-nxopen-api-key": API_KEY },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패! 상태 코드: ${response.status}`);
        }

        const data = await response.json();

        //url뒤에 넣을 파라미터셋팅할 변수
        let params = {
          count : 10,
          date : "2023-12-21"
        };

        //URLSearchParams를 사용해서 객체를 query string으로 변환
        let queryString = new URLSearchParams(params).toString();

        
        const cubeInfoUrl = `https://open.api.nexon.com/maplestory/v1/history/cube?${queryString}`;
        
          //ocid 조회 성공후, 조회한 ocid로 캐릭터별 큐브 사용 결과 조회
          try {
            const infoResponse = await fetch(cubeInfoUrl, {
              method: "GET",
              headers: { "x-nxopen-api-key": API_KEY }
            });
            
            if (!infoResponse.ok) {
              throw new Error(`API 요청 실패! 상태 코드: ${infoResponse.status}`);
            }
    
            const returnCubeData = await infoResponse.json();
            
            //큐브데이터 출력
            console.log("returnCubeData====>",returnCubeData);
            
            
            const detailInfoData = customSetting(returnCubeData);
            
            //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
            setCharacterInfo(param, detailInfoData);
            setError(null);
          } catch (err) {
            setError("캐릭터 정보를 불러오는 데 실패했습니다.");
            setCharacterInfo(param, null);
          }
          
      } catch (err) {
        setError("캐릭터 정보를 불러오는 데 실패했습니다.");
        setCharacterInfo(param, null);
      }

      //2. ocid 조회후, 조회한 ocid를 가지고 잠재능력 재설정 이용결과 조회
      const detailUrl = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(useCharName)}`;
      try {
        const response = await fetch(detailUrl, {
          method: "GET",
          headers: { "x-nxopen-api-key": API_KEY },
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패! 상태 코드: ${response.status}`);
        }
        
        const data = await response.json();
        const charDetailInfoUrl = `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=`+data.ocid;
          
          //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
          try {
            const infoResponse = await fetch(charDetailInfoUrl, {
              method: "GET",
              headers: { "x-nxopen-api-key": API_KEY },
            });

            if (!infoResponse.ok) {
              throw new Error(`API 요청 실패! 상태 코드: ${infoResponse.status}`);
            }
            const returnData = await infoResponse.json();
            const detailInfoData = customDetailSetting(returnData);

            //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
            setCharacterDetailInfo(param, detailInfoData);
            setError(null);
          } catch (err) {
            setError("캐릭터 정보를 불러오는 데 실패했습니다.");
            setCharacterDetailInfo(param, null);
          }
          
      } catch (err) {
        setError("캐릭터 정보를 불러오는 데 실패했습니다.");
        setCharacterDetailInfo(param, null);
      }
    };
    
    //엔터키 안눌려지게끔 처리
    const inputRef = useRef(null);

     useEffect(() => {
       saveSearchTerm(null);        //처음 로딩될때 그동안 검색했던 검색어 표시
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
        <Helmet>
          <title>메이플-파이터</title>
          <meta name="description" content="캐릭터들간의 데이터들을 서로 비교해볼 수 있는 사이트" />
          <meta property="og:title" content="메이플-파이터" />
        </Helmet>
        <div className="content">
          <img className="logo-div" src="images/vsLogo.jpg" onClick={handleLogoClick} alt="이미지" />
          <h1 className="name-custom-font">Maple Fighter</h1>
          <img className="logo-div" src="images/MapleFighter.jpg" alt="이미지" />
        </div>
        <div className="total-container">
            <div className="half-text-container">
                <div className="half-text-box">
                    <h1 className="name-small-font">(1-Step) 개발자 API KEY 발급방법</h1>
                    <p>1. 넥슨 Open API 사이트 접속 및 로그인</p>
                    <p>2. NEXON Open API 공식 사이트에 접속합니다.</p>
                    <p>3. 넥슨 계정으로 로그인합니다.</p>
                    <p>4. 애플리케이션 등록</p>
                    <p>5. 로그인 후, 상단 메뉴에서 **"마이 페이지"**로 이동합니다.</p>
                    <p>6. "애플리케이션 등록" 버튼을 클릭하여 새 애플리케이션을 등록합니다.</p>
                    <p>7. 애플리케이션 이름, 설명, 콜백 URL 등 필요한 정보를 입력합니다.</p>
                    <p>8. API 키 발급 확인</p>
                    <p>9. 애플리케이션 등록이 완료되면, 해당 애플리케이션의 상세 페이지에서 발급된 API 키를 확인할 수 있습니다.</p>
                    <p>10. 이 API 키는 요청 헤더에 포함하여 API를 호출할 때 사용됩니다</p>
                    <a href="https://openapi.nexon.com/ko/guide/prepare-in-advance/"> 참고 : https://openapi.nexon.com/ko/guide/prepare-in-advance/</a>
                </div>
            </div>
            <div className="half-info-container">
                <div className="half-info-box">
                    {/* First Section */}
                    <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-60 navbar-search">
                      <div className="input-group fiexd-input">
                        <input
                          type="text"
                          id="charSearch"
                          ref={inputRef}
                          className="form-control bg-light border-0 small"
                          placeholder="개발자 API-KEY 입력하기"
                          aria-label="Search"
                          aria-describedby="basic-addon2"
                          value={firstCharacterName}
                          onChange={(e) => setFirstCharacterName(e.target.value)}
                        />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button" onClick={firstInfo}>
                            <i className="fas fa-search fa-sm">확인</i>
                          </button>
                        </div>
                      </div>
                      <div className="input-group char-div fiexd-info" value={firstCharacterData}>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          {firstCharacterData && (
                            <div className="divide-info">
                              <div className="left-img-info">
                                  <img className="char-logo" src={firstCharacterData.character_image} alt="이미지" />
                              </div>
                              <div className="right-char-info">
                                  <h1>{firstCharacterData.character_name}</h1>
                                  <p>월드: {firstCharacterData.world_name}</p>
                                  <p>길드: {firstCharacterData.character_guild_name}</p>
                                  <p>직업: {firstCharacterData.character_class}</p>
                                  <p>레벨: {firstCharacterData.character_level}</p>
                                  <p>경험치량: {firstCharacterData.character_exp_rate} %</p>
                                  <p>생성일: {firstCharacterData.character_date_create}</p>
                              </div>
                            </div>
                          )}
                          <div className="divide-info" value={firstCharacterDetailData}>
                            <div className="left-char-info">
                                {Array.isArray(firstCharacterDetailData) && firstCharacterDetailData.length > 0 ? (
                                  firstCharacterDetailData
                                    .filter((item) => useStatArray.some(innerArray => innerArray.some(innerItem => innerItem.left_stat_name === item.stat_name))) // 특정 stat_name만 필터링
                                    .map((item, index) => (
                                      <p key={index} className="item">
                                        {item.stat_name} : {item.stat_value}
                                      </p>
                                    ))
                                ) : (
                                  <p></p>
                                )}
                            </div>
                            <div className="right-char-info">
                                {Array.isArray(firstCharacterDetailData) && firstCharacterDetailData.length > 0 ? (
                                  firstCharacterDetailData
                                    .filter((item) => useStatArray.some(innerArray => innerArray.some(innerItem => innerItem.right_stat_name === item.stat_name))) // 특정 stat_name만 필터링
                                    .map((item, index) => (
                                      <p key={index} className="item">
                                        {item.stat_name} : {item.stat_value}
                                      </p>
                                    ))
                                ) : (
                                  <p></p>
                                )}
                            </div>
                        </div>
                      </div>
                    </form>
                </div>
            </div>
        
        </div>
        
        
        <div className="half-text-container">
            <div className="half-text-box">
                <h1 className="name-small-font">(2-Step) 사용방법 및 주의사항</h1>
                <p>1. 발급받은 개발자 API-KEY 입력후 "확인" 버튼 클릭</p>
                <p>2. 해당 넥슨 ID가 가지고 있는 메이플 캐릭터들의 잠재능력 & 큐브 사용정보를 볼 수 있습니다.</p>
                <a href="https://openapi.nexon.com/ko/guide/prepare-in-advance/"> 참고 : https://openapi.nexon.com/ko/guide/prepare-in-advance/</a>
            </div>
        </div>



        <img className="logo-scollor-div" src="images/vsLogo.jpg" onClick={handleLogoClick} alt="이미지" />

      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
}

export default CharPotialComp;