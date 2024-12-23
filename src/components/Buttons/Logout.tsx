
import { auth } from '@/firebase/firebase';
import React from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';

import { FiLogOut} from "react-icons/fi"
type LogoutProps = {};

const Logout:React.FC<LogoutProps> = () => {
    const [signOut, loading, error] = useSignOut(auth);
    const handleLogout = () => {
        signOut();
    }
    return (
        <button className='cursor-pointer rounded bg-black py-1.5 px-3 text-#ffcc00' onClick={handleLogout}>
            <FiLogOut font-size={"20"}/>
        </button>
    )
}
export default Logout;