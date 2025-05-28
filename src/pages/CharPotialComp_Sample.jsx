import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const createNowDay = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;  // 'YYYY-MM-DD' 형식
}

const CubeComparison = () => {
  const [apiKey, setApiKey] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [startDate, setStartDate] = useState(createNowDay());
  const [endDate, setEndDate] = useState(createNowDay());
  const [cubeType, setCubeType] = useState("수상한 큐브");
  const [addType, setAddType] = useState("수상한 에디셔널 큐브");

  const [userCube, setUserCube] = useState([20, 12, 4]);
  const [userAdd, setUserAdd] = useState([18, 10, 2]);
  
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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: { y: { beginAtZero: true, max: 40 } }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '20px' }}>
        {/* 좌측 패널: 여기에 추가 UI */}
      </div>
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>개발자 KEY 입력</h3>
          <input type="text" placeholder="개발자 API-KEY 입력하기" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <label> 실행횟수:</label>
          <select value={attempts} onChange={e => setAttempts(Number(e.target.value))}>
            {[10, 50, 100, 500].map(num => <option key={num} value={num}>{num}</option>)}
          </select>
        </div>

        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>조회 기간 선택</h3>
          <button onClick={() => setPeriod('7d')}>7일</button>
          <button onClick={() => setPeriod('1m')}>1개월</button>
          <button onClick={() => setPeriod('3m')}>3개월</button>
          <button onClick={() => setPeriod('custom')}>기간설정</button><br/>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button onClick={handleConfirmSearch}>검색</button>
        </div>

        <h2>큐브 등급업 확률</h2>
        <select value={cubeType} onChange={e => setCubeType(e.target.value)}>
          {Object.keys(cubeDataMap).map(cube => <option key={cube} value={cube}>{cube}</option>)}
        </select>
        <Bar data={getChartData(cubeDataMap[cubeType], userCube)} options={options} />

        <h2>에디셔널 잠재능력 확률</h2>
        <select value={addType} onChange={e => setAddType(e.target.value)}>
          {Object.keys(addDataMap).map(add => <option key={add} value={add}>{add}</option>)}
        </select>
        <Bar data={getChartData(addDataMap[addType], userAdd)} options={options} />
      </div>
    </div>
  );
};

export default CubeComparison;
