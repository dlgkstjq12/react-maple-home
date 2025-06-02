import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
import { Helmet } from 'react-helmet';
import Calendar from 'react-calendar'; //npm install react-calendar
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일 적용
import { FaCalendarAlt } from 'react-icons/fa'; //npm install react-icons
import axios from 'axios'; //npm install axios
import rateLimit from 'axios-rate-limit'; //npm install axios-rate-limit //요청 빈도를 자동으로 제어
import { Bar } from "react-chartjs-2";

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
    const [apiKey, setApiKey] = useState(API_KEY);
    const [attempts, setAttempts] = useState(1000);
    const [startDate, setStartDate] = useState(() => createNowDay());
    const [endDate, setEndDate] = useState(() => createNowDay());
    const [cubeType, setCubeType] = useState("수상한 큐브");
    const [addType, setAddType] = useState("수상한 에디셔널 큐브");

    const [userCube, setUserCube] = useState([0, 0, 0]);
    const [userAdd, setUserAdd] = useState([0, 0, 0]);
    
    const [cubeData, setCubeData] = useState(null);
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가
    const [error, setError] = useState(null);

    const [startCubeDateShow, setStartCubeDateShow] = useState(false);
    const [endCubeDateShow, setEndCubeDateShow] = useState(false);
    
    const labels = ["레어→에픽", "에픽→유니크", "유니크→레전드리"];
    
    //"레어→에픽", "에픽→유니크", "유니크→레전드리" index 정리
    const rteUp = 0;
    const etuUp = 1;
    const utlUp = 2;
    
    //레어 → 에픽 : RARE_TO_EPIC
    //에픽 → 유니크 : EPIC_TO_UNIQUE
    //유니크 → 레전드리 : UNIQUE_TO_LEGENDARY
    //큐브별 시행횟수와 등급업된 확률
    let cubeSuspicious = {
        name : "수상한 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 수상한 큐브

    let cubeMaster = {
        name : "장인의 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 장인의 큐브
    
    let cubeGrandmaster = {
        name : "명장의 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 명장의 큐브

    let cubeRed = {
        name : "레드 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 레드 큐브

    let cubeBlack = {
        name : "블랙 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 블랙 큐브

    let resetPotential = {
        name : "잠재능력 재설정", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 잠재능력 재설정

    let cubeSuspiciousAdditional = {
        name : "수상한 에디셔널 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 수상한 에디셔널 큐브

    let cubeAdditional = {
        name : "에디셔널 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 에디셔널 큐브
    
    let cubeAdditionalWhite = {
        name : "화이트 에디셔널 큐브", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 화이트 에디셔널 큐브
    
    let resetAdditionalPotential = {
        name : "에디셔널 잠재능력 재설정", 
        rteCount : 0, 
        rteRankUp : 0,
        etuCount : 0,
        etuRankUp : 0,
        utlCount : 0,
        utlRankUp : 0
    }; // – 에디셔널 잠재능력 재설정
    
    const cubeTotArray = [cubeSuspicious, cubeMaster, cubeGrandmaster, cubeRed, cubeBlack, resetPotential];
    const addCubeTotArray = [cubeSuspiciousAdditional, cubeAdditional, cubeAdditionalWhite, resetAdditionalPotential];

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

    const [chartCubeData, setChartCubeData] = useState(getChartData(cubeDataMap[cubeType], userCube));
    const [chartAddData, setChartAddData] = useState(getChartData(addDataMap[addType], userAdd));
    
    useEffect(() => {
      setChartCubeData(getChartData(cubeDataMap[cubeType], userCube));
    }, [cubeType, userCube]);
    
    useEffect(() => {
      setChartAddData(getChartData(addDataMap[addType], userAdd));
    }, [addType, userAdd]);
    
    //캐릭터별 구분 상수
    const first = 'first';
    
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
        
    const setPeriod = (type) => {
        const today = new Date();
        let start, end = new Date();
        if (type === '7d') start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (type === '1m') start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        else if (type === '3m') start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        else return;

        setStartDate(start.toISOString().slice(0, 10));
        setEndDate(new Date().toISOString().slice(0, 10));
    };
    
    

    const viewportWidth = window.innerWidth;
    const smallSize = 480;// 모바일 해상도 기준
    const ratioSetting = (viewportWidth > smallSize) ? true : false;
    //const smallSize = 768; // 모바일 뷰포트 기준
    const isMobile = viewportWidth <= smallSize;

    const sizeSetting = isMobile ? 4 : 15;
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
        x: {  categoryPercentage: 1.0, barPercentage: 1.0, ticks: { font: { size: sizeSetting } } },
        y: { min: 0, max: 70, ticks: { font: { size: sizeSetting, stepSize: 5} } },
      },
    };
    
    // 날짜 리스트 생성 함수
    const getDateRange = (start, end) => {
      const dateList = [];
      let current = new Date(start);
      end = new Date(end);
      while (current <= end) {
        dateList.push(current.toISOString().split('T')[0]); // YYYY-MM-DD
        current.setDate(current.getDate() + 1);
      }
      return dateList;
    };
    
    const handleConfirmSearch = async () => {
        
        let useApiKey;
        //url뒤에 넣을 파라미터셋팅할 변수 셋팅, 데이터 없으면 return
        let params = {};
        if(!apiKey){
            alert("개발자 API-KEY를 입력해주세요.");
            return;
        }else{
            useApiKey = apiKey;
        }
        
        if(!attempts){
            alert("시행횟수를 입력해주세요.");
            return;
        }else{
            params.count = Number(attempts);
        }
        
        if(!startDate){
            alert("시행 시작 일자를 입력해주세요.");
            return;
        }
        if(!endDate){
            alert("시행 종료 일자를 입력해주세요.");
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            alert("시작일은 종료일보다 빠를 수 없습니다.");
            return;
        }
        
        debugger;
        
        const dates = getDateRange(startDate, endDate);
        
        console.log("dates====>",dates);
        console.log("useFirstApiKey====>",useApiKey);
        console.log("params====>",params);

        const config = {
          headers: { "x-nxopen-api-key": useApiKey }
        };
        
        //URLSearchParams를 사용해서 객체를 query string으로 변환
        let queryString;
        let cubeData;
        let returnCubeDataArray = [];
        for(var i = 0; i < dates.length; i++){
            params.date = dates[i];
            queryString = new URLSearchParams(params).toString();
            cubeData = await callCubeData(queryString, config);
            
            if(cubeData.cube_history.length !== 0){
                for(var k = 0; k < cubeData.cube_history.length; k++){
                    switch (cubeData.cube_history[k].cube_type) {
                      case "수상한 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeSuspicious.rteCount ++;
                                cubeSuspicious.rteRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeSuspicious.rteCount ++;
                            }
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeSuspicious.rteCount ++;
                            }
                        }
                        break;
                      case "장인의 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeMaster.rteCount ++;
                                cubeMaster.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeMaster.etuCount ++;
                                cubeMaster.etuRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeMaster.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeMaster.etuCount ++;
                            }
                        }
                        break;
                      case "명장의 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeGrandmaster.rteCount ++;
                                cubeGrandmaster.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeGrandmaster.etuCount ++;
                                cubeGrandmaster.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                cubeGrandmaster.utlCount ++;
                                cubeGrandmaster.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeGrandmaster.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeGrandmaster.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeGrandmaster.utlCount ++;
                            }
                        }
                        break;
                      case "레드 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeRed.rteCount ++;
                                cubeRed.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeRed.etuCount ++;
                                cubeRed.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                cubeRed.utlCount ++;
                                cubeRed.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeRed.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeRed.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeRed.utlCount ++;
                            }
                        }
                        break;
                      case "블랙 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeBlack.rteCount ++;
                                cubeBlack.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeBlack.etuCount ++;
                                cubeBlack.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                cubeBlack.utlCount ++;
                                cubeBlack.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeBlack.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeBlack.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeBlack.utlCount ++;
                            }
                        }
                        break;
                      case "잠재능력 재설정":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                resetPotential.rteCount ++;
                                resetPotential.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                resetPotential.etuCount ++;
                                resetPotential.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                resetPotential.utlCount ++;
                                resetPotential.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                resetPotential.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                resetPotential.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                resetPotential.utlCount ++;
                            }
                        }
                        break;
                      case "수상한 에디셔널 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeSuspiciousAdditional.rteCount ++;
                                cubeSuspiciousAdditional.rteRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeSuspiciousAdditional.rteCount ++;
                            }
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeSuspiciousAdditional.rteCount ++;
                            }
                        }
                        break;
                      case "에디셔널 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeAdditional.rteCount ++;
                                cubeAdditional.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeAdditional.etuCount ++;
                                cubeAdditional.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                cubeAdditional.utlCount ++;
                                cubeAdditional.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeAdditional.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeAdditional.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeAdditional.utlCount ++;
                            }
                        }
                        break;
                      case "화이트 에디셔널 큐브":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                cubeAdditionalWhite.rteCount ++;
                                cubeAdditionalWhite.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeAdditionalWhite.etuCount ++;
                                cubeAdditionalWhite.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                cubeAdditionalWhite.utlCount ++;
                                cubeAdditionalWhite.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                cubeAdditionalWhite.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                cubeAdditionalWhite.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                cubeAdditionalWhite.utlCount ++;
                            }
                        }
                        break;
                      case "에디셔널 잠재능력 재설정":
                        if(cubeData.cube_history[k].item_upgrade_result === "성공"){
                            if(cubeData.potential_option_grade === "에픽"){
                                resetAdditionalPotential.rteCount ++;
                                resetAdditionalPotential.rteRankUp ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                resetAdditionalPotential.etuCount ++;
                                resetAdditionalPotential.etuRankUp ++;
                            }else if(cubeData.potential_option_grade === "레전드리"){
                                resetAdditionalPotential.utlCount ++;
                                resetAdditionalPotential.utlRankUp ++;
                            }
                        }else{
                            if(cubeData.potential_option_grade === "레어"){
                                resetAdditionalPotential.rteCount ++;
                            }else if(cubeData.potential_option_grade === "에픽"){
                                resetAdditionalPotential.etuCount ++;
                            }else if(cubeData.potential_option_grade === "유니크"){
                                resetAdditionalPotential.utlCount ++;
                            }
                        }
                        break;
                      default:
                    }
                }
            }
        }
        console.log("returnCubeDataArray==>",returnCubeDataArray);
    };
    
    //큐브 등급업 확률 구분 select box 변경시
    function cubeDataChange (){
        var cubeTypeSet = {cubeType};
        var array = [0,0,0];
        let cubeMap;
        const rteUp = 0;
        const etuUp = 1;
        const utlUp = 2;

        switch (cubeTypeSet) {
          case "수상한 큐브":
            cubeMap = cubeSuspicious;
            break;
          case "장인의 큐브":
            cubeMap = cubeMaster;
            break;
          case "명장의 큐브":
            cubeMap = cubeGrandmaster;
            break;
          case "레드 큐브":
            cubeMap = cubeRed;
            break;
          case "블랙 큐브":  
            cubeMap = cubeBlack;
            break;
          case "잠재능력 재설정":
            cubeMap = resetPotential;
            break;
          default:
            cubeMap = [0,0,0];
            break;
        }
        
        array[rteUp] = cubeMap.rteCount / cubeMap.rteRankUp;
        array[etuUp] = cubeMap.etuCount / cubeMap.etuRankUp;
        array[utlUp] = cubeMap.utlCount / cubeMap.utlRankUp;
        
        //설정한 큐브데이터 셋팅
        setChartCubeData(array);
        
    }
    
    // 큐브 데이터 호출하는 API
    const limitedAxios = rateLimit(axios.create(), { maxRequests: 100, limit: 4, perMilliseconds: 1000 });

    async function callCubeData(queryString, config) {
        const cubeInfoUrl = `https://open.api.nexon.com/maplestory/v1/history/cube?${queryString}`;
        try {
            setLoading(true);  // 요청 시작 시 로딩 상태 true
            const response = await limitedAxios.get(cubeInfoUrl, config);
            console.log("returnCubeData==>", response.data);
            setCubeData(response.data);
            return response.data;  // axios는 JSON 자동 파싱
        } catch (error) {
            console.error(`API 요청 실패!`, error.response?.status, error.message);
            setError(`API 요청 실패! 상태 코드: ${error.response?.status}`);
            throw new Error(`API 요청 실패! 상태 코드: ${error.response?.status}`);
        } finally {
            setLoading(false);  // 요청 종료 시 로딩 상태 false
        }
    }
    
