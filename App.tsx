import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideLeaf, LucideUsers, LucideShoppingBag, LucideMessageCircle, 
  LucideSearch, LucideGlobe, LucideHeart, LucideSend, LucideMapPin,
  LucideVideo, LucideImage, LucideX, LucideMenu, LucideLoader2,
  LucideSettings, LucideUser, LucideMoon, LucideSun, LucideEye, 
  LucideVolume2, LucideShieldCheck, LucideLogOut, LucideChevronLeft,
  LucideShare2, LucideCopy, LucideCheckCircle, LucideCloud, LucideSpeaker,
  LucideTrendingUp, LucidePackage, LucideClock, LucideType, LucideMail, 
  LucidePhone, LucidePlus, LucideThumbsUp, LucideUserPlus, LucideMoreVertical
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
    <nav className={`fixed top-0 w-full z-40 px-4 py-3 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-200'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('market')}>
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-2.5 rounded-xl shadow-lg shadow-green-900/20">
            <LucideLeaf className="text-white" size={26} />
          </div>
          <h1 className={`text-2xl font-serif font-black tracking-wide ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>
            {t.app_name[lang as Language]}
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setActiveTab('profile')}
             className={`p-3 rounded-full transition-all ${activeTab === 'profile' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_profile[lang]}
          >
            <LucideUser size={22} strokeWidth={2.5} />
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`p-3 rounded-full transition-all ${activeTab === 'settings' ? 'bg-green-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:bg-white/10 bg-white/5' : 'text-gray-600 hover:bg-gray-100 bg-gray-100'}`}
             title={t.nav_settings[lang]}
          >
            <LucideSettings size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2.5 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-yellow-500/20 hover:scale-105"
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
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
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
        </div>
      )}
    </nav>
  );
};

// 2. Marketplace Components
const ProductCard = ({ product, lang, onClick, theme }: any) => (
  <div onClick={onClick} className="group glass-panel rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer nature-shadow border-0 ring-1 ring-white/10 hover:ring-green-500/50">
    <div className="h-64 overflow-hidden relative">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-between">
        <div className="flex justify-end">
             <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide backdrop-blur-md shadow-lg ${product.type === 'buy' ? 'bg-blue-600/90 text-white' : 'bg-green-600/90 text-white'}`}>
                {product.type === 'buy' ? 'Request' : product.category}
             </span>
        </div>
        <span className="text-yellow-400 font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">₦{product.price.toLocaleString()}</span>
      </div>
    </div>
    <div className={`p-5 space-y-3 ${theme === 'light' ? 'bg-white/80' : 'bg-black/40'}`}>
      <h3 className={`text-xl font-bold leading-tight font-serif line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{product.name}</h3>
      <div className="flex items-center gap-2 text-sm opacity-80 font-medium">
        <LucideMapPin size={14} className="text-green-500" />
        {product.location}
      </div>
       <div className="flex items-center gap-2 text-xs opacity-60">
        <LucideClock size={12} />
        {product.datePosted}
      </div>
    </div>
  </div>
);

const ProductDetail = ({ product, onBack, lang, theme }: any) => {
  const t = TRANSLATIONS;
  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col md:flex-row gap-8">
      {/* Floating LHS Back Navigation */}
      <div className="hidden md:block sticky top-32 h-fit z-30">
        <button 
            onClick={onBack} 
            className="w-14 h-14 rounded-full glass-panel flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-xl text-gray-400 group"
            title="Back to Market"
        >
            <LucideChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row ring-1 ring-white/10">
        <div className="md:hidden absolute top-4 left-4 z-20">
             <button onClick={onBack} className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white"><LucideChevronLeft size={24}/></button>
        </div>
        <div className="lg:w-1/2 relative h-[50vh] lg:h-auto bg-gray-900">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute bottom-6 left-6 flex gap-3">
             <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${product.type === 'buy' ? 'bg-blue-600/90 text-white' : 'bg-green-600/90 text-white'}`}>
                {product.type === 'buy' ? 'Buying Request' : 'For Sale'}
             </span>
             <span className="px-4 py-2 rounded-full text-sm font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-2">
                <LucideImage size={14} /> Gallery
             </span>
          </div>
        </div>
        <div className={`lg:w-1/2 p-8 lg:p-12 flex flex-col ${theme === 'light' ? 'bg-white/90 text-gray-900' : 'bg-gradient-to-br from-black/80 to-green-950/20 text-gray-100'}`}>
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex justify-between items-start">
                 <h2 className="text-4xl md:text-5xl font-serif font-black mb-4 leading-tight">{product.name}</h2>
                 <button className="p-3 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-colors"><LucideShare2 size={24}/></button>
              </div>
              <p className="text-4xl font-black text-yellow-500 tracking-tight">₦{product.price.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-4 py-6 border-y ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
               <div className="w-16 h-16 bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
                 <img src={`https://ui-avatars.com/api/?name=${product.sellerName}&background=random`} className="w-full h-full object-cover" alt="Seller" />
               </div>
               <div>
                 <p className="font-bold text-lg">{product.sellerName}</p>
                 <p className="text-sm opacity-70 flex items-center gap-1.5 mt-1"><LucideMapPin size={14} className="text-green-500"/> {product.location}</p>
                 <p className="text-xs opacity-50 mt-1">Response time: &lt; 1hr</p>
               </div>
               <button className={`ml-auto text-sm font-bold border px-5 py-2.5 rounded-full hover:scale-105 transition-transform ${theme === 'light' ? 'border-gray-300 hover:bg-gray-50' : 'border-gray-600 hover:bg-white/5'}`}>
                   Profile
               </button>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 uppercase tracking-wider opacity-60">Description</h3>
              <p className="text-lg opacity-90 leading-relaxed font-light">{product.description}</p>
            </div>
          </div>
          <div className="mt-10 space-y-4">
             <a 
                href={`https://wa.me/${product.sellerPhone}?text=Hello, I saw your listing for ${product.name} on Agromarket.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-green-500/40 hover:-translate-y-1"
              >
                <LucideMessageCircle size={24} /> {product.type === 'buy' ? t.btn_sell[lang] : t.btn_buy[lang]}
              </a>
              <button className={`w-full py-5 border font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 ${theme === 'dark' ? 'border-gray-600 hover:bg-white/5 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                <LucideMessageCircle size={24} /> In-App Chat
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
    <div className="space-y-8 pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-4 sticky top-24 z-30 nature-shadow backdrop-blur-xl">
        <div className="flex bg-black/10 p-1.5 rounded-xl">
           <button 
             onClick={() => setListingType('sell')}
             className={`px-8 py-3 rounded-xl font-bold transition-all ${listingType === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
             {t.mode_sell[lang]}
           </button>
           <button 
             onClick={() => setListingType('buy')}
             className={`px-8 py-3 rounded-xl font-bold transition-all ${listingType === 'buy' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
             {t.mode_buy[lang]}
           </button>
        </div>
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <LucideMapPin className="absolute left-4 top-4 text-green-500" size={20} />
            <select 
              className={`w-full border pl-12 pr-4 py-4 rounded-xl focus:outline-none appearance-none font-medium cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-900/60 border-gray-700 text-white focus:border-green-500 hover:bg-gray-800' : 'bg-white/60 border-gray-300 text-gray-800 focus:border-green-600 hover:bg-white'}`}
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            >
              <option value="">{t.filter_state[lang]}</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative flex-1">
             <LucideShoppingBag className="absolute left-4 top-4 text-yellow-500" size={20} />
             <select 
               className={`w-full border pl-12 pr-4 py-4 rounded-xl focus:outline-none appearance-none font-medium cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-900/60 border-gray-700 text-white focus:border-yellow-500 hover:bg-gray-800' : 'bg-white/60 border-gray-300 text-gray-800 focus:border-yellow-600 hover:bg-white'}`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} lang={lang} theme={theme} onClick={() => setProduct(product)} />
        ))}
      </div>
    </div>
  );
};

