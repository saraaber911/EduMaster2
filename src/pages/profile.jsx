import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Profile() {
  const { token, user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('Account');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    classLevel: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    cpassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    // const id = user.data.id;
    try {
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      // const id = item.id;
    if (!token) {
      setError('No authentication token found');
      return;
    }
    console.log('Token being used:', token);
      const res = await fetch('https://edu-master-psi.vercel.app/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          token: token, // fallback if backend expects this header
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const response = await res.json();
        setProfileData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          classLevel: response.data.classLevel || ''
        });
      }
    } catch (err) {
        console.log(err)
      setError('Failed to load profile');
      
    } finally {
      setLoading(false);
      console.log(token)
    }
  };
  
  const updateProfile = async () => {
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      // حاول استخراج id من ال-context أولاً
      let id = user?.id || user?._id || user?.data?.id || user?.data?._id;

      // لو ما وجدنا id، نطلب endpoint المسيطر على المستخدم للحصول عليه
      if (!id) {
        const meRes = await fetch('https://edu-master-psi.vercel.app/user/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            token: token,
            'Content-Type': 'application/json'
          }
        });
        if (meRes.ok) {
          const meJson = await meRes.json();
          id = meJson.data?.id || meJson.data?._id;
        }
      }

      if (!id) {
        setError('User id not found. تأكد من تسجيل الدخول.');
        return;
      }

      const res = await fetch(`https://edu-master-psi.vercel.app/user/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          token: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const resJson = await res.json().catch(() => ({}));
      if (res.ok) {
        // لو الـ API رجع البيانات المحدّثة استخدمها لتحديث الواجهة
        if (resJson.data) {
          setProfileData({
            fullName: resJson.data.fullName || profileData.fullName,
            email: resJson.data.email || profileData.email,
            phoneNumber: resJson.data.phoneNumber || profileData.phoneNumber,
            classLevel: resJson.data.classLevel || profileData.classLevel
          });
        }
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(resJson.message || 'Failed to update profile');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    } finally {
      setIsSaving(false);
    }
   };
  
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.cpassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('https://edu-master-psi.vercel.app/user/update-password', {
        method: 'PATCH',
        headers: {
          token:token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (res.ok) {
        setMessage('Password updated successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', cpassword: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update password');
      }
    } catch (err) {
        console.log(err)
      setError('Network error');
    }
  };

  const menuItems = [
    { name: 'Account' },
    { name: 'Security' },
    { name: 'Notifications' },
    { name: 'Learning Goals' }
  ];

  // if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-50 px-4 sm:px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{profileData.fullName}</h1>
              <p className="text-gray-600">Manage your account, progress, and notification settings</p>
            </div>
            <div className="flex flex-col sm:flex-row lg:ml-auto gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Streak: 12 days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exams Passed: 18</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Study Time: 42h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Profile Menu</h3>
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.name)}
                  className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition ${
                    activeSection === item.name
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                  <span className="ml-auto">›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Account Information */}
            {activeSection === 'Account' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <select
                      value={profileData.classLevel}
                      onChange={(e) => setProfileData({...profileData, classLevel: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select your grade</option>
                      <option value="Grade 1 Secondary">Grade 1 Secondary</option>
                      <option value="Grade 2 Secondary">Grade 2 Secondary</option>
                      <option value="Grade 3 Secondary">Grade 3 Secondary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={updateProfile}
                    disabled={isSaving}
                    className={`px-6 py-3 rounded-lg transition ${isSaving ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'Security' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Security</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={passwordData.cpassword}
                          onChange={(e) => setPasswordData({...passwordData, cpassword: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={updatePassword}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span>Enabled</span>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        Manage 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'Notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Exam reminders', desc: 'Get notified 24h and 1h before an exam', enabled: true },
                    { title: 'Email updates', desc: 'Weekly progress summary', enabled: false },
                    { title: 'Instructor messages', desc: 'Direct messages from teachers', enabled: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${item.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.enabled ? 'On' : 'Off'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Goals */}
            {activeSection === 'Learning Goals' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Learning Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Current Goal</h3>
                    <p className="text-gray-600 mb-4">Improve Algebra score to 90%+</p>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        Edit Goals
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
                        Update
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Weekly Target</h3>
                    <p className="text-gray-600">5h study time</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}