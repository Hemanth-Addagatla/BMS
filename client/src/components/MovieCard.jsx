import { CircleIcon, StarIcon } from 'lucide-react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({movie}) => {
    const navigate  = useNavigate();
    const {image_url} = useAppContext();
  return (
    <div onClick={() => {navigate(`/movies/${movie._id}`); scrollTo(0,0)}} className="w-70  rounded-2xl overflow-hidden bg-slate-800 hover:-translate-y-1 transition duration-300 cursor-pointer px-2 py-3 ">
        <img src={image_url+movie.poster_path} alt={movie.title} className="rounded-lg object-cover object-top h-60 w-full"/>
        <p className='font-semibold mt-2 p-2'>{movie.title}</p>
 
        <div className='text-gray-400 text-sm font-semibold flex items-center gap-2 px-2 '>
            <p>
                {new Date(movie.release_date).getFullYear()}
            </p>
            <CircleIcon className='w-1.5 h-1.5 relative top-[1px] text-gray-400 fill-gray-400 inline-block'/>

            <p>
                {movie.genres.slice(0, 2).map(genre => genre.name).join(' | ')}
            </p>
            <CircleIcon className='w-1.5 h-1.5 relative top-[1px] text-gray-400 fill-gray-400 inline-block'/>
            <p>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </p>
        </div>

        <div className='flex items-center justify-between mt-2'>
            <button onClick={() => {navigate(`/movies/${movie._id}`); scrollTo(0,0)}} className='px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-400 transition-colors duration-300 mt-2'>Buy tickets</button>
            <p className='flex items-center gap-1 text-sm text-gray-400 '>
                <StarIcon className='w-4.5 h-4.5 relative top-[1px] text-yellow-400 fill-yellow-400 inline-block'/> {movie.vote_average.toFixed(1)}
                
            </p>
        </div>
    </div>
  );
}

export default MovieCard;
