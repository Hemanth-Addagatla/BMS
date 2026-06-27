import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import { CircleIcon, Heart, PlayCircleIcon, Star, StarIcon} from 'lucide-react';
import '../index.css'
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
// import axios from 'axios';

const Moviedetails = () => {
      const {shows,axios,favouriteMovies,user,getToken,fetchFavouriteMovies,image_url} = useAppContext();

      const navigate = useNavigate();
      const {id} = useParams();
      const [show,setShow] = useState();
      const getShow = async()=>{
        try{
          const {data} = await axios.get(`/api/show/${id}`)
          if(data.success){
            setShow(data)
          }
          // console.log(data);
        } catch(error){
          console.log(error);
        }
        
      }
      useEffect(()=>{
        getShow();
      },[id])

      const handleFavourite = async()=>{
        try {
          if(!user) return toast.error("Please Login to Proceed")
          const {data} = await axios.post('/api/user/update-favourite',{movieId:id},{
            headers:{Authorization: `Bearer ${await getToken()}`}
          })
          if(data.success){
            await fetchFavouriteMovies();
            toast.success("Updated Successfully")
          }
        } catch (error) {
          console.log(error);
        }
      }

      const handleClick = () => {
      document.getElementById("dateSelect")?.scrollIntoView({
        behavior: "smooth"
      });
    };
    // console.log(show.movie._id)
  return show ? (
    <div >
      <div className='flex justify-start px-30 py-30 gap-10'> 
        <img src={image_url + show.movie.poster_path} alt="" className="rounded-lg object-cover object-top h-90 " />
        <div>
          <p className='font-bold text-rose-500/70 mb-3 '>ENGLISH</p>
          <h1 className='font-bold text-3xl'>{show.movie.title}</h1>
          <div className='flex mt-5 gap-4 mb-3'>
            <div className='flex text-gray-50 gap-1'>
              <StarIcon className='fill-rose-500 text-rose-500 relative top-[1px]' width={18}/>{show.movie.vote_average.toFixed(1)}
            </div>
            <p className='text-gray-50 font-semibold'> Imdb User Rating</p>
          </div>

          <p className='text-sm text-gray-500 max-w-xl'>{show.movie.overview}</p>

          <div className='text-md flex  gap-3 mt-5 '> 
            <p>{Math.floor(show.movie.runtime/60)}h {show.movie.runtime%60}m</p>
            <CircleIcon className='fill-gray-50 relative top-[2px]' width={8}/>
            <p className='font-semibold'>{show.movie.genres.map(genre => genre.name).join(" | ")} </p>
            <CircleIcon className='fill-gray-50 relative top-[2px]' width={8}/>
            {show.movie.release_date.split("-")[0]}
          </div>
          <div className='flex gap-10 mt-15 items-center'>
            <button className='flex gap-1 font-semibold bg-rose-500 hover:bg-rose-300 h-10 items-center w-32 justify-center rounded-md cursor-pointer'>
              <PlayCircleIcon width={20} className='relative top-px'/>
              WatchTrailer
            </button>
            <a href='#dateSelect' className='bg-gray-600 flex w-32 font-semibold rounded-md h-10 justify-center items-center hover:bg-gray-400 cursor-pointer' onClick={handleClick}>Buy Tickets</a>
            <button onClick={handleFavourite} className='bg-rose-500 w-10 h-10 rounded-full flex justify-center items-center hover:bg-rose-300'>
              <Heart className={`h-5 cursor-pointer ${favouriteMovies.find(movie => movie._id === id) ? 'fill-white text-rose-500' : ' '}`} width={20}/>
            </button>
          </div>
        </div>
      </div>
      <p className='text-lg font-medium px-20 flex '>Your Favourite Cast</p>
      <div className='overflow-x-auto scrollbar-none  mt-8 pb-4  f'>
        <div className='flex gap-4  px-4 justify-center flex-wrap '>
          {show.movie.casts.slice(0,11).map((cast,index)=>(
            <div key={index} className='flex flex-col text-center items-center'>
              <img src={image_url+cast.profile_path} alt="" className='rounded-full h-20 aspect-square object-cover' />
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <DateSelect dateTime={show.dateTime} id={id}/>
      <p className='flex justify-center font-bold m-10'>Movies you may also like </p>
      <div className='flex gap-5 justify-center'>
        {shows.slice(0,4).map((movie,index) =>(
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-10'>
        <button className='bg-rose-500 w-32 h-8 rounded-md hover:bg-rose-300 cursor-pointer' onClick={() => {navigate('/movies'); scrollTo(0,0)}}>Show More</button>
      </div>

    </div>
  ) : <div className='mt-10'>
    <Loading/>
  </div>
}


export default Moviedetails;
