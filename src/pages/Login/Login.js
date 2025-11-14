import React, { useState,useEffect } from "react";
import { TiTick } from "react-icons/ti";
import "../Login/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../../assets/login.gif";
import logoImage from "../../assets/flapone-logo.png";
import google from "../../assets/google.png";
import { Link } from "react-router-dom";

import axios from "axios";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import {useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useTitle } from "../../hooks/useTitle.js";
import { toast } from "react-toastify";


const Login = () => {
  useTitle("Login - Access Your Account - Flapone Aviation");

  const {id} = useParams();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [gLoginUser, setGLoginUser] = useState([]); 
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
    if(id) {
      axios({
        method: 'post',
        url: `${constant.base_url}/loginUser.php?fun=autologin`,
        headers: {},
        data: {
          id:id,
          type:'employee',
        }
        }).then(function(response) {
          
        if(response.data.data.status === '1'){
            const logdata  = response.data.login.data;
            const redirectpage = response.data.data.type;
            dispatch(setUser(logdata));
            setSuccess(response.data.data.msg);
            localStorage.setItem("flaponeloginDetails", btoa(btoa(JSON.stringify(logdata))));
            
            if(redirectpage === "forgot_password"){
              navigate("/my-account?tab=Settings&section=newpass");
            }else if(redirectpage === "email_verify"){
              navigate("/my-account?tab=settings");
              //navigate("/my-account");
            }else if(redirectpage === "invitaion_accept"){
              navigate("/my-account?tab=settings");
            } else if(redirectpage === "discount_approval_accept" || redirectpage === "discount_approval_reject"){
              navigate("/my-finance/"+response.data.data.payment_id+"?tab=payments");
            } else if(redirectpage === "my_report_followup"){
              navigate("/my-report/all");
            }else{
	     navigate("/my-account?tab=Settings");
             // navigate("/");
            }
            
          }else{
            setPasswordError(response.data.msg);
        }
      });
  }
},[id]);

useEffect(()=>{
  handleCheckLogin(user.auth_id);
},[]);

function handleCheckLogin(auth_id) {
  axios({
    method: 'post',
    url: `${constant.base_url}/loginUser.php?fun=checksessactive`,
    headers: {"Auth-Id": user.auth_id },
    data: {},
  }).then(function (response) {
    if (response.data && response.data.login.status && response.data.login.status === 1) {
	    navigate("/my-account?tab=Settings");
      //navigate("/");
    }
  }).catch(function (error) {
    // Handle error, if necessary
    console.error("Error checking login:", error);
  });
}

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleLogin(e);
  }
};

