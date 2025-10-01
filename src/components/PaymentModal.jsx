import PrimaryButton from "./PrimaryButton";
import { useState } from "react";

export default function PaymentModal({isOpen, token, price, title, description, setIsOpen, lessonId}) { 
    const [buying, setBuying] = useState(false);
    const buyLesson = async () => { 
        setBuying(true);
        const response = await fetch(`https://edu-master-psi.vercel.app/lesson/pay/${lessonId}`, {
            method: 'POST',
            headers: {
                token: token,
            }
        });
        const result = await response.json(); 
        if (result?.success === true) { 
            window.open(result?.paymentUrl);
            setIsOpen(false);
        } else { 
            window.alert('Payment Canceled');
        }
        setBuying(false);
    }
    return ( 
        <>
            {
                isOpen && 
                <div
                className={`fixed z-50 bg-black/40 min-h-[100dvh] w-full flex justify-center items-center top-0`}>
                    <div className="w-1/2 h-1/2 bg-white border-1 border-[var(--border-color)] rounded-2xl p-12 ">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold">{title}</h1>
                            <h3 className="text-black/40">{description}</h3>
                            <p className="text-[var(--primary)] text-xl">{price}$</p>
                            <p>Are you sure you want to buy?</p>
                            <div className="flex gap-3"> 
                                <PrimaryButton label={buying ? 'Loading...' : 'Buy'} fn={() => buyLesson()}/>
                                <button className="bg-[var(--border-color)] min-w-[100px] p-3 rounded-xl text-black 
                                cursor-pointer hover:opacity-70 transition-all duration-200 ease-linear w-fit"
                                onClick={() => setIsOpen(false)}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>  
                </div>
            }     
            </>
    )
}