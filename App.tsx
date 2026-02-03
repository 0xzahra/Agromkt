import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideLeaf, LucideUsers, LucideShoppingBag, LucideMessageCircle, 
  LucideSearch, LucideGlobe, LucideHeart, LucideSend, LucideMapPin,
  LucideVideo, LucideImage, LucideX, LucideMenu, LucideLoader2,
  LucideSettings, LucideUser, LucideMoon, LucideSun, LucideEye, 
  LucideVolume2, LucideShieldCheck, LucideLogOut, LucideChevronLeft,
  LucideShare2, LucideCopy, LucideCheckCircle, LucideCloud, LucideSpeaker,
  LucideTrendingUp, LucidePackage, LucideClock, LucideType, LucideMail, 
  LucidePhone, LucidePlus, LucideThumbsUp, LucideUserPlus, LucideMoreVertical,
  LucideArrowRight, LucideLock, LucideCheck, LucideFileText, LucideBell, LucideMic,
  LucideKey, LucideEdit, LucideSave, LucideTrash2, LucideAlertTriangle
} from 'lucide-react';
import { NIGERIAN_STATES, TRANSLATIONS, MOCK_PRODUCTS, MOCK_POSTS, CRYPTO_ADDRESSES, MOCK_USER, MOCK_GROUPS } from './constants';
import { Language, Product, ForumPost, ChatMessage, AppSettings, UserProfile, Theme, ForumGroup, Comment } from './types';
import { askFarmingAssistant, generateMarketingImage, generateMarketingVideo } from './services/geminiService';
import LiveExpert from './components/LiveExpert';

// --- Services & Helpers ---
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

// --- Authentication Components ---

