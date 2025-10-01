import PrimaryButton from "./PrimaryButton"
export default function ExamsTable({exams, navigateToExamPage}) { 
    return ( 
        <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full text-left text-sm md:text-base">
                <thead className="bg-[var(--border-color)] hidden md:table-header-group">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--border-color)]">
                    {exams &&
                        exams.map((exam) => (
                        <tr
                            key={exam?._id}
                            className="block md:table-row hover:bg-black/10 transition-all duration-200 ease-linear cursor-pointer"
                            onClick={() => navigateToExamPage(exam._id)}
                        >
                            {/* Name */}
                            <td className="md:table-cell p-3 w-full md:w-1/3 text-lg flex gap-1 flex-col">
                            <span className="font-semibold md:hidden">Title: </span>
                            <div className="text-sm md:text-lg">
                                {exam?.title?.length > 15
                                ? exam?.title?.slice(0, 16) + "..."
                                : exam?.title}
                            </div>
                            </td>
    
                            {/* Role */}
                            <td className="flex md:table-cell p-3 w-full flex-col gap-1 md:w-1/4 text-lg">
                            <span className="font-semibold md:hidden">Class: </span>
                            {exam?.classLevel}
                            </td>
    
                            {/* Class Level */}
                            <td className="flex md:table-cell p-3 flex-col gap-1 w-full md:w-1/4">
                            <span className="font-semibold md:hidden">Duration: </span>
                            {exam?.duration + "s"}
                            </td>
    
                            {/* Actions */}
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