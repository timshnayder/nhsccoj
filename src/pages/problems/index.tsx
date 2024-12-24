import React, { useState } from 'react';
import ProblemsTable from '@/components/ProblemsTable/ProblemsTable';
import Navbar from '@/components/Navbar/Navbar';
import LinksParticlesComponent from '@/components/Particles/links';
import useHasMounted from '@/hooks/useHasMounted';
import { FaCheck } from 'react-icons/fa';

type ProblemsPageProps = {
    
};

const ProblemsPage:React.FC<ProblemsPageProps> = () => {
    const [loadingProblems, setLoadingProblems] = useState(true);
	const hasMounted=useHasMounted(); if(!hasMounted){return null};
    return (
        <>
        <main className='bg-dark-layer-2 min-h-screen'>
        <Navbar/>
		{/* <LinksParticlesComponent/> */}
        <h1 className='text-2xl text-center text-white font-bold mt-10 mb-5'>PROBLEMS</h1>
        <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
			{loadingProblems && (
				<div className='max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse'>
					{[...Array(10)].map((_,idx)=>(
						<LoadingSkeleton key={idx}/>
					))}
					
				</div>
			)}
			<table className='text-sm text-left text-gray-500 dark:text-gray-400 max-w-[1200px] mx-auto'>
				{!loadingProblems && (
					<thead className='text-xs text-gray-700 uppercase dark:text-gray-400 bg-[#0c0c0c] '>
					<tr>
						<th scope='col' className='px-3 py-3 w-0 font-medium'>
							<FaCheck />
						</th>
						<th scope='col' className='px-6 py-3 w-0 font-medium'>
							Title
						</th>
						<th scope='col' className='px-6 py-3 w-0 font-medium'>
							Difficulty
						</th>

						<th scope='col' className='px-6 py-3 w-0 font-medium'>
							Category
						</th>
						<th scope='col' className='px-6 py-3 w-0 font-medium'>
							Solution
						</th>
					</tr>
				</thead>
				)}
				<ProblemsTable setLoadingProblems={setLoadingProblems}/>
			</table>
          </div>
          </main>
          </>
        
    )
}
export default ProblemsPage;

const LoadingSkeleton = () => {
	return(
		<div className='flex items-center space-x-12 mt-4 px-6'>
			<div className='w-6 h-6 shrink-0 rounded-full bg-dark-layer-1'></div>
			<div className='w-32 h-4 sm:w-52 rounded-full bg-dark-layer-1'></div>
			<div className='w-32 h-4 sm:w-52 rounded-full bg-dark-layer-1'></div>
			<div className='w-32 h-4 sm:w-52 rounded-full bg-dark-layer-1'></div>
			<span className='sr-only'>Loading...</span>
		</div>
	)
}