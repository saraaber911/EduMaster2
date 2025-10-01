import Hero from '../components/Hero';
import HomeCard from '../components/HomeCard';
import { PiBookOpenTextBold } from "react-icons/pi";
import { FiCheckCircle } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import PrimaryButton from '../components/PrimaryButton';
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function Home() {
    return (
    <>
    <Header/>
        <Hero />
        <section className='px-12 py-10 flex flex-col gap-4'> 
            <div className='font-bold text-2xl text-center'>Everything you need to succeed</div> 
            <div className='flex w-full gap-3 flex-wrap md:flex-nowrap justify-center'> 
                <HomeCard 
                title={'Interactive Lessons'} 
                icon={<PiBookOpenTextBold />} 
                className={'bg-teal-500 text-gray-50 text-lg text-balance'}
                description={'Learn with bite-sized modules, visuals, and practice activities designed to keep you engaged and motivated.'}
                type='MAIN_CARD'
                />
                <HomeCard 
                title={'Comprehensive Exams'} 
                icon={<FiCheckCircle />} 
                className={'bg-orange-400 text-black text-lg text-balance'}
                description={'Assess your understanding with adaptive quizzes and exams that provide instant feedback and detailed reports.'}
                type='MAIN_CARD'
                />
                <HomeCard 
                title={'Personalized Profile'} 
                icon={<GoPerson />} 
                className={'bg-[var(--primary)] text-white text-xl text-balance'}
                description={'Track progress, set goals, and celebrate milestones with a profile tailored to your learning journey'}
                type='MAIN_CARD'
                />
            </div>
        </section>
        <section className='w-full bg-[var(--primary-bg)] p-12 flex flex-wrap justify-center gap-5'> 
            <HomeCard 
            title={'Built for Schools'}
            description={'Trusted by educators to streamline learning across classes and grades'}
            />
            <HomeCard 
            title={'Accessible Anywhere'}
            description={'Use EduMaster on any device. Your progress syncs seamlessly'}
            />
        </section>
        <section className='flex justify-center items-center p-12 gap-10 flex-wrap'> 
            <div className='flex flex-col gap-3'> 
                <div className='font-bold text-2xl'>Ready to begin your learning journey?</div>
                <div className='text-black/40'>Join thousands of students improving their skills every day with EduMaster</div>
            </div>
                <PrimaryButton label={'Create Your Free Account'}/>
        </section>
        <Footer/>
    </>
    );
}