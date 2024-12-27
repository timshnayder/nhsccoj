
import { problems } from '@/mockProblems/problems';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs'
import { AiFillYoutube } from 'react-icons/ai'
import { auth, firestore } from '@/firebase/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
type ProblemsTableProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
};

const ProblemsTable:React.FC<ProblemsTableProps> = ({setLoadingProblems}) => {
    
    const problems = useGetProblems(setLoadingProblems)
    const solvedProblems = useGetSolvedProblems();

    return (
        <tbody className='text-white'>
            {problems?.map((problem,idx) => {
                const difficultyColor = problem.difficulty === "Easy" ? "text-green-500" : problem.difficulty === "Medium" ? "text-yellow-600"  : "text-red-700";
                return(
                    <tr className={`${idx % 2 == 1? "bg-dark-fill-3" : "bg-dark-fill-2"}`} key={problem.id}>
                        <th className="text-center align-middle px-3 font-medium whitespace-nowrap text-green border-[#444] border-l-[1px] border-r-[1px] border-b-[1px] border-t-[1px]">
                            {solvedProblems.includes(problem.id) && <BsCheckCircle fontSize={"18"} width={"18"}/>}
                        </th>
                        <td className='text-nowrap px-4 py-2 w-[320px] border-[#444] border-l-[1px] border-r-[1px] border-b-[1px] border-t-[1px]'>
                            {problem.link ? (
                                <Link href={problem.link} className='hover:text-blue-600 cursor-pointer' target="_blank">
                                    {problem.title}
                                </Link>
                            ) : 
                            <Link className="hover:text-blue-600 cursor-pointer" href={`/problem/${problem.id}`}>
                                {problem.title}
                            </Link>
                            }
                        </td>
                        <td className={`text-nowrap px-6 py-1 ${difficultyColor} font-bold border-[#444] border-l-[1px] border-r-[1px] border-b-[1px] border-t-[1px]`}>
                                {problem.difficulty}
                        </td>
                        <td className={`px-6 py-1 w-[200px] border-[#444] border-l-[1px] border-r-[1px] border-b-[1px] border-t-[1px]`}>
                                {problem.category}
                        </td>
                        <td className={`text-nowrap px-6 py-1 border-[#444] border-l-[1px] border-r-[1px] border-b-[1px] border-t-[1px]`}>
                               {problem.editorial ? (<Link href='{problem.editorial}'>Editorial</Link>) : (<p>No Editorial</p>)}
                        </td>
                    </tr>
                )
            })
            }
        </tbody>
    )
}
export default ProblemsTable;

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>){
    const [problems, setProblems] = useState<Problem[]>([]);
    useEffect(() => {
        const getProblems = async() => {
            setLoadingProblems(true);
            const q = query(collection(firestore,"problems"),orderBy("title","desc"))
            const querySnapshot = await getDocs(q);
            const tmp: Problem[] = [];
            querySnapshot.forEach((problem)=>{
                
                tmp.push({id:problem.id,...problem.data()} as Problem)
            })
            setProblems(tmp);
            setLoadingProblems(false);
        }

        getProblems();
    },[])
    return problems;
}

function useGetSolvedProblems(){
    const [solvedProblems,setSolvedProblems] = useState<string[]>([]);
    const [user] = useAuthState(auth);
    useEffect(() => {
        const getSolvedProblems = async () =>{
            const userRef = doc(firestore, "users", user!.uid);
            const userDoc = await getDoc(userRef);

            if(userDoc.exists()){
                setSolvedProblems(userDoc.data().solvedProblems);
            }

        }
        if(user)getSolvedProblems();
    },[user])
    return solvedProblems;
}