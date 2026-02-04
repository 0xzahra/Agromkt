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
  LucideKey, LucideEdit, LucideSave, LucideTrash2, LucideAlertTriangle,
  LucideBadgeCheck, LucideTruck, LucideCrown, LucideWifiOff, LucideAward
} from 'lucide-react';
import { NIGERIAN_STATES, TRANSLATIONS, MOCK_PRODUCTS, MOCK_POSTS, CRYPTO_ADDRESSES, MOCK_USER, MOCK_GROUPS } from './constants';
import { Language, Product, ForumPost, ChatMessage, AppSettings, UserProfile, Theme, ForumGroup, Comment } from './types';
import { askFarmingAssistant, generateMarketingImage, generateMarketingVideo } from './services/geminiService';
import LiveExpert from './components/LiveExpert';

// --- Configuration ---
// REPLACE THIS URL WITH YOUR UPLOADED LOGO IMAGE PATH
const LOGO_URL = "https://images.unsplash.com/photo-1599387661571-0428d0859897?q=80&w=500&auto=format&fit=crop"; 

// --- Services & Helpers ---
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

const calculateDaysLeft = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
};

// --- Intro Component ---
const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationStep(1), 500); // Logo fade in
    const t2 = setTimeout(() => setAnimationStep(2), 1500); // Text slide up
    const t3 = setTimeout(() => setAnimationStep(3), 3500); // Exit start
    const t4 = setTimeout(onComplete, 4200); // Complete

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] bg-[#FAFDF9] flex flex-col items-center justify-center transition-all duration-700 ${animationStep === 3 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative flex flex-col items-center p-8">
            {/* Logo Image */}
            <div className={`transition-all duration-1000 ease-out transform ${animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`}>
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white shadow-2xl flex items-center justify-center p-2 mb-8 border-4 border-green-50 overflow-hidden relative">
                    <img 
                        src={LOGO_URL} 
                        alt="Agromkt Logo" 
                        className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 rounded-full border border-black/5"></div>
                </div>
            </div>

            {/* Text */}
            <div className="text-center overflow-hidden h-40">
                <h2 className={`text-2xl md:text-3xl text-gray-500 font-serif font-medium mb-3 transition-all duration-1000 delay-300 transform ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    Welcome back to
                </h2>
                <h1 className={`text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-600 tracking-tighter transition-all duration-1000 delay-500 transform ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    Agromarket
                </h1>
            </div>
        </div>
    </div>
  );
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
  const [tourEnabled, setTourEnabled] = useState(false);

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
        
        {/* LEFT SECTION: Title + Messages + Notification + Tour */}
        <div className="flex items-center">
             {/* Title */}
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer mr-8 md:mr-12" onClick={() => handleNav('market')}>
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 md:p-2.5 rounded-xl shadow-lg shadow-green-900/20">
                    <LucideLeaf className="text-white" size={22} />
                </div>
                <h1 className={`text-xl md:text-2xl font-serif font-black tracking-wide ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>
                    {t.app_name[lang as Language]}
                </h1>
            </div>

            {/* MOVED CONTROLS: Inbox, Notification, Tour (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4">
                 
                 {/* Interactive Tour Toggle */}
                 <div className="flex items-center gap-2 border-r pr-4 border-gray-300 dark:border-gray-700 mr-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tour</span>
                    <button 
                        onClick={() => setTourEnabled(!tourEnabled)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${tourEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${tourEnabled ? 'left-6' : 'left-1'}`}></div>
                    </button>
                 </div>

                 {/* Inbox Dropdown */}
                 <div className="relative">
                    <button 
                        onClick={() => { setShowInbox(!showInbox); setShowNotifications(false); }}
                        className={`p-2.5 rounded-full transition-all relative ${showInbox ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
                    >
                        <LucideMail size={20} strokeWidth={2.5} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                    </button>
                    {showInbox && (
                        <div className={`absolute top-full left-0 mt-4 w-80 max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-top-2 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
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

                {/* Notifications Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); }}
                        className={`p-2.5 rounded-full transition-all relative ${showNotifications ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
                    >
                        <LucideBell size={20} strokeWidth={2.5} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                    </button>
                    {showNotifications && (
                        <div className={`absolute top-full left-0 mt-4 w-80 max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-top-2 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
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
            </div>
        </div>

        {/* Desktop Nav (Centered) */}
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

        {/* Right Controls (Minus Inbox/Notifications) */}
        <div className="flex items-center gap-2 md:gap-3">
          
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

// --- Main App Component ---

const App = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState('market');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLiveExpert, setShowLiveExpert] = useState(false);

  // Simple routing params mock
  const [navParams, setNavParams] = useState<any>(null);

  const handleNavigate = (tab: string, params?: any) => {
    setActiveTab(tab);
    if (params) setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!introComplete) {
    return <IntroScreen onComplete={() => setIntroComplete(true)} />;
  }

  if (!isAuthenticated) {
    return (
        <>
            <AuthPage onLogin={handleLogin} onGoogleClick={() => setShowAuthModal(true)} />
            {showAuthModal && (
                <GoogleAuthModal 
                    onComplete={() => { setShowAuthModal(false); handleLogin(); }}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </>
    );
  }

  const t = TRANSLATIONS;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-[#FAFDF9] text-gray-900'}`}>
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        theme={theme}
        onNavigate={handleNavigate}
      />

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        
        {activeTab === 'market' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-serif font-bold">{t.hero_title[lang]}</h2>
                        <p className="opacity-70">{t.hero_subtitle[lang]}</p>
                    </div>
                    <div className="flex gap-2">
                         <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                            {t.btn_sell[lang]}
                         </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 gap-3 mb-8 no-scrollbar">
                    {['All', 'Poultry', 'Fish', 'Feed', 'Equipment', 'Services'].map((cat, i) => (
                        <button key={cat} className={`px-6 py-2 rounded-full whitespace-nowrap font-bold transition-all ${i===0 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PRODUCTS.map(product => (
                        <div key={product.id} className={`group rounded-2xl overflow-hidden border transition-all hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="relative h-56 overflow-hidden">
                                <LazyImage src={product.image} alt={product.name} />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1 rounded-full">
                                    {product.category}
                                </div>
                                {product.type === 'buy' && (
                                     <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Wanted
                                     </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-green-600 transition-colors">{product.name}</h3>
                                </div>
                                <p className="text-2xl font-serif font-black text-green-600 mb-3">₦{product.price.toLocaleString()}</p>
                                <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
                                    <LucideMapPin size={14}/> {product.location}
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                     <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{product.sellerName[0]}</div>
                                         <span className="text-xs font-bold opacity-70">{product.sellerName}</span>
                                     </div>
                                     <button className="text-sm font-bold text-green-600 hover:underline">Contact</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'forum' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold">Community Forum</h2>
                     <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                         <LucidePlus size={16}/> New Post
                     </button>
                 </div>
                 
                 {/* Groups Horizontal */}
                 <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar mb-4">
                     {MOCK_GROUPS.map(group => (
                         <div key={group.id} className="min-w-[200px] h-32 rounded-xl relative overflow-hidden flex items-end p-3 cursor-pointer group">
                             <img src={group.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={group.name}/>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                             <div className="relative z-10 text-white">
                                 <p className="font-bold text-sm leading-tight">{group.name}</p>
                                 <p className="text-[10px] opacity-80">{group.members.toLocaleString()} members</p>
                             </div>
                         </div>
                     ))}
                 </div>

                 <div className="space-y-6">
                     {MOCK_POSTS.map(post => (
                         <div key={post.id} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                             <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                     <img src={post.authorAvatar} className="w-10 h-10 rounded-full bg-gray-200" alt="author"/>
                                     <div>
                                         <p className="font-bold text-sm">{post.author}</p>
                                         <p className="text-xs opacity-60">{post.role} • {post.timestamp}</p>
                                     </div>
                                 </div>
                                 <button><LucideMoreVertical size={16} className="opacity-40"/></button>
                             </div>
                             <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                             <p className="opacity-80 leading-relaxed mb-4">{post.content}</p>
                             {post.image && (
                                 <div className="mb-4 rounded-xl overflow-hidden">
                                     <LazyImage src={post.image} alt="post content" className="w-full h-64"/>
                                 </div>
                             )}
                             <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                 <button className="flex items-center gap-2 text-sm font-bold opacity-60 hover:text-green-500 hover:opacity-100 transition-colors">
                                     <LucideThumbsUp size={18}/> {post.likes}
                                 </button>
                                 <button className="flex items-center gap-2 text-sm font-bold opacity-60 hover:text-blue-500 hover:opacity-100 transition-colors">
                                     <LucideMessageCircle size={18}/> {post.comments.length}
                                 </button>
                                 <button className="flex items-center gap-2 text-sm font-bold opacity-60 hover:text-gray-900 dark:hover:text-white hover:opacity-100 transition-colors ml-auto">
                                     <LucideShare2 size={18}/> Share
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        )}

        {activeTab === 'ai' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl rotate-3 flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30">
                    <LucideLeaf className="text-white w-12 h-12" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black mb-4 tracking-tight">{t.ai_welcome[lang]}</h2>
                <p className="text-lg opacity-70 mb-10 leading-relaxed">
                    {lang === 'EN' 
                        ? "Get real-time advice on crops, disease control, and market trends powered by Gemini 3.0. Or switch to Voice Mode for hands-free assistance."
                        : "Samu shawarwari kan amfanin gona, maganin cututtuka, da yanayin kasuwa tare da Gemini 3.0. Ko yi amfani da Murya don taimako."}
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                     <button 
                        onClick={() => setShowLiveExpert(true)}
                        className="flex-1 bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                     >
                        <LucideMic /> {t.ai_voice_mode[lang]}
                     </button>
                     <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <LucideMessageCircle /> Text Chat
                     </button>
                </div>
            </div>
        )}

        {/* Fallback for other tabs */}
        {['tools', 'donate', 'profile', 'settings', 'messages'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] opacity-50 animate-pulse">
                <LucideLoader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold">Loading module...</p>
            </div>
        )}
      </main>

      {showLiveExpert && <LiveExpert onClose={() => setShowLiveExpert(false)} language={lang} />}
    </div>
  );
};

export default App;