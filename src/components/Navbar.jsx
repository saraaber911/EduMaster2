import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/context";

export default function Navbar({className}) { 
    const [active, setActive] = useState();
    const {token} = useContext(AuthContext);
    const [role, setRole] = useState();
    const [tabs, setTabs] = useState(
        [
        {tabName: 'Home', href: 'home'},
        {tabName: 'Lessons', href: 'lessons'},
        {tabName: 'Exams', href: 'exams'}, 
        {tabName: 'Profile', href: 'profile'}])
    const getUser = async () => { 
        const response = await fetch ('https://edu-master-psi.vercel.app/user/', {
            headers: { 
                token: token
            }
        })
        const result = await response.json();
        setRole(result?.data?.role);
    }
    useEffect(() => {getUser()}, []);
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/') { 
            setActive('home');
        } else { 
            setActive(location.pathname.slice(1).toLowerCase());
        }
    }, [location])
    useEffect(() => {
        if (role === 'admin') { 
            setTabs((prevState) => [...prevState, {tabName: 'Dashboard', href: 'dashboard'}])
        }

        if (role === 'super-admin') { 
            setTabs((prevState) => [...prevState, {tabName: 'Dashboard', href: 'super-dashboard'}])
        }
    }, [role])
    return ( 
        <nav className={`gap-5 p-3 bg-[var(--primary-bg)] rounded-4xl text-[var(--primary)] ${className}`}> 
            { 
                tabs.map((item, index) => ( 
                    <NavItem id={item.href} key={index} active={active}>
                        {item.tabName.charAt(0).toUpperCase() + item.tabName.slice(1)}
                    </NavItem>
                ))
            }
        </nav>
    )
}