/*    useEffect(() => {
      callCubeData();  // 컴포넌트 마운트 시 호출 (필요 시 버튼 클릭으로 대체 가능)
    }, [queryString]);*/
    
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
                    <br />
                    <br />
                    <h1 className="name-small-font">참고사항</h1>
                    <p>* 실제 본인이 경험한 잠재능력 & 큐브 등급업 확률을 확인 할 수 있습니다.</p>
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
                      className="form-control bg-light border-0 small"
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
                      className="custom-select custom-select-sm form-control form-control-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>
                  <div className="date-range-container">
                      <div className="filter-item">
                        <button type="button" className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" onClick={() => setPeriod('7d')}>
                           <i className="fas fa-search fa-sm">7일</i>
                        </button>
                      </div>
                      <div className="filter-item">
                          <button type="button" className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" onClick={() => setPeriod('1m')}>
                             <i className="fas fa-search fa-sm">1개월</i>
                          </button>
                      </div>
                      <div className="filter-item">
                          <button type="button" className="btn btn-light mb-4 mt-4 ml-1.5 mr-3" onClick={() => setPeriod('3m')}>
                             <i className="fas fa-search fa-sm">3개월</i>
                          </button>
                      </div>
                      
                      {/* 시작 일자 */}
                      <div className="filter-item date-group">
                        <label>시행 시작 일자</label>
                        <div className="date-input">
                          <input
                            type="date"
                            className="form-control bg-light border-0 small"
                            readOnly
                            value={startDate}
                            placeholder="시작 일자"
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
                            className="form-control bg-light border-0 small"
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
                    </div>
                    {/* 확인 버튼 */}
                    <button type="button" className="btn btn-primary" onClick={handleConfirmSearch} ref={inputRef}>
                        <i class="fas fa-search fa-sm">확인</i>
                    </button>
                    {loading && <div>로딩중... 🌀</div>}  {/* 로딩바 또는 스피너 표시 */}
                    {error && <div>{error}</div>}
                </div>
                
                </form>
                <div className="total-chart-box">
                    <div className="half-chart-box">
                      <h3>큐브 등급업 확률</h3>
                      <select className="custom-select custom-select-sm form-control form-control-sm" value={cubeType} onChange={e => setCubeType(e.target.value)}>
                        {Object.keys(cubeDataMap).map(cube => (
                          <option key={cube} value={cube}>{cube}</option>
                        ))}
                      </select>
                      <div className="chart-container">
                        <Bar data={chartCubeData} options={options} />
                      </div>
                    </div>
                    <div className="half-chart-box">
                      <h3>에디셔널 등급업 확률</h3>
                      <select className="custom-select custom-select-sm form-control form-control-sm" value={addType} onChange={e => setAddType(e.target.value)}>
                        {Object.keys(addDataMap).map(add => (
                          <option key={add} value={add}>{add}</option>
                        ))}
                      </select>
                      <div className="chart-container">
                        <Bar data={chartAddData} options={options} />
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