import React, { useState } from 'react';
import Split from 'react-split';
import { Problem } from '@/utils/types/problem';
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';
import { User } from '@/utils/types/user';

type WorkspaceProps = {
    user:User;
};

const Workspace:React.FC<WorkspaceProps> = ({user}) => {
    const {width,height}=useWindowSize();
    const [success,setSuccess] = useState(false);
    const [solved, setSolved] = useState(false);
    return <>
        <div className='text-white'>User Profile</div>
        <div>{user.displayName}</div>
        <div>{user.email}</div>
    </>
}
export default Workspace;