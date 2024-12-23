import Head from 'next/head'
import Navbar from '@/components/Navbar/Navbar'
import LinksParticlesComponent from '@/components/Particles/links'
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import useHasMounted from '@/hooks/useHasMounted';

export default function Home() {
  const hasMounted = useHasMounted();
  if(!hasMounted) return null;
  return (
    <>

    <Navbar/>
    <LinksParticlesComponent/>
    <div className='text-center'>
      <h1 className='select-none text-2xl text-white mt-[200px] '> Welcome to </h1>
      <h1 className='select-none text-9xl text-transparent bg-gradient-to-r from-nice-pink to-dark-periwinkle inline-block justify-center bg-clip-text font-semibold typeWriter'>NHSCC:OJ</h1>
      <h1 className='text-white text-xl'>Get started by registering and solving some problems</h1>

    </div>

    </>
  );
}
