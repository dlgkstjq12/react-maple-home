import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
import { Helmet } from 'react-helmet';
import Calendar from 'react-calendar'; //npm install react-calendar
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일 적용
import { FaCalendarAlt } from 'react-icons/fa'; //npm install react-icons


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
    //항목들 정리
    const [firstApiKey, setFirstApiKey] = useState("");
    const [firstCubeCount, setFirstCubeCount] = useState(10);
    const [firstCubeDate, setFirstCubeDate] = useState("");
    const [firstCubeDateShow, setFirstCubeDateShow] = useState(false);
    
    const [secondCubeDate, setSecondCubeDate] = useState("");
    const [secondCubeDateShow, setSecondCubeDateShow] = useState(false);

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
    
    const onChange = (d) => {
      const localDate = d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '-').replace('.', '');
      setFirstCubeDate(localDate); 
      setFirstCubeDateShow(false);
    };

    //날짜 변환함수
    //2020-03-27T00:00+09:00 ==> 2020년 03월 27일
    function dataCustom(paramDate){
        let dateSet = paramDate;
        const date = new Date(dateSet);
        const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
        return formattedDate;
    }
    
    
    //콤마찍는 공통함수
    function formatNumberString(str) {
        const num = Number(str.replace(/[^0-9.-]/g, '')); // 숫자만 추출
        if (isNaN(num)) return str; // 변환할 수 없는 경우 원래 문자열 반환
        return num.toLocaleString();
    }
    
    const fetchCharacterInfo = async (param) => {
        if (!param) return;
        
        let useFirstApiKey;
        
        switch (param) {
          case first:
            if (!firstApiKey) return;
            useFirstApiKey = firstApiKey;
            break;
          default:
            alert("검색 실패");
        }
        
        debugger;
        
        //url뒤에 넣을 파라미터셋팅할 변수
        let params = {};
        if(firstCubeCount != null && firstCubeCount != ""){
            params.count = Number(firstCubeCount);
        }
        if(firstCubeDate != null && firstCubeDate != ""){
            params.date = firstCubeDate;
        }
        //if(firstCubeDate != null && firstCubeDate != ""){
            //params.cursor = "1";
       // }

        console.log("useFirstApiKey====>",useFirstApiKey);
        console.log("params====>",params);

        //URLSearchParams를 사용해서 객체를 query string으로 변환
        let queryString = new URLSearchParams(params).toString();

        debugger;
        
        const cubeInfoUrl = `https://open.api.nexon.com/maplestory/v1/history/cube?${queryString}`;
        
          //ocid 조회 성공후, 조회한 ocid로 캐릭터별 큐브 사용 결과 조회
          try {
            const infoResponse = await fetch(cubeInfoUrl, {
              method: "GET",
              headers: { "x-nxopen-api-key": useFirstApiKey }
            });
            
            if (!infoResponse.ok) {
              throw new Error(`API 요청 실패! 상태 코드: ${infoResponse.status}`);
            }
    
            const returnCubeData = await infoResponse.json();
            
            //큐브데이터 출력
            console.log("returnCubeData====>",returnCubeData);
            
            
            const detailInfoData = returnCubeData;
            
            //ocid 조회 성공후, 조회한 ocid로 캐릭터 정보 조회
            //setCharacterInfo(param, detailInfoData);
            setError(null);
          } catch (err) {
            setError("캐릭터 정보를 불러오는 데 실패했습니다.");
            //setCharacterInfo(param, null);
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
        <Helmet>
          <title>메이플-파이터</title>
          <meta name="description" content="캐릭터들간의 데이터들을 서로 비교해볼 수 있는 사이트" />
          <meta property="og:title" content="메이플-파이터" />
        </Helmet>
        <div className="content">
          <img className="logo-div" src="images/vsLogo.jpg" alt="이미지" />
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
                    <form>
                    <div className="filter">
                      {/* input box */}
                      <div className="filter-item">
                        <label>개발자 KEY 입력</label>
                        <input
                          type="text"
                          placeholder="개발자 API-KEY 입력하기"
                          value={firstApiKey}
                          onChange={(e) => setFirstApiKey(e.target.value)}
                          ref={inputRef}
                        />
                      </div>

                      {/* select box */}
                      <div className="filter-item">
                        <label>잠재능력 & 큐브 시행횟수</label>
                        <select
                          value={firstCubeCount}
                          onChange={(e) => setFirstCubeCount(e.target.value)}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                        </select>
                      </div>
                      {/* 시작 일자 */}
                      <div className="filter-item date-group">
                        <label>시행 시작 일자</label>
                        <div className="date-input">
                          <input
                            readOnly
                            value={firstCubeDate}
                            placeholder="시작 일자"
                            className="calendar-input-text"
                          />
                          <FaCalendarAlt
                            onClick={() => setFirstCubeDateShow(!firstCubeDateShow)}
                            className="calendar-icon"
                          />
                          {firstCubeDateShow && (
                            <div className="calendar-popup">
                              <Calendar onChange={onChange} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ~ 구분자 */}
                      <span>~</span>

                      {/* 종료 일자 */}
                      <div className="filter-item date-group">
                        <label>시행 종료 일자</label>
                        <div className="date-input">
                          <input
                            readOnly
                            value={secondCubeDate}
                            placeholder="종료 일자"
                            className="calendar-input-text"
                          />
                          <FaCalendarAlt
                            onClick={() => setSecondCubeDateShow(!secondCubeDateShow)}
                            className="calendar-icon"
                          />
                          {secondCubeDateShow && (
                            <div className="calendar-popup">
                              <Calendar onChange={onChange} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 확인 버튼 */}
                      <button className="btn-confirm" onClick={firstInfo}>
                        확인
                      </button>
                    </div>
                    <div class="box">
                      <h3>첫 번째 박스</h3>
                      <p>이곳에 첫 번째 리스트나 데이터를 표시할 수 있습니다.</p>
                    </div>

                    <div class="box">
                      <h3>두 번째 박스</h3>
                      <p>이곳에는 두 번째 내용이 들어갑니다.</p>
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
      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
}

export default CharPotialComp;