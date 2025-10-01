export default function HomeCard({icon, title, description, className, type}) { 
    const calculateMaxWidth = () => { 
        if (type === 'MAIN_CARD') { 
            return 'max-w-[500px]'
        }
    }
    return ( 
        <div className={`flex flex-col gap-3 min-w-[200px] ${calculateMaxWidth()} bg-white border-2 border-[var(--border-color)] rounded-2xl p-6`}> 
            { 
                icon && 
                <div className={`rounded-xl p-2 ${className} w-10 h-10 flex items-center justify-center`}>{icon}</div>
            }
            <div className="md:text-xl text-sm font-bold">{title}</div>
            <div className="text-black/40 text-balance">{description}</div>
        </div>
    )
}