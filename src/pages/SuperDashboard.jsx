import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/context";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu"
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RiAdminLine } from "react-icons/ri";
import PrimaryButton from "../components/PrimaryButton";
import LoadingSpinner from "../components/Loading";
import { useNavigate } from "react-router-dom";
import UsersTable from "../components/UsersTable";
export default function SuperDashboard() {
    const [users, setUsers] = useState();
    const [admins, setAdmins] = useState();
    const [filter, setFilter] = useState('All');
    const [Loading, setLoading] = useState(true);
    const [filteredItems, setFilteredItems] = useState();
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();
    const fetchUrl = async (url) => { 
        const res = await fetch(url, {
            headers: {
                token: token
            }
        })
        const data = await res.json();
        return data;
    }
    const getUsers = async () => { 
        const res = await fetchUrl('https://edu-master-psi.vercel.app/admin/all-user');
        setUsers(res?.data);
    }

    const getAdmins = async () => { 
        const res = await fetchUrl('https://edu-master-psi.vercel.app/admin/all-admin');
        setAdmins(res?.data);
    }

    const navigateToUserPage = (userId, userRole) => { 
        navigate('/manage-user', {state: {id: userId, role: userRole}});
    }
    useEffect(() => {
        getUsers();
        getAdmins();
    }, [])

    useEffect(() => {
        if (users && admins) { 
            if (filter === 'All') { 
                setFilteredItems([...users, ...admins]);
            } else if (filter === 'Admins') { 
                setFilteredItems(admins);
            } else if (filter === 'Users') { 
                setFilteredItems(users);
            }
        setLoading(false);
        }
    }, [filter, users, admins])
    return ( 
        <> 
        { 
            Loading ? 
            <LoadingSpinner />
            : 
            <> 
            <Header />
            <main className="flex flex-col w-full">
                <div className="flex-grow">
                    <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                        <div className="flex items-center gap-3">
                            <IoSettingsOutline size={'24px'}/>
                            <div className="flex flex-col gap-1"> 
                                <h1 className="text-2xl font-bold text-center">Super Admin Dashboard</h1>
                                <h3 className="text-black/40 text-center md:text-start">Manage users and admins</h3>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5 w-1/2 justify-end items-center"> 
                            <div className="flex gap-2 items-center bg-white p-2 rounded-3xl border-1 border-[var(--border-color)]">
                                <LuUsersRound size={'18px'}/>
                                <div>{users?.length}</div>
                                <div>Users</div>
                            </div>
                            <div className="flex gap-2 items-center bg-white p-2 rounded-3xl border-1 border-[var(--border-color)]">
                                <RiAdminLine size={'18px'}/>
                                <div>{admins?.length}</div>
                                <div>Admins</div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="flex w-full justify-center mt-10">
                    <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl p-4 flex flex-col gap-3 w-[50%]">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="font-bold text-2xl">Accounts</div>
                            <div className="flex flex-col md:flex-row gap-3 items-center"> 
                                <select name="role" className="text-md md:text-xl rounded-2xl p-3" onChange={(e) => setFilter(e.target.value)}>
                                    <option>All</option>
                                    <option>Users</option>
                                    <option>Admins</option>
                                </select>
                                <PrimaryButton label={'Create Admin'} fn={() => navigate('/create-admin')}/>
                            </div>
                        </div>
                        <UsersTable filteredItems={filteredItems} navigateToUserPage={navigateToUserPage}/>
                    </div>
                </section>
            </main>
            <Footer />
            </>
        }
        </>
    )
}