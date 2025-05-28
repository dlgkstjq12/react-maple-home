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
    
    const createNowDay = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작
      const dd = String(now.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;  // 'YYYY-MM-DD' 형식
    }
    
    //메이플 API 관련 호출 함수
    //x-nxopen-api-key :: API KEY
    //항목들 정리
    const [apiKey, setApiKey] = useState('');
    const [attempts, setAttempts] = useState(10);
    const [startDate, setStartDate] = useState(() => createNowDay());
    const [endDate, setEndDate] = useState(() => createNowDay());
    const [cubeType, setCubeType] = useState("수상한 큐브");
    const [addType, setAddType] = useState("수상한 에디셔널 큐브");

    const [userCube, setUserCube] = useState([20, 12, 4]);
    const [userAdd, setUserAdd] = useState([18, 10, 2]);

    const [error, setError] = useState(null);

    const [startCubeDateShow, setStartCubeDateShow] = useState(false);
    const [endCubeDateShow, setEndCubeDateShow] = useState(false);

    //캐릭터별 구분 상수
    const first = 'first';
    
    const cubeDataMap = {
      "수상한 큐브": [0.9901, 0, 0],
      "장인의 큐브": [4.7619, 1.1858, 0],
      "명장의 큐브": [7.9994, 1.6959, 0.1996],
      "레드 큐브": [6.0000002444, 1.8, 0.3],
      "잠재능력 재설정 & 블랙큐브": [15.0000001275, 3.5, 1.4]
    };

    const addDataMap = {
      "수상한 에디셔널 큐브": [0.4, 0, 0],
      "에디셔널 큐브/화이트 에디셔널 큐브": [4.7619, 1.9608, 0.7],
      "에디셔널 잠재능력 재설정": [2.3810, 0.9804, 0.7]
    };

    const labels = ["레어→에픽", "에픽→유니크", "유니크→레전드리"];
    
    const viewportWidth = window.innerWidth;
    const smallSize = 480;// 모바일 해상도 기준
    const ratioSetting = (viewportWidth > smallSize) ? true : false;
    const sizeSetting = (viewportWidth > smallSize) ? 25 : 12;
    
    const firstInfo = function (){
      fetchCharacterInfo(first);
    }
    
    const onChange = (d) => {
      handleCalendarChange(d, 'start');
    };

    const onEndChange = (d) => {
      handleCalendarChange(d, 'end');
    };
    
    const handleCalendarChange = (d, type) => {
      const localDate = d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '-').replace('.', '');

      if (type === 'start') {
        setStartDate(localDate);
        setStartCubeDateShow(false); // 시작 날짜 캘린더 닫기
      } else if (type === 'end') {
        setEndDate(localDate);
        setEndCubeDateShow(false); // 끝 날짜 캘린더 닫기
      }
    };
    
    const handleConfirmSearch = () => {
      if (!apiKey) {
        alert("API KEY를 입력해주세요.");
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        alert("시작일은 종료일보다 빠를 수 없습니다.");
        return;
      }
      alert(`검색 조건:\nAPI KEY: ${apiKey}\n실행횟수: ${attempts}\n기간: ${startDate} ~ ${endDate}`);
      // 여기에 실제 API 호출 추가 가능
    };
    
    const setPeriod = (type) => {
      const today = new Date();
      let start, end = new Date();
      if (type === '7d') start = new Date(today.setDate(today.getDate() - 7));
      else if (type === '1m') start = new Date(today.setMonth(today.getMonth() - 1));
      else if (type === '3m') start = new Date(today.setMonth(today.getMonth() - 3));
      else return;
      setStartDate(start.toISOString().slice(0, 10));
      setEndDate(new Date().toISOString().slice(0, 10));
    };
    
    const getChartData = (data, user) => ({
      labels,
      datasets: [
        {
          label: '공식 확률 (%)',
          data,
          backgroundColor: 'rgba(54,162,235,0.7)',
        },
        {
          label: '이벤트 확률 (%)',
          data: data.map(x => x * 2),
          backgroundColor: 'rgba(75,192,192,0.7)',
        },
        {
          label: '내 경험 확률 (%)',
          data: user,
          backgroundColor: 'rgba(255,99,132,0.7)',
        }
      ]
    });
    