const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setSuccess("");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email Empty!");
    }
    if (!password) {
      setPasswordError("Password Empty!");
    }
    if(!email || !password){
      return;
    } 
    else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }    
    
    setLoading(true);
    axios({
      method: 'post',
      url: `${constant.base_url}/loginUser.php?fun=login`,
      headers: {},
      data: {
        username: email,
        password: password,
        type:"employee",
      }
    }).then(function(response) {
        const loginUser = response.data.login.data;
	localStorage.clear();
        if (loginUser && loginUser.user_id !== "" && loginUser.user_id!==undefined) {
            dispatch(setUser(loginUser));
            setSuccess(response.data.data.msg);
            localStorage.setItem("flaponeloginDetails", btoa(btoa(JSON.stringify(loginUser))));
	   if(loginUser.dept_id == 7 && loginUser.role_id == 4){
            navigate("/lead-detail");
	   }else if(loginUser.dept_id == 7 && loginUser.role_id !== 4){
            navigate("/my-reports");
	   }else{
            //navigate("/my-account?tab=Settings");
            navigate("/my-finance");
	   }
        }
       else{
        setPasswordError(response.data.data.msg);
       }
    }).catch(function(error) {
      // Handle errors
      console.error('Error during login:', error);
    });
    setLoading(false);

  };

  /************************Google Login Code*******************************/

  const handleGoogleLoginSuccess = (codeResponse) => {
    // Set the gLoginUser state
    setGLoginUser(codeResponse);
    // Call the googleSignin function with the codeResponse
    googleSignin(codeResponse);
  };
  const login = useGoogleLogin({
    onSuccess:handleGoogleLoginSuccess,
    onError: (error) => toast.error("Login Failed:", error),
  });
  function googleSignin(gLoginUser){
    if (gLoginUser) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gLoginUser.access_token}`, {
        headers: {
          Authorization: `Bearer ${gLoginUser.access_token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        createGoogleUser(gLoginUser, res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  const createGoogleUser = async (gLoginUser, gLoginProfile) => {
    if (gLoginProfile) {
      setEmail(gLoginProfile.email);
    }
    axios({
      method: 'post',
      url: `${constant.base_url}/loginUser.php?fun=loginbygoogle`,
      headers: {},
      data: {
        userdata: gLoginUser,
        userprofile: gLoginProfile,
        type:"employee",
      }
    }).then(function(response) {
        const loginUser = response.data.login.data;
	localStorage.clear();
        if (loginUser && loginUser.user_id !== "" && loginUser.user_id!==undefined) {
          dispatch(setUser(loginUser));
          setSuccess(response.data.data.msg);
          localStorage.setItem("flaponeloginDetails", btoa(btoa(JSON.stringify(loginUser))));
          //navigate("/");
	   if(loginUser.dept_id == 7 && loginUser.role_id == 4){
            navigate("/lead-detail");
           }else if(loginUser.dept_id == 7 && loginUser.role_id !== 4){
            navigate("/my-reports");
           }else{
            //navigate("/my-account?tab=Settings");
            navigate("/my-finance");
           }
         //navigate("/my-account?tab=Settings");
        }
     else{
        setPasswordError(response.data.data.msg);
     }
    }).catch(function(error) {
      // Handle errors
      console.error('Error during login:', error);
    });
  };

  /****************************End Google Login Code*******************************/
  return (
    <div className="login-container box-center ">
      <div className="login-left-side-image pr">
        <img src={loginImage} alt="login" className="imgrad" />
        <div className="pa box-center fc3 login-left-text w100 fdc">
          <div className="fc3 fw6 mb8 lh22 login-left-heading">
            Why do we use it?
          </div>
          <div className="fc3 fw5 ls1 lh14">
            <p className="fs14">
              <TiTick /> Streamlined access for quick entry into the CRM/CMS
            </p>
            <p className="fs14 mt4">
              <TiTick /> Personalized dashboards based on your roles
            </p>
            <p className="fs14 mt4">
              <TiTick /> Real-time data updates for informed decision-making
            </p>
          </div>
        </div>
      </div>
      <div className="login-right-side-form">
        <div className="pd20 w100">
          <div className="box-center login-head fdc">
            <img src={logoImage} alt="logo" className="slider-company-logo" />
            <h3 className="fc15 fw5 fs20 mt24 ls1 tac">
              Login
              <div className="fs14 fc16 mt12 fw4 ls1">
                Welcome to the Flapone family!
              </div>
            </h3>
          </div>
          <form className="mt24 mb48 login-forms">
            <div className="social-form-group box-center">
              <button className=" sign-in-microsoft ls2 flx45" onClick={(e) => {e.preventDefault();login();}}>
                <img src={google} alt="google" className="mr8 fc1" />
                Sign in with Google
              </button>
            </div>
            <div className="hr-line pr mt36 mb32">
              <hr
                style={{
                  height: 1,
                  backgroundColor: "#9fa5bc",
                  border: "none",
                }}
              />

              <span
                className="fc17 tac"
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: 0,
                  width: "100%",
                }}
              >
                <span style={{ background: "#fff", padding: 20 }}>or</span>
              </span>
            </div>
            <div className="col-xl-12">
              <input
                type="text"
                name="email"
                className="form-control br4"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
               {emailError && <div className="form-error-messages error mt4 ml4 blink-text-normal-error">{emailError}</div>}
            </div>
            <div className="col-xl-12 pr mt12 password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control br4"
                autoComplete="current-password"
                onKeyDown={handleKeyDown}
              />
             
              <span onClick={togglePasswordVisibility}>
                {!showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              
            </div>
            {passwordError && (
                <div className="form-error-messages error mt4 ml4 blink-text-normal-error">{passwordError}</div>
            )}
             {success && <div className="mt4 ml4 blink-text-normal-success">{success}</div>}
            <Link
              to="/forgot-password"
              className="df jce cp fc16 fs10 fw5 lh14 ls1 mt8"
            >
              <div>Forgot Password?</div>
            </Link>
           
            <div className="box-center">
              <button
                className="login-email w100 mt24 lh22 ls1 cp flx33"
                onClick={handleLogin}
              >
                {loading ? <SmallLoader/> : "Login with email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
