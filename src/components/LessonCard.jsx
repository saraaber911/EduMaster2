import { useState } from "react";
import PaymentModal from "./PaymentModal";
import PrimaryButton from "./PrimaryButton";

export default function LessonCard({title, description, tags, url, price, token, lessonId}) { 
    const [isOpen, setIsOpen] = useState(false);
    const goToVideo = () => { 
        window.open(url);
    }
    return ( 
        <> 
        <PaymentModal isOpen={isOpen} title={title} description={description} price={price} token={token} setIsOpen={setIsOpen} lessonId={lessonId}/>
        <div className="bg-white-100 flex flex-col min-w-[300px] md:flex-row gap-4 items-center justify-between w-1/2 px-8 py-4 border-1 border-[var(--border-color)] rounded-2xl"> 
            <div className="flex flex-col gap-2"> 
                <div className="text-lg font-bold">{title}</div>
                <div className="text-black/40 text-balance">{description}</div>
                <div className="flex flex-col md:flex-row gap-1"> 
                    { 
                        tags &&
                        tags.map((item) => (
                            <div key={item} className="bg-[var(--primary-bg)] text-[var(--primary)] py-2 md:py-1 px-3 rounded-2xl flex items-center justify-center">{item}</div>
                        ))
                    }
                </div>
            </div>
            { 
                price > 0 && 
                <PrimaryButton label={`${price} EGP`} fn={() => setIsOpen(true)}/>
            }

            { 
                price === 0 && 
                <PrimaryButton label={`Free`} fn={() => setIsOpen(true)}/>
            }

            { 
                url && 
                <PrimaryButton label={'Open Video'} fn={() => goToVideo()} />
            }
        </div>
        </>
    )
}