import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState("Sign Up");
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const onSubmitHandler = async (e) => {
  //   try {
  //     e.preventDefault();

  //     axios.defaults.withCredentials = true;

  //     if (state === 'Sign Up') {
  //       const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });

  //       if (data.success) {
  //         localStorage.setItem("token", data.token);
  //         setIsLoggedin(true);
  //         getUserData(); // 🔥 ADD THIS
  //         navigate('/')
  //       }
  //       else {
  //         toast.error(data.message)
  //       }
  //     } else {
  //       const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });

  //       // if (data.success) {
  //       //   localStorage.setItem("token", data.token);
  //       //   setIsLoggedin(true);
  //       //   navigate('/')
  //       // }
  //       if (data.success) {
  //         localStorage.setItem("token", data.token);
  //         setIsLoggedin(true);
  //         getUserData(); // 🔥 ADD THIS
  //         navigate('/')
  //       }
  //       else {
  //         toast.error(data.message)
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(data.message)
  //   }
  // }

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    axios.defaults.withCredentials = true;

    if (state === 'Sign Up') {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
        name, email, password
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }

    } else {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email, password
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  return (
   
     <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-green-200 to-green-800'>
      <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'></img>
      
      <div className='bg-green-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-green-200 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your Account' : 'Login to your account'}</p>

        <form onSubmit={onSubmitHandler}>

          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c0e2c8] text-black'>
              <img src={assets.person_icon} alt="" className='filter brightness-0'></img>
              <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none text-black placeholder-gray-600'  type='text' placeholder='Full Name'></input>
            </div>
          )}


          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c0e2c8]'>
            <img src={assets.mail_icon} alt="" className='filter brightness-0'></img>
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-black placeholder-gray-600'  type='email' placeholder='Email id'></input>
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c0e2c8]'>
            <img src={assets.lock_icon} alt="" className='filter brightness-0'></img>
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none text-black placeholder-gray-600'  type='password' placeholder='password'></input>
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-green-200 cursor-pointer'>Forget password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-medium'>{state}</button>
        </form>

        {state === 'Sign Up' ?
          (<p className='text-green-100 text-center text-xs mt-4'>Already have an account{' '}
            <span onClick={() => setState('Login')} className='text-green-400 cursor-pointer underline'>Login here</span>
          </p>)
          : (<p className='text-green-100 text-center text-xs mt-4'>Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-green-400 cursor-pointer underline'>Sign up</span>
          </p>)}

      </div>
    </div>
  )
}

export default Login
