export type Language = 'EN' | 'HA';

export interface Product {
  id: string;
  name: string;
  category: 'Poultry' | 'Fish' | 'Feed';
  price: number;
  location: string;
  sellerName: string;
  sellerPhone: string;
  image: string;
  description: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: 'Farmer' | 'Buyer' | 'Expert';
  title: string;
  content: string;
  category: 'Disease Control' | 'Feed Formulation' | 'Market Prices' | 'General';
  likes: number;
  comments: number;
  timestamp: string;
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