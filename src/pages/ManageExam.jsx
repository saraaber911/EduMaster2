import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/context";
import LoadingSpinner from "../components/Loading";
import { MdManageAccounts } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { Bounce, toast } from "react-toastify";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`
export default function ManageExam() { 
    const [exam, setExam] = useState();
    const [loading, setLoading] = useState(true);
    const [classLevels, setClassLevels] = useState(['Grade 1 Secondary', 'Grade 2 Secondary', 'Grade 3 Secondary']);
    const [newExam, setNewExam] = useState({
        title: '', description: '', duration: 0, classLevel: '', isPublished: true, startDate: '', endDate: ''
    });
    const [scores, setScores] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = location.state || null;
    const { token } = useContext(AuthContext);
    const getExam = async () => { 
        const res = await fetch(`https://edu-master-psi.vercel.app/exam/get/${id}`, {
            headers: { 
                token: token
            }
        })
        const result = await res.json();
        setExam(result?.data);
        setLoading(false);
    }
    useEffect(() => {getExam();}, [])
    useEffect(() => {
    }, [exam])
    useEffect(() => {
        if (exam) { 
            const filteredClassLevels = classLevels.filter((item) => item !== exam?.classLevel);
            setClassLevels(filteredClassLevels);

            setNewExam({
                title: exam?.title,
                description: exam?.description, 
                duration: Number(exam?.duration),
                classLevel: exam?.classLevel, 
                isPublished: exam?.isPublished,
                startDate: new Date(exam?.startDate).toISOString(),
                endDate: new Date(exam?.endDate).toISOString(),

            })
        }
    }, [exam])

    const getExamScores = async () => { 
        const res = await fetch(`https://edu-master-psi.vercel.app/studentExam/exams/${id}`, {
            headers: {
                token: token
            }
        })
        const result = await res.json();
        setScores(result?.data);
    }

    useEffect(() => {getExamScores()}, []);

    const handleExamSubmit = async (e) => { 
        e.preventDefault();
        const res = await fetch(`https://edu-master-psi.vercel.app/exam/${id}`, {
            method: 'PUT', 
            body: JSON.stringify(newExam), 
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

    const handleQuestionUpdate = (questionId, id) => { 
        navigate('/manage-question', {state: {id: questionId, examId: id}});
    }

    const deleteQuestion = async () => {
        const res = await fetch(`https://edu-master-psi.vercel.app/question/${id}`, {
            method: 'DELETE',
            headers: { 
                token: token 
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

    const navigateToCreateQuestion = () => { 
        navigate('/create-question', {state: {examId: id}});
    }

    const deleteExam = async () => { 
        const res = await fetch(`https://edu-master-psi.vercel.app/exam/${id}`, {
            method: 'DELETE', 
            headers: { 
                token: token
            }
        });
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
            {
                loading ? 
                <LoadingSpinner /> 
                : 
                <> 
                    <Header /> 
                    <main>
                        <Toast />
                        <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                            <div className="w-full flex items-center justify-between"> 
                                <div className="flex items-center gap-3"> 
                                    <MdManageAccounts size={24}/>
                                    <div> 
                                        <h1 className="text-2xl font-bold">Manage Exam</h1>
                                        <h3 className="text-md text-black/40">View, edit, delete, and show scores for exams</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3"> 
                                    <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-700 
                                    transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2"
                                    onClick={deleteExam}
                                    >
                                        <FaRegTrashAlt />
                                        Delete Exam
                                    </button>
                                    
                                    <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                                    transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2 w-fit self-center my-2"
                                    onClick={navigateToCreateQuestion}>
                                        <FaPlus />
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-5 p-12">
                            <form onSubmit={handleExamSubmit} className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]">
                                <div className="text-2xl font-bold mb-4">Exam Details</div>
                                <div className="flex flex-col gap-1 text-lg">
                                    <label>Title</label>
                                    <input placeholder={exam?.title} className={inputStyles} type="text"
                                    onChange={(e) => setNewExam((prevState) => ({...prevState, title: e.target.value}))}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 text-lg">
                                    <label>Description</label>
                                    <input placeholder={exam?.description} className={inputStyles} type="text"
                                    onChange={(e) => setNewExam((prevState) => ({...prevState, description: e.target.value}))}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 text-lg">
                                    <label>Duration</label>
                                    <input placeholder={exam?.duration} className={inputStyles} type="number"
                                    onChange={(e) => setNewExam((prevState) => ({...prevState, duration: Number(e.target.value)}))}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 text-lg">
                                    <label>Class Level</label>
                                    <select name="class-level" id="class-level" className={inputStyles}
                                    onChange={(e) => setNewExam((prevState) => ({...prevState, classLevel: e.target.value}))}
                                    >
                                        <option value={exam?.classLevel}>{exam?.classLevel}</option>
                                        { 
                                            classLevels.map((item) => (
                                                <option value={item}>{item}</option>
                                            ))
                                        }   
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 text-lg">
                                    <label>Published</label>
                                    <div className="flex gap-2"> 
                                        <input type="radio" name="isPublished" value={true} id={'true'} checked={exam?.isPublished}
                                        onChange={(e) => setNewExam((prevState) => ({...prevState, isPublished: e.target.value}))}
                                        />
                                        <label htmlFor={'true'}>True</label>
                                    </div>
                                    <div className="flex gap-2"> 
                                        <input type="radio" name="isPublished" value={false} id={'false'} checked={exam?.isPublished === 'false' && true}
                                        onChange={(e) => setNewExam((prevState) => ({...prevState, isPublished: e.target.value}))}
                                        />
                                        <label htmlFor={'false'}>False</label>
                                    </div>
                                </div>
                                <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                                transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2 w-fit self-center my-2">
                                    <FaRegSave />
                                    Submit Changes
                                </button>
                            </form>
                        <div className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]">
                            <div className="text-2xl font-bold mb-5">Questions</div>
                            { 
                                exam?.questions?.map((question, index) => (
                                    <div className="border-b-2 border-b-[var(--border-color)] mb-5 flex flex-col"> 
                                    <div className="flex justify-between w-full items-center"> 
                                        <div className="text-lg mb-2 font-semibold">Question No.{index+1}</div>
                                        <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-700 
                                        transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2" onClick={() => deleteQuestion(question?._id)}>
                                            <FaRegTrashAlt />
                                            Delete Question
                                            </button>
                                    </div>
                                        <div className="flex flex-col gap-1 text-lg">
                                            <label>Title</label>
                                            <input placeholder={question?.text} className={inputStyles} type="text" disabled/>
                                        </div>

                                        <div className="flex flex-col gap-1 text-lg">
                                            <label>Type</label>
                                            <select name="question-type" id="question-type" className={inputStyles} disabled>
                                                <option value={question?.type}>{question?.type}</option>
                                                <option value="multiple-choice" className={question?.type === 'multiple-choice' && 'hidden'}>Multiple Choices</option>
                                                <option value="true-false" className={question?.type === 'true-false' && 'hidden'}>True or False</option>
                                                <option value="SHORT_ANSWER" className={question?.type === 'SHORT_ANSWER' && 'hidden'}>Short Answer</option>
                                            </select>
                                        </div>        

                                        {
                                            question?.type === 'multiple-choice' &&
                                            <div className="flex flex-col gap-1 text-lg">
                                                <label>Choices</label>
                                                {
                                                    question?.options?.map((opt) => (
                                                        <input placeholder={opt} className={inputStyles} type="text" disabled/>
                                                    ))
                                                }
                                            </div>           
                                        }

                                        <div className="flex flex-col gap-1 text-lg">
                                            <label>Correct Answer</label>
                                            <input placeholder={question?.correctAnswer} className={inputStyles} type="text" disabled/>
                                        </div>

                                        <div className="flex flex-col gap-1 text-lg">
                                            <label>Points</label>
                                            <input placeholder={question?.points} className={inputStyles} type="number" disabled/>
                                        </div>

                                        <button className="p-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600
                                        transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2 self-center my-3"
                                        onClick={() => handleQuestionUpdate(question?._id, id)}
                                        >
                                            <GrEdit />
                                            Edit Question
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="overflow-x-auto rounded-xl shadow-md w-[50dvw]">
                            <table className="min-w-full text-center text-sm md:text-base">
                                <thead className="bg-[var(--border-color)] hidden md:table-header-group">
                                    <tr>
                                        <th className="p-3">Student</th>
                                        <th className="p-3">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[var(--border-color)]"> 
                                    { 
                                        scores && 
                                        scores.map((score) => (
                                            <tr
                                            key={score?._id}
                                            className="block md:table-row hover:bg-black/10 transition-all duration-200 ease-linear cursor-pointer"> 
                                                <td className="md:table-cell p-3 w-full md:w-1/3 text-lg flex gap-1 flex-col">
                                                    <span className="font-semibold md:hidden">Student: </span>
                                                    <div className="text-sm md:text-lg">
                                                        {score?.student?.fullName}
                                                    </div>
                                                </td>

                                                <td className="flex md:table-cell p-3 w-full flex-col gap-1 md:w-1/4 text-lg">
                                                    <span className="font-semibold md:hidden">Class: </span>
                                                    {+score?.score}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </main>
                    <Footer/>
                </>
            }
        </>
    )
}