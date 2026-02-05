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
  LucideBadgeCheck, LucideTruck, LucideCrown, LucideWifiOff, LucideAward,
  LucideHeadphones, LucideWallet, LucideWheat, LucideSprout, LucideDroplets
} from 'lucide-react';
import { NIGERIAN_STATES, TRANSLATIONS, MOCK_PRODUCTS, MOCK_POSTS, CRYPTO_ADDRESSES, MOCK_USER, MOCK_GROUPS } from './constants';
import { Language, Product, ForumPost, ChatMessage, AppSettings, UserProfile, Theme, ForumGroup, Comment } from './types';
import { askFarmingAssistant, generateMarketingImage, generateMarketingVideo } from './services/geminiService';
import LiveExpert from './components/LiveExpert';

// --- Configuration ---
// Removed unused LOGO_URL

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
    const t1 = setTimeout(() => setAnimationStep(1), 500); // Symbols fade in
    const t2 = setTimeout(() => setAnimationStep(2), 1500); // Text slide up
    const t3 = setTimeout(() => setAnimationStep(3), 3500); // Exit start
    const t4 = setTimeout(onComplete, 4200); // Complete

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] bg-[#FAFDF9] flex flex-col items-center justify-center transition-all duration-700 ${animationStep === 3 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative flex flex-col items-center p-8">
            {/* Agriculture Symbols Animation */}
            <div className={`transition-all duration-1000 ease-out transform ${animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`}>
                <div className="relative w-64 h-48 flex items-end justify-center pb-4 mb-4">
                     {/* Sun */}
                     <div className="absolute top-2 right-12 animate-[spin_12s_linear_infinite]">
                         <LucideSun size={56} className="text-yellow-400 fill-yellow-100" />
                     </div>
                     {/* Cloud with Rain */}
                     <div className="absolute top-6 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
                         <LucideCloud size={48} className="text-blue-300 fill-white" />
                         <LucideDroplets size={20} className="text-blue-400 absolute -bottom-5 left-3 animate-pulse" />
                     </div>
                     
                     {/* Plants */}
                     <div className="flex items-end gap-[-5px] z-10">
                        <LucideWheat size={64} className="text-amber-500 -rotate-12 transform origin-bottom animate-pulse" style={{ animationDuration: '4s' }} />
                        <LucideSprout size={72} className="text-green-600 -translate-y-2" strokeWidth={2} />
                        <LucideLeaf size={56} className="text-emerald-500 rotate-12 transform origin-bottom animate-pulse" style={{ animationDuration: '5s' }} />
                     </div>

                     {/* Ground Shadow/Glow */}
                     <div className="absolute bottom-2 w-48 h-4 bg-green-900/10 rounded-[100%] blur-md"></div>
                </div>
            </div>

            {/* Text */}
            <div className="text-center overflow-hidden">
                <h1 className={`text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-600 tracking-tighter mb-3 transition-all duration-1000 delay-300 transform ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    Agromarket
                </h1>
                <h2 className={`text-lg md:text-xl text-gray-500 font-serif font-medium tracking-widest uppercase transition-all duration-1000 delay-500 transform ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                    Premium Nigerian Agriculture
                </h2>
            </div>
        </div>
    </div>
  );
};

