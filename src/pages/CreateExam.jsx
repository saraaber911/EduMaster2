import Footer from "../components/Footer";
import Header from "../components/Header";
import { MdManageAccounts } from "react-icons/md";
import PrimaryButton from "../components/PrimaryButton";
import { useContext, useState } from "react";
import { AuthContext } from "../context/context";
import Toast from "../components/Toast";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`

export default function CreateExam() { 
    const [exam, setExam] = useState({title: '', description: '', duration: 0, classLevel: 'Grade 1 Secondary', startDate: '', endDate: '', isPublished: true});
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const createExam = async (e) => {
        e.preventDefault();
        const res = await fetch(`https://edu-master-psi.vercel.app/exam`, { 
            method: 'POST', 
            body: JSON.stringify(exam),
            headers: { 
                token: token,
                'content-type': 'application/json'
            }
        })
        const result = await res.json();
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
        })
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
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
                            <h1 className="text-2xl font-bold">Create Exam</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center p-12"> 
                    <form onSubmit={createExam} className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]">
                        <label className="font-semibold text-lg">Title</label>
                        <input type="text" placeholder="Enter exam title" className={inputStyles}
                        onChange={(e) => setExam((prevState) => ({...prevState, title: e.target.value}))}
                        />

                        <label className="font-semibold text-lg">Description</label>
                        <input type="text" placeholder="Enter exam description" className={inputStyles}
                        onChange={(e) => setExam((prevState) => ({...prevState, description: e.target.value}))}
                        />

                        <label className="font-semibold text-lg">Duration</label>
                        <input type="number" placeholder="Enter exam duration" className={inputStyles}
                        onChange={(e) => setExam((prevState) => ({...prevState, duration: +e.target.value}))}
                        />

                        <label className="font-semibold text-lg">Class Level</label>
                        <select className={inputStyles} 
                        onChange={(e) => setExam((prevState) => ({...prevState, classLevel: e.target.value}))}> 
                            <option value="Grade 1 Secondary">Grade 1 Secondary</option>
                            <option value="Grade 2 Secondary">Grade 2 Secondary</option>
                            <option value="Grade 3 Secondary">Grade 3 Secondary</option>
                        </select>

                        <label className="font-semibold text-lg">Start Date</label>
                        <input type="date" className={inputStyles} 
                        onChange={(e) => setExam((prevState) => ({...prevState, startDate: e.target.value}))}/>

                        <label className="font-semibold text-lg">End Date</label>
                        <input type="date" className={inputStyles} 
                        onChange={(e) => setExam((prevState) => ({...prevState, endDate: e.target.value}))}/>

                        <label className="mb-2 font-semibold text-lg">Published</label>
                        <div className="flex gap-2"> 
                            <input type="radio" name="isPublished" value={true} id={'true'} 
                            onChange={(e) => setExam((prevState) => ({...prevState, isPublished: e.target.value}))}/>
                            <label htmlFor={'true'}>True</label>
                        </div>
                        <div className="flex gap-2"> 
                            <input type="radio" name="isPublished" value={false} id={'false'}
                            onChange={(e) => setExam((prevState) => ({...prevState, isPublished: e.target.value}))}/>
                            <label htmlFor={'false'}>False</label>
                        </div>

                        <PrimaryButton label={'Create Exam'} className={'self-center mt-5'} />
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}