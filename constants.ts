import { Translation, Product, ForumPost, UserProfile, ForumGroup } from './types';

export const CRYPTO_ADDRESSES = {
  ETH_BASE: "arewa.base.eth",
  NFT: "zahrah.nft"
};

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
  nav_profile: { EN: "Profile", HA: "Tarihi" },
  nav_settings: { EN: "Settings", HA: "Saituna" },
  
  filter_state: { EN: "Filter by State", HA: "Tace ta Jiha" },
  filter_category: { EN: "Category", HA: "Rukuni" },
  search_placeholder: { EN: "Search products...", HA: "Nemi kayayyaki..." },
  
  btn_buy: { EN: "Contact Seller", HA: "Tuntubi Mai Sayarwa" },
  btn_sell: { EN: "I have this", HA: "Ina da wannan" },
  
  hero_title: { EN: "Premium Nigerian Agriculture", HA: "Noman Zamani a Najeriya" },
  hero_subtitle: { EN: "Connecting farmers, buyers, and experts.", HA: "Hada manoma, masu saye, da kwararru." },
  
  ai_welcome: { EN: "Ask me anything about farming.", HA: "Tambaye ni komai game da noma." },
  ai_thinking: { EN: "Thinking...", HA: "Ina tunani..." },
  ai_voice_mode: { EN: "Live Voice Mode", HA: "Yanayin Murya" },
  
  copyright: { EN: "© 2026 Agromarket. Vibe coded by Zahra Usman.", HA: "© 2026 Agromarket. Zahra Usman ce ta tsara shi." },
  
  support_chat: { EN: "Chat with Support", HA: "Yi Magana da Taimako" },
  support_help: { EN: "Help", HA: "Taimako" },

  mode_sell: { EN: "For Sale", HA: "Na Sayarwa" },
  mode_buy: { EN: "Buy Requests", HA: "Bukatar Saye" },

  stats_earnings: { EN: "Total Earnings", HA: "Jimlar Kuɗin Shiga" },
  stats_sold: { EN: "Items Sold", HA: "Abubuwan da aka Sayar" },
  stats_active: { EN: "Active Listings", HA: "Tallace-tallace Masu Aiki" },
  stats_pending: { EN: "Pending Orders", HA: "Oda Masu Jiranta" },
  
  setting_font_size: { EN: "Font Size", HA: "Girman Rubutu" },
  footer_quick_links: { EN: "Quick Links", HA: "Hanyoyin Sauri" },
  footer_contact: { EN: "Contact Us", HA: "Tuntube Mu" }
};

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Zahra Usman',
  handle: '@zahra_farms',
  bio: 'Passionate poultry farmer and tech enthusiast. Creating solutions for the Arewa agricultural community.',
  avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop',
  location: 'Kano, Nigeria',
  isVerified: true,
  role: 'Expert',
  socials: {
    twitter: 'twitter.com/zahra',
    instagram: 'instagram.com/zahra_farms'
  },
  reputation: 4.8,
  joinedDate: 'Jan 2024',
  stats: {
    totalEarnings: 4500000,
    itemsSold: 142,
    activeListings: 12,
    pendingOrders: 5
  },
  followers: 1250,
  following: 45
};

export const MOCK_GROUPS: ForumGroup[] = [
  {
    id: 'g1',
    name: 'Poultry Pros Nigeria',
    description: 'The #1 community for broiler and layer farmers.',
    image: 'https://images.unsplash.com/photo-1563721345-f09dfd2d3869?q=80&w=400&auto=format&fit=crop',
    members: 15420,
    isJoined: true
  },
  {
    id: 'g2',
    name: 'Kano Farmers Union',
    description: 'Connect with local farmers in Kano state.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop',
    members: 8200,
    isJoined: false
  },
  {
    id: 'g3',
    name: 'Fish Farming 101',
    description: 'Catfish and Tilapia farming guides and discussions.',
    image: 'https://images.unsplash.com/photo-1516684669134-de6d7c47743b?q=80&w=400&auto=format&fit=crop',
    members: 5300,
    isJoined: false
  }
];

