import React, { useState , useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { dummyShowsData , dummyDateTimeData, assets } from '../assets/assets';
import isoTimeFormat from '../lib/isoTimeFormat';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
const SeatLayout = () => {
  const groupRows = [["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]]
  const {id,date} = useParams();
  const [selectedSeats,setSelectedSeats] = useState([]);
  const [selectedTime,setSelectedTime] = useState(null);
  const [show,setShow] = useState(null);
  const [occupiedSeats,setOccupiedSeats] = useState([])
  
  const navigate = useNavigate();
  const {axios,getToken,user} = useAppContext();
  // console.log(getToken());
  const handleProceed=()=>{
    if(selectedSeats.length===0){
      return toast("Please Select a Seat")
    }
    else{
      navigate('/my-bookings')
      scrollTo(0,0)
    }
  }

  const getShow = async()=>{
    try {
      const {data} = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data)
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
      
    }
    
    const getOccupied = async()=>{
      try {
        const {data} =  await axios.get(`/api/bookings/seats/${selectedTime.showId}`)

        if(data.success){
          setOccupiedSeats(data.occupiedSeats)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error); 
      }
    }
    useEffect(()=>{
      getShow();
    },[])

    useEffect(()=>{
      if(selectedTime){
        getOccupied();
        console.log("Occupied Seats", occupiedSeats);
      }
    },[selectedTime])
    
    const handleSeatClick = (seatId)=> {
      if(!selectedTime){
        return toast("Please select the time first")
      }
      if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      if(occupiedSeats.includes(seatId)){
        return toast('This seat is Already booked')
      }
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev,seatId])
    }

    const bookTickets = async() =>{
      try {
        if(!user) return toast.error('Please login to Proceed')
        if(!selectedTime ||  selectedSeats.length==0) return toast.error('Please Select the seats and time')
        const {data} = await axios.post('/api/bookings/create',{showId: selectedTime.showId , selectedSeats},{headers:{
          Authorization: `Bearer ${await getToken()}`}})

        if(data.success){
          window.location.href = data.url;
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
 

    const renderSeats = (row,count=9)=>(
      <div key={row} className='flex gap-2 mt-2'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {Array.from({length: count} ,(_,i) =>{
            const seatId = `${row}${i+1}`;
            return (
              <button key={seatId} onClick={()=> handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-rose-400/60 cursor-pointer 
              ${selectedSeats.includes(seatId) && "bg-rose-400 text-white"} 
              ${occupiedSeats.includes(seatId) && "bg-rose-400/50 opacity-50"}
              `}>{seatId}</button>
            )
          })}
        </div>
      </div>
    )

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      
      {/* Available timings */}
      <div className='w-60 bg-rose-400/20 border border-rose-500/30 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div>
          {show.dateTime[date].map((item)=>(
            <div key={item.time} onClick={()=> setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition  ${selectedTime?.time === item.time ? "bg-rose-500 text-white" : "hover:bg-rose-400/30"}`}>
              <ClockIcon className='w-5 h-5'/>
              <p className='text-sm '>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <h1 className='text-2xl font-semibold mb-4'>Select Your Seats</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>Screen-side</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6 '>
            {groupRows[0].map(row=> renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group,idx) =>(
            <div key={idx}>
              {group.map(row=>renderSeats(row))}
            </div>
          ))}
        </div>
        </div>
        <button onClick={bookTickets}  className='flex items-center justify-center mt-15 gap-3 bg-rose-600  w-50 h-10 rounded-md cursor-pointer hover:bg-rose-600/60 transition duration-300'>
          Proceed to CheckOut
          <ArrowRightIcon strokeWidth={3} className='w-4 h-4 relative top-[2px]'/>
        </button>
        
      </div>
    </div>
  ) : ( 
    <div className='mt-20'>
        <Loading/>
    </div>
  )
}

export default SeatLayout;
