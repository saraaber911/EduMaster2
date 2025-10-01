import PrimaryButton from "../components/PrimaryButton";
import { AuthContext } from "../context/context";
export default function UsersTable({filteredItems, navigateToUserPage}) { 
    return ( 
        <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-[var(--border-color)] hidden md:table-header-group">
                <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Class Level</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--border-color)]">
                {filteredItems &&
                    filteredItems.map((acc) => (
                    <tr
                        key={acc?._id}
                        className="block md:table-row hover:bg-black/10 transition-all duration-200 ease-linear cursor-pointer"
                        onClick={() => navigateToUserPage(acc)}
                    >
                        {/* Name */}
                        <td className="md:table-cell p-3 w-full md:w-1/3 text-lg flex gap-1 flex-col">
                        <span className="font-semibold md:hidden">Name: </span>
                        <div className="text-sm md:text-lg">
                            {acc?.fullName?.length > 15
                            ? acc?.fullName?.slice(0, 16)
                            : acc?.fullName}
                        </div>
                        </td>

                        {/* Role */}
                        <td className="flex md:table-cell p-3 w-full flex-col gap-1 md:w-1/4 text-lg">
                        <span className="font-semibold md:hidden">Role: </span>
                        {acc?.role}
                        </td>

                        {/* Class Level */}
                        <td className="flex md:table-cell p-3 flex-col gap-1 w-full md:w-1/4">
                        <span className="font-semibold md:hidden">Class Level: </span>
                        {acc?.classLevel}
                        </td>

                        {/* Actions */}
                        <td className="flex md:table-cell p-3 flex-col gap-1 w-full md:w-1/6">
                            <PrimaryButton label={'View'} />
                        </td>
                    </tr>
                    ))}
                </tbody>
        </table>
        </div>
    )
}