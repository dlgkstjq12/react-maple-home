import React,{ useEffect, useRef, useState} from "react";
import '../App.css';                 // CSS 파일을 따로 만들어서 가져옵니다.
import '../css/sb-admin-2.css';      // 부트스트랩 CSS 파일을 가져옴
import '../css/sb-admin-2.min.css';  // 부트스트랩 CSS 파일을 가져옴
import emailjs from "@emailjs/browser";
import { Helmet } from 'react-helmet';


function Contact () {
    const form = useRef();
    const [status, setStatus] = useState("");
    
    const MAIL_SERVICE_ID = process.env.REACT_APP_MAIL_SERVICE_ID;
    const MAIL_TEMPLATE_ID = process.env.REACT_APP_MAIL_TEMPLATE_ID;
    const MAIL_PUBLIC_KEY = process.env.REACT_APP_MAIL_PUBLIC_KEY;
    
    const sendEmail = (e) => {
      e.preventDefault();

      emailjs.sendForm(
        MAIL_SERVICE_ID,     // EmailJS의 Service ID
        MAIL_TEMPLATE_ID,    // EmailJS의 Template ID
        form.current,
        MAIL_PUBLIC_KEY      // EmailJS의 Public Key
      )
      .then(
        () => {
          setStatus("메일이 성공적으로 전송되었습니다.");
          form.current.reset();
        },
        (error) => {
          console.error(error);
          setStatus("메일 전송에 실패했습니다.");
        }
      );
    };

    return (
        
        <div className="pri-text-container">
            <div className="pri-text-box">
              <div className="contact-form">
                <h2>Contact Me</h2>
                <form ref={form} onSubmit={sendEmail}>
                  <div className="mb-4 mt-4 ml-1.5 mr-3 flex gap-2">
                      <input placeholder="제목을 입력해주세요." className="form-control bg-light border-0 small w-1/2" type="text" name="title" required />
                  </div>
                  <div className="mb-4 mt-4 ml-1.5 mr-3 flex gap-2">  
                    <input placeholder="보내시는분을 입력해주세요." className="form-control bg-light border-0 small w-1/2" type="text" name="name" required />
                  </div>
                  <div className="mb-4 mt-4 ml-1.5 mr-3">
                    <textarea placeholder="내용을 입력해주세요." className="form-control bg-light border-0 small" name="message" rows="5" required />
                  </div>
                  <button className="btn btn-primary mb-4 mt-4 ml-1.5 mr-3" type="submit">
                    <i className="fas fa-search fa-sm">메일 보내기</i>
                  </button>
                </form>
                {status && <p style={{ color: "red", fontSize: "1.3rem"}}>{status}</p>}
              </div>
          </div>
      </div>
      
    );
  };

export default Contact;