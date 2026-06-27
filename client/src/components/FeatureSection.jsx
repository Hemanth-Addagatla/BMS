import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import { dummyShowsData } from '../assets/assets';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

const FeatureSection = () => {
    const navigate = useNavigate();
    const {shows} = useAppContext();
  return (
    <div>
      
    {/* <div className='relative bg-rose-500 w-50 h-50 aspect-square blur-3xl left-300 top-30 overflow-hidden -z-50' ></div> */}
      <div className="relative flex items-center justify-between px-6 md:px-16 lg:px-36 mt-20 overflow-hidden text-sm">
        {/* <BlurCircle top="0px" left="1200px" className="-z-50"/> */}
        <p className='text-gray-200 font-medium '>Now Showing</p>
        <button className='group flex flex-row gap-2 items-center rounded-full w-28 h-8 justify-center bg-rose-500 hover:bg-rose-300 transition-all cursor-pointer ' onClick={() => {navigate('/movies'); scrollTo(0, 0)}} >

            View All <ArrowRightIcon className='group-hover:translate-x-1 transition duration-300 w-5 h-5'/>
        </button>
        
      </div>

      <div className="flex flex-wrap gap-8 mt-9 px-6 md:px-16 lg:px-36 justify-center "> 
        {shows.slice(0,4).map((show)=>(
            <MovieCard key={show._id} movie={show}/>
        ))}
      </div>

      <div className="mt-30">
        <button className='group flex flex-row gap-2 items-center rounded-md font-semibold text-sm w-30 h-10 justify-center relative m-auto bg-rose-500 hover:bg-rose-300 transition-all cursor-pointer ' onClick={() => {navigate('/movies'); scrollTo(0, 0)}}>
          Show More
        </button>
      </div>
    </div>
  );
}

export default FeatureSection;
