import "./header.css";
import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
function Header() {

    const [username, setUsername] = useState("")
    const [image, setImage] = useState("")

    useEffect(() => {
        const profile = localStorage.getItem("profile");
        if (profile) {
            const { username, image } = JSON.parse(profile);
            setUsername(username);
            setImage(image);
        }
    }, [])

    const [currentTime, setcurrentTime] = useState("")

    useEffect(() => {
        setInterval(() => {
            const date = new Date().toString();
            const d = date.split("GMT")[0];
            setcurrentTime(d);
        }, 1000)
    }, [])


    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    }

    return <div> <ul className="header">
        <li className="h-font">Meets by <strong>Mohsin</strong></li>
        <li className="header-right" style={{ marginTop: "0.5em", marginLeft: "0.4em" }}>
            { username?<Button variant="outlined" onClick={logOut}>Log Out</Button>:""}</li>
        <li className="header-right" style={{ marginTop: "0.5em" }} >{image ? <img src={image} id="profile-pic"></img> : ""}</li>
        <li className="header-right" style={{ padding: "1em 0.5em 0 0em" }} >{username}</li>
        <li className="header-right" style={{ padding: "1em 0.5em 0 0em" }}> • </li>
        <li className="header-right time" style={{ padding: "1em 0.5em 0 0em" }}>{currentTime}</li>
    </ul>
    </div>
}

export default Header;