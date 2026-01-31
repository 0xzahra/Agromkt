import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideLeaf, LucideUsers, LucideShoppingBag, LucideMessageCircle, 
  LucideSearch, LucideGlobe, LucideHeart, LucideSend, LucideMapPin,
  LucideVideo, LucideImage, LucideX, LucideMenu, LucideLoader2,
  LucideSettings, LucideUser, LucideMoon, LucideSun, LucideEye, 
  LucideVolume2, LucideShieldCheck, LucideLogOut, LucideChevronLeft,
  LucideShare2, LucideCopy, LucideCheckCircle, LucideCloud, LucideSpeaker
} from 'lucide-react';
import { NIGERIAN_STATES, TRANSLATIONS, MOCK_PRODUCTS, MOCK_POSTS, CRYPTO_ADDRESSES, MOCK_USER } from './constants';
import { Language, Product, ForumPost, ChatMessage, AppSettings, UserProfile, Theme } from './types';
import { askFarmingAssistant, generateMarketingImage, generateMarketingVideo } from './services/geminiService';
import LiveExpert from './components/LiveExpert';

// --- Services & Helpers ---
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

// --- Sub-components ---

// 1. Navbar
const Navbar = ({ lang, setLang, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, theme }: any) => {
  const t = TRANSLATIONS;
  const tabs = [
    { id: 'market', icon: LucideShoppingBag, label: t.nav_market[lang as Language] },
    { id: 'forum', icon: LucideUsers, label: t.nav_forum[lang as Language] },
    { id: 'ai', icon: LucideLeaf, label: t.nav_ai[lang as Language] },
    { id: 'tools', icon: LucideImage, label: t.nav_tools[lang as Language] },
    { id: 'donate', icon: LucideHeart, label: t.nav_donate[lang as Language] },
  ];

  return (
    <nav className={`fixed top-0 w-full z-40 px-4 py-3 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('market')}>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-2 rounded-lg shadow-lg">
            <LucideLeaf className="text-white" size={24} />
          </div>
          <h1 className={`text-2xl font-serif font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>
            {t.app_name[lang as Language]}
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 transform scale-105' 
                  : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setActiveTab('profile')}
             className={`p-2 rounded-full ${activeTab === 'profile' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LucideUser size={20} />
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`p-2 rounded-full ${activeTab === 'settings' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LucideSettings size={20} />
          </button>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
            className="hidden md:flex items-center gap-1.5 bg-yellow-600/20 border border-yellow-600/50 px-3 py-1.5 rounded-full text-yellow-500 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600/30 transition-colors"
          >
            <LucideGlobe size={14} />
            {lang}
          </button>
          <button 
            className={`md:hidden ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <LucideX /> : <LucideMenu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-4 pb-4 space-y-2 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                 activeTab === tab.id 
                 ? 'bg-green-600 text-white' 
                 : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// 2. Marketplace Components
const ProductCard = ({ product, lang, onClick, theme }: any) => (
  <div onClick={onClick} className="group glass-panel rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer nature-shadow">
    <div className="h-48 overflow-hidden relative">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex justify-between items-end">
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.type === 'buy' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
          {product.type === 'buy' ? 'Request' : product.category}
        </span>
        <span className="text-yellow-400 font-bold text-lg drop-shadow-md">₦{product.price.toLocaleString()}</span>
      </div>
    </div>
    <div className={`p-4 space-y-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
      <h3 className={`text-lg font-bold leading-tight font-serif ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{product.name}</h3>
      <div className="flex items-center gap-2 text-xs opacity-70">
        <LucideMapPin size={12} />
        {product.location} • {product.datePosted}
      </div>
    </div>
  </div>
);

const ProductDetail = ({ product, onBack, lang, theme }: any) => {
  const t = TRANSLATIONS;
  return (
    <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className={`flex items-center gap-2 mb-6 font-bold ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
        <LucideChevronLeft /> Back to Market
      </button>
      
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 relative h-96 md:h-auto">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute top-4 left-4">
             <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${product.type === 'buy' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {product.type === 'buy' ? 'Buying Request' : 'For Sale'}
             </span>
          </div>
        </div>

        {/* Info Section */}
        <div className={`md:w-1/2 p-8 flex flex-col ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between items-start">
                 <h2 className={`text-4xl font-serif font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{product.name}</h2>
                 <button className="p-2 rounded-full hover:bg-gray-500/20"><LucideShare2 size={20}/></button>
              </div>
              <p className="text-2xl font-bold text-yellow-500">₦{product.price.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-gray-500/20">
               <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${product.sellerName}&background=random`} alt="Seller" />
               </div>
               <div>
                 <p className="font-bold">{product.sellerName}</p>
                 <p className="text-xs opacity-70 flex items-center gap-1"><LucideMapPin size={10}/> {product.location}</p>
               </div>
               <button className="ml-auto text-xs border border-current px-3 py-1 rounded-full">View Profile</button>
            </div>

            <div>
              <h3 className="font-bold mb-2 opacity-80">Description</h3>
              <p className="opacity-70 leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             <a 
                href={`https://wa.me/${product.sellerPhone}?text=Hello, I saw your listing for ${product.name} on Agromarket.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30"
              >
                <LucideMessageCircle /> {product.type === 'buy' ? t.btn_sell[lang] : t.btn_buy[lang]} (WhatsApp)
              </a>
              <button className={`w-full py-4 border font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-gray-600 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'}`}>
                Start Live Chat
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace = ({ lang, theme, setProduct }: any) => {
  const [filterState, setFilterState] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [listingType, setListingType] = useState<'sell' | 'buy'>('sell');
  const t = TRANSLATIONS;

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    return (!filterState || p.location === filterState) && 
           (!filterCat || p.category === filterCat) &&
           (p.type === listingType);
  });

  return (
    <div className="space-y-6 pt-24 pb-24 px-4 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 sticky top-20 z-30 nature-shadow">
        
        {/* Type Toggle */}
        <div className="flex bg-black/20 p-1 rounded-lg">
           <button 
             onClick={() => setListingType('sell')}
             className={`px-6 py-2 rounded-md font-bold transition-all ${listingType === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
             {t.mode_sell[lang]}
           </button>
           <button 
             onClick={() => setListingType('buy')}
             className={`px-6 py-2 rounded-md font-bold transition-all ${listingType === 'buy' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
             {t.mode_buy[lang]}
           </button>
        </div>

        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <LucideMapPin className="absolute left-3 top-3.5 text-green-400" size={18} />
            <select 
              className={`w-full border pl-10 pr-4 py-3 rounded-lg focus:outline-none appearance-none ${theme === 'dark' ? 'bg-gray-900/60 border-gray-700 text-white focus:border-green-500' : 'bg-white/60 border-gray-300 text-gray-800 focus:border-green-600'}`}
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            >
              <option value="">{t.filter_state[lang]}</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative flex-1">
             <LucideShoppingBag className="absolute left-3 top-3.5 text-yellow-500" size={18} />
             <select 
               className={`w-full border pl-10 pr-4 py-3 rounded-lg focus:outline-none appearance-none ${theme === 'dark' ? 'bg-gray-900/60 border-gray-700 text-white focus:border-yellow-500' : 'bg-white/60 border-gray-300 text-gray-800 focus:border-yellow-600'}`}
               value={filterCat}
               onChange={(e) => setFilterCat(e.target.value)}
             >
              <option value="">{t.filter_category[lang]}</option>
              <option value="Poultry">Poultry</option>
              <option value="Fish">Fish</option>
              <option value="Feed">Feed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} lang={lang} theme={theme} onClick={() => setProduct(product)} />
        ))}
      </div>
    </div>
  );
};

// 3. User Profile Component
const Profile = ({ theme, lang }: any) => {
  const user = MOCK_USER;
  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto">
       <div className="glass-panel rounded-3xl overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-green-800 to-green-600"></div>
          <div className="px-8 pb-8">
             <div className="relative -top-16 flex flex-col md:flex-row items-end md:items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-black/50 overflow-hidden shadow-2xl">
                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 mb-2">
                   <h2 className={`text-3xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name} {user.isVerified && <LucideShieldCheck className="inline text-blue-400" size={24}/>}</h2>
                   <p className="text-gray-400">{user.handle} • {user.role}</p>
                </div>
                <div className="mb-2 flex gap-3">
                   <button className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">Edit Profile</button>
                </div>
             </div>

             <div className={`mt-[-2rem] grid grid-cols-1 md:grid-cols-3 gap-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="md:col-span-2 space-y-6">
                   <div>
                     <h3 className="font-bold text-lg mb-2 border-b border-gray-500/30 pb-2">About</h3>
                     <p className="leading-relaxed">{user.bio}</p>
                   </div>
                   <div>
                     <h3 className="font-bold text-lg mb-4 border-b border-gray-500/30 pb-2">Active Listings</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_PRODUCTS.slice(0,2).map(p => (
                           <div key={p.id} className="bg-black/20 p-3 rounded-xl flex gap-3 items-center">
                              <img src={p.image} className="w-16 h-16 rounded-lg object-cover" alt="p"/>
                              <div>
                                 <p className="font-bold text-sm truncate">{p.name}</p>
                                 <p className="text-yellow-500 text-xs font-bold">₦{p.price.toLocaleString()}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-black/10 p-4 rounded-xl space-y-3">
                       <div className="flex items-center gap-3">
                          <LucideMapPin className="text-green-500"/>
                          <span>{user.location}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <LucideGlobe className="text-blue-400"/>
                          <span className="truncate">{user.socials.twitter}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <LucideCheckCircle className="text-yellow-500"/>
                          <span>Reputation: {user.reputation}/5.0</span>
                       </div>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

// 4. Settings Component
const Settings = ({ settings, setSettings, theme, setTheme, lang }: any) => {
   const toggleSetting = (key: keyof AppSettings) => {
      setSettings((prev: any) => ({...prev, [key]: !prev[key]}));
   }

   return (
     <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto">
        <h2 className={`text-3xl font-serif font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>Settings</h2>
        
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-gray-500/20">
           {/* Appearance */}
           <div className="p-6">
              <h3 className="text-green-500 font-bold mb-4 uppercase text-xs tracking-wider">Appearance</h3>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    {theme === 'dark' ? <LucideMoon/> : <LucideSun/>}
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>App Theme</span>
                 </div>
                 <div className="bg-black/20 p-1 rounded-lg flex">
                    <button onClick={() => setTheme('light')} className={`px-4 py-1 rounded ${theme === 'light' ? 'bg-white text-black shadow' : 'text-gray-400'}`}>Light</button>
                    <button onClick={() => setTheme('dark')} className={`px-4 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-white shadow' : 'text-gray-400'}`}>Dark</button>
                 </div>
              </div>
           </div>

           {/* Accessibility */}
           <div className="p-6 space-y-6">
              <h3 className="text-green-500 font-bold mb-4 uppercase text-xs tracking-wider">Accessibility</h3>
              
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <LucideEye className="text-yellow-500"/>
                    <div>
                       <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Eye Comfort Mode</p>
                       <p className="text-xs text-gray-400">Reduces blue light for night use</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggleSetting('eyeComfort')}
                   className={`w-12 h-6 rounded-full transition-colors relative ${settings.eyeComfort ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.eyeComfort ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <LucideVolume2 className="text-blue-400"/>
                    <div>
                       <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Text-to-Speech</p>
                       <p className="text-xs text-gray-400">Read content aloud for accessibility</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggleSetting('textToSpeech')}
                   className={`w-12 h-6 rounded-full transition-colors relative ${settings.textToSpeech ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.textToSpeech ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>

               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold">C</div>
                    <div>
                       <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>High Contrast</p>
                       <p className="text-xs text-gray-400">Increases visibility</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggleSetting('highContrast')}
                   className={`w-12 h-6 rounded-full transition-colors relative ${settings.highContrast ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.highContrast ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>

           {/* Security */}
           <div className="p-6 space-y-6">
              <h3 className="text-green-500 font-bold mb-4 uppercase text-xs tracking-wider">Security & Data</h3>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <LucideShieldCheck className="text-green-400"/>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Two-Factor Auth</span>
                 </div>
                 <button 
                   onClick={() => toggleSetting('twoFactor')}
                   className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.twoFactor ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <LucideCloud className="text-blue-400"/>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Cloud Backup</span>
                 </div>
                 <button 
                   onClick={() => toggleSetting('cloudSync')}
                   className={`w-12 h-6 rounded-full transition-colors relative ${settings.cloudSync ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.cloudSync ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>

           <div className="p-6 bg-red-500/10 cursor-pointer hover:bg-red-500/20 transition-colors flex items-center gap-3 text-red-400">
               <LucideLogOut />
               <span className="font-bold">Log Out</span>
           </div>
        </div>
     </div>
   )
}

// 5. Donation Component
const Donation = ({ theme }: any) => {
   const [copied, setCopied] = useState<string | null>(null);

   const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
   }

   return (
      <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto text-center">
         <div className="glass-panel p-8 rounded-3xl space-y-6">
             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <LucideHeart className="text-red-500" size={40}/>
             </div>
             <h2 className={`text-3xl font-serif font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Our Development</h2>
             <p className="text-gray-400">Help us keep Agromarket free for farmers across Nigeria. We accept crypto donations.</p>
             
             <div className="space-y-4 text-left mt-8">
                <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center border border-white/10">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Base / ETH</p>
                      <p className="font-mono text-green-400 text-lg">{CRYPTO_ADDRESSES.ETH_BASE}</p>
                   </div>
                   <button onClick={() => copyToClipboard(CRYPTO_ADDRESSES.ETH_BASE, 'eth')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                      {copied === 'eth' ? <LucideCheckCircle className="text-green-500"/> : <LucideCopy/>}
                   </button>
                </div>

                <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center border border-white/10">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">NFT Domain</p>
                      <p className="font-mono text-blue-400 text-lg">{CRYPTO_ADDRESSES.NFT}</p>
                   </div>
                   <button onClick={() => copyToClipboard(CRYPTO_ADDRESSES.NFT, 'nft')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                      {copied === 'nft' ? <LucideCheckCircle className="text-green-500"/> : <LucideCopy/>}
                   </button>
                </div>
             </div>
         </div>
      </div>
   )
}

// ... AI, Tools, Forum remain mostly similar but adapted for theme ... 
// Simplified inline for brevity due to length, assume they accept 'theme' prop

const AIGuide = ({ lang, theme }: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const result = await askFarmingAssistant(userMsg.text, `Language: ${lang === 'HA' ? 'Hausa' : 'English'}`);
      let groundingText = "";
      if (result.grounding && result.grounding.length > 0) {
        groundingText = "\n\nSources:\n" + result.grounding.map((c: any) => `- ${c.web?.title}: ${c.web?.uri}`).join('\n');
      }
      setMessages(prev => [...prev, { role: 'model', text: result.text + groundingText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Network error. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto h-screen flex flex-col">
      {showVoice && <LiveExpert onClose={() => setShowVoice(false)} language={lang} />}
      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden nature-shadow">
        <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-green-900/40 border-white/10' : 'bg-green-100/80 border-green-200'}`}>
           <div className="flex items-center gap-3">
             <div className="bg-yellow-500/20 p-2 rounded-full"><LucideLeaf className="text-yellow-500" /></div>
             <div><h3 className={`font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{t.nav_ai[lang]}</h3></div>
           </div>
           <button onClick={() => setShowVoice(true)} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full font-bold border border-red-500/30"><LucideVideo size={16}/> Voice</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-800/80 text-gray-100 rounded-bl-none border border-gray-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isThinking && <div className="text-green-500 animate-pulse flex items-center gap-2 p-4"><LucideLoader2 className="animate-spin"/> Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className={`p-4 border-t ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/50 border-gray-200'}`}>
          <div className="flex gap-2">
            <input type="text" className={`flex-1 rounded-xl px-4 py-3 focus:outline-none border ${theme === 'dark' ? 'bg-gray-900/80 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} placeholder="Ask..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-green-600 text-white p-3 rounded-xl"><LucideSend size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tools = ({ lang, theme }: any) => {
    const [prompt, setPrompt] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'image' | 'video'>('image');
    
    const handleGenerate = async () => {
        if(!prompt) return;
        setLoading(true);
        setGeneratedUrl(null);
        try {
            const win = window as any;
            if (win.aistudio && win.aistudio.openSelectKey) {
                const hasKey = await win.aistudio.hasSelectedApiKey();
                if(!hasKey) await win.aistudio.openSelectKey();
            }
            let result = mode === 'image' ? await generateMarketingImage(prompt) : await generateMarketingVideo(prompt);
            if(result) setGeneratedUrl(result);
        } catch (e) { alert("Generation failed."); } finally { setLoading(false); }
    }

    return (
        <div className="pt-24 pb-24 px-4 max-w-2xl mx-auto space-y-6">
            <h2 className={`text-3xl font-serif text-center ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>Creative Studio</h2>
            <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div className="flex gap-4 bg-black/20 p-1 rounded-lg">
                    <button onClick={() => setMode('image')} className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'image' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>Image</button>
                    <button onClick={() => setMode('video')} className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'video' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>Video</button>
                </div>
                <textarea className={`w-full h-32 rounded-xl p-4 focus:outline-none border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white/50 border-gray-300 text-gray-900'}`} placeholder={`Describe your ${mode}...`} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                <button onClick={handleGenerate} disabled={loading || !prompt} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl flex justify-center gap-2">{loading ? <LucideLoader2 className="animate-spin"/> : <LucideLeaf />} Generate</button>
                {generatedUrl && <div className="mt-6 rounded-xl overflow-hidden"><img src={generatedUrl} className="w-full" alt="gen"/></div>}
            </div>
        </div>
    )
}

const Forum = ({ theme }: any) => (
    <div className="pt-24 pb-24 px-4 max-w-3xl mx-auto space-y-6">
        {MOCK_POSTS.map(post => (
             <div key={post.id} className="glass-panel p-6 rounded-2xl space-y-3 nature-shadow">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <img src={post.authorAvatar} className="w-10 h-10 rounded-full" alt="auth"/>
                        <div>
                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.author} <span className="text-green-500 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">{post.role}</span></p>
                            <p className="text-gray-500 text-xs">{post.timestamp}</p>
                        </div>
                    </div>
                </div>
                <h3 className={`text-xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{post.content}</p>
                <div className="flex gap-4 pt-2 border-t border-gray-500/20">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-sm"><LucideHeart size={16}/> {post.likes}</button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 text-sm"><LucideMessageCircle size={16}/> {post.comments}</button>
                </div>
             </div>
        ))}
    </div>
);

// Main App Layout
function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('dark'); // 'dark' (Default Forest) | 'light' (Daylight)
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    eyeComfort: false,
    highContrast: false,
    textToSpeech: false,
    cloudSync: true,
    twoFactor: false
  });

  const bgImage = theme === 'dark' 
     ? 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop' // Forest Dark
     : 'https://images.unsplash.com/photo-1625246333195-098e98e29138?q=80&w=2070&auto=format&fit=crop'; // Farm Light

  return (
    <div className={`min-h-screen bg-fixed bg-cover bg-center transition-all duration-500 ${theme === 'light' ? 'light-mode' : ''} ${settings.highContrast ? 'high-contrast' : ''}`} 
         style={{ backgroundImage: `url('${bgImage}')` }}>
      
      {/* Eye Comfort Overlay */}
      {settings.eyeComfort && <div className="eye-comfort-overlay"></div>}

      {/* Dark Overlay for readability in dark mode */}
      {theme === 'dark' && <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none transition-opacity duration-500" />}
      {theme === 'light' && <div className="fixed inset-0 bg-white/20 z-0 pointer-events-none transition-opacity duration-500" />}

      {/* Content */}
      <div className="relative z-10">
        <Navbar 
          lang={lang} setLang={setLang} activeTab={activeTab} setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} theme={theme}
        />

        <main className="min-h-[calc(100vh-60px)]">
          {activeTab === 'market' && !selectedProduct && <Marketplace lang={lang} theme={theme} setProduct={setSelectedProduct} />}
          {activeTab === 'market' && selectedProduct && <ProductDetail product={selectedProduct} theme={theme} lang={lang} onBack={() => setSelectedProduct(null)} />}
          
          {activeTab === 'ai' && <AIGuide lang={lang} theme={theme} />}
          {activeTab === 'forum' && <Forum theme={theme} />}
          {activeTab === 'tools' && <Tools lang={lang} theme={theme} />}
          {activeTab === 'profile' && <Profile theme={theme} lang={lang} />}
          {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} theme={theme} setTheme={setTheme} lang={lang} />}
          {activeTab === 'donate' && <Donation theme={theme} />}
        </main>

        {/* Floating TTS Button if enabled */}
        {settings.textToSpeech && (
           <button onClick={() => speakText("Welcome to Agromarket. Currently viewing " + activeTab)} className="fixed bottom-36 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl">
              <LucideSpeaker />
           </button>
        )}

        {/* Live Support Widget */}
        <div className="fixed bottom-20 right-4 z-40">
           {showSupport && (
               <div className="absolute bottom-16 right-0 w-72 h-64 glass-panel rounded-xl p-4 flex flex-col mb-2 origin-bottom-right animate-in fade-in zoom-in slide-in-from-bottom-5">
                   <div className="flex justify-between items-center mb-2 border-b border-gray-500/30 pb-2">
                       <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Agent</span>
                       <button onClick={() => setShowSupport(false)}><LucideX size={16} /></button>
                   </div>
                   <div className="flex-1 bg-black/20 rounded p-2 text-sm text-gray-300 overflow-y-auto">
                       <p>Hello! How can we help you verify your farm account today?</p>
                   </div>
                   <input className="mt-2 bg-gray-800 text-white text-sm p-2 rounded border border-gray-600" placeholder="Type here..." />
               </div>
           )}
           <button 
             onClick={() => setShowSupport(!showSupport)}
             className="bg-yellow-500 hover:bg-yellow-400 text-black p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-bold"
           >
             <LucideMessageCircle /> 
             <span className="hidden md:inline">{TRANSLATIONS.support_help[lang]}</span>
           </button>
        </div>

        {/* Footer */}
        <footer className="glass-panel border-t border-white/10 py-6 text-center z-10 relative">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {TRANSLATIONS.copyright[lang]}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;