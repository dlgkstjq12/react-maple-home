import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Footer = () => {
    
    const navigate = useNavigate();
    
    return (
        <footer>
            <p className="footer">
                © 2025 Maple Fighter App. <br />
                All rights reserved. <br />
                by 스카니아@도끼질의참맛 <br />
                Data Based on NEXON OPEN API <br />
                <Link to="/PrivacyPolicy" className="text-sm text-gray-600 underline">개인정보처리방침</Link> <br />
                contact : dlgkstjq623@naver.com
            </p>
        </footer>
    )
};

export default Footer;
