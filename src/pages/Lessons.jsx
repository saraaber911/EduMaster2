import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AuthContext } from "../context/context";
import { PiBookOpenTextBold } from "react-icons/pi";
import LessonCard from "../components/LessonCard";
import LoadingSpinner from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { MdCloudOff } from "react-icons/md";
export default function Lessons() { 
    const {token} = useContext(AuthContext);
    const [lessons, setLessons] = useState(null);
    const [grade, setGrade] = useState();
    const [role, setRole] = useState();
    const [search, setSearch] = useState('');
    const [filteredLessons, setFilteredLessons] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const getGrade = async () => { 
        const response = await fetch ('https://edu-master-psi.vercel.app/user/', { 
            headers: { 
                token: token
            }
        })
        const result = await response.json();
        setGrade(result?.data?.classLevel);
        setRole(result?.data?.role);
    }

    const getLessons = async () => { 
        const response = await fetch('https://edu-master-psi.vercel.app/lesson/', {
            headers: { 
                token: token
            }
        })
        const result = await response.json();
        setLessons(result?.data);
    }

    const searchLessons = () => { 
        const searchResult = lessons?.filter((item) => item.title.includes(search)); 
        setFilteredLessons(searchResult);
    }
    useEffect(() => {
            getLessons();
            getGrade();
    }, [])

    useEffect(() => {
        if (search === '') { 
            setFilteredLessons(lessons);
        }
    }, [search, lessons]) 

    useEffect(() => {
        if (lessons && grade || role === 'admin' || role === 'super-admin') { 
            setLoading(false);
        }
    }, [lessons, grade, role])
    return ( 
        <div className="flex flex-col min-h-screen"> 
            <Header />
                <div className="flex-grow"> 
                    { 
                        loading ? 
                        <LoadingSpinner />
                        : 
                        <> 
                        { 
                            role === 'user' ? 
                            <> 
                            <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                                <div className="flex items-center gap-3">
                                    <PiBookOpenTextBold size={24}/>
                                    <div className="flex flex-col gap-1"> 
                                        <h1 className="text-2xl font-bold">Lessons</h1>
                                        <h3 className="text-black/40">Browse interactive lessons</h3>
                                    </div>
                            </div>

                                <div className="flex flex-col md:flex-row gap-5 w-1/2 justify-end items-center"> 
                                    <input type="search" placeholder="Search lessons..." className="p-3 h-12 md:w-1/3 rounded-xl bg-gray-100"
                                    onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button className="bg-[var(--primary)] min-w-[100px] p-3 rounded-xl text-white cursor-pointer hover:opacity-70 
                                    transition-all duration-200 ease-linear w-fit disabled:cursor-not-allowed" 
                                    disabled={search ? false : true}
                                    onClick={() => searchLessons()}
                                    >Search</button>
                                    <button className="bg-[var(--primary)] min-w-[100px] p-3 rounded-xl text-white cursor-pointer hover:opacity-70 
                                    transition-all duration-200 ease-linear w-fit" 
                                    onClick={() => navigate('/purchased-lessons')}
                                    >Purchased Lessons</button>
                                    <div className="flex flex-col justify-center items-center p-3 h-24 w-fit rounded-xl bg-gray-100">
                                        <div className="font-bold">Level:</div>
                                        <div className="text-center">{grade ? grade : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-12 gap-4 items-center"> 
                                <h1 className="text-3xl font-bold">{grade ? grade : 'Your'} Lessons</h1>
                                <div className="w-full flex flex-wrap justify-center gap-4">
                                    { 
                                        filteredLessons && 
                                        filteredLessons?.map((lesson) => ( 
                                            <LessonCard
                                            title={lesson.title}
                                            description={lesson.description}
                                            tags={[grade, lesson.isPaid ? 'Paid' : 'Free']}
                                            price={+lesson.price}
                                            key={lesson._id}
                                            lessonId={lesson._id}
                                            token={token}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            </>
                            :
                            <div className="flex flex-col gap-3 w-full min-h-[80dvh] items-center justify-center">
                                <MdCloudOff size={38}/> 
                                <div className="text-2xl font-bold">This is page is made for users!</div>
                                <div>Show lessons from <Link to={'/dashboard'} className="text-[var(--primary)] font-bold">Dashboard</Link></div>
                            </div>
                        }
                        </>
                    }
                </div>
            <Footer />
        </div>
    )
}