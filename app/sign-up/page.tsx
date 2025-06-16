'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineMail, AiOutlineLock, AiOutlineGoogle, AiFillFacebook, AiOutlineArrowLeft } from 'react-icons/ai';
import '../styles/auth.css';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('Register with:', email, password);
  }

  const router = useRouter()

  return (
    <div className="auth-container">
      <div className="back-button-container">
        <button onClick={() => router.push('/')} className="back-button">
          <AiOutlineArrowLeft size={22} />
          <span>Back</span>
        </button>
      </div>
      <div className="auth-card">
        <div className="auth-left-panel">
          <div className="skew-shape-1"></div>
          <div className="skew-shape-2"></div>
          <div className="skew-shape-3"></div>
          <div className="left-panel-content">
            <h2 className="left-panel-title">SIGN UP</h2>
            <a href="/log-in" className="left-panel-subtitle">LOGIN</a>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="logo-container">
            <h1 className="signup-title">Sign Up</h1>
          </div>

          <form onSubmit={handleSignUp} className="form-spacing">
            <div className="input-wrapper">
              <span className="input-icon"><AiOutlineMail size={20} /></span>
              <input
                type="email"
                placeholder="Email"
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <span className="input-icon"><AiOutlineLock size={20} /></span>
              <input
                type="password"
                placeholder="Password"
                className="text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <span className="input-icon"><AiOutlineLock size={20} /></span>
              <input
                type="password"
                placeholder="Confirm Password"
                className="text-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <div className="form-footer">
              <div></div>
              <button type="submit" className="auth-button">SIGN UP</button>
            </div>
          </form>

          <div className="or-divider">
            <p className="social-login-text">Or sign up with</p>
            <div className="social-buttons">
              <button className="social-button"><AiOutlineGoogle size={24} className="google-icon" /> Google</button>
              <button className="social-button"><AiFillFacebook size={24} className="facebook-icon" /> Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
