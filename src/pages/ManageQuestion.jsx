import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/context";
import LoadingSpinner from "../components/Loading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MdManageAccounts } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import Toast from "../components/Toast";
import { Bounce, toast } from "react-toastify";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`
export default function ManageQuestion() { 
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState();
    const [newQuestion, setNewQuestion] = useState({text: '', type: '', options: [], correctAnswer: '', exam: '', points: 0});
    const location = useLocation();
    const { id, examId } = location.state || null;
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const getQuestion = async () => { 
        const res = await fetch(`https://edu-master-psi.vercel.app/question/get/${id}`, {
            headers: {
                token: token
            }
        })
        const result = await res.json();
        setQuestion(result?.data);
        setLoading(false);
    }

    useEffect(() => {getQuestion()}, [])
    useEffect(() => {
        if (question) { 
            setNewQuestion({
                text: question?.text, 
                type: question?.type,
                options: question?.options || [],
                correctAnswer: question?.correctAnswer, 
                exam: examId, 
                points: +question?.points
            })  
        }
    }, [question])

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

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const body = {
            text: newQuestion.text,
            type: newQuestion.type, 
            correctAnswer: newQuestion.correctAnswer,
            exam: examId, 
            points: +newQuestion.points
        }
        if (newQuestion.type === 'multiple-choice') { 
            body.options = newQuestion.options;
        }
        const res = await fetch(`https://edu-master-psi.vercel.app/question/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
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
                                    <h1 className="text-2xl font-bold">Manage Question</h1>
                                </div>
                                <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-700 
                                transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2" onClick={deleteQuestion}>
                                    <FaRegTrashAlt />
                                    Delete Question
                                </button>
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-5 p-12"> 
                            <form onSubmit={handleSubmit} className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]"> 
                                    <div className="flex flex-col gap-1 text-lg">
                                        <label>Title</label>
                                        <input placeholder={question?.text} className={inputStyles} type="text"
                                        onChange={(e) => setNewQuestion((prevState) => ({...prevState, text: e.target.value}))}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 text-lg">
                                        <label>Type</label>
                                        <select name="question-type" id="question-type" className={inputStyles}
                                        onChange={(e) => setNewQuestion((prevState) => ({...prevState, type: e.target.value}))}
                                        >
                                            <option value={question?.type}>{question?.type}</option>
                                            <option value="multiple-choice" className={question?.type === 'multiple-choice' && 'hidden'}>Multiple Choices</option>
                                            <option value="true-false" className={question?.type === 'true-false' && 'hidden'}>True or False</option>
                                            <option value="SHORT_ANSWER" className={question?.type === 'SHORT_ANSWER' && 'hidden'}>Short Answer</option>
                                        </select>
                                    </div>        

                                    {
                                        question?.type === 'multiple-choice' || newQuestion.type === 'multiple-choice' &&
                                        <div className="flex flex-col gap-1 text-lg">
                                            <label>Choices</label>
                                            {
                                                question?.type === 'multiple-choice' && 
                                                <input placeholder={question?.options?.join(',')} type="text" className={inputStyles}
                                                onChange={(e) => setNewQuestion((prevState) => ({...prevState, options: (e.target.value).split(',')}))}
                                                /> 
                                            }
                                            {
                                                newQuestion.type === 'multiple-choice' && 
                                                <input placeholder="Enter choices with , between every choice" type="text" className={inputStyles}
                                                onChange={(e) => setNewQuestion((prevState) => ({...prevState, options: (e.target.value).split(',')}))}
                                                /> 
                                            }
                                        </div>           
                                    }

                                    <div className="flex flex-col gap-1 text-lg">
                                        <label>Correct Answer</label>
                                        <input placeholder={question?.correctAnswer} className={inputStyles} type="text"
                                        onChange={(e) => setNewQuestion((prevState) => ({...prevState, correctAnswer: e.target.value}))}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 text-lg">
                                        <label>Points</label>
                                        <input placeholder={question?.points} className={inputStyles} type="number"
                                        onChange={(e) => setNewQuestion((prevState) => ({...prevState, points: +e.target.value}))}
                                        />
                                    </div>
                                    <button type="submit" className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                                    transition-all duration-200 ease-linear cursor-pointer flex items-center gap-2 w-fit self-center my-2">
                                        <FaRegSave />
                                        Submit Changes
                                    </button>
                            </form>
                        </div>
                    </main>
                    <Footer />
                </>
            }
        </>
    )
}