import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
    console.log(currentTrailer.videoUrl);
  return (
    <div className=''>
        <p className='text-center font-bold mt-20'>Trailers</p>

        <div className='flex flex-wrap gap-4 mt-4 justify-center'>
            <ReactPlayer src={currentTrailer.videoUrl} controls={false}  width="960px" height="500px"/>
        </div>

        <div className='grid grid-cols-4 gap-4 md:gap-8 mx-auto mt-8 max-w-3xl '>
            {dummyTrailers.map((trailer)=>(
                <div key={trailer.image} className='relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition  max-md:h-60 cursor-pointer' onClick={()=> setCurrentTrailer(trailer)}>
                    <img src={trailer.image} alt="" className='rounded-lg w-full h-full object-cover brightness-75' />
                    <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-5 md:w-5 h-5 transform -translate-x-1/2 -translate-y-1/2'/>
                </div>
            ))}
        </div>
    </div>
  );
}

export default TrailerSection;
