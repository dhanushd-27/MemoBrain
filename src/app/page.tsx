"use client"

import React from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

const LandingPage = () => {

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-36 py-4 flex justify-between'>
        <Image src={ "/logo.png" } alt='logo' width={ 100 } height={ 85 }/>
        <div className='flex gap-4'>
          <PrimaryButton buttonName='View Demo' url='#' target='_blank'/>
          <SecondaryButton buttonName='Github' url='https://github.com/dhanushd-27/MemoBrain' target='_blank'/>
        </div>
      </header>
      <main className='w-full flex flex-col gap-4 items-center justify-center text-center flex-1'>
        <h1 className='w-[700px] font-extrabold text-6xl'>
          Capture important links. Organize your digital memory.
        </h1>
        <h5 className='text-xl text-black/40 font-semibold w-[500px]'>
          MemoBrain helps you save tweets, docs, videos, and links in one organized space you can easily share. 
        </h5>
        <div className='flex gap-4'>
          <SecondaryButton buttonName="Sign In" url='/login' target='_self' />
          <PrimaryButton buttonName='Get Started' url='/signup' target='_self' />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
