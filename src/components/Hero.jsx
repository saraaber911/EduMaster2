import PrimaryButton from "./PrimaryButton";
import HeroImg from "../assets/hero-img.jpeg";
export default function Hero() { 
    return ( 
        <section className="flex md:flex-row flex-col-reverse gap-5 w-full justify-between items-center py-10 px-12 bg-[var(--primary-bg)]"> 
            <div className="flex flex-col md:w-1/2 text-center md:text-start gap-4">
                <h1 className="text-4xl 2xl:text-5xl font-bold text-balance"> 
                    Unlock Your Potential with EduMaster
                </h1>
                <h2 className="text-black/50"> 
                    Engaging lessons, comperhensive exams, and a personalized profile to track your growth. Learn at your pace with tools trusted by schools. 
                </h2>
                <PrimaryButton label={'Start Learning Now'} className={'self-center md:self-auto'}/>
            </div>
            <img src={HeroImg} alt="hero-thumbnail" className="rounded-2xl w-1/3 object-cover min-w-[250px] max-h-[500px]"/>
        </section>
    )
}