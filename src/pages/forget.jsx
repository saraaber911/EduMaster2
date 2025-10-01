import React, { useState } from "react";
import { GiGraduateCap } from "react-icons/gi";

export default function Forget(){
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle email submission (Step 1)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('https://edu-master-psi.vercel.app/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.debug('Forgot-password status:', res.status, res.statusText);

      const contentType = res.headers.get('content-type') || '';

      if (res.ok) {
        // handle JSON or plain text success responses
        if (contentType.includes('application/json')) {
          try {
            const data = await res.json();
            setSuccess(data.message || 'OTP sent to your email successfully!');
          } catch {
            setSuccess('OTP sent to your email successfully!');
          }
        } else {
          const txt = await res.text();
          setSuccess(txt || 'OTP sent to your email successfully!');
        }
        
        // Move to OTP verification step
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 1500);
        
      } else {
        // non-OK response: try JSON, otherwise read text and show status
        let errMsg = `Request failed: ${res.status} ${res.statusText}`;
        if (contentType.includes('application/json')) {
          try {
            const errData = await res.json();
            errMsg = errData.message || JSON.stringify(errData) || errMsg;
          } catch {
            // fallthrough to text
          }
        } 
        if (!contentType.includes('application/json')) {
          try {
            const txt = await res.text();
            if (txt) errMsg = txt;
          } catch(err) {
            console.log(err)
          }
        }
        setError(errMsg);
      }
    } catch (err) {
      console.error(err);
      setError('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP verification (Step 2) - Just move to next step
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      setSubmitting(false);
      return;
    }

    // Since there's no separate OTP verification endpoint,
    // we'll just validate the format and move to password reset
    setSuccess('Code format is valid. Please set your new password.');
    setTimeout(() => {
      setStep(3);
      setSuccess('');
      setSubmitting(false);
    }, 1500);
  };

  // Handle password reset (Step 3)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('https://edu-master-delta.vercel.app/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp: otp.join(''), 
          newPassword,
          cpassword: confirmPassword
        }),
      });

      console.debug('Password reset status:', res.status, res.statusText);
      const contentType = res.headers.get('content-type') || '';

      if (res.ok) {
        if (contentType.includes('application/json')) {
          try {
            const data = await res.json();
            setSuccess(data.message || 'Password reset successfully! You can now login with your new password.');
          } catch {
            setSuccess('Password reset successfully! You can now login with your new password.');
          }
        } else {
          const txt = await res.text();
          setSuccess(txt || 'Password reset successfully! You can now login with your new password.');
        }
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        
      } else {
        let errMsg = `Password reset failed: ${res.status} ${res.statusText}`;
        if (contentType.includes('application/json')) {
          try {
            const errData = await res.json();
            errMsg = errData.message || JSON.stringify(errData) || errMsg;
          } catch {
            // fallthrough to text
          }
        }
        if (!contentType.includes('application/json')) {
          try {
            const txt = await res.text();
            if (txt && !txt.includes('<!DOCTYPE')) {
              errMsg = txt;
            }
          } catch(err) {
            console.log(err);
          }
        }
        setError(errMsg);
      }
    } catch (err) {
      console.error(err);
      setError('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit}>
            <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-sm text-gray-500 mb-6">Enter the Email associated with your account and we will send you a reset link</p>

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              type="email"
              required 
            />

            <button 
              className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 shadow-md hover:from-blue-500 hover:to-blue-600 transition" 
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit}>
            <h1 className="text-3xl font-bold mb-2">Enter Verification Code</h1>
            <p className="text-sm text-gray-500 mb-6">We sent a 6-digit code to {email}</p>

            <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit code</label>
            <div className="flex gap-2 mb-4 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      if (prevInput) prevInput.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button 
              className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 shadow-md hover:from-blue-500 hover:to-blue-600 transition mb-3" 
              disabled={submitting}
            >
              {submitting ? 'Verifying...' : 'Verify Code'}
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-blue-500 text-sm hover:underline"
            >
              Back to Email
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit}>
            <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
            <p className="text-sm text-gray-500 mb-6">Create a new password for your account</p>

            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input 
              className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100" 
              type="password"
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Enter new password" 
              required 
              minLength="6"
            />

            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100" 
              type="password"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirm new password" 
              required 
              minLength="6"
            />

            <button 
              className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 shadow-md hover:from-blue-500 hover:to-blue-600 transition mb-3" 
              disabled={submitting}
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>

            <button 
              type="button"
              onClick={() => setStep(2)}
              className="text-blue-500 text-sm hover:underline"
            >
              Back to OTP
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-bg)]">
      <div className="bg-white rounded-2xl p-8 w-[420px] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-gray-50 bg-[var(--primary)] p-3 w-10 h-10 flex items-center justify-center rounded-lg">
            <GiGraduateCap className="text-white w-8 h-8" />
          </div>
          <div className="text-lg font-bold">EduPortal</div>
        </div>

        {renderStepContent()}

        {error && <div className="text-red-600 mb-3 mt-4">{error}</div>}
        {success && <div className="text-green-600 mb-3 mt-4">{success}</div>}

        {step === 1 && (
          <a className="text-blue-500 items-center text-sm mt-4 block" href="/login">
            Back To Login
          </a>
        )}
      </div>
    </div>
  );
}