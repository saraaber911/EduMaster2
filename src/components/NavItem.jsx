import { useNavigate } from "react-router-dom"

const activeTabStyles = 
`text-gray-50 bg-[var(--primary)] rounded-4xl cursor-not-allowed`
export default function NavItem({active, children, id}) { 
    const navigate = useNavigate();
    const navigateToPage = (page) => { 
        if (page === 'home') { 
            navigate('/');
        } else { 
            navigate(`/${page}`);
        }
    }
    return ( 
        <div className={`${active === id ? activeTabStyles : 'hover-tab' } p-3 text-center`} onClick={() => navigateToPage(id)}>{children}</div>
    )
}