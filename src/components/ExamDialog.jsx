import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle,
  CheckCircle,
  Save
} from 'lucide-react';
import { AuthContext } from '../context/context';

const ExamDialog = ({ isOpen, onClose, exam, onSubmitSuccess }) => {
  const { token } = useContext(AuthContext);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);

  // تهيئة الامتحان
  useEffect(() => {
    if (isOpen && exam) {
      console.log('Initializing exam:', exam);
      setExamQuestions(exam.questions || []);
      setTimeRemaining(exam.duration * 60); // تحويل إلى ثواني
      setCurrentQuestion(0);
      setAnswers({});
      setExamStarted(false);
      setIsSubmitting(false);

      // تحقق من وجود الأسئلة
      if (!exam.questions || exam.questions.length === 0) {
        console.warn('⚠️ No questions found in exam:', exam);
      }
    }
  }, [isOpen, exam]);

  // انتهاء الوقت
  const handleTimeUp = useCallback(() => {
    setExamStarted(false);
    alert('⏰ Time is up! The exam has been automatically submitted.');
    // سنعرف handleSubmit لاحقاً
  }, []);

  // عداد الوقت
  useEffect(() => {
    let timer;
    if (examStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, handleTimeUp]);

  // بدء الامتحان
  const startExam = useCallback(async () => {
    try {
      console.log('Starting exam:', exam._id);

      const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/start/${exam._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          examId: exam._id
        })
      });

      console.log('Start exam response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Start exam result:', result);
        setExamStarted(true);
      } else {
        const errorText = await response.text();
        console.error('Start exam error:', errorText);
        throw new Error(`Failed to start exam: ${errorText}`);
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert(`Failed to start exam: ${error.message}. Please try again.`);
    }
  }, [exam, token]);



  // تحديث الإجابة مع حفظ تلقائي
  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  // حفظ تلقائي كل 30 ثانية
  useEffect(() => {
    let autoSaveTimer;
    if (examStarted && Object.keys(answers).length > 0) {
      autoSaveTimer = setInterval(async () => {
        console.log('Auto-saving answers...', answers);

        try {
          // حفظ تلقائي للإجابات
          const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/save/${exam._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              answers: answers,
              lastSaved: new Date().toISOString()
            })
          });

          if (response.ok) {
            console.log('✅ Answers auto-saved successfully');
          } else {
            console.warn('⚠️ Auto-save failed, but continuing...');
          }
        } catch (error) {
          console.warn('⚠️ Auto-save error:', error.message);
        }
      }, 30000); // كل 30 ثانية
    }
    return () => clearInterval(autoSaveTimer);
  }, [examStarted, answers, exam?._id, token]);

  // تسليم الامتحان
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;

    if (!isAutoSubmit) {
      const confirmed = window.confirm('Are you sure you want to submit this exam? This action cannot be undone.');
      if (!confirmed) return;
    }

    setIsSubmitting(true);

    try {
      // تحويل الإجابات إلى التنسيق المطلوب
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: questionId,
        answer: answer,
        isCorrect: false // سيتم تحديدها من الخادم
      }));

      console.log('Submitting exam with answers:', formattedAnswers);

      const response = await fetch(`https://edu-master-psi.vercel.app/studentExam/submit/${exam._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          submittedAt: new Date().toISOString(),
          examId: exam._id
        })
      });

      console.log('Submit response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Submit result:', result);

        // عرض النتيجة
        const message = `
🎉 Exam Submitted Successfully!

📊 Your Results:
• Score: ${result.data?.score || result.score || 'Calculating...'}%
• Grade: ${result.data?.grade || result.grade || 'Pending'}
• Total Questions: ${examQuestions.length}
• Answered: ${Object.keys(answers).length}

${(result.data?.score || result.score || 0) >= 70 ? '✅ Congratulations! You passed!' : '❌ Better luck next time!'}
        `;

        alert(message);

        if (onSubmitSuccess) {
          onSubmitSuccess(result.data || result);
        }

        onClose();
      } else {
        const errorText = await response.text();
        console.error('Submit error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert(`❌ Failed to submit exam: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, token, answers, examQuestions.length, onSubmitSuccess, onClose, isSubmitting]);

  // تنسيق الوقت
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // لون الوقت حسب المتبقي
  const getTimeColor = () => {
    if (timeRemaining > 300) return 'text-green-600'; // أكثر من 5 دقائق
    if (timeRemaining > 60) return 'text-yellow-600';  // أكثر من دقيقة
    return 'text-red-600'; // أقل من دقيقة
  };

  // عدد الأسئلة المجابة
  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
  };

  // التنقل بين الأسئلة مع تحسين الأداء وتمرير سلس
  const goToQuestion = useCallback((index) => {
    setCurrentQuestion(index);
    // تمرير سلس إلى أعلى المحتوى عند تغيير السؤال
    setTimeout(() => {
      const contentElement = document.querySelector('.question-content');
      if (contentElement) {
        contentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentQuestion(prev => Math.min(examQuestions.length - 1, prev + 1));
  }, [examQuestions.length]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!examStarted) return;

      if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && currentQuestion < examQuestions.length - 1) {
        goToNext();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [examStarted, currentQuestion, examQuestions.length, goToPrevious, goToNext, handleSubmit]);

  // منع إغلاق الامتحان أثناء التشغيل
  const handleCloseAttempt = useCallback(() => {
    if (examStarted) {
      const confirmed = window.confirm(
        'Are you sure you want to close the exam? Your progress will be lost and the exam will be marked as incomplete.'
      );
      if (confirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [examStarted, onClose]);

  if (!isOpen) return null;

  const currentQ = examQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">{exam?.title}</h2>
            {examStarted && (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {examStarted && (
              <>
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {examQuestions.length}
                </span>
                <span className="text-sm text-gray-600">
                  Answered: {getAnsweredCount()}/{examQuestions.length}
                </span>
              </>
            )}
            <button
              onClick={handleCloseAttempt}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 flex min-h-0">
          {!examStarted ? (
            // شاشة البداية - Scrollable
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-8">
                <div className="text-center max-w-md w-full">
                  <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h3>

                  <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{exam?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{examQuestions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points:</span>
                      <span className="font-medium">
                        {examQuestions.reduce((sum, q) => sum + (q.points || 1), 0)}
                      </span>
                    </div>
                  </div>

                  {examQuestions.length === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium mb-1">No Questions Available</p>
                          <p>This exam doesn't have any questions yet. Please contact your instructor.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Important Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Once started, the timer cannot be paused</li>
                          <li>Make sure you have a stable internet connection</li>
                          <li>You can navigate between questions freely</li>
                          <li>Submit before time runs out to avoid auto-submission</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startExam}
                    disabled={examQuestions.length === 0}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {examQuestions.length === 0 ? 'No Questions Available' : 'Start Exam'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // شاشة الامتحان
            <>
              {/* Question Navigation Sidebar - Fixed width, scrollable content */}
              <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Sidebar Header - Fixed */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>

                  <div className="grid grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
                    {examQuestions.map((question, index) => (
                      <button
                        key={question._id}
                        onClick={() => goToQuestion(index)}
                        className={`
                          w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200 relative
                          ${index === currentQuestion
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : answers[question._id] && answers[question._id].trim() !== ''
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                          }
                        `}
                        title={`Question ${index + 1}${answers[question._id] ? ' (Answered)' : ' (Not answered)'}`}
                      >
                        {index + 1}
                        {answers[question._id] && answers[question._id].trim() !== '' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Content - Scrollable */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-2 text-sm mb-6">
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

                  {/* Progress Info */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">Progress</div>
                      <div>{getAnsweredCount()} of {examQuestions.length} answered</div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(getAnsweredCount() / examQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center font-medium"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                  </button>
                </div>
              </div>

              {/* Question Content - Fully scrollable */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Question Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 question-content">
                  {currentQ && (
                    <div className="max-w-3xl">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Question {currentQuestion + 1}
                          </h3>
                          <span className="text-sm text-blue-600 font-medium">
                            {currentQ.points || 1} point{(currentQ.points || 1) > 1 ? 's' : ''}
                          </span>
                        </div>

                        <p className="text-gray-800 text-lg leading-relaxed">
                          {currentQ.text}
                        </p>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-4 mb-8">
                        {currentQ.type === 'multiple-choice' && currentQ.options && (
                          <div className="space-y-3">
                            {currentQ.options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
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
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Your Answer:
                            </label>
                            <textarea
                              value={answers[currentQ._id] || ''}
                              onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                              placeholder="Type your answer here..."
                              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={8}
                            />
                            <div className="text-xs text-gray-500">
                              Characters: {(answers[currentQ._id] || '').length}
                            </div>
                          </div>
                        )}

                        {/* True/False Questions */}
                        {(currentQ.type === 'true-false' ||
                          currentQ.type === 'boolean' ||
                          currentQ.type === 'true_false' ||
                          (currentQ.options && currentQ.options.length === 2 &&
                           currentQ.options.some(opt =>
                             opt.toLowerCase().includes('true') ||
                             opt.toLowerCase().includes('false') ||
                             opt.toLowerCase().includes('صح') ||
                             opt.toLowerCase().includes('خطأ')
                           ))) && (
                          <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                              Choose your answer:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {['True', 'False'].map((option) => (
                                <label
                                  key={option}
                                  className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                                    answers[currentQ._id] === option
                                      ? option === 'True'
                                        ? 'border-green-500 bg-green-50 shadow-lg'
                                        : 'border-red-500 bg-red-50 shadow-lg'
                                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={currentQ._id}
                                    value={option}
                                    checked={answers[currentQ._id] === option}
                                    onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                                    className="sr-only"
                                  />
                                  <div className="text-center">
                                    <div className={`text-3xl mb-2 ${
                                      answers[currentQ._id] === option
                                        ? option === 'True' ? 'text-green-600' : 'text-red-600'
                                        : 'text-gray-400'
                                    }`}>
                                      {option === 'True' ? '✓' : '✗'}
                                    </div>
                                    <span className={`text-lg font-semibold ${
                                      answers[currentQ._id] === option
                                        ? option === 'True' ? 'text-green-700' : 'text-red-700'
                                        : 'text-gray-700'
                                    }`}>
                                      {option}
                                    </span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Default fallback for other question types */}
                        {currentQ.type !== 'multiple-choice' &&
                         currentQ.type !== 'text' &&
                         currentQ.type !== 'true-false' &&
                         currentQ.type !== 'boolean' &&
                         currentQ.type !== 'true_false' &&
                         !(currentQ.options && currentQ.options.length === 2 &&
                           currentQ.options.some(opt =>
                             opt.toLowerCase().includes('true') ||
                             opt.toLowerCase().includes('false') ||
                             opt.toLowerCase().includes('صح') ||
                             opt.toLowerCase().includes('خطأ')
                           )) && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                              Question type "{currentQ.type}" is not yet supported in this interface.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Footer - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between max-w-3xl">
                    <button
                      onClick={goToPrevious}
                      disabled={currentQuestion === 0}
                      className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        {currentQuestion + 1} of {examQuestions.length}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        Use ← → keys to navigate
                      </div>
                    </div>

                    <button
                      onClick={goToNext}
                      disabled={currentQuestion === examQuestions.length - 1}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// التحقق من وجود exam قبل عرض المكون
const ExamDialogWrapper = ({ isOpen, onClose, exam, onSubmitSuccess }) => {
  if (!isOpen || !exam) {
    return null;
  }

  return (
    <ExamDialog
      isOpen={isOpen}
      onClose={onClose}
      exam={exam}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
};

export default ExamDialogWrapper;
