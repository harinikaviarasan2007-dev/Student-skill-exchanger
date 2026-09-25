import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  avatar: string;
  availability: string; // e.g. "Weekends", "Evenings", "Weekdays", "Flexible"
  learningMode: string; // e.g. "Online", "In-Person", "Hybrid"
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface UserOfferedSkill {
  id: string;
  userId: string;
  skillId: string;
}

export interface UserRequiredSkill {
  id: string;
  userId: string;
  skillId: string;
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
}

export interface Review {
  id: string;
  exchangeId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
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

interface DatabaseSchema {
  users: User[];
  skills: Skill[];
  userOfferedSkills: UserOfferedSkill[];
  userRequiredSkills: UserRequiredSkill[];
  exchangeRequests: ExchangeRequest[];
  exchanges: Exchange[];
  reviews: Review[];
  notifications: Notification[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'skillswap.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.load();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database file, initializing fresh:', err);
    }

    const initial: DatabaseSchema = {
      users: [],
      skills: [],
      userOfferedSkills: [],
      userRequiredSkills: [],
      exchangeRequests: [],
      exchanges: [],
      reviews: [],
      notifications: [],
    };
    this.save(initial);
    return initial;
  }

  public save(customData?: DatabaseSchema) {
    this.ensureDataDir();
    const dataToSave = customData || this.data;
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  }

  // USERS
  public users = {
    create: (user: Omit<User, 'id' | 'createdAt'>): User => {
      const newUser: User = {
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(newUser);
      this.save();
      return newUser;
    },
    findById: (id: string): User | undefined => {
      return this.data.users.find((u) => u.id === id);
    },
    findByEmail: (email: string): User | undefined => {
      return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    update: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null => {
      const idx = this.data.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    },
    list: (): User[] => {
      return [...this.data.users];
    },
  };

  // SKILLS
  public skills = {
    create: (skill: { name: string; category?: string }): Skill => {
      const normalizedName = skill.name.trim();
      const existing = this.data.skills.find(
        (s) => s.name.toLowerCase() === normalizedName.toLowerCase()
      );
      if (existing) return existing;

      const newSkill: Skill = {
        id: crypto.randomUUID(),
        name: normalizedName,
        category: skill.category || 'General',
      };
      this.data.skills.push(newSkill);
      this.save();
      return newSkill;
    },
    findByName: (name: string): Skill | undefined => {
      return this.data.skills.find(
        (s) => s.name.toLowerCase() === name.trim().toLowerCase()
      );
    },
    findById: (id: string): Skill | undefined => {
      return this.data.skills.find((s) => s.id === id);
    },
    list: (): Skill[] => {
      return [...this.data.skills];
    },
    findOrCreate: (name: string, category = 'General'): Skill => {
      const existing = this.skills.findByName(name);
      if (existing) return existing;
      return this.skills.create({ name, category });
    },
  };

  // USER OFFERED SKILLS
  public userOfferedSkills = {
    add: (userId: string, skillId: string): UserOfferedSkill => {
      const existing = this.data.userOfferedSkills.find(
        (uos) => uos.userId === userId && uos.skillId === skillId
      );
      if (existing) return existing;

      const item: UserOfferedSkill = {
        id: crypto.randomUUID(),
        userId,
        skillId,
      };
      this.data.userOfferedSkills.push(item);
      this.save();
      return item;
    },
    remove: (userId: string, skillId: string): boolean => {
      const initialLen = this.data.userOfferedSkills.length;
      this.data.userOfferedSkills = this.data.userOfferedSkills.filter(
        (uos) => !(uos.userId === userId && uos.skillId === skillId)
      );
      const changed = this.data.userOfferedSkills.length !== initialLen;
      if (changed) this.save();
      return changed;
    },
    findByUserId: (userId: string): Skill[] => {
      const skillIds = this.data.userOfferedSkills
        .filter((uos) => uos.userId === userId)
        .map((uos) => uos.skillId);
      return this.data.skills.filter((s) => skillIds.includes(s.id));
    },
    setForUser: (userId: string, skillNames: string[]): Skill[] => {
      // Remove current
      this.data.userOfferedSkills = this.data.userOfferedSkills.filter(
        (uos) => uos.userId !== userId
      );
      // Add new
      const result: Skill[] = [];
      for (const name of skillNames) {
        const skill = this.skills.findOrCreate(name);
        this.data.userOfferedSkills.push({
          id: crypto.randomUUID(),
          userId,
          skillId: skill.id,
        });
        result.push(skill);
      }
      this.save();
      return result;
    },
  };

  // USER REQUIRED SKILLS
  public userRequiredSkills = {
    add: (userId: string, skillId: string): UserRequiredSkill => {
      const existing = this.data.userRequiredSkills.find(
        (urs) => urs.userId === userId && urs.skillId === skillId
      );
      if (existing) return existing;

      const item: UserRequiredSkill = {
        id: crypto.randomUUID(),
        userId,
        skillId,
      };
      this.data.userRequiredSkills.push(item);
      this.save();
      return item;
    },
    remove: (userId: string, skillId: string): boolean => {
      const initialLen = this.data.userRequiredSkills.length;
      this.data.userRequiredSkills = this.data.userRequiredSkills.filter(
        (urs) => !(urs.userId === userId && urs.skillId === skillId)
      );
      const changed = this.data.userRequiredSkills.length !== initialLen;
      if (changed) this.save();
      return changed;
    },
    findByUserId: (userId: string): Skill[] => {
      const skillIds = this.data.userRequiredSkills
        .filter((urs) => urs.userId === userId)
        .map((urs) => urs.skillId);
      return this.data.skills.filter((s) => skillIds.includes(s.id));
    },
    setForUser: (userId: string, skillNames: string[]): Skill[] => {
      // Remove current
      this.data.userRequiredSkills = this.data.userRequiredSkills.filter(
        (urs) => urs.userId !== userId
      );
      // Add new
      const result: Skill[] = [];
      for (const name of skillNames) {
        const skill = this.skills.findOrCreate(name);
        this.data.userRequiredSkills.push({
          id: crypto.randomUUID(),
          userId,
          skillId: skill.id,
        });
        result.push(skill);
      }
      this.save();
      return result;
    },
  };

  // EXCHANGE REQUESTS
  public exchangeRequests = {
    create: (data: {
      senderId: string;
      receiverId: string;
      offeredSkillName: string;
      requiredSkillName: string;
      message: string;
    }): ExchangeRequest => {
      const req: ExchangeRequest = {
        id: crypto.randomUUID(),
        ...data,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.exchangeRequests.push(req);
      this.save();
      return req;
    },
    findById: (id: string): ExchangeRequest | undefined => {
      return this.data.exchangeRequests.find((r) => r.id === id);
    },
    findBySenderId: (senderId: string): ExchangeRequest[] => {
      return this.data.exchangeRequests.filter((r) => r.senderId === senderId);
    },
    findByReceiverId: (receiverId: string): ExchangeRequest[] => {
      return this.data.exchangeRequests.filter((r) => r.receiverId === receiverId);
    },
    updateStatus: (id: string, status: RequestStatus): ExchangeRequest | null => {
      const idx = this.data.exchangeRequests.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      this.data.exchangeRequests[idx].status = status;
      this.data.exchangeRequests[idx].updatedAt = new Date().toISOString();
      this.save();
      return this.data.exchangeRequests[idx];
    },
  };

  // EXCHANGES
  public exchanges = {
    create: (data: {
      requestId: string;
      senderId: string;
      receiverId: string;
      offeredSkillName: string;
      requiredSkillName: string;
    }): Exchange => {
      const ex: Exchange = {
        id: crypto.randomUUID(),
        ...data,
        status: 'ACTIVE',
        startedAt: new Date().toISOString(),
        completedAt: null,
      };
      this.data.exchanges.push(ex);
      this.save();
      return ex;
    },
    findById: (id: string): Exchange | undefined => {
      return this.data.exchanges.find((e) => e.id === id);
    },
    findByRequestId: (requestId: string): Exchange | undefined => {
      return this.data.exchanges.find((e) => e.requestId === requestId);
    },
    findByUserId: (userId: string): Exchange[] => {
      return this.data.exchanges.filter(
        (e) => e.senderId === userId || e.receiverId === userId
      );
    },
    complete: (id: string): Exchange | null => {
      const idx = this.data.exchanges.findIndex((e) => e.id === id);
      if (idx === -1) return null;
      this.data.exchanges[idx].status = 'COMPLETED';
      this.data.exchanges[idx].completedAt = new Date().toISOString();
      // Also update linked request if exists
      const reqId = this.data.exchanges[idx].requestId;
      this.exchangeRequests.updateStatus(reqId, 'COMPLETED');
      this.save();
      return this.data.exchanges[idx];
    },
  };

  // REVIEWS
  public reviews = {
    create: (data: {
      exchangeId: string;
      reviewerId: string;
      revieweeId: string;
      rating: number;
      feedback: string;
    }): Review => {
      const rev: Review = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      this.data.reviews.push(rev);
      this.save();
      return rev;
    },
    findByRevieweeId: (revieweeId: string): Review[] => {
      return this.data.reviews.filter((r) => r.revieweeId === revieweeId);
    },
    findByExchangeAndReviewer: (exchangeId: string, reviewerId: string): Review | undefined => {
      return this.data.reviews.find(
        (r) => r.exchangeId === exchangeId && r.reviewerId === reviewerId
      );
    },
    findByExchangeId: (exchangeId: string): Review[] => {
      return this.data.reviews.filter((r) => r.exchangeId === exchangeId);
    },
  };

  // NOTIFICATIONS
  public notifications = {
    create: (data: {
      userId: string;
      message: string;
      type: Notification['type'];
      link?: string;
    }): Notification => {
      const notif: Notification = {
        id: crypto.randomUUID(),
        userId: data.userId,
        message: data.message,
        type: data.type,
        link: data.link || '',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      this.data.notifications.push(notif);
      this.save();
      return notif;
    },
    findByUserId: (userId: string): Notification[] => {
      return this.data.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    markAsRead: (id: string): boolean => {
      const notif = this.data.notifications.find((n) => n.id === id);
      if (notif) {
        notif.isRead = true;
        this.save();
        return true;
      }
      return false;
    },
    markAllAsRead: (userId: string): void => {
      this.data.notifications
        .filter((n) => n.userId === userId)
        .forEach((n) => (n.isRead = true));
      this.save();
    },
  };

  // AGGREGATED DETAILS
  public getUserWithDetails(userId: string) {
    const user = this.users.findById(userId);
    if (!user) return null;

    const offered = this.userOfferedSkills.findByUserId(userId);
    const required = this.userRequiredSkills.findByUserId(userId);
    const reviewsReceived = this.reviews.findByRevieweeId(userId).map((rev) => {
      const reviewer = this.users.findById(rev.reviewerId);
      return {
        ...rev,
        reviewerName: reviewer ? reviewer.name : 'Unknown User',
        reviewerAvatar: reviewer ? reviewer.avatar : '',
      };
    });

    const totalRatings = reviewsReceived.reduce((acc, r) => acc + r.rating, 0);
    const averageRating =
      reviewsReceived.length > 0
        ? parseFloat((totalRatings / reviewsReceived.length).toFixed(1))
        : 5.0; // default for new students

    const completedExchangesCount = this.exchanges
      .findByUserId(userId)
      .filter((e) => e.status === 'COMPLETED').length;

    // strip passwordHash
    const { passwordHash, ...userClean } = user;

    return {
      ...userClean,
      offeredSkills: offered,
      requiredSkills: required,
      reviewsReceived,
      averageRating,
      reviewCount: reviewsReceived.length,
      completedExchangesCount,
    };
  }

  public getAllUsersWithDetails(excludeUserId?: string) {
    return this.data.users
      .filter((u) => !excludeUserId || u.id !== excludeUserId)
      .map((u) => this.getUserWithDetails(u.id)!);
  }
}

export const db = new Database();
