import React from 'react';
import background from '../assets/backgroundImage.png';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { SearchIcon, TicketIcon, XIcon } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';


const Navbar = () => {
    const {favouriteMovies} = useAppContext();
    const {user} = useUser();
    const {openSignIn ,openSignUp} = useClerk();
    const navigate = useNavigate();
  return (
    <>

      <div className="nav fixed top-0 left-0 w-full h-16 flex items-center justify-around px-4 align-middle max-md:full  z-50 backdrop-blur-xl">
        <Link to="/">
            <img src={logo} alt="Logo" className='w-30 h-auto'/>
        </Link>
        <div className="max-md:absoulte max-md:top-0 max-md:left-0  flex  md:flex-row items-center min-md:px-8 max-md:h-full  max-md:w-full overflow-hidden gap-8 transition-[width] duration-300 backdrop-blur-lg bg border-1 border-gray-200 rounded-full h-12 z-50 max-md:font-medium   bg-white/30 border-b-1 border-gray-200">
            {/* <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'/> */}
            <Link onClick={() => scrollTo(0, 0)} to="/">Home</Link>
            <Link onClick={() => scrollTo(0, 0)} to="/movies">Movies</Link>
            <Link onClick={() => scrollTo(0, 0)} to="/">Theatres</Link>
            {favouriteMovies.length > 0 &&  <Link onClick={() => scrollTo(0, 0)} to="/favourite">Favourites</Link>}
            <Link onClick={() => scrollTo(0, 0)} to="/">Releases</Link>
        </div>

        <div className="flex items-center space-x-4">
            <SearchIcon className='w-6 h-6 max-md:hidden cursor-pointer'/>

            {
                !user ? (
                <button onClick={openSignIn} className="bg-rose-500 text-white text-md font-semibold px-3 py-1 rounded-xl align-middle hover:bg-rose-300 cursor-pointer">SignIn</button>   
                ) : (
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Action label='My-Bookings' labelIcon={<TicketIcon width={15}/>} onClick={()=>navigate('/my-bookings')}></UserButton.Action>
                      </UserButton.MenuItems>
                    </UserButton>

                )
            }
            
        </div>

      </div>
    </>
  );
}

export default Navbar;
