export type Language = 'EN' | 'HA';
export type Theme = 'light' | 'dark';

export interface Product {
  id: string;
  name: string;
  category: 'Poultry' | 'Fish' | 'Feed';
  type: 'sell' | 'buy'; // New: distinguishing buy requests from sell listings
  price: number;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  image: string;
  description: string;
  images?: string[]; // Gallery support
  datePosted: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  location: string;
  isVerified: boolean;
  role: 'Farmer' | 'Buyer' | 'Expert';
  socials: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  reputation: number; // 0-5 stars
  joinedDate: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorAvatar?: string;
  role: 'Farmer' | 'Buyer' | 'Expert';
  title: string;
  content: string;
  category: 'Disease Control' | 'Feed Formulation' | 'Market Prices' | 'General';
  likes: number;
  comments: number;
  timestamp: string;
}

export interface AppSettings {
  eyeComfort: boolean;
  highContrast: boolean;
  textToSpeech: boolean;
  cloudSync: boolean;
  twoFactor: boolean;
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