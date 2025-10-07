import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, FileText, Calendar, Play, Eye, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ExamDialog from '../components/ExamDialog';
import { AuthContext } from '../context/context';

const ExamPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const { token } = useContext(AuthContext);

  // جلب الامتحانات
  const fetchExams = useCallback(async () => {
    if (!token) {
      console.error('No token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching exams...');

      const response = await fetch('https://edu-master-psi.vercel.app/exam', {
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
      console.log('API Response:', data);

      // معالجة البيانات
      let examsList = [];

      if (Array.isArray(data)) {
        examsList = data;
      } else if (data && data.success === true && Array.isArray(data.data)) {
        examsList = data.data;
      } else if (data && data.success === true && data.data) {
        examsList = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data && Array.isArray(data.data)) {
        examsList = data.data;
      } else if (data && data.data) {
        examsList = [data.data];
      } else if (data && typeof data === 'object' && !data.success && !data.data) {
        examsList = [data];
      } else {
        examsList = [];
      }

      // تنسيق البيانات
      const processedExams = examsList.filter(exam => exam && (exam._id || exam.id)).map(exam => ({
        ...exam,
        id: exam._id || exam.id,
        title: exam.title || exam.name || 'Untitled Exam',
        subject: exam.subject || exam.category || 'General',
        duration: exam.duration || exam.timeLimit || 60,
        questionsCount: exam.questions?.length || exam.questionsCount || 0,
        status: getExamStatus(exam)
      }));

      console.log('Loaded', processedExams.length, 'exams');
      setExams(processedExams);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams. Please try again.');
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // تحديد حالة الامتحان
  const getExamStatus = (exam) => {
    if (!exam.startDate && !exam.openTime) return 'Available';

    const now = new Date();
    const startDate = new Date(exam.startDate || exam.openTime);
    const endDate = new Date(exam.endDate || exam.closeTime);

    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Completed';
    return 'Active';
  };



  // تنسيق الوقت المتبقي
  const formatTimeRemaining = (exam) => {
    if (!exam.startDate && !exam.openTime) return null;

    const now = new Date();
    const startDate = new Date(exam.startDate || exam.openTime);
    const endDate = new Date(exam.endDate || exam.closeTime);

    if (now < startDate) {
      const diff = Math.floor((startDate - now) / 1000 / 60);
      if (diff > 60) {
        const hours = Math.floor(diff / 60);
        return `Starts in ${hours}h ${diff % 60}m`;
      }
      return `Starts in ${diff}m`;
    }

    if (now <= endDate) {
      const diff = Math.floor((endDate - now) / 1000 / 60);
      if (diff > 60) {
        const hours = Math.floor(diff / 60);
        return `${hours}h ${diff % 60}m remaining`;
      }
      return `${diff}m remaining`;
    }

    return 'Ended';
  };

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // بدء الامتحان
  const handleStartExam = useCallback(async (exam) => {
    try {
      const response = await fetch(`https://edu-master-psi.vercel.app/exam/get/${exam._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSelectedExam(data.data);
          setIsExamDialogOpen(true);
        } else {
          alert('Failed to load exam details.');
        }
      } else {
        throw new Error('Failed to fetch exam details');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load exam. Please try again.');
    }
  }, [token]);

  // إغلاق Dialog
  const handleCloseDialog = useCallback(() => {
    setIsExamDialogOpen(false);
    setSelectedExam(null);
  }, []);

  // نجح تسليم الامتحان
  const handleExamSuccess = useCallback((result) => {
    setExams(prevExams => 
      prevExams.map(exam => 
        exam._id === selectedExam._id 
          ? { ...exam, status: 'Completed', score: result.score }
          : exam
      )
    );
  }, [selectedExam]);

  // فلترة الامتحانات
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // ألوان الحالات
  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Available': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
      <Header />
        <div className="min-h-screen bg-blue-50">
        
        <div className="flex items-center justify-center h-110">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exams...</p>
          </div>
        </div>
        
      </div>
      <Footer />
      </>
    );
  }

  // إذا لم يكن هناك token
  if (!token) {
    return (
      <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to view your exams.</p>
          </div>
        </div>
        
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Header />
      <div className="min-h-screen bg-blue-50 ">
  

  <div className="max-w-7xl m-auto px-4 sm:px-6 bg-blue-50 lg:px-8 py-6">
    {/* Page Header */}
    <div className="mb-4  ">
      <div className='max-w-6xl mx-auto   bg-blue-50 '>
      <div className="flex items-center mb-4 ">
        <FileText className="h-8 w-8 text-gray-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
          <p className="text-gray-600">View and take your assigned exams</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      </div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchExams}
            className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )}

    {/* Exam Cards Section */}
    <div className=" max-w-6xl mx-auto px-4 sm:px-6 bg-white lg:px-8 py-8 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Available Exams</h2>
        <span className="text-sm text-gray-500">{filteredExams.length} exam(s) found</span>
      </div>

      {filteredExams.length === 0 && !error ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'No exams are currently available.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Subject: {exam.subject} • {exam.questionsCount} questions • {exam.duration} min
                    </p>
                    {formatTimeRemaining(exam) && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {formatTimeRemaining(exam)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/exam/${exam.id}`)}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </button>
                  {(exam.status === 'Upcoming' ||
                    exam.status === 'Available' ||
                    exam.status === 'Active') && (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  <Footer />
</div>

      {/* Exam Dialog */}
      <ExamDialog
        isOpen={isExamDialogOpen}
        onClose={handleCloseDialog}
        exam={selectedExam}
        onSubmitSuccess={handleExamSuccess}
      />
    </>
  );
};

export default ExamPage;
