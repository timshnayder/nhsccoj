import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authModelState } from '@/atoms/authModelAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import router, { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import AuthModel from '@/components/Models/AuthModel';
import SnowParticlesComponent from '@/components/Particles/snow';

type AuthPageProps = {
    
};

const AuthPage:React.FC<AuthPageProps> = () => {
    const authModel = useRecoilValue(authModelState);
    const [user,loading,error] = useAuthState(auth);
    const router = useRouter();
    const [pageLoading,setPageLoading] = useState(true);

    useEffect(()=>{
        if(user) router.push("/");
        if(!loading && !user) setPageLoading(false);
    }, [user,router,loading])
    
    if(pageLoading) return null;

    return (
        
        <div className="">
            <Navbar/>
            <SnowParticlesComponent/>
            <AuthModel/>
        </div>
        
    )
}
export default AuthPage;