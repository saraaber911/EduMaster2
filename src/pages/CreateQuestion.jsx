import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { MdManageAccounts } from "react-icons/md";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrimaryButton from "../components/PrimaryButton";
import { AuthContext } from "../context/context";
import Toast from "../components/Toast";
import { Bounce, toast } from "react-toastify";
const inputStyles = `mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100`
export default function CreateQuestion() { 
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState({text: '', type: 'true-false', options: [], correctAnswer: '', points: ''})
    const { examId } = location.state || null;
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const createQuestion = async (e) => {
        setLoading(true);
        e.preventDefault(); 
        const body = { 
            text: question.text,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer,
            exam: examId,
            points: question.points
        }
        if (question.type === 'true-false') { 
            body.options = ['True', 'False'];
        }
        const res = await fetch('https://edu-master-psi.vercel.app/question', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                token: token,
                'content-type': 'application/json'
            }
        })
        const result = await res.json();
        setLoading(false);
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
                            <h1 className="text-2xl font-bold">Create Question</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center p-12"> 
                    <form onSubmit={createQuestion} className="flex flex-col p-5 rounded-2xl border-2 border-[var(--border-color)] w-[50dvw]"> 
                        <label className="font-semibold text-lg">Question</label>
                        <input placeholder="Enter your question" type="text" className={inputStyles} 
                        onChange={(e) => setQuestion((prevState) => ({...prevState, text: e.target.value}))}
                        />

                        <label className="font-semibold text-lg">Type</label>
                        <select name="question-type" id="question-type" className={inputStyles}
                        onChange={(e) => setQuestion((prevState) => ({...prevState, type: e.target.value}))}
                        >
                            <option value="true-false">True/False</option>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="SHORT_ANSWER">Short Answer</option>
                        </select>

                        {
                            question.type === 'multiple-choice' &&
                            <> 
                                <label>Choices</label>
                                <input type="text" placeholder="Enter choices for this question with , between each choice" className={inputStyles}
                                onChange={(e) => setQuestion((prevState) => ({...prevState, options: (e.target.value).split(',')}))}
                                />         
                            </>
                        }

                        <label className="font-semiBold text-lg">Correct Answer</label>
                        <input type="text" placeholder="Enter the correct answer for the question" className={inputStyles} 
                        onChange={(e) => setQuestion((prevState) => ({...prevState, correctAnswer: e.target.value}))}
                        />

                        <label className="font-semiBold text-lg">Points</label>
                        <input type="number" placeholder="Enter points for this question" className={inputStyles} 
                        onChange={(e) => setQuestion((prevState) => ({...prevState, points: +e.target.value}))}
                        />

                        <PrimaryButton label={loading ? 'Creating...' : 'Create Question'} className={'self-center'}/>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}