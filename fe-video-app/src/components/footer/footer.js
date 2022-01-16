import "./footer.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import React, { useEffect, useRef, useState } from "react";
import { Link } from "@mui/material";
function Footer(){
    return <div className="footer">
       <Link href="https://github.com/MohsinAliFarhat?tab=repositories" target="_blank"><GitHubIcon fontSize="large" /></Link> 
    </div>
}
export default Footer;