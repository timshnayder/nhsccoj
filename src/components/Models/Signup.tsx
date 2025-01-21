import React from 'react';
import { useEffect, useState } from "react";
import { authModelState } from '@/atoms/authModelAtom';
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
type SignupProps = {};

const Signup:React.FC<SignupProps> = () => {
    const setAuthModelState = useSetRecoilState(authModelState);
	const handleClick = () => {
		setAuthModelState((prev) => ({ ...prev, type: "login" }));
	};
    const [inputs, setInputs] = useState({email:"",displayName:"",password:""});
    const router = useRouter();
    const [
createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);
    
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.displayName! || !inputs.password){
            return toast.error("Please fill all fields", {position: 'top-center', autoClose: 3000, theme: 'dark'});
        }
        try{
            toast.loading("Creating your account", {position:"top-center", toastId:"loadingToast"})

            // Check if email or displayName is already taken
            const emailQuery = query(
                collection(firestore, "users"),
                where("email", "==", inputs.email)
            );
            const displayNameQuery = query(
                collection(firestore, "users"),
                where("displayName", "==", inputs.displayName)
            );

            const [emailSnapshot, displayNameSnapshot] = await Promise.all([
                getDocs(emailQuery),
                getDocs(displayNameQuery),
            ]);

            if (!emailSnapshot.empty) {
                return toast.error("Email is already in use", {position: 'top-center', autoClose: 3000, theme: 'dark'});
            }

            if (!displayNameSnapshot.empty) {
                return toast.error("Display name is already in use", {position: 'top-center', autoClose: 3000, theme: 'dark'});
            }

            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
            if(!newUser) return;
            const userData = {
                uid: newUser.user.uid,
                email: newUser.user.email,
                displayName: inputs.displayName,
                createdAt:Date.now(),
                updatedAt:Date.now(),
                likedProblems:[],
                dislikedProblems:[],
                starredProblems:[],
                solvedProblems:[],
                isAdmin: false,
                language: "cpp",
            }
            await setDoc(doc(firestore,"users", userData.uid), userData)
            router.push("/");
        } catch(error:any){
            toast.error(error.message,{position:"top-center"})
        }finally{
            toast.dismiss("loadingToast")
        }
    }

    useEffect(() => {
        if(error) {
            console.log(error);
            if(error.code === "auth/invalid-email"){
                toast.error("Please input a valid email", {position: 'top-center', autoClose: 3000, theme: 'dark'});
            }else if(error.code === "auth/weak-password"){
                toast.error("Password should be at least 6 characters", {position: 'top-center', autoClose: 3000, theme: 'dark'});
            }
            else{
                toast.error(error.message, {position: 'top-center', autoClose: 3000, theme: 'dark'});
            }
            
            
        }
    }, [error])
    
    return (
        <form className="space-y-6 px-6 pb-4" onSubmit={handleRegister} noValidate>
        <h3 className="text-xl font-medium text-white">Register to NHSCC:OJ</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
                Email
            </label>
            <input onChange={handleChangeInput}
            type="email" name="email" id="email" 
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-600 placeholder-gray-400 text-white"
            placeholder="name@domain.com" />
        </div>

        <div>
            <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">
                Display Name
            </label>
            <input onChange={handleChangeInput} type="displayName" name="displayName" id="displayName" 
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-600 placeholder-gray-400 text-white"
            placeholder="ArthurIsAPeriwinkle123" />
        </div>

        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
                Password
            </label>
            <input onChange={handleChangeInput} type="password" name="password" id="password" 
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Password" />
        </div>
        
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
        text-sm px-5 py-2.5 text-center bg-blue-800 hover:bg-blue-900">
            {loading ? "Registering..." : "Register"}
        </button>

        <div className='flex'>
        <button className="w-full justify-start" onClick={handleClick}>
            <a href="#" className="block font-medium text-blue-600 hover:underline text-left">Log in</a>
        </button>

        
        </div>
        

        </form>
    )
};
export default Signup;