// ... (rest of the file remains unchanged, starting from TourOverlay) ...
const TourOverlay = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const steps = [
    {
      title: "Welcome to Agromarket",
      desc: "Your premium gateway to Nigerian agriculture. Let's take a quick tour.",
      icon: <LucideLeaf size={40} className="text-green-500" />
    },
    {
        title: "The Marketplace",
        desc: "Buy and sell produce, equipment, and services. Toggle between 'For Sale' and 'Buyer Requests' to find exactly what you need.",
        icon: <LucideShoppingBag size={40} className="text-blue-500" />
    },
    {
        title: "AI Farming Expert",
        desc: "Stuck? Ask our Gemini-powered AI about crops, diseases, or prices. Try the Live Voice mode for hands-free help!",
        icon: <LucideMic size={40} className="text-purple-500" />
    },
    {
        title: "Community Forum",
        desc: "Connect with other farmers, join cooperatives, and share knowledge in our thriving community.",
        icon: <LucideUsers size={40} className="text-yellow-500" />
    }
  ];

  const handleNext = () => {
      if (step < totalSteps - 1) setStep(step + 1);
      else onClose();
  }

  return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl max-w-md w-full shadow-2xl border border-white/20 relative mx-4">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <LucideX size={24} />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                      {steps[step].icon}
                  </div>
                  
                  <div>
                      <h3 className="text-2xl font-bold font-serif mb-2 dark:text-white">{steps[step].title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{steps[step].desc}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                      {steps.map((_, i) => (
                          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-green-600' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
                      ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-green-600/20"
                  >
                      {step === totalSteps - 1 ? 'Finish Tour' : 'Next Step'}
                  </button>
              </div>
          </div>
      </div>
  )
}

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
      </div>
    </div>
  );
};