export const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    groupId: 'g1',
    authorId: 'u2',
    author: 'Musa Ibrahim',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Expert',
    title: 'Managing Heat Stress in Broilers',
    content: 'During the dry season, it is crucial to provide electrolytes and ensure proper ventilation. I recommend feeding during cooler parts of the day. Here is a picture of my setup.',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop',
    category: 'Disease Control',
    likes: 45,
    comments: [
       { id: 'c1', authorId: 'u3', authorName: 'Aliyu Bello', authorAvatar: 'https://randomuser.me/api/portraits/men/11.jpg', content: 'Great advice Musa! What specific electrolyte brand do you use?', timestamp: '1h ago' },
       { id: 'c2', authorId: 'u1', authorName: 'Zahra Usman', authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop', content: 'Vitalyte works best for me in Kano heat.', timestamp: '30m ago' }
    ],
    timestamp: '2h ago',
    isLiked: false
  },
  {
    id: '2',
    groupId: 'g2',
    authorId: 'u4',
    author: 'Chidinma Okoro',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Farmer',
    title: 'Current Maize prices in Kaduna?',
    content: 'Looking to formulate my own feed. Any insights on the current price per ton in Kaduna markets? I heard it dropped recently.',
    category: 'Market Prices',
    likes: 10,
    comments: [
        { id: 'c3', authorId: 'u5', authorName: 'Emeka Kalu', authorAvatar: 'https://randomuser.me/api/portraits/men/66.jpg', content: 'It is currently ₦450,000 per ton at Dawanau market.', timestamp: '2h ago' }
    ],
    timestamp: '5h ago',
    isLiked: true
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Day-Old Broiler Chicks',
    category: 'Poultry',
    type: 'sell',
    price: 850,
    location: 'Oyo',
    sellerId: 's1',
    sellerName: 'Ibadan Farms Ltd',
    sellerPhone: '2348000000001',
    image: 'https://images.unsplash.com/photo-1544558509-f6230f2c4193?q=80&w=800&auto=format&fit=crop',
    video: 'https://cdn.pixabay.com/video/2022/11/27/140733-775791410_large.mp4',
    description: 'High quality Arbor Acres broilers. Vaccinated against Newcastle and Gumboro. Ideal for 6-week maturity cycle.',
    datePosted: '2 days ago'
  },
  {
    id: '2',
    name: 'Catfish Fingerlings',
    category: 'Fish',
    type: 'sell',
    price: 35,
    location: 'Lagos',
    sellerId: 's2',
    sellerName: 'Lagoon Fishery',
    sellerPhone: '2348000000002',
    image: 'https://images.unsplash.com/photo-1516684669134-de6d7c47743b?q=80&w=800&auto=format&fit=crop',
    description: 'Fast growing Clarias species. 5 weeks old, hardy and disease resistant. Minimum order 1000 pieces.',
    datePosted: '1 week ago'
  },
  {
    id: '3',
    name: 'Layer Feed (Mash)',
    category: 'Feed',
    type: 'sell',
    price: 12500,
    location: 'Kano',
    sellerId: 's3',
    sellerName: 'Arewa Feeds',
    sellerPhone: '2348000000003',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop',
    description: 'Balanced diet for optimal egg production. Contains high calcium and protein content specifically for layers.',
    datePosted: '3 hours ago'
  },
  {
    id: '4',
    name: 'Looking for 500 Bags of Maize',
    category: 'Feed',
    type: 'buy',
    price: 35000,
    location: 'FCT - Abuja',
    sellerId: 'b1',
    sellerName: 'Capital Poultry',
    sellerPhone: '2348000000004',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop',
    description: 'Urgent request for 500 bags of dry white maize. Must be clean and free from weevils. Payment on delivery.',
    datePosted: 'Just now'
  },
  {
    id: '5',
    name: 'Full Grown Turkeys',
    category: 'Poultry',
    type: 'sell',
    price: 35000,
    location: 'FCT - Abuja',
    sellerId: 'b1',
    sellerName: 'Capital Poultry',
    sellerPhone: '2348000000004',
    image: 'https://images.unsplash.com/photo-1563721345-f09dfd2d3869?q=80&w=800&auto=format&fit=crop',
    description: 'Organic free-range turkeys available for festive season. Average weight 8kg.',
    datePosted: '5 days ago'
  },
  {
    id: '6',
    name: 'Organic Fertilizer (Manure)',
    category: 'Feed',
    type: 'sell',
    price: 1500,
    location: 'Kaduna',
    sellerId: 's4',
    sellerName: 'Green Earth',
    sellerPhone: '2348000000005',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
    description: 'Rich organic manure for crop farming. Sold in 50kg bags.',
    datePosted: '1 day ago'
  }
];