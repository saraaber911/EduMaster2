import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu"
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { LuBook } from "react-icons/lu";
import { AuthContext } from "../context/context";
import PrimaryButton from "../components/PrimaryButton";
import UsersTable from "../components/UsersTable";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/Loading";
import LessonsTable from "../components/LessonsTable";
import ExamsTable from "../components/ExamsTable";
export default function Dashboard() {
    const [users, setUsers] = useState();
    const [lessons, setLessons] = useState(); 
    const [exams, setExams] = useState();
    const {token} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const fetchUrl = async (url) => { 
        const response = await fetch(url, {
            headers: {
                token: token
            }
        });
        const result = await response.json();
        return result;
    }

    const getUsers = async () => {
        const res = await fetchUrl('https://edu-master-psi.vercel.app/admin/all-user');
        setUsers(res?.data);
    }

    const getLessons = async () => { 
        const res = await fetchUrl('https://edu-master-psi.vercel.app/lesson/?classLevel=Grade 1 Secondary');
        setLessons(res?.data);
    }

    const getExams = async () => { 
        const res = await fetchUrl('https://edu-master-psi.vercel.app/exam');
        setExams(res?.data);
    }

    const navigateToUserPage = (user) => { 
        navigate('/manage-user', {state: {user: user}});
    }

    const navigateToExamPage = (examId) => { 
        navigate('/manage-exam', {state: {id: examId}});
    }

    useEffect(() => {
        getUsers();
        getExams();
        getLessons();
    }, [])

    useEffect(() => {
        if (users && lessons && exams) { 
            setLoading(false);
        }
    }, [users, lessons, exams])

    return ( 
        <>
        { 
            loading ? 
            <LoadingSpinner /> 
            : 
            <> 
                <Header />
                <main className="flex flex-col min-h-screen w-full">
                    <div className="flex-grow">
                        <div className="bg-[var(--primary-bg)] p-12 flex flex-col items-center md:flex-row md:justify-between w-full gap-4"> 
                            <div className="flex items-center gap-3">
                                <IoSettingsOutline size={24}/>
                                <div className="flex flex-col gap-1"> 
                                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                                    <h3 className="text-black/40">Manage users, lessons, exams and monitor performance</h3>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-5 w-1/2 justify-end items-center"> 
                                <div className="flex gap-2 items-center bg-white p-2 rounded-3xl border-1 border-[var(--border-color)]">
                                    <LuUsersRound size={18}/>
                                    <div>{users?.length}</div>
                                    <div>Users</div>
                                </div>

                                <div className="flex gap-2 items-center bg-white p-2 rounded-3xl border-1 border-[var(--border-color)]">
                                    <LuBook size={18}/>
                                    <div>{lessons?.length}</div>
                                    <div>Lessons</div>
                                </div>

                                <div className="flex gap-2 items-center bg-white p-2 rounded-3xl border-1 border-[var(--border-color)]">
                                    <HiOutlineDocumentChartBar size={18}/>
                                    <div>{exams?.length}</div>
                                    <div>Exams</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex px-12 py-6 w-full gap-4">
                            <section className="flex flex-wrap justify-center w-[100dvw] items-center gap-5">
                                <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl p-4 flex flex-col gap-3 w-[50%]">
                                        <div className="font-bold text-2xl mt-1">Users</div>
                                    <UsersTable filteredItems={users} navigateToUserPage={navigateToUserPage}/>
                                    
                                </div>

                                <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl p-4 flex flex-col gap-3 w-[50%]">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-2xl">Lessons</div>
                                        <PrimaryButton label={'Add Lesson'}/>
                                    </div>
                                    <LessonsTable lessons={lessons} />
                                </div>

                                <div className="bg-white border-2 border-[var(--border-color)] rounded-2xl p-4 flex flex-col gap-3 w-[50%]">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-2xl">Exams</div>
                                        <PrimaryButton label={'Add Exam'} fn={() => navigate('/create-exam')}/>
                                    </div>
                                    <ExamsTable exams={exams} navigateToExamPage={navigateToExamPage} />
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        }
        </>
    )
}