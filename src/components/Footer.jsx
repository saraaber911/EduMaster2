import { FaRegCopyright } from "react-icons/fa6";
export default function Footer() { 
    return ( 
        <footer className="py-8 px-12 flex md:justify-between flex-wrap justify-center text-black/40 border-t-1 border-t-[var(--border-color)]">
            <div className="flex gap-2 items-center">
                <FaRegCopyright /> 
                <div>{new Date().getFullYear()}</div>
                <div>EduMaster</div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="hover:underline cursor-pointer">Privacy</div>
                <div className="hover:underline cursor-pointer">Terms</div>
                <div className="hover:underline cursor-pointer">Help</div>
            </div>
        </footer>
    )
}