import { useState, useContext } from "react"
import { IoMenuOutline } from "react-icons/io5";
import Navbar from "./Navbar";
import { RiCloseLargeLine } from "react-icons/ri";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
export default function Header() { 
    const navigate = useNavigate();
    const [showNav, setShowNav] = useState(false);
    const { isAuthenticated, logout } = useContext(AuthContext);
    return ( 
        <header className="flex w-full justify-between items-center px-12 py-4">
            <div className="flex items-center gap-3"> 
                <div className="text-gray-50 bg-[var(--primary)] p-3 w-10 h-10 flex items-center justify-center rounded-lg">
                    E
                </div>
                <div className="text-lg font-bold">
                    EduMaster
                </div>
            </div>
            {/* desktop navbar */}
            <div className="flex items-center gap-4"> 
                <Navbar className='md:flex hidden'/>
                <div className="hidden md:flex items-center gap-4 text-black hover:text-white border-1
                border-red-500 hover:bg-red-500 p-3 rounded-xl cursor-pointer transition-all duration-200 ease-linear"
                onClick={() => {isAuthenticated ? logout : navigate('/login')}}
                >
                    {isAuthenticated ? (
                        <button className="text-sm cursor-pointer flex items-center gap-2" onClick={logout}>
                            <CiLogout size={18}/>
                            Logout
                        </button>
                    ) : (
                        <p className="text-sm cursor-pointer">Login</p>
                    )}
                </div>
            </div>

            {/* mobile navbar */}
            <div className="md:hidden flex text-4xl border-1 border-[var(--border-color)] rounded-lg p-1 hover:bg-[var(--primary)] hover:text-gray-50 transition-all duration-200 ease-linear cursor-pointer" onClick={() => setShowNav((prevState) => !prevState)}> 
                { 
                    showNav ? 
                    <RiCloseLargeLine /> 
                    : 
                    <IoMenuOutline/>   
                }
            </div>
            { 
                showNav &&
                <div className="md:hidden flex flex-col items-center">
                    <Navbar className='md:hidden flex flex-col absolute w-40 md:w-fit right-3 top-20 z-10' /> 
                    <div className="md:hidden flex items-center gap-4 hover:text-black text-white border-1
                    border-red-500 bg-red-500 p-3 hover:bg-transparent rounded-xl cursor-pointer transition-all duration-200 ease-linear absolute top-110 right-11"
                    onClick={() => {isAuthenticated ? logout : navigate('/login')}}
                    >
                    {isAuthenticated ? (
                        <button className="text-sm cursor-pointer flex items-center gap-2">
                            <CiLogout size={18}/>
                            Logout
                        </button>
                    ) : (
                        <p className="text-sm cursor-pointer">Login</p>
                    )}
                </div>
                </div> 
            }
        </header>
    )
}