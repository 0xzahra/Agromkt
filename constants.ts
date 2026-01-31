import { Translation, Product, ForumPost } from './types';

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const TRANSLATIONS: Translation = {
  app_name: { EN: "Agromarket", HA: "Agromarket" },
  nav_market: { EN: "Marketplace", HA: "Kasuwa" },
  nav_forum: { EN: "Forum", HA: "Dandali" },
  nav_ai: { EN: "AI Guide", HA: "Jagoran AI" },
  nav_donate: { EN: "Donate", HA: "Gudummawa" },
  nav_tools: { EN: "Tools", HA: "Kayan Aiki" },
  
  filter_state: { EN: "Filter by State", HA: "Tace ta Jiha" },
  filter_category: { EN: "Category", HA: "Rukuni" },
  search_placeholder: { EN: "Search products...", HA: "Nemi kayayyaki..." },
  
  btn_buy: { EN: "Buy via WhatsApp", HA: "Saya ta WhatsApp" },
  btn_post: { EN: "Post Topic", HA: "Rubuta Taken" },
  
  hero_title: { EN: "Premium Nigerian Agriculture", HA: "Noman Zamani a Najeriya" },
  hero_subtitle: { EN: "Connecting farmers, buyers, and experts.", HA: "Hada manoma, masu saye, da kwararru." },
  
  ai_welcome: { EN: "Ask me anything about farming.", HA: "Tambaye ni komai game da noma." },
  ai_thinking: { EN: "Thinking...", HA: "Ina tunani..." },
  ai_voice_mode: { EN: "Live Voice Mode", HA: "Yanayin Murya" },
  
  copyright: { EN: "© 2026 Agromarket. Vibe coded by Zahra Usman.", HA: "© 2026 Agromarket. Zahra Usman ce ta tsara shi." },
  
  support_chat: { EN: "Chat with Support", HA: "Yi Magana da Taimako" },
  support_help: { EN: "Help", HA: "Taimako" }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Day-Old Broiler Chicks',
    category: 'Poultry',
    price: 850,
    location: 'Oyo',
    sellerName: 'Ibadan Farms Ltd',
    sellerPhone: '2348000000001',
    image: 'https://picsum.photos/seed/chicks/400/400',
    description: 'High quality Arbor Acres broilers. Vaccinated.'
  },
  {
    id: '2',
    name: 'Catfish Fingerlings',
    category: 'Fish',
    price: 35,
    location: 'Lagos',
    sellerName: 'Lagoon Fishery',
    sellerPhone: '2348000000002',
    image: 'https://picsum.photos/seed/fish/400/400',
    description: 'Fast growing species. 5 weeks old.'
  },
  {
    id: '3',
    name: 'Layer Feed (Mash)',
    category: 'Feed',
    price: 12500,
    location: 'Kano',
    sellerName: 'Arewa Feeds',
    sellerPhone: '2348000000003',
    image: 'https://picsum.photos/seed/feed/400/400',
    description: 'Balanced diet for optimal egg production.'
  },
   {
    id: '4',
    name: 'Full Grown Turkeys',
    category: 'Poultry',
    price: 35000,
    location: 'FCT - Abuja',
    sellerName: 'Capital Poultry',
    sellerPhone: '2348000000004',
    image: 'https://picsum.photos/seed/turkey/400/400',
    description: 'Organic free-range turkeys.'
  },
];

export const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Musa Ibrahim',
    role: 'Expert',
    title: 'Managing Heat Stress in Broilers',
    content: 'During the dry season, it is crucial to provide electrolytes...',
    category: 'Disease Control',
    likes: 45,
    comments: 12,
    timestamp: '2h ago'
  },
  {
    id: '2',
    author: 'Chidinma Okoro',
    role: 'Farmer',
    title: 'Current Maize prices in Kaduna?',
    content: 'Looking to formulate my own feed. Any insights?',
    category: 'Market Prices',
    likes: 10,
    comments: 24,
    timestamp: '5h ago'
  }
];