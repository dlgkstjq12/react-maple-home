import React from "react";
import './App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import './css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import './css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
import Home from "./pages/Home";
import CharPotialComp from "./pages/CharPotialComp";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const App = () => {

  return (
    <div>
        <Router>
        <ScrollToTop />
            <Header />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CharPotialComp" element={<CharPotialComp />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            </Routes>
            <Footer />
        </Router>
    </div>
  )
};

export default App;