const AuthPage = ({ onLogin, onGoogleClick }: { onLogin: () => void, onGoogleClick: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1625246333195-098e98e29138?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] min-h-[600px]">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-green-800 to-green-950 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
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
           </div>
           <p className="text-xs text-gray-500 mt-8">© 2026 Agromarket Inc.</p>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
           <div className="text-center md:text-left mb-8">
             <h3 className="text-3xl font-bold text-gray-900 mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
           </div>

           <div className="space-y-4">
             <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-green-500 focus-within:bg-white transition-colors">
                <LucideMail className="text-gray-400 mr-3" size={20} />
                <input type="email" placeholder="Email Address" className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400" />
             </div>
             
             <div className="bg-gray-50 rounded-xl flex items-center px-4 py-3 border focus-within:border-green-500 focus-within:bg-white transition-colors mb-4">
                <LucideLock className="text-gray-400 mr-3" size={20} />
                <input type="password" placeholder="Password" className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400" />
             </div>
             
             <button onClick={onLogin} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                {mode === 'login' ? 'Sign In' : 'Get Started'} <LucideArrowRight size={20}/>
             </button>

             <button onClick={onGoogleClick} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5"/>
                Continue with Google
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

const LazyImage = ({ src, alt, className = "", imageClassName = "" }: { src: string, alt: string, className?: string, imageClassName?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-black/30 z-10">
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
const Navbar = ({ lang, setLang, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, theme, setTheme, onNavigate, tourEnabled, setTourEnabled }: any) => {
  const t = TRANSLATIONS;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  const handleNav = (tab: string, params?: any) => {
    onNavigate(tab, params);
    setShowInbox(false);
    setShowNotifications(false);
    setMobileMenuOpen(false);
  }

  // Removing Donate from tabs
  const tabs = [
    { id: 'market', icon: LucideShoppingBag, label: t.nav_market[lang as Language] },
    { id: 'forum', icon: LucideUsers, label: t.nav_forum[lang as Language] },
    { id: 'ai', icon: LucideLeaf, label: t.nav_ai[lang as Language] },
    { id: 'tools', icon: LucideImage, label: t.nav_tools[lang as Language] },
  ];

  const ControlButton = ({ icon: Icon, onClick, active, badge }: any) => (
    <button 
        onClick={onClick}
        className={`p-2 rounded-full transition-all relative ${active ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
    >
        <Icon size={18} strokeWidth={2.5} />
        {badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></span>}
    </button>
  );

  return (
    <nav className={`fixed top-0 w-full z-40 px-2 md:px-4 py-2 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        
        {/* LEFT: Logo + Title + Controls (Inbox/Notif/Tour) */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
             {/* Logo + Title */}
            <div className="flex items-center gap-2 cursor-pointer shrink-0 mr-2 md:mr-6" onClick={() => handleNav('market')}>
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-1.5 rounded-lg shadow-lg">
                    <LucideLeaf className="text-white" size={18} />
                </div>
                <h1 className={`text-lg md:text-xl font-serif font-black tracking-wide hidden min-[360px]:block ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>
                    Agromkt
                </h1>
            </div>

            {/* CONTROLS: Tour Toggle + Inbox + Notif (Next to title, visible on mobile) */}
            <div className="flex items-center gap-2 md:gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
                 
                 {/* Tour Toggle */}
                 <div className="flex items-center gap-2 mr-1 md:mr-2 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tour</span>
                    <button 
                        onClick={() => setTourEnabled(!tourEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${tourEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        title="Toggle Interactive Tour"
                    >
                        <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${tourEnabled ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
                    </button>
                 </div>

                 {/* Inbox */}
                 <div className="relative">
                    <ControlButton icon={LucideMail} onClick={() => { setShowInbox(!showInbox); setShowNotifications(false); }} active={showInbox} badge={true} />
                    {showInbox && (
                        <div className={`absolute top-full left-0 mt-3 w-72 max-w-[90vw] rounded-2xl shadow-xl overflow-hidden border z-50 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="p-3 border-b border-gray-500/10 flex justify-between items-center">
                                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Messages</h3>
                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">2 New</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                <div onClick={() => handleNav('messages', { chatId: '1' })} className={`p-3 hover:bg-gray-500/5 cursor-pointer flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">A</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">Ahmed Musa</p>
                                        <p className="text-xs truncate opacity-70">Is the maize still available?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <ControlButton icon={LucideBell} onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); }} active={showNotifications} badge={true} />
                    {showNotifications && (
                        <div className={`absolute top-full left-0 mt-3 w-72 max-w-[90vw] rounded-2xl shadow-xl overflow-hidden border z-50 ${theme === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="p-3 border-b border-gray-500/10 flex justify-between items-center">
                                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">3 New</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                <div onClick={() => handleNav('market')} className={`p-3 hover:bg-gray-500/5 cursor-pointer flex gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <LucideTrendingUp size={16} className="text-green-500 mt-0.5"/>
                                    <div>
                                        <p className="font-bold text-sm">Price Alert</p>
                                        <p className="text-xs opacity-70">Maize prices rose by 5%.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* MIDDLE: Desktop Tabs */}
        <div className="hidden lg:flex gap-1 absolute left-1/2 -translate-x-1/2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-green-600 text-white shadow-md' 
                  : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
              }`}
            >
              <tab.icon size={18} strokeWidth={2.5} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* RIGHT: System Controls (Theme, Lang, Mobile Menu) */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            {theme === 'dark' ? <LucideSun size={18} /> : <LucideMoon size={18} />}
          </button>

          <button 
             onClick={() => handleNav('profile')}
             className={`hidden md:block p-2 rounded-full transition-all ${activeTab === 'profile' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_profile[lang]}
          >
            <LucideUser size={18} strokeWidth={2.5} />
          </button>
          <button 
             onClick={() => handleNav('settings')}
             className={`hidden md:block p-2 rounded-full transition-all ${activeTab === 'settings' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_settings[lang]}
          >
            <LucideSettings size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
            className="hidden md:flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <LucideGlobe size={14} strokeWidth={2.5} />
            {lang}
          </button>
          <button 
            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-14 left-0 w-full h-[calc(100vh-3.5rem)] overflow-y-auto pb-8 backdrop-blur-xl z-50 animate-in slide-in-from-top-4 ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'}`}>
          <div className="p-4 space-y-2">
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
            
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} space-y-2`}>
                <button 
                    onClick={() => handleNav('profile')}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold ${activeTab === 'profile' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <LucideUser size={24} /> Profile
                </button>
                <button 
                    onClick={() => handleNav('settings')}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold ${activeTab === 'settings' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <LucideSettings size={24} /> Settings
                </button>
                <button 
                    onClick={() => { setLang(lang === 'EN' ? 'HA' : 'EN'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold text-yellow-500`}
                >
                    <LucideGlobe size={24} /> {lang === 'EN' ? 'Switch to Hausa' : 'Switch to English'}
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Marketplace Component (Refined)
const Marketplace = ({ lang, theme }: { lang: Language, theme: Theme }) => {
  const [filter, setFilter] = useState('All');
  const [marketMode, setMarketMode] = useState<'sell' | 'buy'>('sell'); // 'sell' = For Sale (Sellers), 'buy' = Requests (Buyers)
  const [search, setSearch] = useState('');
  
  // Refined filtering logic
  const filtered = MOCK_PRODUCTS.filter(p => 
    (filter === 'All' || p.category === filter) &&
    (p.type === marketMode) && // Filter by Buy/Sell mode
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      
      {/* Dashboard Filters & Search */}
      <div className={`sticky top-14 z-30 pt-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 backdrop-blur-xl ${theme === 'dark' ? 'bg-black/80' : 'bg-white/80'}`}>
         
         {/* Mode Switcher (Sellers vs Buyers) */}
         <div className="flex justify-center mb-4">
             <div className={`p-1 rounded-full flex ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                 <button 
                    onClick={() => setMarketMode('sell')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${marketMode === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                 >
                    For Sale
                 </button>
                 <button 
                    onClick={() => setMarketMode('buy')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${marketMode === 'buy' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                 >
                    Buyer Requests
                 </button>
             </div>
         </div>

         <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
                <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder={marketMode === 'sell' ? "Search products..." : "Search buyer requests..."}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none border transition-all ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white focus:border-green-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-green-500'}`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {['All', 'Poultry', 'Fish', 'Feed'].map(cat => (
                    <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap text-sm border transition-all ${
                        filter === cat 
                        ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black' 
                        : theme === 'dark' ? 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                    >
                    {cat}
                    </button>
                ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
        {filtered.length > 0 ? filtered.map(product => (
            <div key={product.id} className={`group rounded-2xl overflow-hidden border transition-all hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="relative h-48 md:h-56 overflow-hidden">
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
                <div className="p-4 md:p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg leading-tight line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                    </div>
                    <p className="text-2xl font-serif font-black text-green-600 mb-3">₦{product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
                        <LucideMapPin size={14}/> {product.location}
                    </div>
                    <div className={`pt-4 border-t flex justify-between items-center ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-800">{product.sellerName[0]}</div>
                                <span className="text-xs font-bold opacity-70">{product.sellerName}</span>
                            </div>
                            <button className="text-sm font-bold text-green-600 hover:underline">Contact</button>
                    </div>
                </div>
            </div>
        )) : (
            <div className="col-span-full py-20 text-center opacity-50 flex flex-col items-center">
                <LucideSearch size={48} className="mb-4"/>
                <p>No listings found in this category.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// 3. Settings Component (Enhanced)
const Settings = ({ theme, lang, onToggleTheme }: { theme: Theme, lang: Language, onToggleTheme: () => void }) => {
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotification({ msg: 'Address copied!', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <h2 className={`text-3xl font-serif font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
            
            {notification && (
                <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <LucideCheckCircle size={16} /> {notification.msg}
                </div>
            )}

            {/* Donation Section */}
            <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-500/10 pb-4">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500"><LucideHeart size={24} /></div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Us</h3>
                </div>
                <p className="text-sm opacity-70 mb-4">Help us grow Agromarket by donating crypto to our addresses.</p>
                
                <div className="space-y-3">
                    <div className={`p-4 rounded-xl flex justify-between items-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                            <LucideWallet className="text-blue-500" size={20} />
                            <div>
                                <p className="text-xs opacity-50 font-bold uppercase">Base ETH</p>
                                <p className="font-mono font-bold text-sm">{CRYPTO_ADDRESSES.ETH_BASE}</p>
                            </div>
                        </div>
                        <button onClick={() => handleCopy(CRYPTO_ADDRESSES.ETH_BASE)} className="p-2 hover:bg-white/10 rounded-full"><LucideCopy size={18}/></button>
                    </div>
                    <div className={`p-4 rounded-xl flex justify-between items-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                         <div className="flex items-center gap-3">
                            <LucideImage className="text-purple-500" size={20} />
                            <div>
                                <p className="text-xs opacity-50 font-bold uppercase">NFT Domain</p>
                                <p className="font-mono font-bold text-sm">{CRYPTO_ADDRESSES.NFT}</p>
                            </div>
                        </div>
                        <button onClick={() => handleCopy(CRYPTO_ADDRESSES.NFT)} className="p-2 hover:bg-white/10 rounded-full"><LucideCopy size={18}/></button>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-500/10 pb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><LucideSettings size={24} /></div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>App Preferences</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</span>
                        <button 
                            onClick={onToggleTheme}
                            className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                    {/* Other settings... */}
                </div>
            </div>

            {/* Support */}
             <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'}`}>
                 <div className="flex items-center gap-3 mb-6 border-b border-gray-500/10 pb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><LucideHeadphones size={24} /></div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Help & Support</h3>
                </div>
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                    <LucideMessageCircle size={20} /> Chat with Live Support
                </button>
             </div>

            <button className="w-full py-4 text-red-500 font-bold bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors flex items-center justify-center gap-2">
                <LucideLogOut size={20} /> Sign Out
            </button>
        </div>
    )
}

// ... [Keep other components like Profile, Messages, etc. mostly same but ensure theme prop is passed correctly if changed] ...

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
  
  // App wide state
  const [tourEnabled, setTourEnabled] = useState(false);

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
        setTheme={setTheme}
        onNavigate={handleNavigate}
        tourEnabled={tourEnabled}
        setTourEnabled={setTourEnabled}
      />

      <main className="pt-20 px-4 max-w-7xl mx-auto min-h-screen">
        
        {activeTab === 'market' && <Marketplace lang={lang} theme={theme} />}

        {activeTab === 'forum' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-20">
                 {/* Forum Header */}
                 <div className="flex justify-between items-center mb-6 pt-4">
                     <h2 className="text-2xl font-bold">Community Forum</h2>
                     <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                         <LucidePlus size={16}/> New Post
                     </button>
                 </div>
                 
                 {/* Groups Horizontal */}
                 <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar mb-4">
                     {MOCK_GROUPS.map(group => (
                         <div key={group.id} className="min-w-[200px] h-32 rounded-xl relative overflow-hidden flex items-end p-3 cursor-pointer group shrink-0">
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl rotate-3 flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30">
                    <LucideLeaf className="text-white w-12 h-12" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black mb-4 tracking-tight">{TRANSLATIONS.ai_welcome[lang]}</h2>
                <p className="text-lg opacity-70 mb-10 leading-relaxed">
                    {lang === 'EN' 
                        ? "Get real-time advice on crops, disease control, and market trends powered by Gemini 3.0. Or switch to Voice Mode for hands-free assistance."
                        : "Samu shawarwari kan amfanin gona, maganin cututtuka, da yanayin kasuwa tare da Gemini 3.0. Ko yi amfani da Murya don taimako."}
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                     <button 
                        onClick={() => setShowLiveExpert(true)}
                        className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                     >
                        <LucideMic /> {TRANSLATIONS.ai_voice_mode[lang]}
                     </button>
                     <button className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                        <LucideMessageCircle /> Text Chat
                     </button>
                </div>
            </div>
        )}

        {activeTab === 'settings' && <Settings theme={theme} lang={lang} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}

        {/* Fallback for other tabs */}
        {['tools', 'profile', 'messages'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] opacity-50 animate-pulse">
                <LucideLoader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold">Loading module...</p>
            </div>
        )}
      </main>

      {tourEnabled && <TourOverlay onClose={() => setTourEnabled(false)} />}
      {showLiveExpert && <LiveExpert onClose={() => setShowLiveExpert(false)} language={lang} />}
    </div>
  );
};

export default App;