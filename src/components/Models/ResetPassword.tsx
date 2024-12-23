import { authModelState } from "@/atoms/authModelAtom";
import { auth } from "@/firebase/firebase";
import React, { useState, useEffect } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

import { useSetRecoilState } from "recoil";

type ResetPasswordProps = {};

const ResetPassword:React.FC<ResetPasswordProps> = () => {
    
	const [email, setEmail] = useState("");
	const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

	const setAuthModelState = useSetRecoilState(authModelState);
	const handleClick = () => {
		setAuthModelState((prev) => ({ ...prev, type: "login" }));
	};
    
	const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await sendPasswordResetEmail(email);
		if (success) {
			toast.success("Password reset email sent", { position: "top-center", autoClose: 3000, theme: "dark" });
		}
	};
	useEffect(()=>{
		if(error){
			toast.error(error.message, {position: 'top-center', autoClose: 3000, theme: 'dark'});
		}
	},[error])

    return (
		<>
        <form className='space-y-6 px-6 pb-4' onSubmit={handleReset}>
			<h3 className='text-xl font-medium  text-white'>Reset Password</h3>
			<p className='text-sm text-white '>
				Forgotten your password? Enter your e-mail address and we&apos;ll send you an e-mail allowing you
				to reset it.
			</p>
			<div>
				<label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
					Your email
				</label>
				<input
					type='email'
					name='email'
					onChange={(e)=> setEmail(e.target.value)}
					id='email'
					className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
					placeholder='name@domain.com'
				/>
			</div>

			<button
				type='submit'
				className={`w-full text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                bg-blue-700 hover:bg-blue-800 `}
			>
				Reset Password
			</button>

			<div className='flex'>
        	<button className="w-full justify-start" onClick={handleClick}>
            	<a href="#" className="block font-medium text-blue-600 hover:underline text-left">Log in</a>
        	</button>
			
        	</div>

			

		</form>
		</>
    )
}
export default ResetPassword;