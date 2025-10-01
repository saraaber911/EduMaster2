import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { MdManageAccounts } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/context";
import { FaRegTrashAlt } from "react-icons/fa";
import PrimaryButton from "../components/PrimaryButton";
import Toast from "../components/Toast";
import { Bounce, toast } from "react-toastify";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`
export default function ManageLesson() { 
    const location = useLocation();
    const { lesson } = location.state || null;
    const [newLesson, setNewLesson] = useState({title: '', description: '', classLevel: 'Grade 1 Secondary', video: '', price: ''})
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (lesson) { 
            setNewLesson({
                title: lesson?.title,
                description: lesson?.description,
                classLevel: lesson?.classLevel,
                video: lesson?.video,
                price: lesson?.price
            })
        }
    }, [lesson]);

    const updateLesson = async (e) => { 
        e.preventDefault();
        const res = await fetch(`https://edu-master-psi.vercel.app/lesson/${lesson?._id}`, {
            method: 'PUT',
            body: JSON.stringify(newLesson),
            headers: { 
                'content-type': 'application/json',
                token: token
            }
        });
        const result = await res.json();
        if (result.success) { 
            toast(`${result?.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
        } else { 
            toast(`${result?.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
        }
        setTimeout(() => {
            navigate('/dashboard')
        }, 1500);
    } 

    const deleteLesson = async () => { 
        await fetch(`https://edu-master-psi.vercel.app/lesson/${lesson?._id}`, {
            headers: {
                token: token
            }
        });
    }
    return ( 
        <> 
            <Header />
            <main>
                <Toast />
                <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                        <div className="w-full flex items-center justify-between"> 
                            <div className="flex items-center gap-3"> 
                                <MdManageAccounts size={24}/>
                                <h1 className="text-2xl font-bold">Manage Lesson</h1>
                            </div>
                            <div className="flex items-center gap-3"> 
                                <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-700 
                                transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2"
                                onClick={deleteLesson}
                                >
                                    <FaRegTrashAlt />
                                    Delete Lesson
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center p-12">
                        <form onSubmit={updateLesson} className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]">
                            <label className="font-semibold text-lg">Title</label>
                            <input type="text" placeholder={lesson?.title} className={inputStyles}
                            onChange={(e) => setNewLesson((prevState) => ({...prevState, title: e.target.value}))}
                            />

                            <label className="font-semibold text-lg">Description</label>
                            <input type="text" placeholder={lesson?.description} className={inputStyles} 
                            onChange={(e) => setNewLesson((prevState) => ({...prevState, description: e.target.value}))}
                            />

                            <label className="font-semibold text-lg">Video Url</label>
                            <input type="text" placeholder={lesson?.video} className={inputStyles}
                            onChange={(e) => setNewLesson((prevState) => ({...prevState, video: e.target.value}))}
                            />

                            <label>Class Level</label>
                            <select className={inputStyles} 
                            onChange={(e) => setNewLesson((prevState) => ({...prevState, classLevel: e.target.value}))}
                            > 
                                <option value="Grade 1 Secondary">Grade 1 Secondary</option>
                                <option value="Grade 2 Secondary">Grade 2 Secondary</option>
                                <option value="Grade 3 Secondary">Grade 3 Secondary</option>
                            </select>

                            <label className="font-semibold text-lg">Price</label>
                            <input type="number" placeholder={lesson?.price} className={inputStyles} 
                            onChange={(e) => setNewLesson((prevState) => ({...prevState, price: +e.target.value}))}
                            />

                            <PrimaryButton label={'Submit Changes'} className={'self-center'} />
                        </form>
                    </div>
            </main>
            <Footer />
        </>
    )
}