// 3. Updated Profile Component (Handles both My Profile and Others)
const Profile = ({ theme, lang, viewingUser, onBack }: any) => {
  const user = viewingUser || MOCK_USER; // Default to my profile if no user passed
  const isMe = !viewingUser || viewingUser.id === MOCK_USER.id;
  const t = TRANSLATIONS;
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <div className="pt-28 pb-24 px-4 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8">
       {/* Floating Back Button for viewing other profiles */}
       {!isMe && (
          <button 
             onClick={onBack} 
             className="mb-6 w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-xl text-gray-400"
          >
              <LucideChevronLeft size={24} />
          </button>
       )}

       <div className="glass-panel rounded-[2.5rem] overflow-hidden relative shadow-2xl ring-1 ring-white/10">
          <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2664&auto=format&fit=crop')` }}>
             <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          <div className="px-8 pb-12">
             <div className="relative -top-20 flex flex-col lg:flex-row items-end lg:items-end gap-8">
                <div className="w-40 h-40 rounded-[2rem] border-4 border-black/50 overflow-hidden shadow-2xl bg-gray-800">
                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 mb-2">
                   <h2 className={`text-4xl md:text-5xl font-black font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name} {user.isVerified && <LucideShieldCheck className="inline text-blue-500" size={32}/>}</h2>
                   <p className="text-xl text-green-500 font-bold mt-1">{user.handle} • <span className="bg-white/10 px-3 py-0.5 rounded-full text-sm text-gray-300">{user.role}</span></p>
                   <div className="flex gap-6 mt-3 text-sm opacity-70">
                       <span><span className="font-bold">{user.followers || 0}</span> Followers</span>
                       <span><span className="font-bold">{user.following || 0}</span> Following</span>
                   </div>
                </div>
                <div className="mb-4 flex gap-4">
                   {isMe ? (
                      <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1">Edit Profile</button>
                   ) : (
                      <>
                        <button 
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2 ${isFollowing ? 'bg-gray-600 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                        >
                            {isFollowing ? 'Following' : <><LucideUserPlus size={18}/> Follow</>}
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1">Message</button>
                      </>
                   )}
                </div>
             </div>

             <div className={`mt-[-2rem] grid grid-cols-1 lg:grid-cols-3 gap-12 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                {/* Stats (Visible for everyone, maybe limited for others in real app) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-900/50 to-green-800/20 p-6 rounded-3xl border border-green-500/20">
                        <div className="flex items-center gap-3 mb-2 text-green-400">
                            <LucideTrendingUp />
                            <span className="font-bold uppercase text-xs tracking-wider">{t.stats_earnings[lang]}</span>
                        </div>
                        <p className="text-3xl font-black text-white">₦{user.stats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                         <div className="flex items-center gap-3 mb-2 text-blue-400">
                            <LucidePackage />
                            <span className="font-bold uppercase text-xs tracking-wider">{t.stats_sold[lang]}</span>
                        </div>
                        <p className="text-3xl font-black text-white">{user.stats.itemsSold}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                         <div className="flex items-center gap-3 mb-2 text-yellow-400">
                            <LucideShoppingBag />
                            <span className="font-bold uppercase text-xs tracking-wider">{t.stats_active[lang]}</span>
                        </div>
                        <p className="text-3xl font-black text-white">{user.stats.activeListings}</p>
                    </div>
                     <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                         <div className="flex items-center gap-3 mb-2 text-purple-400">
                            <LucideClock />
                            <span className="font-bold uppercase text-xs tracking-wider">Pending Orders</span>
                        </div>
                        <p className="text-3xl font-black text-white">{user.stats.pendingOrders}</p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                   <div>
                     <h3 className="font-bold text-2xl mb-4 flex items-center gap-2"><LucideUser className="text-green-500"/> About</h3>
                     <p className="text-lg leading-relaxed opacity-80">{user.bio}</p>
                   </div>
                   <div>
                     <h3 className="font-bold text-2xl mb-6 flex items-center gap-2"><LucideShoppingBag className="text-yellow-500"/> Active Listings</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {MOCK_PRODUCTS.slice(0,2).map(p => (
                           <div key={p.id} className="bg-black/20 p-4 rounded-2xl flex gap-4 items-center hover:bg-black/30 transition-colors cursor-pointer group">
                              <img src={p.image} className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform" alt="p"/>
                              <div>
                                 <p className="font-bold text-lg truncate group-hover:text-green-400">{p.name}</p>
                                 <p className="text-yellow-500 font-bold">₦{p.price.toLocaleString()}</p>
                                 <p className="text-xs opacity-50 mt-1">{p.datePosted}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10">
                       <h3 className="font-bold text-xl mb-2 opacity-50 uppercase tracking-widest">Details</h3>
                       <div className="flex items-center gap-4 text-lg">
                          <div className="bg-green-500/20 p-3 rounded-full"><LucideMapPin className="text-green-500"/></div>
                          <span>{user.location}</span>
                       </div>
                       <div className="flex items-center gap-4 text-lg">
                          <div className="bg-blue-500/20 p-3 rounded-full"><LucideGlobe className="text-blue-400"/></div>
                          <span className="truncate">{user.socials.twitter}</span>
                       </div>
                       <div className="flex items-center gap-4 text-lg">
                          <div className="bg-yellow-500/20 p-3 rounded-full"><LucideCheckCircle className="text-yellow-500"/></div>
                          <span>Reputation: {user.reputation}/5.0</span>
                       </div>
                       <div className="pt-4 border-t border-white/10">
                          <p className="text-sm opacity-50">Joined {user.joinedDate}</p>
                       </div>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

// 4. Interactive Forum Component
const Forum = ({ theme, onViewProfile }: any) => {
    const [selectedGroup, setSelectedGroup] = useState<ForumGroup | null>(null);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [newPostText, setNewPostText] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    
    // Derived state for view
    const postsToDisplay = selectedGroup 
        ? MOCK_POSTS.filter(p => p.groupId === selectedGroup.id)
        : MOCK_POSTS;

    const handleCreatePost = () => {
        if(!newPostText) return;
        alert("Post created! (Simulation)");
        setNewPostText('');
        setIsCreatingPost(false);
    }

    const handleAddComment = () => {
        if(!newCommentText) return;
        alert("Comment added! (Simulation)");
        setNewCommentText('');
    }

    // Detail View: Single Post
    if (selectedPost) {
        return (
            <div className="pt-28 pb-24 px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8">
                <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 mb-6 font-bold text-gray-400 hover:text-white">
                    <LucideChevronLeft /> Back to Forum
                </button>
                <div className="glass-panel p-8 rounded-[2rem] space-y-6 ring-1 ring-white/10">
                     {/* Author */}
                     <div className="flex justify-between items-start">
                        <div className="flex gap-4 cursor-pointer" onClick={() => onViewProfile({ id: selectedPost.authorId, name: selectedPost.author, avatar: selectedPost.authorAvatar } as any)}>
                            <img src={selectedPost.authorAvatar} className="w-14 h-14 rounded-full ring-2 ring-white/20" alt="auth"/>
                            <div>
                                <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedPost.author} <span className="text-green-500 text-xs px-2 py-0.5 bg-green-500/10 rounded-full font-black uppercase tracking-wider">{selectedPost.role}</span></p>
                                <p className="text-gray-500 text-sm">{selectedPost.timestamp}</p>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <h1 className={`text-3xl font-serif font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedPost.title}</h1>
                    <p className="text-lg leading-relaxed opacity-90">{selectedPost.content}</p>
                    {selectedPost.image && (
                        <div className="rounded-2xl overflow-hidden shadow-xl mt-4">
                            <img src={selectedPost.image} className="w-full h-auto" alt="Post attachment" />
                        </div>
                    )}
                    {/* Actions */}
                    <div className="flex gap-6 pt-4 border-t border-gray-500/20">
                         <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-base font-bold"><LucideHeart size={20}/> {selectedPost.likes} Likes</button>
                         <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-base font-bold"><LucideShare2 size={20}/> Share</button>
                    </div>
                    {/* Comments Section */}
                    <div className="pt-8 space-y-6">
                        <h3 className="font-bold text-xl">Comments ({selectedPost.comments.length})</h3>
                        <div className="space-y-4">
                            {selectedPost.comments.map(c => (
                                <div key={c.id} className="bg-white/5 p-4 rounded-2xl flex gap-3">
                                    <img src={c.authorAvatar} className="w-10 h-10 rounded-full bg-gray-600" alt="commenter"/>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-bold text-sm cursor-pointer hover:underline" onClick={() => onViewProfile({ id: c.authorId, name: c.authorName, avatar: c.authorAvatar } as any)}>{c.authorName}</p>
                                            <span className="text-xs text-gray-500">{c.timestamp}</span>
                                        </div>
                                        <p className="text-gray-300 mt-1">{c.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Add Comment */}
                        <div className="flex gap-3 mt-4">
                            <input 
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" 
                                placeholder="Write a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                            />
                            <button onClick={handleAddComment} className="bg-green-600 p-3 rounded-xl text-white"><LucideSend size={20}/></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Main View: Groups & Feed
    return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto space-y-8">
        {/* Groups Horizontal Scroll */}
        <div className="space-y-4">
            <h2 className={`text-2xl font-serif font-bold px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Communities</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 <div 
                    onClick={() => setSelectedGroup(null)}
                    className={`min-w-[150px] p-4 rounded-2xl cursor-pointer transition-all border ${!selectedGroup ? 'bg-green-600 border-green-500 text-white' : 'glass-panel border-white/10 hover:bg-white/5'}`}
                 >
                     <LucideGlobe size={24} className="mb-2"/>
                     <h3 className="font-bold">All Topics</h3>
                     <p className="text-xs opacity-70">Global Feed</p>
                 </div>
                 {MOCK_GROUPS.map(g => (
                     <div 
                        key={g.id}
                        onClick={() => setSelectedGroup(g)}
                        className={`min-w-[200px] p-4 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${selectedGroup?.id === g.id ? 'border-green-500 ring-1 ring-green-500' : 'glass-panel border-white/10 hover:bg-white/5'}`}
                     >
                         <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" style={{backgroundImage: `url(${g.image})`}}></div>
                         <div className="relative z-10">
                            <h3 className={`font-bold ${theme === 'light' && selectedGroup?.id !== g.id ? 'text-gray-900' : 'text-white'}`}>{g.name}</h3>
                            <p className="text-xs text-white opacity-80">{g.members.toLocaleString()} members</p>
                            {g.isJoined ? <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full mt-2 inline-block">Joined</span> : <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full mt-2 inline-block">+ Join</span>}
                         </div>
                     </div>
                 ))}
            </div>
        </div>

        {/* Create Post FAB */}
        <div className="fixed bottom-24 right-4 md:right-8 z-30">
            <button 
                onClick={() => setIsCreatingPost(true)} 
                className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all hover:scale-110 flex items-center gap-2 font-bold"
            >
                <LucidePlus size={24}/> <span className="hidden md:inline">New Post</span>
            </button>
        </div>

        {/* Creating Post Modal */}
        {isCreatingPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-gray-900 w-full max-w-lg rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl text-white">Create Post</h3>
                        <button onClick={() => setIsCreatingPost(false)}><LucideX className="text-white"/></button>
                    </div>
                    <textarea 
                        className="w-full h-32 bg-black/30 rounded-xl p-4 text-white focus:outline-none border border-gray-700 focus:border-green-500" 
                        placeholder="What's happening on your farm?"
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-gray-300 flex items-center justify-center gap-2 font-bold"><LucideImage size={18}/> Photo</button>
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-gray-300 flex items-center justify-center gap-2 font-bold"><LucideVideo size={18}/> Video</button>
                    </div>
                    <button onClick={handleCreatePost} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl text-white font-bold text-lg">Post</button>
                </div>
            </div>
        )}

        {/* Feed */}
        <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className={`text-xl font-bold px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedGroup ? selectedGroup.name : 'Recent Discussions'}</h2>
            {postsToDisplay.map(post => (
                 <div key={post.id} onClick={() => setSelectedPost(post)} className="glass-panel p-6 rounded-[2rem] space-y-4 nature-shadow ring-1 ring-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <img src={post.authorAvatar} className="w-12 h-12 rounded-full ring-2 ring-white/20 object-cover" alt="auth"/>
                            <div>
                                <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:underline`} onClick={(e) => { e.stopPropagation(); onViewProfile({ id: post.authorId, name: post.author, avatar: post.authorAvatar } as any); }}>{post.author} <span className="text-green-500 text-xs px-2 py-0.5 bg-green-500/10 rounded-full font-black uppercase tracking-wider">{post.role}</span></p>
                                <p className="text-gray-500 text-sm">{post.timestamp} • {post.category}</p>
                            </div>
                        </div>
                        <button className="text-gray-400"><LucideMoreVertical size={20}/></button>
                    </div>
                    <h3 className={`text-2xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                    <p className={`text-lg leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{post.content}</p>
                    {post.image && (
                        <div className="h-48 w-full rounded-2xl overflow-hidden relative">
                             <img src={post.image} className="w-full h-full object-cover" alt="post img"/>
                        </div>
                    )}
                    <div className="flex gap-6 pt-2 border-t border-gray-500/10 mt-2">
                        <button className={`flex items-center gap-2 text-base font-bold hover:scale-105 transition-transform ${post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} onClick={(e) => {e.stopPropagation(); alert('Liked!')}}><LucideHeart size={20} fill={post.isLiked ? "currentColor" : "none"}/> {post.likes}</button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-base font-bold hover:scale-105 transition-transform"><LucideMessageCircle size={20}/> {post.comments.length}</button>
                    </div>
                 </div>
            ))}
        </div>
    </div>
    );
};

// 5. Updated Settings Component with New Links
const Settings = ({ settings, setSettings, theme, setTheme, lang, setActiveTab }: any) => {
   const t = TRANSLATIONS;
   const toggleSetting = (key: keyof AppSettings) => {
      setSettings((prev: any) => ({...prev, [key]: !prev[key]}));
   }

   const setFontSize = (size: 'small' | 'medium' | 'large') => {
       setSettings((prev: any) => ({...prev, fontSize: size}));
   }

   return (
     <div className="pt-28 pb-24 px-4 max-w-3xl mx-auto">
        <h2 className={`text-4xl font-serif font-black mb-10 ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>Settings</h2>
        
        <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-gray-500/20 shadow-2xl">
           
           {/* Visuals */}
           <div className="p-8">
              <h3 className="text-green-500 font-bold mb-6 uppercase text-xs tracking-wider flex items-center gap-2"><LucideEye size={16}/> Visuals</h3>
              <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {theme === 'dark' ? <LucideMoon size={24}/> : <LucideSun size={24}/>}
                        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>App Theme</span>
                    </div>
                    <div className="bg-black/20 p-1.5 rounded-xl flex">
                        <button onClick={() => setTheme('light')} className={`px-6 py-2 rounded-lg font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Light</button>
                        <button onClick={() => setTheme('dark')} className={`px-6 py-2 rounded-lg font-bold transition-all ${theme === 'dark' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Dark</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <LucideType size={24}/>
                        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.setting_font_size[lang]}</span>
                    </div>
                    <div className="bg-black/20 p-1.5 rounded-xl flex">
                        <button onClick={() => setFontSize('small')} className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${settings.fontSize === 'small' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Aa</button>
                        <button onClick={() => setFontSize('medium')} className={`px-4 py-2 rounded-lg font-bold transition-all text-base ${settings.fontSize === 'medium' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Aa</button>
                        <button onClick={() => setFontSize('large')} className={`px-4 py-2 rounded-lg font-bold transition-all text-lg ${settings.fontSize === 'large' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Aa</button>
                    </div>
                  </div>
              </div>
           </div>

           {/* Quick Links */}
           <div className="p-8">
               <h3 className="text-green-500 font-bold mb-4 uppercase text-xs tracking-wider flex items-center gap-2"><LucideMessageCircle size={16}/> Quick Links</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {['Marketplace', 'Community Forum', 'AI Assistant', 'Creative Tools'].map(link => (
                       <button 
                           key={link} 
                           onClick={() => {
                               if(link === 'Marketplace') setActiveTab('market');
                               if(link === 'Community Forum') setActiveTab('forum');
                               if(link === 'AI Assistant') setActiveTab('ai');
                               if(link === 'Creative Tools') setActiveTab('tools');
                           }}
                           className="bg-black/20 p-4 rounded-xl text-left font-bold text-gray-300 hover:bg-black/40 hover:text-white transition-colors flex justify-between items-center"
                       >
                           {link} <LucideChevronLeft className="rotate-180" size={16}/>
                       </button>
                   ))}
               </div>
           </div>

           {/* Legal & Support */}
           <div className="p-8 space-y-4">
                <h3 className="text-green-500 font-bold mb-4 uppercase text-xs tracking-wider flex items-center gap-2"><LucideShieldCheck size={16}/> Support & Legal</h3>
                <div className="space-y-2">
                    {['Privacy Policy', 'Terms of Service', 'Safety Tips', 'Dispute Resolution'].map(item => (
                        <div key={item} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>{item}</span>
                            <LucideChevronLeft className="rotate-180 text-gray-500" size={16}/>
                        </div>
                    ))}
                </div>
                <div className="bg-green-900/20 p-6 rounded-2xl border border-green-500/20 mt-6 space-y-3">
                    <h4 className="font-bold text-white mb-2">Contact Us</h4>
                    <p className="flex items-center gap-3 text-gray-300"><LucideMail size={18} className="text-green-500"/> support@agromarket.ng</p>
                    <p className="flex items-center gap-3 text-gray-300"><LucidePhone size={18} className="text-green-500"/> +234 800 AGRO HELP</p>
                    <p className="flex items-center gap-3 text-gray-300"><LucideMapPin size={18} className="text-green-500"/> Kano Innovation Hub</p>
                </div>
           </div>

           <div className="p-8 bg-red-500/10 cursor-pointer hover:bg-red-500/20 transition-colors flex items-center justify-center gap-3 text-red-500">
               <LucideLogOut size={24} />
               <span className="font-bold text-lg">Log Out</span>
           </div>
        </div>
     </div>
   )
}

// ... (Other components like Donation, AIGuide, Tools remain largely same but ensure correct props passed if needed) ...
// Simplified placeholders for brevity where logic is identical to previous versions, focusing on changes.

const Donation = ({ theme }: any) => {
   const [copied, setCopied] = useState<string | null>(null);
   const copyToClipboard = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
   }
   return (
      <div className="pt-28 pb-24 px-4 max-w-2xl mx-auto text-center">
         <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 ring-1 ring-white/10">
             <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <LucideHeart className="text-red-500" size={48}/>
             </div>
             <div>
                <h2 className={`text-4xl font-serif font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Our Development</h2>
                <p className="text-lg opacity-60 mt-4 max-w-md mx-auto">Help us keep Agromarket free for farmers across Nigeria. We accept crypto donations.</p>
             </div>
             <div className="space-y-4 text-left mt-8">
                <div className="bg-black/30 p-6 rounded-2xl flex justify-between items-center border border-white/10 hover:border-green-500/50 transition-colors group">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Base / ETH</p>
                      <p className="font-mono text-green-400 text-xl font-bold group-hover:text-white transition-colors">{CRYPTO_ADDRESSES.ETH_BASE}</p>
                   </div>
                   <button onClick={() => copyToClipboard(CRYPTO_ADDRESSES.ETH_BASE, 'eth')} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white">
                      {copied === 'eth' ? <LucideCheckCircle className="text-green-500" size={24}/> : <LucideCopy size={24}/>}
                   </button>
                </div>
                <div className="bg-black/30 p-6 rounded-2xl flex justify-between items-center border border-white/10 hover:border-blue-500/50 transition-colors group">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">NFT Domain</p>
                      <p className="font-mono text-blue-400 text-xl font-bold group-hover:text-white transition-colors">{CRYPTO_ADDRESSES.NFT}</p>
                   </div>
                   <button onClick={() => copyToClipboard(CRYPTO_ADDRESSES.NFT, 'nft')} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white">
                      {copied === 'nft' ? <LucideCheckCircle className="text-green-500" size={24}/> : <LucideCopy size={24}/>}
                   </button>
                </div>
             </div>
         </div>
      </div>
   )
}

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
    } finally { setIsThinking(false); }
  };
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto h-[90vh] flex flex-col">
      {showVoice && <LiveExpert onClose={() => setShowVoice(false)} language={lang} />}
      <div className="glass-panel rounded-[2rem] flex-1 flex flex-col overflow-hidden nature-shadow ring-1 ring-white/10">
        <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-green-900/20 border-white/10' : 'bg-green-50/50 border-green-200'}`}>
           <div className="flex items-center gap-4">
             <div className="bg-yellow-500/20 p-3 rounded-xl"><LucideLeaf className="text-yellow-500" size={24} /></div>
             <div><h3 className={`text-xl font-bold font-serif ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{t.nav_ai[lang]}</h3></div>
           </div>
           <button onClick={() => setShowVoice(true)} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2.5 rounded-full font-bold border border-red-500/30 hover:bg-red-500/20 transition-colors"><LucideVideo size={20}/> Voice Mode</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl p-5 text-lg leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-800/80 text-gray-100 rounded-bl-none border border-white/10'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isThinking && <div className="text-green-500 animate-pulse flex items-center gap-3 p-6"><LucideLoader2 className="animate-spin" size={24}/> Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className={`p-6 border-t ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
          <div className="flex gap-3">
            <input type="text" className={`flex-1 rounded-2xl px-6 py-4 text-lg focus:outline-none border shadow-inner ${theme === 'dark' ? 'bg-gray-900/80 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} placeholder="Ask anything about farming..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl shadow-xl transition-transform hover:scale-105"><LucideSend size={24} /></button>
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
        <div className="pt-28 pb-24 px-4 max-w-2xl mx-auto space-y-8">
            <h2 className={`text-4xl font-serif text-center font-black ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>Creative Studio</h2>
            <div className="glass-panel p-8 rounded-[2rem] space-y-8 ring-1 ring-white/10">
                <div className="flex gap-4 bg-black/20 p-2 rounded-2xl">
                    <button onClick={() => setMode('image')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'image' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Image</button>
                    <button onClick={() => setMode('video')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'video' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Video</button>
                </div>
                <textarea className={`w-full h-40 rounded-2xl p-6 text-lg focus:outline-none border shadow-inner ${theme === 'dark' ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white/50 border-gray-300 text-gray-900'}`} placeholder={`Describe your ${mode}...`} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                <button onClick={handleGenerate} disabled={loading || !prompt} className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-2xl flex justify-center gap-3 shadow-xl transition-all disabled:opacity-50">{loading ? <LucideLoader2 className="animate-spin" size={28}/> : <LucideLeaf size={28}/>} Generate Asset</button>
                {generatedUrl && <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20"><img src={generatedUrl} className="w-full" alt="gen"/></div>}
            </div>
        </div>
    )
}

// Main App Layout
function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null); // For viewing other users
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    eyeComfort: false,
    highContrast: false,
    textToSpeech: false,
    cloudSync: true,
    twoFactor: false,
    fontSize: 'medium'
  });

  const bgImage = theme === 'dark' 
     ? 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop'
     : 'https://images.unsplash.com/photo-1625246333195-098e98e29138?q=80&w=2070&auto=format&fit=crop';

  const getFontSize = () => {
      if(settings.fontSize === 'small') return '14px';
      if(settings.fontSize === 'large') return '18px';
      return '16px';
  }

  // Handle viewing a profile from anywhere
  const handleViewProfile = (user: UserProfile) => {
      setViewingProfile(user);
      setActiveTab('profile');
      setSelectedProduct(null); // Clear product if open
  }

  return (
    <div className={`min-h-screen bg-fixed bg-cover bg-center transition-all duration-500 ${theme === 'light' ? 'light-mode' : ''} ${settings.highContrast ? 'high-contrast' : ''}`} 
         style={{ backgroundImage: `url('${bgImage}')`, fontSize: getFontSize() }}>
      
      {settings.eyeComfort && <div className="eye-comfort-overlay"></div>}
      {theme === 'dark' && <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none transition-opacity duration-500" />}
      {theme === 'light' && <div className="fixed inset-0 bg-white/20 z-0 pointer-events-none transition-opacity duration-500" />}

      <div className="relative z-10">
        <Navbar 
          lang={lang} setLang={setLang} activeTab={activeTab} setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} theme={theme}
        />

        <main className="min-h-[calc(100vh-60px)]">
          {activeTab === 'market' && !selectedProduct && <Marketplace lang={lang} theme={theme} setProduct={setSelectedProduct} />}
          {activeTab === 'market' && selectedProduct && <ProductDetail product={selectedProduct} theme={theme} lang={lang} onBack={() => setSelectedProduct(null)} />}
          
          {activeTab === 'ai' && <AIGuide lang={lang} theme={theme} />}
          {activeTab === 'forum' && <Forum theme={theme} onViewProfile={handleViewProfile} />}
          {activeTab === 'tools' && <Tools lang={lang} theme={theme} />}
          
          {activeTab === 'profile' && (
              <Profile 
                theme={theme} 
                lang={lang} 
                viewingUser={viewingProfile} 
                onBack={() => {
                    setViewingProfile(null); // Clear viewing profile to go back to "My Profile" or just back
                    if(!viewingProfile) setActiveTab('market'); // If on my profile, maybe nothing, but for consistency
                }}
              />
          )}
          
          {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} theme={theme} setTheme={setTheme} lang={lang} setActiveTab={setActiveTab} />}
          {activeTab === 'donate' && <Donation theme={theme} />}
        </main>

        {settings.textToSpeech && (
           <button onClick={() => speakText("Welcome to Agromarket.")} className="fixed bottom-36 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl">
              <LucideSpeaker />
           </button>
        )}

        <div className="fixed bottom-20 right-4 z-40">
           {showSupport && (
               <div className="absolute bottom-20 right-0 w-80 h-96 glass-panel rounded-3xl p-6 flex flex-col mb-2 origin-bottom-right animate-in fade-in zoom-in slide-in-from-bottom-5 ring-1 ring-white/10 shadow-2xl">
                   <div className="flex justify-between items-center mb-4 border-b border-gray-500/30 pb-4">
                       <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support Agent</span>
                       <button onClick={() => setShowSupport(false)}><LucideX size={20} /></button>
                   </div>
                   <div className="flex-1 bg-black/20 rounded-2xl p-4 text-sm text-gray-300 overflow-y-auto space-y-4">
                       <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[90%]">
                            <p>Hello! How can we help you verify your farm account today?</p>
                       </div>
                   </div>
                   <input className="mt-4 bg-gray-800 text-white text-sm p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-green-500" placeholder="Type message..." />
               </div>
           )}
           <button 
             onClick={() => setShowSupport(!showSupport)}
             className="bg-yellow-500 hover:bg-yellow-400 text-black p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-transform hover:scale-110 flex items-center gap-3 font-bold text-lg"
           >
             <LucideMessageCircle size={28} /> 
             <span className="hidden md:inline">{TRANSLATIONS.support_help[lang]}</span>
           </button>
        </div>

        <footer className={`glass-panel border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} pt-16 pb-8 z-10 relative mt-20`}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-6">
                   <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-2 rounded-lg"><LucideLeaf className="text-white" size={24} /></div>
                        <h2 className={`text-2xl font-serif font-black ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>Agromarket</h2>
                   </div>
                   <p className="opacity-60 leading-relaxed">Revolutionizing Nigerian agriculture through technology, community, and trust.</p>
              </div>
              
              <div>
                  <h3 className="font-bold uppercase tracking-wider mb-6 opacity-80">{TRANSLATIONS.footer_quick_links[lang]}</h3>
                  <ul className="space-y-4 opacity-60">
                      <li><button onClick={() => setActiveTab('market')}>Marketplace</button></li>
                      <li><button onClick={() => setActiveTab('forum')}>Community Forum</button></li>
                      <li><button onClick={() => setActiveTab('ai')}>AI Assistant</button></li>
                      <li><button onClick={() => setActiveTab('tools')}>Creative Tools</button></li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-bold uppercase tracking-wider mb-6 opacity-80">Legal</h3>
                  <ul className="space-y-4 opacity-60">
                      <li>Privacy Policy</li>
                      <li>Terms of Service</li>
                      <li>Safety Tips</li>
                      <li>Dispute Resolution</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-bold uppercase tracking-wider mb-6 opacity-80">{TRANSLATIONS.footer_contact[lang]}</h3>
                  <ul className="space-y-4 opacity-60">
                      <li className="flex items-center gap-2"><LucideMail size={16}/> support@agromarket.ng</li>
                      <li className="flex items-center gap-2"><LucidePhone size={16}/> +234 800 AGRO HELP</li>
                      <li className="flex items-center gap-2"><LucideMapPin size={16}/> Kano Innovation Hub, Nigeria</li>
                  </ul>
              </div>
          </div>
          <div className="text-center pt-8 border-t border-white/5">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                {TRANSLATIONS.copyright[lang]}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;