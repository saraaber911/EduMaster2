import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  FileText, 
  Calendar, 
  User, 
  BookOpen, 
  Timer, 
  Play, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/context';

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [canStart, setCanStart] = useState(false);

  // جلب تفاصيل الامتحان
  const fetchExamDetails = async () => {
    try {
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`https://edu-master-psi.vercel.app/exam/get/${examId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Exam details fetched:', data);
      
      if (data.success && data.data) {
        setExam(data.data);
        checkExamAvailability(data.data);
      } else {
        setError('Exam not found');
      }
    } catch (error) {
      console.error('Error fetching exam details:', error);
      setError('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  // التحقق من إمكانية بدء الامتحان
  const checkExamAvailability = (examData) => {
    const now = new Date();
    const startDate = new Date(examData.startDate);
    const endDate = new Date(examData.endDate);
    
    if (now >= startDate && now <= endDate) {
      setCanStart(true);
    } else {
      setCanStart(false);
    }
  };

  // جلب الوقت المتبقي
  const fetchRemainingTime = async () => {
    try {
      const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/exams/remaining-time/${examId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          token: token,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRemainingTime(data);
      }
    } catch (error) {
      console.error('Error fetching remaining time:', error);
    }
  };

  // بدء الامتحان
  const handleStartExam = async () => {
    const confirmed = window.confirm('Are you ready to start this exam? Once started, the timer will begin.');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/start/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Exam started:', data);
        // الانتقال مباشرة إلى صفحة الامتحان
        navigate(`/exam-taking/${examId}`);
      } else {
        throw new Error('Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam. Please try again.');
    }
  };

  useEffect(() => {
    if (examId && token) {
      fetchExamDetails();
      fetchRemainingTime();
    }
  }, [examId, token]);

  // تحديث الوقت المتبقي كل دقيقة
  useEffect(() => {
    if (exam && canStart) {
      const interval = setInterval(() => {
        fetchRemainingTime();
      }, 60000); // كل دقيقة

      return () => clearInterval(interval);
    }
  }, [exam, canStart]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (!exam) return 'bg-gray-100 text-gray-800';
    
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    if (now < startDate) return 'bg-yellow-100 text-yellow-800';
    if (now >= startDate && now <= endDate) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (!exam) return 'Unknown';
    
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    if (now < startDate) return 'Upcoming';
    if (now >= startDate && now <= endDate) return 'Available';
    return 'Expired';
  };

   if (loading) {
     return (
      <>
      <Header />
       <div className="min-h-screen bg-blue-50">
         
         <div className="flex items-center justify-center h-110">
           <div className="text-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
             <p className="mt-4 text-gray-600">Loading Details...</p>
           </div>
         </div>
         
       </div>
       <Footer />
       </>
     );
   }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Exam</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/exams')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Exams
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <><Header />
    <div className="min-h-screen bg-blue-50">
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/exams')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam?.title}</h1>
              <p className="text-gray-600 mt-2">{exam?.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Timer className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{exam?.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="font-medium">{exam?.questions?.length || 0} questions</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Class Level</p>
                    <p className="font-medium">{exam?.classLevel}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="font-medium">{exam?.isPublished ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{formatDate(exam?.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{formatDate(exam?.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            {exam?.questions && exam.questions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions Overview</h2>
                
                <div className="space-y-3">
                  {exam.questions.map((question, index) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          Question {index + 1}: {question.type}
                        </h3>
                        <span className="text-sm text-blue-600 font-medium">
                          {question.points} points
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{question.text}</p>
                      {question.type === 'multiple-choice' && (
                        <p className="text-sm text-gray-500 mt-1">
                          {question.options?.length || 0} options available
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              {canStart ? (
                <button
                  onClick={handleStartExam}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Exam
                </button>
              ) : (
                <div className="text-center">
                  <Info className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {new Date() < new Date(exam?.startDate) 
                      ? 'Exam not yet available' 
                      : 'Exam has expired'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Time Info */}
            {remainingTime && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Remaining Time</p>
                      <p className="font-medium">{remainingTime.remainingTime || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exam Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-medium">{exam?.questions?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points</span>
                  <span className="font-medium">
                    {exam?.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{exam?.duration} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
    <Footer />
    </>
  );
};

export default ExamDetails;
