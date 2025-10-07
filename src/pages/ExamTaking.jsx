import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Save,
  Send
} from 'lucide-react';
import { AuthContext } from '../context/context';

const ExamTaking = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      if (data.success && data.data) {
        setExam(data.data);
        // تهيئة الإجابات
        const initialAnswers = {};
        data.data.questions?.forEach((question) => {
          initialAnswers[question._id] = '';
        });
        setAnswers(initialAnswers);
        
        // تعيين الوقت المتبقي
        setTimeRemaining(data.data.duration * 60); // تحويل إلى ثواني
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

  // تحديث الإجابة
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // حفظ الإجابات (auto-save)
  const saveAnswers = async () => {
    try {
      // يمكن إضافة API call لحفظ الإجابات تلقائياً
      console.log('Auto-saving answers:', answers);
    } catch (error) {
      console.error('Error saving answers:', error);
    }
  };

  // تسليم الامتحان
  const handleSubmitExam = async () => {
    const confirmed = window.confirm('Are you sure you want to submit this exam? This action cannot be undone.');
    if (!confirmed) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/submit/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({ 
          answers: answers,
          submittedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Exam submitted successfully! Your score: ${data.score || 'Calculating...'}%`);
        navigate('/exams');
      } else {
        throw new Error('Failed to submit exam');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // عداد الوقت
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // انتهى الوقت - تسليم تلقائي
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // حفظ تلقائي كل 30 ثانية
  useEffect(() => {
    const autoSave = setInterval(() => {
      saveAnswers();
    }, 30000);

    return () => clearInterval(autoSave);
  }, [answers]);

  useEffect(() => {
    if (examId && token) {
      fetchExamDetails();
    }
  }, [examId, token]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 300) return 'text-green-600'; // أكثر من 5 دقائق
    if (timeRemaining > 60) return 'text-yellow-600';  // أكثر من دقيقة
    return 'text-red-600'; // أقل من دقيقة
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
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
    );
  }

  const currentQ = exam?.questions?.[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam?.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {exam?.questions?.length || 0}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              {/* Progress */}
              <div className="text-sm text-gray-600">
                Answered: {getAnsweredCount()}/{exam?.questions?.length || 0}
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {exam?.questions?.map((question, index) => (
                  <button
                    key={question._id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium transition-colors
                      ${index === currentQuestion 
                        ? 'bg-blue-600 text-white' 
                        : answers[question._id] && answers[question._id].trim() !== ''
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                  <span className="text-gray-600">Not answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            {currentQ && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Question {currentQuestion + 1}
                    </h2>
                    <span className="text-sm text-blue-600 font-medium">
                      {currentQ.points} points
                    </span>
                  </div>
                  
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentQ.text}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQ.type === 'multiple-choice' && currentQ.options && (
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={currentQ._id}
                            value={option}
                            checked={answers[currentQ._id] === option}
                            onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-3 text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQ.type === 'text' && (
                    <textarea
                      value={answers[currentQ._id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={6}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={saveAnswers}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </button>
                  
                  <button
                    onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === exam.questions.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTaking;
