import React from 'react';

const containerStyle = {
  width: '502px',
  height: '267px',
  display: 'flex',
  border: '1px solid #ccc',
  background: 'white',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  zIndex:50000000,
};

const sidebarLeftStyle = {
  width: '70px',
  background: '#e3f2fd',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px 0',
  gap: '20px',
};

const iconStyle = {
  width: '30px',
  height: '30px',
  background: '#64b5f6',
  borderRadius: '6px',
};

const contentStyle = {
  flexGrow: 1,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const titleStyle = {
  margin: '0 0 10px 0',
  color: '#1e88e5',
};

const paragraphStyle = {
  margin: '0 0 15px 0',
  color: '#555',
  fontSize: '14px',
};

const graphStyle = {
  height: '80px',
  background: 'linear-gradient(90deg, #1e88e5 0%, #90caf9 100%)',
  borderRadius: '8px',
};

const sidebarRightStyle = {
  width: '80px',
  background: '#e3f2fd',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0',
  gap: '25px',
};

const profileIconStyle = {
  width: '40px',
  height: '40px',
  background: '#42a5f5',
  borderRadius: '50%',
  position: 'relative',
};

const notificationIconStyle = {
  width: '40px',
  height: '40px',
  background: '#42a5f5',
  borderRadius: '50%',
  position: 'relative',
};

const notificationBadgeStyle = {
  content: "''",
  position: 'absolute',
  top: '6px',
  right: '6px',
  width: '10px',
  height: '10px',
  background: 'red',
  borderRadius: '50%',
  border: '2px solid white',
};

export default function ScreenshotExample() {
  return (
    <div style={containerStyle}>
      <div style={sidebarLeftStyle}>
        <div style={iconStyle}></div>
        <div style={iconStyle}></div>
        <div style={iconStyle}></div>
      </div>
      <div style={contentStyle}>
        <h2 style={titleStyle}>스크린샷 예시</h2>
        <p style={paragraphStyle}>502x267 해상도, 2:1 비율을 가진 화면 구성입니다.</p>
        <div style={graphStyle}></div>
      </div>
      <div style={sidebarRightStyle}>
        <div style={profileIconStyle}></div>
        <div style={{ ...notificationIconStyle, position: 'relative' }}>
          <div style={notificationBadgeStyle}></div>
        </div>
      </div>
    </div>
  );
}
