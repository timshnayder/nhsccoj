import Navbar from '@/components/Navbar/Navbar';
import React from 'react';


type pageProps = {
    
};

const page:React.FC<pageProps> = () => {
    
    return (
        <div className='bg-[#dfdfdf] min-h-screen'>
            <Navbar></Navbar>
            <div className='mx-80 bg-[#b9b9b9] min-h-screen border-[#000000] border-x-4'>
                <div className='p-10'>
                <h1 className='text-4xl'>Tips</h1>
                <p>c++ tips test</p>
                </div>
            </div>
        </div>
        
    )
}
export default page;