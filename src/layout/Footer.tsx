import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 커뮤니티 규칙 */}
        <div className="footer-section">
          <h4>커뮤니티 규칙</h4>
          <ul>
            <li>존중과 예의를 지켜주세요.</li>
            <li>욕설 및 비방은 삼가주세요.</li>
          </ul>
        </div>

        {/* 만든 사람 정보 */}
        <div className="footer-section">
          <h4>만든 사람</h4>
          <p>이선오, 김민성, 손다희, 이원용</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
