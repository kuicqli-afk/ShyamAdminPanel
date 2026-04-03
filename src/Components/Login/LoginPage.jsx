import React, { useState } from "react";
import "./LoginPage.css";
import img from "../../assets/login.png"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginPage({ setIsLogin }) {
  const [input, setInput] = useState("");  // Input for email or mobile number
  const [error, setError] = useState("");  // Error message
  const [otp, setOtp] = useState("");  // OTP input
  const [step, setStep] = useState(1);  // Track current step (1: email/phone, 2: OTP)
  const navigate = useNavigate();

  // Validate email or phone number
  const validateInput = (input) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;  // 10-digit phone number validation
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION ADD
    if (!validateInput(input)) {
      setError("Enter valid phone number");
      return;
    }

    try {
      const res = await axios.post(
        "https://shyambackend.onrender.com/api/auth/send-otp",
        { phone: input }
      );

      if (res.data.success) {
        // ✅ DIRECT OTP SCREEN
        setStep(2);
      } else {
        setError(res.data.message);
      }

    } catch (err) {
      console.log(err);
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

    try {
      const res = await axios.post(
        "https://shyambackend.onrender.com/api/auth/verify-otp",
        {
          phone: input,
          otp
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isLoggedIn", "true");

        setIsLogin(true);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid OTP");
      }

    } catch (err) {
      setError("Error verifying OTP");
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
          <h2>Sign In</h2>
          <p className="sub-text">to access your account</p>

          {/* Step 1: Email/Phone Input */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Email address or mobile number"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
              />

              {/* Error message display */}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">Continue</button>
            </form>
          )}

          {/* Step 2: OTP Input */}
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
              {/* Error message display */}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">Verify OTP</button>
            </form>
          )}

          <div className="divider">or</div>

          {/* Google Sign-In Button */}
          <button className="google-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt="google"
            />
            Sign in with Google
          </button>

          <p className="footer-text">
            New here? <span>Contact Us</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;