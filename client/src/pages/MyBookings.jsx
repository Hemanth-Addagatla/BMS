import React, { useEffect, useState } from 'react';
import { dummyBookingData } from '../assets/assets';
import Loading from '../components/Loading';
import isoTimeFormat from '../lib/isoTimeFormat';
import { dateFormat } from '../lib/dateFormat';
import { BringToFront } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const {axios,user,getToken,image_url} = useAppContext() 
  
  // console.log(currency);

  const [bookings,setBookings] = useState([]);
  const [isLoading,setIsLoading] = useState(true);


  const getMyBookings = async()=>{
    try {
      const {data} = await axios.get('/api/user/bookings',{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        setBookings(data.bookings)
      }
    } catch (error) {
      
    }
    setIsLoading(false) 
  }

  useEffect(()=>{
    if(user)
      getMyBookings()
  },[user])
  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <h1 className='font-bold mb-10'>My Bookings</h1>

      {bookings.map((item,index)=>(
        <div key={index} className='flex flex-col md:flex-row justify-between bg-rose-400/8 border border-rose-400/20 rounded-lg mt-4 p-2 max-w-3xl'>
          <div className='flex '>
            <img src={image_url+item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom-right rounded'/>
            <div className='flex flex-col p-4'>
              <p className='font-semibold'>{item.show.movie.title}</p>
              <p className='text-sm text-gray-400 '>{Math.floor(item.show.movie.runtime/60)}h {item.show.movie.runtime%60}m</p>
              <p className='text-sm text-gray-400 mt-auto'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
            <div className='flex gap-4'>
              <p className='font-semibold text-lg'>{currency}{item.amount}</p>
              {!item.isPaid && <button className='bg-rose-400 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</button>}
            </div>
            <div className='text-sm'>
              <p>
                <span className='text-gray-400'>
                  Total Tickets:
                </span>
                {item.bookedSeats.length}
              </p>
              <p>
                <span className='text-gray-400'>
                  Seat Numbers:
                </span>
                {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>

      ))}
    </div>
  ):(
    <div className='mt-20'>
      <Loading/>
    </div>
  )
}

export default MyBookings;
