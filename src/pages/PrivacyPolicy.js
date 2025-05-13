import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴

function PrivacyPolicy () {
    return (
        <div className="pri-text-container">
            <div className="pri-text-box">
                <h1 className="font-semibold mt-8 mb-2">개인정보 처리방침</h1>
                <p>
                    <strong>메이플-파이터</strong>(이하 "서비스")는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 개인정보 처리방침은 서비스가 이용자의 개인정보를 어떻게 수집, 이용, 보관, 파기하며 어떤 권리가 보장되는지를 설명합니다.
                </p>
                <h2 className="font-semibold mt-8 mb-2">1. 수집하는 개인정보 항목</h2>
                <ul className="list-disc list-inside mb-4">
                    <li><strong>필수:</strong> 닉네임, 이메일 주소, 비밀번호, 로그인 이력(IP 주소, 접속 시간), 게임 플레이 기록</li>
                    <li><strong>선택:</strong> 프로필 이미지, 소개글, 커뮤니티 활동 기록, 알림 수신 여부</li>
                </ul>

                <h2 className="text-l font-semibold mt-8 mb-2">2. 개인정보 수집 방법</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>회원가입 및 로그인 시 사용자가 직접 입력</li>
                    <li>게임 플레이 중 자동 생성 및 저장</li>
                    <li>고객문의, 오류 신고 등을 통한 수집</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">3. 개인정보의 이용 목적</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>계정 관리 및 사용자 인증</li>
                    <li>게임 전적 저장, 랭킹 시스템 제공</li>
                    <li>커뮤니티 운영 및 고객 응대</li>
                    <li>부정 이용 방지 및 보안 강화</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">4. 보유 및 이용 기간</h2>
                <p className="mb-2">목적 달성 후 즉시 파기하며, 법령에 따라 다음과 같이 보존합니다.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>부정 이용 정보: 1년</li>
                    <li>계약 및 거래 기록: 5년</li>
                    <li>민원 및 분쟁처리 기록: 3년</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">5. 제3자 제공</h2>
                <p className="mb-4">이용자의 동의 없이는 개인정보를 외부에 제공하지 않으며, 법령에 따른 경우만 예외로 합니다.</p>

                <h2 className="text-xl font-semibold mt-8 mb-2">6. 위탁 처리</h2>
                <p className="mb-4">현재 위탁 업체는 없으며, 필요 시 고지 후 동의받습니다.</p>

                <h2 className="text-xl font-semibold mt-8 mb-2">7. 이용자의 권리</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>개인정보 열람, 정정, 삭제, 처리 정지 요청 가능</li>
                    <li>계정 설정 또는 고객센터를 통해 요청 가능</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">8. 파기 절차 및 방법</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>전자 파일: 복구 불가능한 방법으로 삭제</li>
                    <li>인쇄물: 파쇄 또는 소각</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">9. 개인정보 보호 대책</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>비밀번호 암호화 저장</li>
                    <li>접근 권한 제한 및 보안 시스템 운영</li>
                    <li>정기 보안 점검 실시</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-2">10. 개인정보 보호 책임자</h2>
                <p className="mb-4">
                    이름: 스카니아@도끼질의참맛<br />
                    이메일: dlgkstjq623@naver.com<br />
                    문의 가능 시간: 평일 10:00 ~ 18:00
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">11. 고지의 의무</h2>
                <p className="mb-4">
                    본 방침은 2025년 5월 13일부터 적용됩니다. 이후 내용이 변경될 경우 시행 7일 전 공지합니다.
                </p>
            </div>
        </div>
    );
}


export default PrivacyPolicy;