const GoogleAuthModal = ({ onComplete, onClose }: { onComplete: () => void, onClose: () => void }) => {
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => setStep('success'), 2000);
      return () => clearTimeout(timer);
    }
    if (step === 'success') {
      const timer = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative m-4">
        {step === 'select' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2">
                 <img src="https://www.google.com/favicon.ico" alt="G" className="w-6 h-6"/>
                 <span className="font-bold text-gray-700 text-lg">Sign in with Google</span>
               </div>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><LucideX size={20}/></button>
            </div>
            <p className="text-gray-600 mb-6">Choose an account to continue to Agromarket</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => setStep('processing')}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">Z</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Zahra Usman</p>
                  <p className="text-gray-500 text-xs">zahra@agromarket.ng</p>
                </div>
              </button>
              <button 
                onClick={() => setStep('processing')}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">F</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Farm Admin</p>
                  <p className="text-gray-500 text-xs">admin@myfarm.com</p>
                </div>
              </button>
              <div className="border-t my-4"></div>
              <button className="flex items-center gap-3 text-gray-600 font-bold text-sm px-2 hover:text-gray-800">
                 <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"><LucideUserPlus size={16}/></div>
                 Use another account
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
             <p className="text-gray-600 font-medium">Verifying credentials...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center bg-green-50">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <LucideCheck size={32} strokeWidth={3} />
             </div>
             <p className="text-green-800 font-bold text-xl">Signed In Successfully</p>
             <p className="text-green-600 text-sm mt-2">Redirecting back to Agromarket...</p>
          </div>
        )}
        
        <div className="bg-gray-50 px-8 py-4 text-xs text-gray-500 border-t flex justify-between">
           <span>English (United States)</span>
           <div className="flex gap-4">
             <span>Help</span>
             <span>Privacy</span>
             <span>Terms</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ onLogin, onGoogleClick }: { onLogin: () => void, onGoogleClick: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1625246333195-098e98e29138?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] min-h-[600px]">
        {/* Left Side - Motivation */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-green-800 to-green-950 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                  <LucideLeaf className="text-green-300" size={28} />
                </div>
                <h1 className="text-2xl font-serif font-black tracking-wide">Agromarket</h1>
              </div>
              
              <h2 className="text-4xl font-serif font-bold leading-tight mb-6">
                Grow your farm,<br/>
                <span className="text-green-400">Automate your success.</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                 Get motivated! While you focus on the field, our AI app writes your 
                 <span className="text-white font-bold"> academic documents, business plans, and reports</span> automatically.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <LucideFileText className="text-yellow-400" size={24} />
                   <div>
                     <p className="font-bold">Auto-Documentation</p>
                     <p className="text-xs text-gray-400">Generate professional reports in seconds</p>
                   </div>
                </div>
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <LucideTrendingUp className="text-blue-400" size={24} />
                   <div>
                     <p className="font-bold">Market Insights</p>
                     <p className="text-xs text-gray-400">Real-time prices and buyer connection</p>
                   </div>
                </div>
              </div>
           </div>
           
           <p className="text-xs text-gray-500 mt-8">© 2026 Agromarket Inc.</p>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
           <div className="text-center md:text-left mb-8">
             <h3 className="text-3xl font-bold text-gray-900 mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
             <p className="text-gray-500">
               {mode === 'login' ? 'Enter your details to access your dashboard.' : 'Start your smart farming journey today.'}
             </p>
           </div>

           <div className="space-y-4">
             {mode === 'signup' && (
                <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-green-500 focus-within:bg-white transition-colors">
                  <LucideUser className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
             )}
             
             <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-green-500 focus-within:bg-white transition-colors">
                <LucideMail className="text-gray-400 mr-3" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
             </div>
             
             <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-green-500 focus-within:bg-white transition-colors mb-4">
                <LucideLock className="text-gray-400 mr-3" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
             </div>
             
             <button 
               onClick={onLogin}
               className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
             >
                {mode === 'login' ? 'Sign In' : 'Get Started'} <LucideArrowRight size={20}/>
             </button>

             <div className="relative my-8">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
               <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
             </div>

             <button 
               onClick={onGoogleClick}
               className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
             >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5"/>
                Continue with Google
             </button>
           </div>
           
           <p className="text-center mt-8 text-gray-500">
             {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
             <button 
               onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
               className="text-green-600 font-bold ml-2 hover:underline"
             >
               {mode === 'login' ? 'Sign Up' : 'Log In'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components (Restored) ---

// 0. LazyImage Component
const LazyImage = ({ src, alt, className = "", imageClassName = "" }: { src: string, alt: string, className?: string, imageClassName?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-black/30 z-10 transition-opacity duration-500">
            <LucideLoader2 className="animate-spin text-green-500" size={24} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-105'
        } ${imageClassName}`}
      />
    </div>
  );
};

// 1. Navbar
const Navbar = ({ lang, setLang, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, theme, onNavigate }: any) => {
  const t = TRANSLATIONS;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [mobileSection, setMobileSection] = useState<'inbox' | 'notifications' | null>(null);

  const handleNav = (tab: string, params?: any) => {
    onNavigate(tab, params);
    setShowInbox(false);
    setShowNotifications(false);
    setMobileMenuOpen(false);
  }

  const tabs = [
    { id: 'market', icon: LucideShoppingBag, label: t.nav_market[lang as Language] },
    { id: 'forum', icon: LucideUsers, label: t.nav_forum[lang as Language] },
    { id: 'ai', icon: LucideLeaf, label: t.nav_ai[lang as Language] },
    { id: 'tools', icon: LucideImage, label: t.nav_tools[lang as Language] },
    { id: 'donate', icon: LucideHeart, label: t.nav_donate[lang as Language] },
  ];

  return (
    <nav className={`fixed top-0 w-full z-40 px-4 py-3 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-200'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Title Section: Adjusted padding and font size for mobile to prevent crowding */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => handleNav('market')}>
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 md:p-2.5 rounded-xl shadow-lg shadow-green-900/20">
            <LucideLeaf className="text-white" size={22} />
          </div>
          <h1 className={`text-xl md:text-2xl font-serif font-black tracking-wide ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>
            {t.app_name[lang as Language]}
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold ${
                activeTab === tab.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 transform scale-105' 
                  : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
              }`}
            >
              <tab.icon size={20} strokeWidth={2.5} />
              <span className="text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Inbox Dropdown - Hidden on Mobile */}
          <div className="relative hidden md:block">
            <button 
                onClick={() => { setShowInbox(!showInbox); setShowNotifications(false); }}
                className={`p-3 rounded-full transition-all relative ${showInbox ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
            >
               <LucideMail size={22} strokeWidth={2.5} />
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            </button>
            {showInbox && (
                <div className={`absolute top-full right-0 mt-4 w-80 max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-top-2 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="p-4 border-b border-gray-500/10 flex justify-between items-center">
                        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Messages</h3>
                        <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <div onClick={() => handleNav('messages', { chatId: '1' })} className={`p-4 hover:bg-white/5 cursor-pointer border-b border-gray-500/10 flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold shrink-0">A</div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Ahmed Musa</p>
                                <p className="text-xs line-clamp-1">Is the maize still available?</p>
                                <p className="text-[10px] opacity-50 mt-1">2m ago</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('messages', { chatId: '2' })} className={`p-4 hover:bg-white/5 cursor-pointer flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold shrink-0">F</div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fatima Aliyu</p>
                                <p className="text-xs line-clamp-1">Confirmed delivery for tomorrow.</p>
                                <p className="text-[10px] opacity-50 mt-1">1h ago</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 text-center border-t border-gray-500/10 bg-black/5">
                        <button onClick={() => handleNav('messages')} className="text-sm font-bold text-green-500 hover:underline">View All Messages</button>
                    </div>
                </div>
            )}
          </div>

          {/* Notifications Dropdown - Hidden on Mobile */}
          <div className="relative hidden md:block">
            <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); }}
                className={`p-3 rounded-full transition-all relative ${showNotifications ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
            >
               <LucideBell size={22} strokeWidth={2.5} />
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            </button>
            {showNotifications && (
                <div className={`absolute top-full right-0 mt-4 w-80 max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-top-2 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="p-4 border-b border-gray-500/10 flex justify-between items-center">
                        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                        <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">3 New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <div onClick={() => handleNav('market')} className={`p-4 hover:bg-white/5 cursor-pointer border-b border-gray-500/10 flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="mt-1"><LucideTrendingUp size={16} className="text-green-500"/></div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Price Alert</p>
                                <p className="text-xs">Maize prices in Kano rose by 5% today.</p>
                                <p className="text-[10px] opacity-50 mt-1">10m ago</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('profile')} className={`p-4 hover:bg-white/5 cursor-pointer border-b border-gray-500/10 flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="mt-1"><LucideUserPlus size={16} className="text-blue-500"/></div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>New Follower</p>
                                <p className="text-xs">Ibrahim Sani started following you.</p>
                                <p className="text-[10px] opacity-50 mt-1">30m ago</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('profile')} className={`p-4 hover:bg-white/5 cursor-pointer flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                             <div className="mt-1"><LucidePackage size={16} className="text-yellow-500"/></div>
                             <div>
                                 <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Order Update</p>
                                 <p className="text-xs">Your order #1023 has been shipped.</p>
                                 <p className="text-[10px] opacity-50 mt-1">2h ago</p>
                             </div>
                        </div>
                    </div>
                     <div className="p-3 text-center border-t border-gray-500/10 bg-black/5">
                        <button className="text-sm font-bold text-green-500 hover:underline">Mark all as read</button>
                    </div>
                </div>
            )}
          </div>

          <button 
             onClick={() => handleNav('profile')}
             className={`hidden md:block p-3 rounded-full transition-all ${activeTab === 'profile' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_profile[lang]}
          >
            <LucideUser size={22} strokeWidth={2.5} />
          </button>
          <button 
             onClick={() => handleNav('settings')}
             className={`hidden md:block p-3 rounded-full transition-all ${activeTab === 'settings' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_settings[lang]}
          >
            <LucideSettings size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
            className="hidden md:flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2.5 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-yellow-500/20 hover:scale-105"
          >
            <LucideGlobe size={18} strokeWidth={2.5} />
            {lang}
          </button>
          <button 
            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <LucideX size={28} /> : <LucideMenu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-4 pb-4 space-y-2 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold ${
                 activeTab === tab.id 
                 ? 'bg-green-600 text-white' 
                 : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={24} />
              <span>{tab.label}</span>
            </button>
          ))}
          
          <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
              {/* Notification Toggle in Mobile Menu */}
              <div className="border-b border-gray-500/10 pb-2">
                 <button 
                    onClick={() => setMobileSection(mobileSection === 'notifications' ? null : 'notifications')}
                    className={`w-full flex items-center justify-between gap-4 px-6 py-4 rounded-xl text-lg font-bold ${
                        mobileSection === 'notifications' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                 >
                    <div className="flex items-center gap-4"><LucideBell size={24} /> Notifications</div>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                 </button>
                 {mobileSection === 'notifications' && (
                    <div className="px-6 py-2 space-y-3">
                        <div onClick={() => handleNav('market')} className={`p-3 rounded-lg flex gap-3 cursor-pointer ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="mt-1"><LucideTrendingUp size={16} className="text-green-500"/></div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Price Alert</p>
                                <p className="text-xs opacity-70">Maize prices in Kano rose by 5% today.</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('profile')} className={`p-3 rounded-lg flex gap-3 cursor-pointer ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="mt-1"><LucideUserPlus size={16} className="text-blue-500"/></div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>New Follower</p>
                                <p className="text-xs opacity-70">Ibrahim Sani started following you.</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('profile')} className={`p-3 rounded-lg flex gap-3 cursor-pointer ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                             <div className="mt-1"><LucidePackage size={16} className="text-yellow-500"/></div>
                             <div>
                                 <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Order Update</p>
                                 <p className="text-xs opacity-70">Your order #1023 has been shipped.</p>
                             </div>
                        </div>
                    </div>
                 )}
              </div>

              {/* Messages Toggle in Mobile Menu */}
              <div className="border-b border-gray-500/10 pb-2">
                 <button 
                    onClick={() => setMobileSection(mobileSection === 'inbox' ? null : 'inbox')}
                    className={`w-full flex items-center justify-between gap-4 px-6 py-4 rounded-xl text-lg font-bold ${
                        mobileSection === 'inbox' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                 >
                    <div className="flex items-center gap-4"><LucideMail size={24} /> Messages</div>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                 </button>
                 {mobileSection === 'inbox' && (
                    <div className="px-6 py-2 space-y-3">
                         <div onClick={() => handleNav('messages', { chatId: '1' })} className={`p-3 rounded-lg flex gap-3 cursor-pointer ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold shrink-0">A</div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Ahmed Musa</p>
                                <p className="text-xs opacity-70">Is the maize still available?</p>
                            </div>
                        </div>
                        <div onClick={() => handleNav('messages', { chatId: '2' })} className={`p-3 rounded-lg flex gap-3 cursor-pointer ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold shrink-0">F</div>
                            <div>
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fatima Aliyu</p>
                                <p className="text-xs opacity-70">Confirmed delivery for tomorrow.</p>
                            </div>
                        </div>
                    </div>
                 )}
              </div>

              <button 
                  onClick={() => handleNav('profile')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold ${
                     activeTab === 'profile' 
                     ? 'bg-green-600 text-white' 
                     : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                  <LucideUser size={24} /> Profile
              </button>
               <button 
                  onClick={() => handleNav('settings')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold ${
                     activeTab === 'settings' 
                     ? 'bg-green-600 text-white' 
                     : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                  <LucideSettings size={24} /> Settings
              </button>
               <button 
                  onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold text-yellow-500 hover:bg-yellow-500/10`}
              >
                  <LucideGlobe size={24} /> {lang === 'EN' ? 'Switch to Hausa' : 'Switch to English'}
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Marketplace Components
const ProductCard = ({ product, lang, onClick, theme }: any) => {
  return (
    <div 
      onClick={onClick} 
      className="group relative glass-panel rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer nature-shadow border-0 ring-1 ring-white/10 hover:ring-green-500/50 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="h-64 overflow-hidden relative">
        <LazyImage 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full"
          imageClassName="transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
             <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide backdrop-blur-md shadow-lg ${product.type === 'buy' ? 'bg-blue-600/90 text-white' : 'bg-green-600/90 text-white'}`}>
                {product.type === 'buy' ? 'Request' : product.category}
             </span>
        </div>

        {/* Quick View Button (Visible on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl hover:scale-105">
                <LucideEye size={20} /> Quick View
            </button>
        </div>

        {/* Price Tag (Bottom Left) */}
        <div className="absolute bottom-4 left-4">
             <span className="text-yellow-400 font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                ₦{product.price.toLocaleString()}
             </span>
        </div>
      </div>

      {/* Details Section */}
      <div className={`p-5 flex flex-col flex-1 gap-4 ${theme === 'light' ? 'bg-white/90 text-gray-900' : 'bg-black/40 text-gray-100'}`}>
        
        {/* Title */}
        <h3 className={`text-xl font-bold leading-tight font-serif line-clamp-2 group-hover:text-green-500 transition-colors`}>
            {product.name}
        </h3>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm opacity-80">
            <div className="flex items-center gap-2">
                <LucideMapPin size={14} className="text-green-500 shrink-0" />
                <span className="truncate">{product.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <LucideClock size={14} className="text-yellow-500 shrink-0" />
                <span className="truncate">{product.datePosted}</span>
            </div>
        </div>

        {/* Divider */}
        <div className={`h-px w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`}></div>

        {/* Seller Info & CTA */}
        <div className="flex justify-between items-center mt-auto pt-1">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden ring-2 ring-white/20">
                    <img src={`https://ui-avatars.com/api/?name=${product.sellerName}&background=random`} alt="seller" className="w-full h-full object-cover"/>
                 </div>
                 <div className="flex flex-col">
                     <span className="text-xs font-bold leading-none">{product.sellerName.split(' ')[0]}</span>
                     <span className="text-[10px] opacity-60">Verified Seller</span>
                 </div>
             </div>
             
             <button className={`p-2.5 rounded-xl transition-colors ${theme === 'light' ? 'bg-gray-100 hover:bg-green-100 text-green-700' : 'bg-white/5 hover:bg-green-600 hover:text-white text-gray-400'}`}>
                 <LucideMessageCircle size={20} />
             </button>
        </div>
      </div>
    </div>
  );
};

// 3. Marketplace Component
const Marketplace = ({ lang, theme }: { lang: Language, theme: Theme }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const filtered = MOCK_PRODUCTS.filter(p => 
    (filter === 'All' || p.category === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-20 z-30 py-2 backdrop-blur-md bg-transparent">
        <div className="relative w-full md:w-96 group">
          <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={TRANSLATIONS.search_placeholder[lang]} 
            className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none border transition-all shadow-sm focus:shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white placeholder-gray-500' : 'bg-white border-gray-200 focus:border-green-500 text-gray-900'}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {['All', 'Poultry', 'Fish', 'Feed'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                  : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} lang={lang} theme={theme} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

// 4. Forum Component
const Forum = ({ lang, theme }: { lang: Language, theme: Theme }) => {
    return (
        <div className="space-y-6">
            <div className="flex gap-4 overflow-x-auto pb-4">
                {MOCK_GROUPS.map(group => (
                    <div key={group.id} className={`min-w-[280px] p-4 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                        <img src={group.image} alt={group.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                            <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{group.name}</h4>
                            <p className="text-xs text-gray-500">{group.members.toLocaleString()} members</p>
                            <button className="mt-2 text-xs font-bold text-green-500">Join Group</button>
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="space-y-4">
                {MOCK_POSTS.map(post => (
                    <div key={post.id} className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800/50 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-4">
                             <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
                             <div>
                                 <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.author}</h4>
                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                                     <span className={`px-2 py-0.5 rounded-full ${post.role === 'Expert' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>{post.role}</span>
                                     <span>• {post.timestamp}</span>
                                 </div>
                             </div>
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                        <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>
                        {post.image && (
                            <div className="mb-4 rounded-2xl overflow-hidden h-64">
                                <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex items-center gap-6 text-gray-500 text-sm font-medium border-t border-gray-500/10 pt-4">
                            <button className="flex items-center gap-2 hover:text-red-500"><LucideHeart size={18} /> {post.likes}</button>
                            <button className="flex items-center gap-2 hover:text-blue-500"><LucideMessageCircle size={18} /> {post.comments.length}</button>
                            <button className="flex items-center gap-2 ml-auto hover:text-green-500"><LucideShare2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 5. AI Guide Component
const AIGuide = ({ lang, theme }: { lang: Language, theme: Theme }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: TRANSLATIONS.ai_welcome[lang] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLive, setShowLive] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const result = await askFarmingAssistant(userMsg);
            setMessages(prev => [...prev, { role: 'model', text: result.text || "I couldn't generate a response." }]);
        } catch (error) {
             setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`h-[calc(100vh-140px)] flex flex-col rounded-3xl overflow-hidden border ${theme === 'dark' ? 'bg-gray-800/50 border-white/5' : 'bg-white border-gray-200 shadow-xl'}`}>
             {showLive && <LiveExpert onClose={() => setShowLive(false)} language={lang} />}
             
             <div className="p-4 border-b border-gray-500/10 flex justify-between items-center bg-green-600 text-white">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                         <LucideLeaf size={20} />
                     </div>
                     <div>
                         <h3 className="font-bold">Agro AI Assistant</h3>
                         <p className="text-xs opacity-80">Powered by Gemini 3.0</p>
                     </div>
                 </div>
                 <button 
                    onClick={() => setShowLive(true)}
                    className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse hover:animate-none hover:scale-105 transition-transform"
                 >
                     <LucideMic size={16} /> Live Voice
                 </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-4 rounded-2xl ${
                             msg.role === 'user' 
                             ? 'bg-green-600 text-white rounded-tr-none' 
                             : theme === 'dark' ? 'bg-gray-700 text-white rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                         }`}>
                             {msg.text}
                         </div>
                     </div>
                 ))}
                 {loading && (
                     <div className="flex justify-start">
                         <div className={`p-4 rounded-2xl rounded-tl-none flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                             <LucideLoader2 size={16} className="animate-spin" /> {TRANSLATIONS.ai_thinking[lang]}
                         </div>
                     </div>
                 )}
                 <div ref={messagesEndRef} />
             </div>

             <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
                 <div className="relative flex items-center gap-2">
                     <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about crops, livestock, or prices..."
                        className={`flex-1 p-3 rounded-xl pr-12 outline-none border transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' : 'bg-white border-gray-200 focus:border-green-500 text-gray-900'}`}
                     />
                     <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                         <LucideSend size={20} />
                     </button>
                 </div>
             </div>
        </div>
    )
}

// 6. Settings Component (New)
const Settings = ({ theme, lang }: { theme: Theme, lang: Language }) => {
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [email, setEmail] = useState('zahra@agromarket.ng');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const handleSaveEmail = () => {
        setNotification({ msg: 'Email updated successfully. Please verify your new address.', type: 'success' });
        setEditingEmail(false);
        setTimeout(() => setNotification(null), 3000);
    }

    const handleSavePassword = () => {
        if (newPassword !== confirmPassword) {
            setNotification({ msg: 'Passwords do not match.', type: 'error' });
            return;
        }
        setNotification({ msg: 'Password changed successfully.', type: 'success' });
        setEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setNotification(null), 3000);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-3xl font-serif font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
            
            {notification && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {notification.type === 'success' ? <LucideCheckCircle size={20} /> : <LucideAlertTriangle size={20} />}
                    <span className="font-medium">{notification.msg}</span>
                </div>
            )}

            {/* Account Security Section */}
            <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-500/10 pb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><LucideShieldCheck size={24} /></div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Account Security</h3>
                </div>
                
                <div className="space-y-6">
                    {/* Email Change */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
                            {!editingEmail && (
                                <button onClick={() => setEditingEmail(true)} className="text-green-500 text-sm font-bold flex items-center gap-1 hover:underline">
                                    <LucideEdit size={14} /> Change
                                </button>
                            )}
                        </div>
                        {editingEmail ? (
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`flex-1 p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                                <button onClick={handleSaveEmail} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-colors"><LucideSave size={20}/></button>
                                <button onClick={() => setEditingEmail(false)} className={`p-3 rounded-xl border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}><LucideX size={20}/></button>
                            </div>
                        ) : (
                            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{email}</p>
                        )}
                    </div>

                    <div className={`h-px w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>

                    {/* Password Change */}
                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Password</label>
                            {!editingPassword && (
                                <button onClick={() => setEditingPassword(true)} className="text-green-500 text-sm font-bold flex items-center gap-1 hover:underline">
                                    <LucideKey size={14} /> Reset Password
                                </button>
                            )}
                        </div>
                        {editingPassword ? (
                            <div className="space-y-3 p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
                                <input 
                                    type="password" 
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className={`w-full p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                />
                                <input 
                                    type="password" 
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={`w-full p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                />
                                <input 
                                    type="password" 
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button onClick={() => setEditingPassword(false)} className={`px-4 py-2 rounded-lg font-bold text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Cancel</button>
                                    <button onClick={handleSavePassword} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-600/20">Update Password</button>
                                </div>
                            </div>
                        ) : (
                            <p className={`text-lg font-medium tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>••••••••••••</p>
                        )}
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-500/10 pb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><LucideSettings size={24} /></div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Preferences</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Push Notifications</span>
                        <div className="w-12 h-6 bg-green-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email Updates</span>
                        <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Two-Factor Authentication</span>
                         <div className="w-12 h-6 bg-green-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                </div>
            </div>

            <button className="w-full py-4 text-red-500 font-bold bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors flex items-center justify-center gap-2">
                <LucideLogOut size={20} /> Sign Out
            </button>
        </div>
    )
}

// 7. Messages Component (New)
const Messages = ({ selectedChatId, theme, lang }: { selectedChatId?: string, theme: Theme, lang: Language }) => {
    const [activeChat, setActiveChat] = useState<string | null>(selectedChatId || null);
    const [newMessage, setNewMessage] = useState('');
    
    // Mock Data for Chats
    const chats = [
        { id: '1', name: 'Ahmed Musa', avatar: 'A', lastMsg: 'Is the maize still available?', time: '2m', unread: 1, color: 'bg-blue-500' },
        { id: '2', name: 'Fatima Aliyu', avatar: 'F', lastMsg: 'Confirmed delivery for tomorrow.', time: '1h', unread: 0, color: 'bg-yellow-500' },
        { id: '3', name: 'Kano Feeds', avatar: 'K', lastMsg: 'We have restocked broiler mash.', time: '1d', unread: 0, color: 'bg-green-500' }
    ];

    const [chatHistory, setChatHistory] = useState([
        { id: '1', sender: 'them', text: 'Hello, I saw your listing for white maize.', time: '10:30 AM' },
        { id: '2', sender: 'me', text: 'Yes, it is available. How many bags do you need?', time: '10:32 AM' },
        { id: '3', sender: 'them', text: 'I need about 50 bags. What is your best price?', time: '10:35 AM' },
        { id: '4', sender: 'me', text: 'For 50 bags, I can do ₦34,000 per bag.', time: '10:36 AM' },
        { id: '5', sender: 'them', text: 'Is the maize still available?', time: '10:40 AM' }
    ]);

    const handleSend = () => {
        if(!newMessage.trim()) return;
        setChatHistory([...chatHistory, { id: Date.now().toString(), sender: 'me', text: newMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        setNewMessage('');
    }

    return (
        <div className={`h-[calc(100vh-140px)] rounded-3xl overflow-hidden border flex ${theme === 'dark' ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-200 shadow-xl'}`}>
            {/* Sidebar List */}
            <div className={`w-full md:w-80 border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-500/10">
                    <h3 className={`text-xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Messages</h3>
                    <div className="mt-4 relative">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search chats..." className={`w-full pl-9 p-2 rounded-lg text-sm outline-none ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`} />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1">
                    {chats.map(chat => (
                        <div 
                           key={chat.id} 
                           onClick={() => setActiveChat(chat.id)}
                           className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-gray-500/5 ${activeChat === chat.id ? (theme === 'dark' ? 'bg-white/10' : 'bg-green-50') : 'hover:bg-gray-500/5'}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${chat.color}`}>
                                {chat.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{chat.name}</h4>
                                    <span className="text-xs text-gray-500">{chat.time}</span>
                                </div>
                                <p className={`text-sm truncate ${chat.unread ? 'font-bold text-green-500' : 'text-gray-500'}`}>{chat.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col h-full bg-pattern">
                    {/* Header */}
                    <div className={`p-4 border-b flex items-center gap-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                         <button onClick={() => setActiveChat(null)} className="md:hidden p-2 hover:bg-gray-500/10 rounded-full"><LucideChevronLeft size={20}/></button>
                         <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                         <div>
                             <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Ahmed Musa</h4>
                             <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
                         </div>
                         <div className="ml-auto flex gap-2 text-gray-400">
                             <button className="p-2 hover:bg-gray-500/10 rounded-full"><LucidePhone size={20}/></button>
                             <button className="p-2 hover:bg-gray-500/10 rounded-full"><LucideMoreVertical size={20}/></button>
                         </div>
                    </div>

                    {/* Messages */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50'}`}>
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'me' 
                                    ? 'bg-green-600 text-white rounded-tr-none shadow-lg shadow-green-600/20' 
                                    : theme === 'dark' ? 'bg-gray-700 text-white rounded-tl-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm border'
                                }`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-green-200' : 'text-gray-400'}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className={`flex items-center gap-2 p-1 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-transparent'}`}>
                            <button className="p-3 text-gray-400 hover:text-green-500"><LucidePlus size={20}/></button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-transparent outline-none py-3"
                            />
                            <button onClick={handleSend} className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md"><LucideSend size={18}/></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-24 h-24 bg-gray-500/10 rounded-full flex items-center justify-center mb-4">
                        <LucideMessageCircle size={40} className="text-gray-500"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select a Conversation</h3>
                    <p>Choose a chat from the sidebar to start messaging.</p>
                </div>
            )}
        </div>
    )
}

// 8. Profile Component (New)
const Profile = ({ user, theme, lang }: { user: UserProfile, theme: Theme, lang: Language }) => {
  const t = TRANSLATIONS;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className={`relative rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
        <div className="h-48 bg-gradient-to-r from-green-800 to-green-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Cover image pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="-mt-16 relative">
               <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200">
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
               </div>
               {user.isVerified && (
                 <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-4 border-white dark:border-gray-800" title="Verified Expert">
                   <LucideCheck size={16} strokeWidth={4} />
                 </div>
               )}
             </div>

             <div className="flex-1 mt-4 md:mt-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-3xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.handle}</p>
                  </div>
                  <div className="flex gap-3">
                     <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-colors shadow-lg shadow-green-600/20">
                       Edit Profile
                     </button>
                     <button className={`p-2 rounded-full border transition-colors ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`}>
                       <LucideShare2 size={20} />
                     </button>
                  </div>
                </div>
                
                <p className={`mt-4 max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.bio}
                </p>

                <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium opacity-80">
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10"><LucideMapPin size={14} className="text-red-500"/> {user.location}</span>
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10"><LucideClock size={14} className="text-yellow-500"/> Joined {user.joinedDate}</span>
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10"><LucideShieldCheck size={14} className="text-blue-500"/> {user.role}</span>
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10"><LucideUsers size={14} className="text-purple-500"/> {user.followers?.toLocaleString()} Followers</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-6 rounded-2xl flex flex-col items-center text-center gap-2 group hover:-translate-y-1 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                 <LucideTrendingUp size={24} />
              </div>
              <span className={`text-2xl font-black font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ₦{(user.stats.totalEarnings / 1000000).toFixed(1)}M
              </span>
              <span className="text-xs uppercase tracking-wider opacity-60 font-bold">{t.stats_earnings[lang]}</span>
          </div>
          
          <div className={`p-6 rounded-2xl flex flex-col items-center text-center gap-2 group hover:-translate-y-1 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                 <LucideShoppingBag size={24} />
              </div>
              <span className={`text-2xl font-black font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.stats.itemsSold}
              </span>
              <span className="text-xs uppercase tracking-wider opacity-60 font-bold">{t.stats_sold[lang]}</span>
          </div>

          <div className={`p-6 rounded-2xl flex flex-col items-center text-center gap-2 group hover:-translate-y-1 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                 <LucidePackage size={24} />
              </div>
              <span className={`text-2xl font-black font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.stats.activeListings}
              </span>
              <span className="text-xs uppercase tracking-wider opacity-60 font-bold">{t.stats_active[lang]}</span>
          </div>

          <div className={`p-6 rounded-2xl flex flex-col items-center text-center gap-2 group hover:-translate-y-1 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl mb-1 group-hover:scale-110 transition-transform">
                 <LucideClock size={24} />
              </div>
              <span className={`text-2xl font-black font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.stats.pendingOrders}
              </span>
              <span className="text-xs uppercase tracking-wider opacity-60 font-bold">{t.stats_pending ? t.stats_pending[lang] : 'Pending Orders'}</span>
          </div>
      </div>
      
      <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
         <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
         <div className="flex flex-col items-center justify-center py-8 text-gray-500">
             <LucideLeaf size={48} className="mb-2 opacity-20" />
             <p>No recent activity to show.</p>
         </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [lang, setLang] = useState<Language>('EN');
    const [theme, setTheme] = useState<Theme>('dark');
    const [activeTab, setActiveTab] = useState('market');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Navigation State
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [viewingProfileId, setViewingProfileId] = useState<string | undefined>(undefined);

    const handleNavigate = (tab: string, params?: any) => {
        setActiveTab(tab);
        if (tab === 'messages' && params?.chatId) {
            setSelectedChatId(params.chatId);
        } else if (tab === 'messages') {
            setSelectedChatId(undefined); // Reset if just clicking 'Messages' general link
        }
        
        if (tab === 'profile' && params?.userId) {
            setViewingProfileId(params.userId);
        }
    };

    // Initial check (mock)
    useEffect(() => {
        // In a real app, check session/local storage
    }, []);

    if (!isAuthenticated) {
        return (
            <>
                <AuthPage 
                    onLogin={() => setIsAuthenticated(true)} 
                    onGoogleClick={() => setShowAuthModal(true)} 
                />
                {showAuthModal && (
                    <GoogleAuthModal 
                        onComplete={() => { setShowAuthModal(false); setIsAuthenticated(true); }} 
                        onClose={() => setShowAuthModal(false)} 
                    />
                )}
            </>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#0a0a0a] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar 
                lang={lang} 
                setLang={setLang} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen}
                theme={theme}
                onNavigate={handleNavigate}
            />

            <main className="pt-24 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
                {activeTab === 'market' && <Marketplace lang={lang} theme={theme} />}
                {activeTab === 'forum' && <Forum lang={lang} theme={theme} />}
                {activeTab === 'ai' && <AIGuide lang={lang} theme={theme} />}
                {activeTab === 'settings' && <Settings lang={lang} theme={theme} />}
                {activeTab === 'messages' && <Messages theme={theme} lang={lang} selectedChatId={selectedChatId} />}
                {activeTab === 'profile' && <Profile user={MOCK_USER} theme={theme} lang={lang} />}
                
                {/* Placeholders for other tabs */}
                {(activeTab === 'tools' || activeTab === 'donate') && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                             {activeTab === 'tools' && <LucideImage size={40} />}
                             {activeTab === 'donate' && <LucideHeart size={40} />}
                        </div>
                        <h2 className="text-2xl font-bold font-serif capitalize">{activeTab}</h2>
                        <p className="text-gray-500 max-w-md">This section is currently under development. Check back soon for updates!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;