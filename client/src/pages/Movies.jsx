import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    
      <div className='flex flex-wrap gap-8 mt-9 px-6 md:px-16 lg:px-36 justify-center relative '>
        <h3 className='mt-15 font-bold'>Now Showing..</h3>
        {/* <BlurCircle top='3' /> */}
        <div className='flex gap-5 flex-wrap'>
          {dummyShowsData.map((movie)=>(
            <MovieCard movie={movie} key={movie._id}/>
          ))}
        </div>
      </div>
  ):(
    <div className='flex flex-col items-center justify-center '>
      <h3 className='text-3xl font-bold text-center text-rose-400 mt-40'>Pardon!! No Shows Available</h3>
      {/* <button>Home</button> */}
    </div>
  )
}

export default Movies;
