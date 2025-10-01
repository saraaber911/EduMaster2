import { useLocation } from "react-router-dom"
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MdManageAccounts } from "react-icons/md";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`
export default function ManageUser() { 
    const location = useLocation();
    const { user } = location.state || null;
    return ( 
        <div className="flex flex-col min-h-screen"> 
            <Header /> 

            <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                <div className="flex items-center gap-3"> 
                    <MdManageAccounts size={24}/>
                    <h1 className="text-2xl font-bold">View User</h1>
                </div>
            </div>

            <div className="w-full flex justify-center p-12"> 
                <div className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]">
                    <label>Full Name</label>
                    <input type="text" value={user?.fullName} disabled className={inputStyles} />

                    <label>Email Address</label>
                    <input type="email" value={user?.email} disabled className={inputStyles} />

                    <label>Phone Number</label>
                    <input type="number" value={user?.phoneNumber} disabled className={inputStyles} />
                    
                    <label>Class Level</label>
                    <input type="text" value={user?.classLevel} disabled className={inputStyles} />
                    
                    <label>Verified</label>
                    <input type="text" value={user?.isVerified} disabled className={inputStyles} />
                </div>
            </div>
            <Footer /> 
        </div>
    ) 
}