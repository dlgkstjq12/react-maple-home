import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
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
    //항목들 정리
    const [firstCharacterName, setFirstCharacterName] = useState("");
    const [firstCharacterData, setFirstCharacterData] = useState(null);
    const [firstCharacterDetailData, setfirstCharacterDetailData] = useState(null);
    
    const [secondCharacterName, setSecondCharacterName] = useState("");
    const [secondCharacterData, setSecondCharacterData] = useState(null);
    const [secondCharacterDetailData, setSecondCharacterDetailData] = useState(null);

    const [thirdCharacterName, setThirdCharacterName] = useState("");
    const [thirdCharacterData, setThirdCharacterData] = useState(null);
    const [thirdCharacterDetailData, setThirdCharacterDetailData] = useState(null);

    const [fourthCharacterName, setFourthCharacterName] = useState("");
    const [fourthCharacterData, setFourthCharacterData] = useState(null);
    const [fourthCharacterDetailData, setFourthCharacterDetailData] = useState(null);

    const [error, setError] = useState(null);
    
    //차트보여주기위해 사용할 객체들
    const [showChart, setShowChart] = useState(false);
    const [firstChartData, setFirstChartData] = useState(null);
    const [secondChartData, setSecondChartData] = useState(null);
    const [thirdChartData, setThirdChartData] = useState(null);
    const [fourthChartData, setFourthChartData] = useState(null);
    
    const [thousChartOptions, setThousChartOptions] = useState(null);
    const [perChartOptions, setPerChartOptions] = useState(null);
    
    const [chartKey, setChartKey] = useState(0); // 차트 리렌더링을 위한 키
    
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
    const second = 'second';
    const third = 'third';
    const fourth = 'fourth';
    
    const firstInfo = function (){
      fetchCharacterInfo(first);
    }
    
    const secondInfo = function (){
      fetchCharacterInfo(second);
    }
    
    const thirdInfo = function (){
      fetchCharacterInfo(third);
    }
    
    const fourthInfo = function (){
      fetchCharacterInfo(fourth);
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
          case second:
            setSecondCharacterData(infoData)
            break;
          case third:
            setThirdCharacterData(infoData);
            break;
          case fourth:
            setFourthCharacterData(infoData);
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
          case second:
            setSecondCharacterDetailData(infoData)
            break;
          case third:
            setThirdCharacterDetailData(infoData);
            break;
          case fourth:
            setFourthCharacterDetailData(infoData);
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
        if(secondCharacterName != null){
            labelArray.push(secondCharacterName);
            firstDataArray.push(removeCommasAndParseNumber(secondCharacterDetailData[CP].stat_value));
            secondDataArray.push(formatNumberString(secondCharacterDetailData[BOSS_DMG].stat_value));
            thirdDataArray.push(formatNumberString(secondCharacterDetailData[PIERCE_DMG].stat_value));
            fourthDataArray.push(formatNumberString(secondCharacterDetailData[FINAL_DMG].stat_value));
            totalDataMap.push({name : secondCharacterName, cp : firstDataArray[1], boss_dmg : secondDataArray[1], pierce_dmg : thirdDataArray[1], final_dmg : fourthDataArray[1]});
        }
        if(thirdCharacterName != null){
            labelArray.push(thirdCharacterName);
            firstDataArray.push(removeCommasAndParseNumber(thirdCharacterDetailData[CP].stat_value));
            secondDataArray.push(formatNumberString(thirdCharacterDetailData[BOSS_DMG].stat_value));
            thirdDataArray.push(formatNumberString(thirdCharacterDetailData[PIERCE_DMG].stat_value));
            fourthDataArray.push(formatNumberString(thirdCharacterDetailData[FINAL_DMG].stat_value));
            totalDataMap.push({name : thirdCharacterName, cp : firstDataArray[2], boss_dmg : secondDataArray[2], pierce_dmg : thirdDataArray[2], final_dmg : fourthDataArray[2]});
        }
        if(fourthCharacterName != null){
            labelArray.push(fourthCharacterName);
            firstDataArray.push(removeCommasAndParseNumber(fourthCharacterDetailData[CP].stat_value));
            secondDataArray.push(formatNumberString(fourthCharacterDetailData[BOSS_DMG].stat_value));
            thirdDataArray.push(formatNumberString(fourthCharacterDetailData[PIERCE_DMG].stat_value));
            fourthDataArray.push(formatNumberString(fourthCharacterDetailData[FINAL_DMG].stat_value));
            totalDataMap.push({name : fourthCharacterName, cp : firstDataArray[3], boss_dmg : secondDataArray[3], pierce_dmg : thirdDataArray[3], final_dmg : fourthDataArray[3]});
        }

        //전투력
        function firstChartDataSet() {
            const newData1 = {
                labels: labelArray,
                datasets: [
                    {
                        label: "전투력",
                        data: firstDataArray, 
                        backgroundColor: "RGB(137, 207, 240)",
                    },
                ],
            };
            setFirstChartData(newData1);
        }
        
        //보스 공격력 데미지
        function secondChartDataSet() {
            const newData2 = {
                labels: labelArray,
                datasets: [
                    {
                        label: "보스 공격력 데미지 (%)",
                        data: secondDataArray, 
                        backgroundColor: "RGB(255, 161, 161)",
                    },
                ],
            };
            setSecondChartData(newData2);
        }
        
        //방어력 무시
        function thirdChartDataSet() {
            const newData3 = {
                labels: labelArray,
                datasets: [
                    {
                        label: "방어력 무시 (%)",
                        data: thirdDataArray, 
                        backgroundColor: "RGB(185, 225, 134)",
                    },
                ],
            };
            setThirdChartData(newData3);
        }
        
        //최종데미지
        function fourthChartDataSet() {
            const newData4 = {
                labels: labelArray,
                datasets: [
                    {
                        label: "최종데미지 (%)",
                        data: fourthDataArray,
                        backgroundColor: "RGB(200, 180, 255)",
                    },
                ],
            };
            setFourthChartData(newData4);
        }
        
        //천단위 표시 옵션
        const newThousOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: { font: { size: 25 } }, // 범례 글씨 크기
                },
                title: { display: true, text: "캐릭터별 비교", font: { size: 35 } },
                tooltip: {
                  titleFont: {
                    size: 25  // 제목 글씨 크기
                  },
                  bodyFont: {
                    size: 20  // 본문 글씨 크기
                  },
                  footerFont: {
                    size: 17  // 푸터 글씨 크기 (있을 경우)
                  }
                },
            },
            scales: {
                x: { ticks: { font: { size: 18 } } },
                y: { ticks: { font: { size: 18 } } },
            },
        };
        
        //퍼센트 표시 옵션
        const newPerOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: { font: { size: 25 } }, // 범례 글씨 크기
                },
                title: { display: true, text: "캐릭터별 비교 (%)", font: { size: 35 } },
                tooltip: {
                  titleFont: {
                    size: 25  // 제목 글씨 크기
                  },
                  bodyFont: {
                    size: 20  // 본문 글씨 크기
                  },
                  footerFont: {
                    size: 17  // 푸터 글씨 크기 (있을 경우)
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
                x: { ticks: { font: { size: 18 } } },
                y: { ticks: { font: { size: 18 } } },
            },
        };

        firstChartDataSet();
        secondChartDataSet();
        thirdChartDataSet();
        fourthChartDataSet();
        
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
            break;
          case second:
            if (!secondCharacterName) return;
            useCharName = secondCharacterName;
            break;
          case third:
            if (!thirdCharacterName) return;
            useCharName = thirdCharacterName;
            break;
          case fourth:
            if (!fourthCharacterName) return;
            useCharName = fourthCharacterName;
            break;
          default:
            alert("검색 실패");
        }

      //1. ocid 조회후, 조회한 ocid를 가지고 캐릭터 기본 정보 조회함
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
    
            const returnCharData = await infoResponse.json();
            const detailInfoData = customSetting(returnCharData);
            
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

      //2. ocid 조회후, 조회한 ocid를 가지고 캐릭터 상세정보 정보 조회함
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
        <div className="content">
          <img className="logo-div" src="images/vsLogo.jpg" onClick={handleLogoClick} alt="이미지" />
          <h1 className="name-custom-font">Maple Fighter</h1>
          <img className="logo-div" src="images/MapleFighter.jpg" alt="이미지" />
        </div>
        <div className="text-container">
            <div className="text-box">
                <h1 className="name-custom-font">사용방법</h1>
                <p> 1. 각 캐릭터별 정보를 가져오기위해서, 입력창에 캐릭터명 입력후 "확인" 버튼 클릭</p>
                <p> 2. 통계를 확인할 캐릭터의 정보를 가져온 후에, "VS" 로고 클릭</p>
            </div>
        </div>
        <div className="info-container">
            <div className="info-box">
                {/* First Section */}
                <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-60 navbar-search">
                  <div className="input-group fiexd-input">
                    <input
                      type="text"
                      id="charSearch"
                      ref={inputRef}
                      className="form-control bg-light border-0 small"
                      placeholder="1번 캐릭터 검색하기"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      value={firstCharacterName}
                      onChange={(e) => setFirstCharacterName(e.target.value)}
                    />
                    <div className="input-group input-group-append">
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
            <div className="info-box">
              {/* Second Section */}
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-60 navbar-search">
                <div className="input-group fiexd-input">
                  <input
                    type="text"
                    id="charSearch"
                    ref={inputRef}
                    className="form-control bg-light border-0 small"
                    placeholder="2번 캐릭터 검색하기"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    value={secondCharacterName}
                    onChange={(e) => setSecondCharacterName(e.target.value)}
                  />
                  <div className="input-group input-group-append">
                    <button className="btn btn-primary" type="button" onClick={secondInfo}>
                      <i className="fas fa-search fa-sm">확인</i>
                    </button>
                  </div>
                </div>
                <div className="input-group char-div fiexd-info">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {secondCharacterData && (
                      <div className="divide-info">
                        <div className="left-char-info">
                            <img className="char-logo" src={secondCharacterData.character_image} alt="이미지" />
                        </div>
                        <div className="right-char-info">
                            <h1>{secondCharacterData.character_name}</h1>
                            <p>월드: {secondCharacterData.world_name}</p>
                            <p>길드: {secondCharacterData.character_guild_name}</p>
                            <p>직업: {secondCharacterData.character_class}</p>
                            <p>레벨: {secondCharacterData.character_level}</p>
                            <p>경험치량: {secondCharacterData.character_exp_rate} %</p>
                            <p>생성일: {secondCharacterData.character_date_create}</p>
                        </div>
                      </div>
                    )}
                    <div className="divide-info">
                        <div className="left-char-info">
                            {Array.isArray(secondCharacterDetailData) && secondCharacterDetailData.length > 0 ? (
                              secondCharacterDetailData
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
                            {Array.isArray(secondCharacterDetailData) && secondCharacterDetailData.length > 0 ? (
                              secondCharacterDetailData
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
          <div className="info-box">
              {/* Third Section */}
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-60 navbar-search">
                <div className="input-group fiexd-input">
                  <input
                    type="text"
                    id="charSearch"
                    ref={inputRef}
                    className="form-control bg-light border-0 small"
                    placeholder="3번 캐릭터 검색하기"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    value={thirdCharacterName}
                    onChange={(e) => setThirdCharacterName(e.target.value)}
                  />
                  <div className="input-group input-group-append">
                    <button className="btn btn-primary" type="button" onClick={thirdInfo}>
                      <i className="fas fa-search fa-sm">확인</i>
                    </button>
                  </div>
                </div>
                <div className="input-group char-div fiexd-info">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {thirdCharacterData && (
                      <div className="divide-info">
                        <div className="left-char-info">
                            <img className="char-logo" src={thirdCharacterData.character_image} alt="이미지" />
                        </div>
                        <div className="right-char-info">
                            <h1>{thirdCharacterData.character_name}</h1>
                            <p>월드: {thirdCharacterData.world_name}</p>
                            <p>길드: {thirdCharacterData.character_guild_name}</p>
                            <p>직업: {thirdCharacterData.character_class}</p>
                            <p>레벨: {thirdCharacterData.character_level}</p>
                            <p>경험치량: {thirdCharacterData.character_exp_rate} %</p>
                            <p>생성일: {thirdCharacterData.character_date_create}</p>
                        </div>
                      </div>
                    )}
                    <div className="divide-info">
                        <div className="left-char-info">
                            {Array.isArray(thirdCharacterDetailData) && thirdCharacterDetailData.length > 0 ? (
                              thirdCharacterDetailData
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
                            {Array.isArray(thirdCharacterDetailData) && thirdCharacterDetailData.length > 0 ? (
                              thirdCharacterDetailData
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
          <div className="info-box">
              {/* Fourth Section */}
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-60 navbar-search">
                <div className="input-group fiexd-input">
                  <input
                    type="text"
                    id="charSearch"
                    ref={inputRef}
                    className="form-control bg-light border-0 small"
                    placeholder="4번 캐릭터 검색하기"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    value={fourthCharacterName}
                    onChange={(e) => setFourthCharacterName(e.target.value)}
                  />
                  <div className="input-group input-group-append">
                    <button className="btn btn-primary" type="button" onClick={fourthInfo}>
                      <i className="fas fa-search fa-sm">확인</i>
                    </button>
                  </div>
                </div>
                <div className="input-group char-div fiexd-info">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {fourthCharacterData && (
                      <div className="divide-info">
                        <div className="left-char-info">
                            <img className="char-logo" src={fourthCharacterData.character_image} alt="이미지" />
                        </div>
                        <div className="right-char-info">
                            <h1>{fourthCharacterData.character_name}</h1>
                            <p>월드: {fourthCharacterData.world_name}</p>
                            <p>길드: {fourthCharacterData.character_guild_name}</p>
                            <p>직업: {fourthCharacterData.character_class}</p>
                            <p>레벨: {fourthCharacterData.character_level}</p>
                            <p>경험치량: {fourthCharacterData.character_exp_rate} %</p>
                            <p>생성일: {fourthCharacterData.character_date_create}</p>
                        </div>
                      </div>
                    )}
                    <div className="divide-info">
                        <div className="left-char-info">
                            {Array.isArray(fourthCharacterDetailData) && fourthCharacterDetailData.length > 0 ? (
                              fourthCharacterDetailData
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
                            {Array.isArray(fourthCharacterDetailData) && fourthCharacterDetailData.length > 0 ? (
                              fourthCharacterDetailData
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
        {showChart && firstChartData && thousChartOptions && (
            <div  className="chart-total">
                <div className="chart-div">
                    <Bar key={chartKey} data={firstChartData} options={thousChartOptions} />
                </div>
                <div className="chart-rank" id="cp">
                    {firstChartData.labels
                      .map((label, i) => ({ label, value: firstChartData.datasets[0].data[i] }))
                      .sort((a, b) => b.value - a.value)
                      .map(({ label, value }, i) => {
                        if (i === 0) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-extrabold">{i + 1}위 👑 {label}</span>
                              <span className="font-extrabold">({value.toLocaleString()})</span>
                            </div>
                          );
                        } else if (i === 1) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-bold">{i + 1}위 🥈 {label}</span>
                              <span className="font-bold">({value.toLocaleString()})</span>
                            </div>
                          ); 
                        } else {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between">
                              <span>{i + 1}위 {label}</span>
                              <span className="font-bold text-black-600">({value.toLocaleString()})</span>
                            </div>
                          );
                        }
                      })}
                </div>
            </div>
        )}
        {showChart && secondChartData && perChartOptions && (
            <div  className="chart-total">
                <div className="chart-div">
                    <Bar key={chartKey} data={secondChartData} options={perChartOptions} />
                </div>
                <div className="chart-rank" id="bossDmg">
                    {secondChartData.labels
                      .map((label, i) => ({ label, value: secondChartData.datasets[0].data[i] }))
                      .sort((a, b) => b.value - a.value)
                      .map(({ label, value }, i) => {
                        if (i === 0) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-extrabold">{i + 1}위 👑 {label}</span>
                              <span className="font-extrabold">({value.toLocaleString()})</span>
                            </div>
                          );
                        } else if (i === 1) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-bold">{i + 1}위 🥈 {label}</span>
                              <span className="font-bold">({value.toLocaleString()})</span>
                            </div>
                          ); 
                        } else {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between">
                              <span>{i + 1}위 {label}</span>
                              <span className="font-bold text-black-600">({value.toLocaleString()})</span>
                            </div>
                          );
                        }
                      })}
                </div>
            </div>
        )}
        {showChart && thirdChartData && perChartOptions && (
            <div  className="chart-total">
                <div className="chart-div">
                    <Bar key={chartKey} data={thirdChartData} options={perChartOptions} />
                </div>
                <div className="chart-rank" id="pierceDmg">
                    {thirdChartData.labels
                      .map((label, i) => ({ label, value: thirdChartData.datasets[0].data[i] }))
                      .sort((a, b) => b.value - a.value)
                      .map(({ label, value }, i) => {
                        if (i === 0) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-extrabold">{i + 1}위 👑 {label}</span>
                              <span className="font-extrabold">({value.toLocaleString()})</span>
                            </div>
                          );
                        } else if (i === 1) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-bold">{i + 1}위 🥈 {label}</span>
                              <span className="font-bold">({value.toLocaleString()})</span>
                            </div>
                          ); 
                        } else {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between">
                              <span>{i + 1}위 {label}</span>
                              <span className="font-bold text-black-600">({value.toLocaleString()})</span>
                            </div>
                          );
                        }
                      })}
                </div>
            </div>
        )}
        {showChart && fourthChartData && perChartOptions && (
            <div  className="chart-total">
                <div className="chart-div">
                    <Bar key={chartKey} data={fourthChartData} options={perChartOptions} />
                </div>
                <div className="chart-rank" id="finalDmg">
                    {fourthChartData.labels
                      .map((label, i) => ({ label, value: fourthChartData.datasets[0].data[i] }))
                      .sort((a, b) => b.value - a.value)
                      .map(({ label, value }, i) => {
                        if (i === 0) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-extrabold">{i + 1}위 👑 {label}</span>
                              <span className="font-extrabold">({value.toLocaleString()})</span>
                            </div>
                          );
                        } else if (i === 1) {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                              <span className="font-bold">{i + 1}위 🥈 {label}</span>
                              <span className="font-bold">({value.toLocaleString()})</span>
                            </div>
                          ); 
                        } else {
                          return (
                            <div key={i} className="bg-blue-100 rounded-xl p-4 shadow-md flex justify-between">
                              <span>{i + 1}위 {label}</span>
                              <span className="font-bold text-black-600">({value.toLocaleString()})</span>
                            </div>
                          );
                        }
                      })}
                </div>
            </div>
        )}
      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
}

export default Home;