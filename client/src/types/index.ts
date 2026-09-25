export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface Review {
  id: string;
  exchangeId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  avatar: string;
  availability: string;
  learningMode: string;
  offeredSkills: Skill[];
  requiredSkills: Skill[];
  reviewsReceived?: Review[];
  averageRating: number;
  reviewCount: number;
  completedExchangesCount: number;
  createdAt: string;
}

export interface MatchResult {
  candidate: User;
  score: number;
  reasons: string[];
  theyCanTeachYou: string[];
  youCanTeachThem: string[];
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface ExchangeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredSkillName: string;
  requiredSkillName: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export type ExchangeStatus = 'ACTIVE' | 'COMPLETED';

export interface Exchange {
  id: string;
  requestId: string;
  senderId: string;
  receiverId: string;
  offeredSkillName: string;
  requiredSkillName: string;
  status: ExchangeStatus;
  startedAt: string;
  completedAt: string | null;
  partner?: User;
  userTeaches: string;
  userLearns: string;
  hasReviewed: boolean;
  myReview?: Review;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'REQUEST_RECEIVED' | 'REQUEST_ACCEPTED' | 'REQUEST_REJECTED' | 'EXCHANGE_COMPLETED' | 'REVIEW_RECEIVED';
  isRead: boolean;
  link: string;
  createdAt: string;
}
