import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { MdOutlinePlayLesson } from "react-icons/md";
import { AuthContext } from "../context/context";
import LessonCard from "../components/LessonCard";
export default function PurchasedLessons() { 
    const [lessons, setLessons] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState([]);
    const { token } = useContext(AuthContext);
    const getPurchasedLessons = async () => { 
        const res = await fetch ('https://edu-master-psi.vercel.app/lesson/my/purchased', {
            headers: {
                token: token
            }
        })
        const result = await res.json();
        setLessons(result?.data);
    }

    useEffect(() => {
        getPurchasedLessons();
    }, [])

    useEffect(() => {
        if (lessons) { 
            const purchasedLessons = lessons.filter((item) => item !== null);
            setFilteredLessons(purchasedLessons);
        }
    }, [lessons])
    return (
        <>
            <Header />
            <main>
                <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                    <div className="flex items-center gap-3"> 
                        <MdOutlinePlayLesson size={24}/>
                        <h1 className="text-2xl font-bold">Your Purchased Lessons</h1>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4 items-center p-12"> 
                    {
                        filteredLessons && 
                        filteredLessons?.map((lesson) => (
                            <LessonCard key={lesson?._id} title={lesson?.title} description={lesson?.description} tags={lesson?.tags} url={lesson?.video}/> 
                        ))
                    }
                </div>

            </main>
            <Footer />
        </>
    )
}