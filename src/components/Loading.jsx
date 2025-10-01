import { HashLoader } from "react-spinners";

export default function LoadingSpinner() { 
    return ( 
        <div className="flex items-center justify-center min-h-[100dvh] w-full"> 
            <HashLoader color="var(--primary)"/>
        </div> 
    )
}