import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // const [isEmailSent, setIsEmailSent] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const { backendUrl } = useContext(AppContext); 
   
  axios.defaults.withCredentials = true;


  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArrey = paste.split('');
    pasteArrey.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email })
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Error sending reset OTP:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

//   const onSubmitEmail = async (e) => {
//   e.preventDefault();
//   try {
//     const { data } = await axios.post(
//       `${backendUrl}/api/auth/send-reset-otp`,
//       { email },
//       { timeout: 30000 } 
//     );

//     console.log("OTP Response:", data);

//     if (data.success) {
//       toast.success(data.message);
//       setIsEmailSent(true);
//     } else {
//       toast.error(data.message);
//     }

//   } catch (error) {
//     console.log("ERROR:", error);
//     toast.error(error.response?.data?.message || error.message);
//   }
// };

  const onSubmitOTP = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map(el => el.value);
    const finalOtp = otpArray.join('');

    setOtp(finalOtp); 
    setIsOtpSubmited(true); 
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");

    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-800'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'></img>

     
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-green-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>

          <p className='text-center mb-6 text-green-200'>
            Enter your registered email address
          </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c0e2c8]'>
            <img src={assets.mail_icon} alt='' className='filter brightness-0' />

            <input
              type='email'
              placeholder='Email id'
              className='bg-transparent outline-none text-black placeholder-gray-600'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full mt-3'>
            Submit
          </button>

        </form>
      }

      {/*otp input form  */}

      {!isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitOTP} className='bg-green-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
          <p className='text-center mb-6 text-green-200'>Enter the 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#c0e2c8] text-black text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              ></input>
            ))}
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-green-500 to-green-700 rounded-full text-white'>Submit</button>
        </form>
      }

      {/* Enter new password */}

      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-green-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-green-200'>Enter the new password below</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c0e2c8]'>
            <img src={assets.lock_icon} alt='' className='filter brightness-0' />
            <input type='password' placeholder='Password' className='bg-transparent outline-none text-black placeholder-gray-600' value={newPassword} onChange={e => setNewPassword(e.target.value)} required></input>
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full mt-3'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword
