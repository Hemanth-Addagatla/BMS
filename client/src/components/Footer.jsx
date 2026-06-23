import React from 'react';
import {assets} from '../assets/assets';
import { CopyrightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=' grid grid-cols-4 gap-7 mt-20 px-6 md:px-16 lg:px-36 justify-center '>
        <div className='text-gray-400 text-sm flex flex-col gap-4 font-semibold col-span-2'>
          <img src={assets.logo} alt="" className='' width="150" />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sed quod soluta dignissimos, veritatis sequi, laudantium facere beatae quos aperiam architecto expedita necessitatibus esse vitae cum? Natus delectus eligendi officiis!</p>

          <div className='flex items-center gap-7 justify-start m-3'>
            <img src={assets.googlePlay} alt="" className='cursor-pointer'/>
            <img src={assets.appStore} alt="" className='cursor-pointer'/>
          </div>
        </div>

        <div className='flex flex-col  gap-4 font-semibold ml-30 flex-wrap'>
          <h3>Company</h3> 

            <ul className='text-gray-400 text-sm flex flex-col items-start gap-2 mt-3 font-semibold'>
              <li className='cursor-pointer' onClick={()=>(navigate('/'))}>Home</li>
              <li className='cursor-pointer'>Movies</li>
              <li className='cursor-pointer'>Contact Us</li>
              <li className='cursor-pointer'>Terms of Service</li>
              <li className='cursor-pointer'>Privacy Policy</li>
            </ul>
        </div>

        <div className='flex flex-col  gap-4 font-semibold '>
          <h3 className=' text-sm font-semibold'>Get in Touch</h3>
          <ul className='text-gray-400 text-sm flex flex-col gap-2 mt-3 font-semibold'>
              <li className='cursor-pointer'>7894561230</li>
              <li className='cursor-pointer'>contact@gmail.com</li>
            </ul>

        </div>
      </div>

      <div className='border-1 border-gray-100 w-300 relative m-auto mt-10'></div>
      <div className='text-sm text-gray-400 flex gap-2 md:px-16 lg:px-36 justify-center mt-3'>
        <p className='font-semibold'>Copyright 2026</p>
        <CopyrightIcon width={15}/>
        <p className=''>Company Name. All rights reserved .</p>
      </div>
    </>
  );
}

export default Footer;
