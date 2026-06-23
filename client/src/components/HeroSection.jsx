import React from 'react';
import {assets} from '../assets/assets.js';
import { CalendarIcon, ClockIcon , ArrowRightIcon} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <div className=" flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center h-screen " >
      <img src={assets.marvelLogo} alt="marvelLogo" className='max-h-11 lg:h-11 mt-20' />

      <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>Gaurdian <br /> of the Galaxy</h1>
      <div className='flex items-center gap-4 text-gray-400'>
        <p>Action | Adventure | Sci-fi</p>
        <div className='flex items-center justify-center align-middle gap-1 relative  '>
            <CalendarIcon className='w-4.5 h-4.5 relative top-[1px] '/> 
            <span>2018</span>
        </div>
        <div className='flex items-center gap-1 '>
            <ClockIcon className='w-4.5 h-4.5 relative top-[1px]'/> 
            <span>2h 8m</span>
        </div>
      </div>
      <p className='text-gray-300 max-w-md'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum perferendis repellendus dolorum repellat quaerat nihil corporis voluptatem placeat impedit vero, accusamus delectus ea culpa, illum ex maiores officia fugit ipsam!</p>
      <div className='group bg-rose-500 rounded-full items-center w-40 text-sm py-2 px-1 h-10 text-center font-bold text-white  cursor-pointer hover:bg-rose-300  transition-all duration-350 ' onClick={() => navigate('/movies')}>
        Explore Movies 
        <ArrowRightIcon className='w-4.5 h-4.5 inline-block ml-2 group-hover:translate-x-1 transition duration-300'/>
      </div>
    </div>
  );
}

export default HeroSection;
