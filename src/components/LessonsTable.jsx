import { useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

export default function LessonsTable({lessons}) { 
    const navigate = useNavigate();
    const navigateToLessonPage = (lesson) => { 
        navigate('/manage-lesson', {state: {lesson: lesson}});
    }
    return ( 
        <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full text-left text-sm md:text-base">
                <thead className="bg-[var(--border-color)] hidden md:table-header-group">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--border-color)]">
                    {lessons &&
                        lessons.map((lesson) => (
                        <tr
                            key={lesson?._id}
                            className="block md:table-row hover:bg-black/10 transition-all duration-200 ease-linear cursor-pointer"
                            onClick={() => navigateToLessonPage(lesson)}
                        >
                            <td className="md:table-cell p-3 w-full md:w-1/3 text-lg flex gap-1 flex-col">
                            <span className="font-semibold md:hidden">Title: </span>
                            <div className="text-sm md:text-lg">
                                {lesson?.title?.length > 15
                                ? lesson?.title?.slice(0, 16) + "..."
                                : lesson?.title}
                            </div>
                            </td>
    
                            <td className="flex md:table-cell p-3 w-full flex-col gap-1 md:w-1/4 text-lg">
                            <span className="font-semibold md:hidden">Class: </span>
                            {lesson?.classLevel}
                            </td>
    
                            <td className="flex md:table-cell p-3 flex-col gap-1 w-full md:w-1/4">
                            <span className="font-semibold md:hidden">Price: </span>
                            {lesson?.isPaid ? lesson?.price + "EGP" : 'Free'}
                            </td>
    
                            <td className="flex md:table-cell p-3 flex-col gap-1 w-full md:w-1/6">
                            <PrimaryButton label="View" />
                            </td>
                        </tr>
                        ))}
                    </tbody>
            </table>
        </div>
    )
}