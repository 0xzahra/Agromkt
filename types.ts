export type Language = 'EN' | 'HA';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  name: string;
  category: 'Poultry' | 'Fish' | 'Feed';
  type: 'sell' | 'buy';
  price: number;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerTier: 1 | 2 | 3; // 1: Basic, 2: Verified, 3: Cooperative
  image: string;
  video?: string;
  description: string;
  images?: string[];
  datePosted: string;
  expiryDate?: string; // For perishable items
  coordinates?: { lat: number, lng: number }; // For distance calc
}

export interface UserStats {
  totalEarnings: number;
  itemsSold: number;
  activeListings: number;
  pendingOrders: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  location: string;
  isVerified: boolean;
  verificationTier: 1 | 2 | 3;
  subscription: 'Free' | 'Pro';
  role: 'Farmer' | 'Buyer' | 'Expert';
  socials: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  reputation: number;
  joinedDate: string;
  stats: UserStats;
  followers?: number;
  following?: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface ForumGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  isJoined?: boolean;
  region?: string; // e.g., "Kano", "South-West"
}

export interface ForumPost {
  id: string;
  groupId: string;
  authorId: string;
  author: string;
  authorAvatar?: string;
  role: 'Farmer' | 'Buyer' | 'Expert';
  title: string;
  content: string;
  image?: string; // Media upload
  category: 'Disease Control' | 'Feed Formulation' | 'Market Prices' | 'General';
  likes: number;
  comments: Comment[]; // Nested comments
  timestamp: string;
  isLiked?: boolean;
}

export interface AppSettings {
  eyeComfort: boolean;
  highContrast: boolean;
  textToSpeech: boolean;
  cloudSync: boolean;
  twoFactor: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface Translation {
  [key: string]: {
    EN: string;
    HA: string;
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}