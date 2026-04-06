import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import img from "../../assets/login.png"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginPage({ setIsLogin }) {

  // const [mode, setMode] = useState("login"); // "login" or "signup"
  // const [name, setName] = useState("");
  // const [sessionId, setSessionId] = useState("");
  // const [isNewUser, setIsNewUser] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [input, setInput] = useState("");  // Input for email or mobile number
  const [error, setError] = useState("");  // Error message
  const [otp, setOtp] = useState("");  // OTP input
  const [step, setStep] = useState(1);  // Track current step (1: email/phone, 2: OTP)
  const navigate = useNavigate();


  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input) {
      setError("Enter phone number");
      return;
    }

    // ✅ ADD THIS
    if (!validatePhone(input)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await axios.post(
        "https://shyambackend.onrender.com/api/auth/send-otp",
        {
          phone: input,
          mode: "login",

        },
        {
          withCredentials: true
        }
      );

      if (res.data.success) {
        setStep(2);
        setTimer(30);
        setCanResend(false);
      } else {
        setError(res.data.message);
      }

    } catch (err) {
      setError("Server error");
    }
  };
  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Enter OTP");
      return;
    }

    if (!/^[0-9]{10}$/.test(input)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await axios.post(
        "https://shyambackend.onrender.com/api/auth/verify-otp",
        {
          phone: input,
          otp,
          // sessionId // ✅ IMPORTANT
        },
        {
          withCredentials: true // ✅ IMPORTANT
        }
      );

      if (res.data.success) {
        const user = res.data.user;

        // localStorage.setItem("isLoggedIn", "true");
        setIsLogin(true);

        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(res.data.message);
      }

    } catch (err) {
      setError("OTP verification failed");
    }

  };

  useEffect(() => {
    let interval;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleResend = async () => {
    try {
      const res = await axios.post(
        "https://shyambackend.onrender.com/api/auth/resend-otp",
        { phone: input },
        { withCredentials: true }
      );

      if (res.data.success) {
        setTimer(30);
        setCanResend(false);
        setError("");
      } else {
        setError(res.data.message);
      }

    } catch (err) {
      setError("Resend failed");
    }
  };



  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="left-section">
        <img src={img} alt="login illustration" />
        <h1>Welcome!</h1>
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <div className="login-box">
          <h2>Login</h2>
          <p className="sub-text">to access your account</p>

          {/* Step 1: Email/Phone Input */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Enter Phone Number"
                value={input}
                maxLength={10} // ✅ limit to 10 digits
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // only numbers
                  setInput(value);
                  setError("");
                }}
              />

              {error && <p className="error-message">{error}</p>}

              <button type="submit">Send OTP</button>
            </form>
          )}



          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
              />

              {error && <p className="error-message">{error}</p>}

              <p className="resend-text">
                {timer > 0 && `Resend OTP in ${timer}s`}
              </p>

              <button
                type={timer > 0 ? "submit" : "button"}
                onClick={timer === 0 ? handleResend : undefined}
              >
                {timer > 0 ? "Verify OTP" : "Resend OTP"}
              </button>


            </form>
          )}

          {/* <p className="switch-text">
            
          </p> */}

          {/* <div className="divider">or</div> */}

          {/* Google Sign-In Button */}
          {/* <button className="google-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt="google"
            />
            Sign in with Google
          </button> */}

          <p className="footer-text">
            New here? <span>Contact Us</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;