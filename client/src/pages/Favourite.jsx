import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const Favourite = () => {
  const {favouriteMovies} = useAppContext();
  return favouriteMovies.length > 0 ? (
    
      <div className='flex flex-col gap-8 mt-9 px-6 md:px-16 lg:px-36 justify-center relative '>
        <h3 className='mt-20 font-bold text-center'>Your Favourite Movies.</h3>
        {/* <BlurCircle top='3' /> */}
        <div className='flex gap-5 flex-wrap'>
          {favouriteMovies.map((movie)=>(
            <MovieCard movie={movie} key={movie._id}/>
          ))}
        </div>
      </div>
  ):(
    <div className='flex flex-col items-center justify-center '>
      <h3 className='text-3xl font-bold text-center text-rose-400 mt-40'>Pardon!! No Favourites Available</h3>
      {/* <button>Home</button> */}
    </div>
  )
}

export default Favourite;
