import GoogleLogin from "react-google-login";
import React from "react"
import "./auth.css"
const responseGoogle = (response) => {
    const profile = response.profileObj;
    console.log(profile);
    if (profile) {
        localStorage.setItem("profile", JSON.stringify({
            username: profile.email.split("@")[0],
            image: profile.imageUrl,
            name:profile.name
        }))
        window.location.reload();
    }else{
        console.log("NOTHING returned")
    }
}
function Auth() {

    return (
        <div>
            <h2 className='g-font'>Please Login To Continue to free Video Call App</h2>
            <GoogleLogin
                clientId="466743185625-62lthnm4la02e5rdbgintqlc3h0nac1g.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>)
}

export default Auth;