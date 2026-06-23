import { ChevronLeftIcon ,ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({dateTime, id}) => {
    const navigate = useNavigate();
    const [selected,setSelected] = useState(null);
    const onBookHandler=()=>{
        if(!selected){
            return toast('Please select a Date !!!');
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0);
    }
  return (
    <>
    <p className=' pt-30  text-lg font-bold mb-10 text-center'>Choose Date</p>
    <div id='dateSelect' className='flex justify-center '>
        
        <div className='flex justify-around bg-rose-500/30 h-40 w-300 border-1 border-rose-500 rounded-2xl items-center'>
            <div className='flex items-center'>
                <ChevronLeftIcon width={28}/>
                <span className='flex gap-3'>
                    {Object.keys(dateTime).map((date)=>(
                        <button onClick={()=> setSelected(date)} key={date} className={`flex flex-col items-center justify-center h-14 w-14  aspect-square rounded cursor-pointer  ${selected === date ? "bg-rose-400 text-white" : "border border-rose-500" }`}>
                            <span>{new Date(date).getDate()}</span>
                            <span>{new Date(date).toLocaleDateString("en-Us",{month: "short"})}</span>
                            {/* <span></span> */}
                        </button>
                    ))}
                </span>
                <ChevronRightIcon width={28 }/>
            </div>
            <button onClick={onBookHandler} className='bg-rose-600 h-10 w-32 rounded-md cursor-pointer hover:bg-rose-400 '>Book Now</button>
        </div>
    </div>
    </>
  );
}

export default DateSelect;
