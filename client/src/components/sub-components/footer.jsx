import React from "react";
import ReactTooltip from "react-tooltip";
import { GitHub } from "react-feather";

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} DocuPay</p>
      <a className="docupay-repo" href="https://github.com/cate-k/docupay" data-tip="Click to visit the project repository on GitHub"
        target="_blank" rel="noopener noreferrer">
        <GitHub />
      </a>

      <ReactTooltip />
    </div>
  );
};

export default Footer;