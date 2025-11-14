import React, { useState} from "react";
import { TiTick } from "react-icons/ti";
import "../Login/Login.css";
import loginImage from "../../assets/forgot-password.gif";
import logoImage from "../../assets/flapone-logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import SmallLoader from "../../components/SmallLoader";
import constant from "../../constant/constant";
import { useTitle } from "../../hooks/useTitle.js";


const ForgotPassword = () => {
  useTitle("Forgot Password - Reset Your Password - Flapone Aviation");

  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleForgotPwd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setEmailError("");
    if (forgotEmail.trim() === '') {
      setEmailError("Email field can't be blank.");
      setLoading(false);
    }else if(!emailRegex.test(forgotEmail)){
      setLoading(false);
      setEmailError("Invalid email");
    }
    else{
    axios({
      method: 'post',
      url: `${constant.base_url}/forgetPassword.php?fun=forgotpwd`,
      headers: {},
      data: {
        forgotEmail:forgotEmail,
        type:'employee',
      }
      }).then(function(response) {
        if(response){
          setLoading(false);
          if(response.data.data.status === '1'){
            setSuccess(response.data.data.msg);
            setLoading(false);
            //return false;
          }else{
            setEmailError(response.data.data.msg);
            setLoading(false);
            //return false;
          }
        }
      });
    }
  }

  return (
    <div className="login-container box-center ">
      <div className="login-left-side-image pr">
        <img src={loginImage} alt="login" className="imgrad" />
        <div className="pa box-center fc3 login-left-text w100 fdc">
          <div className="fc3 fw6 mb8 lh22 login-left-heading">Why do we use it?</div>
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
            <h3 className="fc15 fw5 fs20 mt24 ls1 tac forgot-heading">
            Forgot Password
              <p className="fs14 fc16 mt12 fw4 ls1 forgot-text">
              Don't worry. Resetting your password is!
              </p>
            </h3>
          </div>
          <form className="mt24 mb48 login-forms">
            <div className="col-xl-12">
              <input
                type="text"
                name="email"
                className="form-control br4"
                placeholder="Enter registered email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                autoComplete="email"
              />
              {emailError && <div className="form-error-messages error mt4 ml4 blink-text-normal-error">{emailError}</div>}
              {success && <div className="mt4 ml4 blink-text-normal-success">{success}</div>}
            </div>
            <div className="box-center">
              <button
                className="login-email box-center w100 mt24 lh22 ls1 cp flx33"
                onClick={handleForgotPwd}>
               {loading ? <SmallLoader/> :"Submit"}
              </button>
            </div>
          </form>
          <div className="box-center ls1 fc16 have-accout">
            Already have an account?{" "}
            <Link to="/login" className="fc1 ml4 fs16 login-here">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
