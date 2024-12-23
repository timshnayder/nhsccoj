import { authModelState } from '@/atoms/authModelAtom';
import { auth } from '@/firebase/firebase';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModelState = useSetRecoilState(authModelState);
    const handleClick = (type: "login" | "register" | "forgotPassword") => {
        setAuthModelState((prev) => ({...prev, type}));
    }
    const [inputs, setInputs] = useState({email:"", password:""});
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    }
    
    const handleLogin = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!inputs.email || !inputs.password) return alert("Please fill all fields");
        try{
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
            if(!newUser) return;
            router.push("/");
        } catch(error: any){
            alert(error.message);
        }
    }
    
    useEffect(() =>{
        if(error) alert(error.message);
    },[error]);

    return <form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
        <h3 className="text-xl font-medium text-white">Sign in to NHSCC:OJ</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
                Your Email
            </label>
            <input onChange={handleInputChange} type="email" name="email" id="email" 
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-600 placeholder-gray-400 text-white"
            placeholder="name@domain.com" />
        </div>

        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
                Your Password
            </label>
            <input onChange={handleInputChange} type="password" name="password" id="password" 
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Password" />
        </div>
        
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
        text-sm px-5 py-2.5 text-center bg-blue-800 hover:bg-blue-900">
            {loading ? "Loading..." : "Login"}
        </button>

        <div className="flex">
            <button className="w-full justify-start" onClick={() => handleClick("register")}>
            <a href="#" className="text-blue-600 text-medium block hover:underline w-full text-left">Register</a>
            </button>

            <button className="w-full justify-end" onClick={() => handleClick("forgotPassword")} >
            <a href="#" className="text-blue-600 text-medium block hover:underline w-full text-right">Forgot Password?</a>
            </button>
            
        </div>

    </form>
}
export default Login;