'use client'

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import PasswordInput from '../components/passInput';
import { urlApi } from '../../../urlApi';
import { GoogleLogin } from '@react-oauth/google';
import Loader from '../components/loader';

export default function Login(){

  const [isAnnual, setIsAnnual] = useState(true);
  const [loginInfo, setLoginInfo] = useState<{ credential: string, password: string }>({credential: "", password: ""});
  const [registerInfo, setRegisterInfo] = useState<{credential: string, register: boolean}>({credential: "", register: true});
//   const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const notify = (text: string) => toast.error(text , {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });


  const postUser = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    
    try {
      const response = await fetch(`${urlApi.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(loginInfo)
      });
  
      if (!response.ok) {
        setLoading(false);
        const teste = await response.json()
        notify(teste.error)
        throw new Error('Failed to log in');
      }

      const userData = await response.json();

      localStorage.setItem('user', userData.account.name)
      localStorage.setItem('token', userData.token)
      localStorage.setItem('id', userData.account.id)
      localStorage.setItem('email', userData.account.email)
      localStorage.setItem('number', userData.account.cellphone)
      localStorage.setItem('cep', userData.account.cep)
      localStorage.setItem('pfpUrl', userData.account.pfpUrl)

    //   setUserData(userData);
      setLoading(false);
      router.push('/home')
    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const postUserGoogle = async (response: Response) => {
    if (!response.ok) {
      setLoading(false);
      const teste = await response.json()
      notify(teste.error)
      throw new Error('Failed to log in');
    }

    const userData = await response.json();

    localStorage.setItem('user', userData.account.name)
    localStorage.setItem('token', userData.token)
    localStorage.setItem('id', userData.account.id)
    localStorage.setItem('email', userData.account.email)
    localStorage.setItem('number', userData.account.cellphone)
    localStorage.setItem('cep', userData.account.cep)
    localStorage.setItem('pfpUrl', userData.account.pfpUrl)

    // setUserData(userData);
    setLoading(false);
    router.push('/home')
  }
  
  const sendEmailCode = async (e: { preventDefault: () => void; }) => {
    setLoading(true)
    e.preventDefault();

    try {
      const response = await fetch(`${urlApi.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(registerInfo)
      });
  
      if (!response.ok) {
        setLoading(false);
        const teste = await response.json()
        notify(teste.error)
        throw new Error('Failed to log in');
      }
  
      const userData = await response.json();
    //   setUserData(userData);
      setLoading(false);
      router.push(`/code?email=${registerInfo.credential}`)

    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const forgotPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${urlApi.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({credential: loginInfo.credential, register: false})
      });
  
      if (!response.ok) {
        setLoading(false)
        const teste = await response.json()
        notify(await teste.error)
        return;
      }
  
      const userData = await response.json();
    //   setUserData(userData);
      setLoading(false);
      router.push(`/code?email=${loginInfo.credential}`)

    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const sendEmailCodeGoogle = async (response: { ok: string; json: () => any }) => {
    setLoading(true)

    if (!response.ok) {
      setLoading(false);
      const teste = await response.json()
      notify(teste.error)
      return
    }

    const userData = await response.json();

    console.log(userData)

    // setUserData(userData);
    setLoading(false);
    router.push(`/code?email=${userData.email}`)
  };
  
  return (
    <>{ loading || typeof window == "undefined" ? <Loader/> : null }<div className="w-full lg:flex lg:flex-col lg:justify-center lg:items-center h-screen bg-black p-5 relative bg-[url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1756381953/Image_3_gdeaea.jpg)] bg-cover bg-center">
        <div className="absolute h-screen inset-0 bg-[#14141457] lg:flex lg:flex-col lg:justify-center lg:items-center flex items-center justify-center">
        <div className='w-full flex justify-between pt-[20px] z-10 absolute top-0'>
          <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png" width={60} height={110} alt="logo" className='text-white ml-[100px] md:block hidden ' />
          <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png" width={40} height={90} alt="logo" className='text-white ml-[20px] block md:hidden' />
        </div>
      <div className='px-10 rounded-sm py-10 bg-black/60 '>
        <form onSubmit={(e) => { postUser(e); } }>
          <h1 className='text-white md:text-[32px] text-[24px] font-bold mb-5'>Entrar</h1>
          <div className="grid gap-6 lg:w-96">
            <div>
              <input type="mail" id="email" onChange={(event) => { setLoginInfo({ ...loginInfo, credential: event.target.value }); setRegisterInfo({ ...registerInfo, credential: event.target.value }); } } className="border border-gray-400 text-white placeholder-gray-300 text-sm rounded-[3px] h-13 bg-transparent block w-full p-2.5" placeholder="Email ou número de celular" required />
            </div>
            <div>
              <PasswordInput setPasswordInfo={setLoginInfo} passwordInfo={loginInfo} specificVar={'password'} />
            </div>
          </div>
          <div className='w-full flex justify-end'>
            <span className="pt-2 text-sm cursor-pointer font-medium text-white" onClick={() => {  } }>Esqueceu a senha?</span>
          </div>
          <div className='w-full mb-8'>
            <button type="submit" className="text-white mt-5 mb-5 h-10 bg-red-600 focus:ring-4 focus:outline-none  font-medium rounded-xs text-sm w-full px-5 py-2.5 text-center">Entrar</button>
            <GoogleLogin
                text='signup_with'
                onSuccess={ async (credentialResponse) => {
                    const response = await fetch(`${urlApi.API_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential: credentialResponse.credential, register: true }),
                    });
                    postUserGoogle(response)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                />
            </div>
        </form>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />

      </div>
    </div>
    </div></>
  );
}  
