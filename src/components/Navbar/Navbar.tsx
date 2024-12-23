import React, { useEffect, useState } from "react";
import Link from "next/link";

import { auth, firestore } from "@/firebase/firebase"
import { TfiAgenda } from "react-icons/tfi";
import { FaChevronLeft, FaChevronRight, FaPencilAlt, FaRegLightbulb } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { authModelState } from "@/atoms/authModelAtom";
import router, { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { CgProfile } from "react-icons/cg";
import Logout from "@/components/Buttons/Logout"
import Image from "next/image"
import { BsList, BsPencil } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { doc, getDoc } from "firebase/firestore";
import { TiPencil } from "react-icons/ti";


type NavbarProps = {
    problemPage?: boolean;
};

const Navbar:React.FC<NavbarProps> = ({problemPage}) => {

    const setAuthModelState=useSetRecoilState(authModelState);
    const router = useRouter();
    const [user] = useAuthState(auth);
    const admin = getUserAdmin();
    const handleClick = () => {
        router.push("/auth");
    }
    return (
        <nav className="relative h-[50px] w-full shrink-0 items-center px-5 bg-[#1f1f1f] text-white text-lg font-sans font-semibold drop-shadow-lg z-200">
            <div className={`flex w-full items-center justify-between`}>
                <div className="justify-start flex align-middle items-center">
                    <a href="/" className="mr-1"><Image src="/whitelogo.svg" alt='logo' height={53} width={140}/></a>
                    <span className="align-middle border-r-[3px] pr-[3px] w-[1px] h-[32px] mr-[1px] border-white opacity-15"></span>
                    <a className="text-center px-2 py-3 hover:bg-black inline-block align-middle" href="/problems"><TfiAgenda className="inline-block mb-1"/> PROBLEMS </a>
                    <span className="align-middle border-r-[3px] pr-[3px] w-[1px] h-[32px] mr-[1px] border-white opacity-15"></span>
                    <a className="text-center px-2 py-3 hover:bg-black inline-block align-middle" href="/tips/"><FaRegLightbulb className="inline-block mb-1"/> TIPS</a>
                    <span className="align-middle border-r-[3px] pr-[3px] w-[1px] h-[32px] mr-[1px] border-white opacity-15"></span>
                    {admin && <>
                        <a className="text-center px-2 py-3 hover:bg-black inline-block align-middle" href="/publish/"><BsPencil className="inline-block mb-1"/> PUBLISH</a>
                        <span className="align-middle border-r-[3px] pr-[3px] w-[1px] h-[32px] mr-[1px] border-white opacity-15"></span>
                    </>}
                </div>
                {/* {problemPage && 
                    <div className="flex flex-1 items-center gap-4 justify-center text-center">
                        <div className="flex items-center justify-center rounded bg-[#333333] hover:bg-[#292929] h-9 w-8 cursor-pointer">
                            <FaChevronLeft/>
                        </div>
                        <Link href="/problems" className="flex items-center gap-2 font-medium max-w-[170px] text-[#ffffff] cursor-pointer">
                            <div>
                                <BsList/>
                            </div>
                            <p>Problem List</p>
                        </Link>
                        <div className="flex items-center justify-center rounded bg-[#333333] hover:bg-[#292929] h-9 w-8 cursor-pointer">
                            <FaChevronRight/>
                        </div>
                    </div>
                } */}
                
                {user && problemPage && <Timer/>}

                <div className="flex items-center space-x-4 flex-1 justify-end">
                    {!user && (
                        <div className='inline-block items-center float-right align-middle'>
                        <a href="/auth">
                    <button className='mr-5 my-2 bg-dark-layer-1 text-white py-1 px-4 rounded-md text-sm font-medium
                    hover:text-black hover:bg-white hover-border-2 hover:border-gray border-4 border-white transition duration-300 ease-in-out' >Sign In</button>
                    </a>
                    </div>
                    )}
                    
                    {user && (
                        <div className = "group relative justify-right py-2 flex">
                        <CgProfile font-size={"36"} />
                        <div className="absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-black text-white p-2 rounded shadow-lg z-auto group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out">
                            <p className="text-sm z-10">{user.email}</p>
                        </div>
                        </div>
                    )}
                    {user && <Logout/>}
                    
                </div>
                
            </div>  
        </nav>
    
    );
}
export default Navbar;

function getUserAdmin(){
	const [data,setData] = useState(false);
	const [user] = useAuthState(auth);
	useEffect(()=>{
		const getIfUserAdmin = async() =>{
			console.log("in func")
			const userRef = doc(firestore,"users",user!.uid);
			const userSnap = await getDoc(userRef);
			console.log(userSnap);
			if(userSnap.exists()){
				console.log("in if")
				const data = userSnap.data();
				console.log(data)
				const {isAdmin} = data;
				console.log(isAdmin)
				setData(isAdmin || false);
			}
		}
		if(user) getIfUserAdmin();
		return () => setData(false);
	},[user])
	return data;
}