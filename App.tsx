import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideLeaf, LucideUsers, LucideShoppingBag, LucideMessageCircle, 
  LucideSearch, LucideGlobe, LucideHeart, LucideSend, LucideMapPin,
  LucideVideo, LucideImage, LucideX, LucideMenu, LucideLoader2
} from 'lucide-react';
import { NIGERIAN_STATES, TRANSLATIONS, MOCK_PRODUCTS, MOCK_POSTS } from './constants';
import { Language, Product, ForumPost, ChatMessage } from './types';
import { askFarmingAssistant, generateMarketingImage, generateMarketingVideo } from './services/geminiService';
import LiveExpert from './components/LiveExpert';

// --- Sub-components defined here for single-file constraints where possible, or separation of concerns ---

// 1. Navbar
const Navbar = ({ lang, setLang, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }: any) => {
  const t = TRANSLATIONS;
  const tabs = [
    { id: 'market', icon: LucideShoppingBag, label: t.nav_market[lang as Language] },
    { id: 'forum', icon: LucideUsers, label: t.nav_forum[lang as Language] },
    { id: 'ai', icon: LucideLeaf, label: t.nav_ai[lang as Language] },
    { id: 'tools', icon: LucideImage, label: t.nav_tools[lang as Language] },
    { id: 'donate', icon: LucideHeart, label: t.nav_donate[lang as Language] },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 glass-panel border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <LucideLeaf className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            {t.app_name[lang as Language]}
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                activeTab === tab.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HA' : 'EN')}
            className="flex items-center gap-1.5 bg-yellow-600/20 border border-yellow-600/50 px-3 py-1.5 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600/30 transition-colors"
          >
            <LucideGlobe size={14} />
            {lang}
          </button>
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <LucideX /> : <LucideMenu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-700/50 pt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                 activeTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-300'
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

// 2. Marketplace Component
const Marketplace = ({ lang }: { lang: Language }) => {
  const [filterState, setFilterState] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const t = TRANSLATIONS;

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    return (!filterState || p.location === filterState) && (!filterCat || p.category === filterCat);
  });

  return (
    <div className="space-y-6 pt-20 pb-24 px-4 max-w-