/*    const options = {
        maintainAspectRatio: viewportWidth > smallSize,  // true 또는 false로 유지
        responsive: true,
        aspectRatio: viewportWidth <= smallSize ? 1 : 2, // 모바일에서는 정사각형 비율, PC에서는 가로 긴 비율
        plugins: {
          legend: { position: "top", labels: { font: { size: sizeSetting } } },
          title: { display: true, text: "확률별 비교", font: { size: sizeSetting } },
          tooltip: {
            titleFont: { size: sizeSetting },
            bodyFont: { size: sizeSetting },
            footerFont: { size: sizeSetting }
          }
        },
        scales: {
          x: { ticks: { font: { size: sizeSetting } } },
          y: { ticks: { font: { size: sizeSetting } } },
        }
    };*/
    
    //const viewportWidth = window.innerWidth;
    //const smallSize = 768; // 모바일 뷰포트 기준
    const isMobile = viewportWidth <= smallSize;

    //const sizeSetting = isMobile ? 12 : 25;
    const aspectRatio = isMobile ? 1 : 2; // 모바일: 정사각형, 데스크탑: 가로 긴 비율

    
    const options = {
      maintainAspectRatio: true,
      responsive: true,
      aspectRatio: aspectRatio,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { size: sizeSetting } },
        },
        title: {
          display: true,
          text: "확률별 비교",
          font: { size: sizeSetting },
        },
        tooltip: {
          titleFont: { size: sizeSetting },
          bodyFont: { size: sizeSetting },
          footerFont: { size: sizeSetting },
        },
      },
      scales: {
        x: { ticks: { font: { size: sizeSetting } } },
        y: { ticks: { font: { size: sizeSetting } } },
      },
    };

    const fetchCharacterInfo = async (param) => {
        if (!param) return;
        
        let useFirstApiKey;
        
        switch (param) {
          case first:
            if (!apiKey) return;
            useFirstApiKey = apiKey;
            break;
          default:
            alert("검색 실패");
        }

        //url뒤에 넣을 파라미터셋팅할 변수
        let params = {};
        if(apiKey != null && apiKey != ""){
            params.count = Number(apiKey);
        }
        if(startDate != null && startDate != ""){
            params.date = startDate;
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
            <div className="half-text-container">
                <div className="half-text-box">
                    <h1 className="name-small-font">(2-Step) 사용방법 및 주의사항</h1>
                    <p>1. 발급받은 개발자 API-KEY 입력후 "확인" 버튼 클릭</p>
                    <p>2. 해당 넥슨 ID가 가지고 있는 메이플 캐릭터들의 잠재능력 & 큐브 사용정보를 볼 수 있습니다.</p>
                    <a href="https://openapi.nexon.com/ko/guide/prepare-in-advance/"> 참고 : https://openapi.nexon.com/ko/guide/prepare-in-advance/</a>
                </div>
            </div>
        </div>
        <div className="chart-container">
            <div className="info-box">
                {/* First Section */}
                <form>
                <div className="filter">
                  {/* input box */}
                  <div className="filter-item">
                    <label>개발자 KEY 입력</label>
                    <input
                      type="text"
                      placeholder="개발자 API-KEY 입력하기"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  {/* select box */}
                  <div className="filter-item">
                    <label>시행횟수</label>
                    <select
                      value={attempts}
                      onChange={(e) => setAttempts(e.target.value)}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>
                  
                  <div className="filter-item">
                    <button className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" /*onClick={() => setPeriod('7d')}*/>
                       <i className="fas fa-search fa-sm">7일</i>
                    </button>
                  </div>
                  <div className="filter-item">
                      <button className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" onClick={() => setPeriod('1m')}>
                         <i className="fas fa-search fa-sm">1개월</i>
                      </button>
                  </div>
                  <div className="filter-item">
                      <button className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" onClick={() => setPeriod('3m')}>
                         <i className="fas fa-search fa-sm">3개월</i>
                      </button>
                  </div>
                  
                  {/* 시작 일자 */}
                  <div className="filter-item date-group">
                    <label>시행 시작 일자</label>
                    <div className="date-input">
                      <input
                        type="date"
                        readOnly
                        value={startDate}
                        placeholder="시작 일자"
                        className="calendar-input-text"
                        onChange={e => setStartDate(e.target.value)}
                      />
                      <FaCalendarAlt
                        onClick={() => setStartCubeDateShow(!startCubeDateShow)}
                        className="calendar-icon"
                      />
                      {startCubeDateShow && (
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
                        type="date"
                        readOnly
                        value={endDate}
                        placeholder="종료 일자"
                        className="calendar-input-text"
                        onChange={e => setEndDate(e.target.value)}
                      />
                      <FaCalendarAlt
                        onClick={() => setEndCubeDateShow(!endCubeDateShow)}
                        className="calendar-icon"
                      />
                      {endCubeDateShow && (
                        <div className="calendar-popup">
                          <Calendar onChange={onChange} />
                        </div>
                      )}
                    </div>
                  </div>
                    {/* 확인 버튼 */}
                    <button className="btn-confirm" onClick={handleConfirmSearch} ref={inputRef}> 확인 </button>
                </div>
                </form>
                <div className="total-chart-box">
                    <div className="half-chart-box">
                      <h3>큐브 등급업 확률</h3>
                      <select value={cubeType} onChange={e => setCubeType(e.target.value)}>
                        {Object.keys(cubeDataMap).map(cube => (
                          <option key={cube} value={cube}>{cube}</option>
                        ))}
                      </select>
                      <div className="chart-container">
                        <Bar data={getChartData(cubeDataMap[cubeType], userCube)} options={options} />
                      </div>
                    </div>
                    <div className="half-chart-box">
                      <h3>에디셔널 등급업 확률</h3>
                      <select value={addType} onChange={e => setAddType(e.target.value)}>
                        {Object.keys(addDataMap).map(add => (
                          <option key={add} value={add}>{add}</option>
                        ))}
                      </select>
                      <div className="chart-container">
                        <Bar data={getChartData(addDataMap[addType], userAdd)} options={options} />
                      </div>
                    </div>
                </div>
            </div>
        </div>
      {/* Scripts will be handled via React and external libraries */}
    </div>
  )
}

export default CharPotialComp;