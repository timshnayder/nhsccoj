import React, { useEffect } from "react";
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import { IoIosCloseCircle } from "react-icons/io";

import { authModelState } from '@/atoms/authModelAtom';
import { useRecoilValue, useSetRecoilState } from "recoil";

type AuthModelProps = {
    
};

const AuthModel:React.FC<AuthModelProps> = () => {
    const authModel = useRecoilValue(authModelState);
	const closeModel = useCloseModel();
    
    return (
        <>
            <div className='fixed  w-full h-full flex items-center justify-center'>
			<div className='w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-70%]  flex justify-center items-center'>
				<div className='relative w-full h-full mx-auto flex items-center justify-center'>
					<div className='rounded-lg shadow relative w-full bg-[#0c0c0c] mx-6'>
						<div className='flex justify-end p-2'>
							{/* <button
								type='button'
								className='bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
								hover:bg-gray-800 hover:text-white text-white'
							>
							<IoIosCloseCircle className="h-6 w-6" />
							</button> */}
						</div>
						{authModel.type ==="login" ? <Login/> : authModel.type === "register" ? <Signup/> : <ResetPassword/>}
					</div>
				</div>
			</div>
			</div>
		</>
    )
}
export default AuthModel;

function useCloseModel(){
	const setAuthModelState=useSetRecoilState(authModelState);
	const closeModel = () => {
		setAuthModelState((prev) => ({...prev, isOpen:false, type:"login"}));
	};

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => { 
			if(e.key === "Escape") closeModel();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	},[]);

	return closeModel;
}