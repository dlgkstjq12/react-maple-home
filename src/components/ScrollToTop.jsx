// components/ScrollToTop.jsx
import React,{ useEffect, useRef, useState} from "react";
import { useLocation  } from "react-router-dom";

const ScrollToTop = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 확실하게 순간이동
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
