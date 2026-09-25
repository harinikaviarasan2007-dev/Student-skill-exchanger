"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const DATA_DIR = path_1.default.resolve(__dirname, '../../data');
const DB_FILE = path_1.default.join(DATA_DIR, 'skillswap.json');
class Database {
    data;
    constructor() {
        this.ensureDataDir();
        this.data = this.load();
    }
    ensureDataDir() {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
    }
    load() {
        try {
            if (fs_1.default.existsSync(DB_FILE)) {
                const raw = fs_1.default.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(raw);
            }
        }
        catch (err) {
            console.error('Error loading database file, initializing fresh:', err);
        }
        const initial = {
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
    save(customData) {
        this.ensureDataDir();
        const dataToSave = customData || this.data;
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    }
    // USERS
    users = {
        create: (user) => {
            const newUser = {
                ...user,
                id: crypto_1.default.randomUUID(),
                createdAt: new Date().toISOString(),
            };
            this.data.users.push(newUser);
            this.save();
            return newUser;
        },
        findById: (id) => {
            return this.data.users.find((u) => u.id === id);
        },
        findByEmail: (email) => {
            return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        },
        update: (id, updates) => {
            const idx = this.data.users.findIndex((u) => u.id === id);
            if (idx === -1)
                return null;
            this.data.users[idx] = { ...this.data.users[idx], ...updates };
            this.save();
            return this.data.users[idx];
        },
        list: () => {
            return [...this.data.users];
        },
    };
    // SKILLS
    skills = {
        create: (skill) => {
            const normalizedName = skill.name.trim();
            const existing = this.data.skills.find((s) => s.name.toLowerCase() === normalizedName.toLowerCase());
            if (existing)
                return existing;
            const newSkill = {
                id: crypto_1.default.randomUUID(),
                name: normalizedName,
                category: skill.category || 'General',
            };
            this.data.skills.push(newSkill);
            this.save();
            return newSkill;
        },
        findByName: (name) => {
            return this.data.skills.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
        },
        findById: (id) => {
            return this.data.skills.find((s) => s.id === id);
        },
        list: () => {
            return [...this.data.skills];
        },
        findOrCreate: (name, category = 'General') => {
            const existing = this.skills.findByName(name);
            if (existing)
                return existing;
            return this.skills.create({ name, category });
        },
    };
    // USER OFFERED SKILLS
    userOfferedSkills = {
        add: (userId, skillId) => {
            const existing = this.data.userOfferedSkills.find((uos) => uos.userId === userId && uos.skillId === skillId);
            if (existing)
                return existing;
            const item = {
                id: crypto_1.default.randomUUID(),
                userId,
                skillId,
            };
            this.data.userOfferedSkills.push(item);
            this.save();
            return item;
        },
        remove: (userId, skillId) => {
            const initialLen = this.data.userOfferedSkills.length;
            this.data.userOfferedSkills = this.data.userOfferedSkills.filter((uos) => !(uos.userId === userId && uos.skillId === skillId));
            const changed = this.data.userOfferedSkills.length !== initialLen;
            if (changed)
                this.save();
            return changed;
        },
        findByUserId: (userId) => {
            const skillIds = this.data.userOfferedSkills
                .filter((uos) => uos.userId === userId)
                .map((uos) => uos.skillId);
            return this.data.skills.filter((s) => skillIds.includes(s.id));
        },
        setForUser: (userId, skillNames) => {
            // Remove current
            this.data.userOfferedSkills = this.data.userOfferedSkills.filter((uos) => uos.userId !== userId);
            // Add new
            const result = [];
            for (const name of skillNames) {
                const skill = this.skills.findOrCreate(name);
                this.data.userOfferedSkills.push({
                    id: crypto_1.default.randomUUID(),
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
    userRequiredSkills = {
        add: (userId, skillId) => {
            const existing = this.data.userRequiredSkills.find((urs) => urs.userId === userId && urs.skillId === skillId);
            if (existing)
                return existing;
            const item = {
                id: crypto_1.default.randomUUID(),
                userId,
                skillId,
            };
            this.data.userRequiredSkills.push(item);
            this.save();
            return item;
        },
        remove: (userId, skillId) => {
            const initialLen = this.data.userRequiredSkills.length;
            this.data.userRequiredSkills = this.data.userRequiredSkills.filter((urs) => !(urs.userId === userId && urs.skillId === skillId));
            const changed = this.data.userRequiredSkills.length !== initialLen;
            if (changed)
                this.save();
            return changed;
        },
        findByUserId: (userId) => {
            const skillIds = this.data.userRequiredSkills
                .filter((urs) => urs.userId === userId)
                .map((urs) => urs.skillId);
            return this.data.skills.filter((s) => skillIds.includes(s.id));
        },
        setForUser: (userId, skillNames) => {
            // Remove current
            this.data.userRequiredSkills = this.data.userRequiredSkills.filter((urs) => urs.userId !== userId);
            // Add new
            const result = [];
            for (const name of skillNames) {
                const skill = this.skills.findOrCreate(name);
                this.data.userRequiredSkills.push({
                    id: crypto_1.default.randomUUID(),
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
    exchangeRequests = {
        create: (data) => {
            const req = {
                id: crypto_1.default.randomUUID(),
                ...data,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.data.exchangeRequests.push(req);
            this.save();
            return req;
        },
        findById: (id) => {
            return this.data.exchangeRequests.find((r) => r.id === id);
        },
        findBySenderId: (senderId) => {
            return this.data.exchangeRequests.filter((r) => r.senderId === senderId);
        },
        findByReceiverId: (receiverId) => {
            return this.data.exchangeRequests.filter((r) => r.receiverId === receiverId);
        },
        updateStatus: (id, status) => {
            const idx = this.data.exchangeRequests.findIndex((r) => r.id === id);
            if (idx === -1)
                return null;
            this.data.exchangeRequests[idx].status = status;
            this.data.exchangeRequests[idx].updatedAt = new Date().toISOString();
            this.save();
            return this.data.exchangeRequests[idx];
        },
    };
    // EXCHANGES
    exchanges = {
        create: (data) => {
            const ex = {
                id: crypto_1.default.randomUUID(),
                ...data,
                status: 'ACTIVE',
                startedAt: new Date().toISOString(),
                completedAt: null,
            };
            this.data.exchanges.push(ex);
            this.save();
            return ex;
        },
        findById: (id) => {
            return this.data.exchanges.find((e) => e.id === id);
        },
        findByRequestId: (requestId) => {
            return this.data.exchanges.find((e) => e.requestId === requestId);
        },
        findByUserId: (userId) => {
            return this.data.exchanges.filter((e) => e.senderId === userId || e.receiverId === userId);
        },
        complete: (id) => {
            const idx = this.data.exchanges.findIndex((e) => e.id === id);
            if (idx === -1)
                return null;
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
    reviews = {
        create: (data) => {
            const rev = {
                id: crypto_1.default.randomUUID(),
                ...data,
                createdAt: new Date().toISOString(),
            };
            this.data.reviews.push(rev);
            this.save();
            return rev;
        },
        findByRevieweeId: (revieweeId) => {
            return this.data.reviews.filter((r) => r.revieweeId === revieweeId);
        },
        findByExchangeAndReviewer: (exchangeId, reviewerId) => {
            return this.data.reviews.find((r) => r.exchangeId === exchangeId && r.reviewerId === reviewerId);
        },
        findByExchangeId: (exchangeId) => {
            return this.data.reviews.filter((r) => r.exchangeId === exchangeId);
        },
    };
    // NOTIFICATIONS
    notifications = {
        create: (data) => {
            const notif = {
                id: crypto_1.default.randomUUID(),
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
        findByUserId: (userId) => {
            return this.data.notifications
                .filter((n) => n.userId === userId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        markAsRead: (id) => {
            const notif = this.data.notifications.find((n) => n.id === id);
            if (notif) {
                notif.isRead = true;
                this.save();
                return true;
            }
            return false;
        },
        markAllAsRead: (userId) => {
            this.data.notifications
                .filter((n) => n.userId === userId)
                .forEach((n) => (n.isRead = true));
            this.save();
        },
    };
    // AGGREGATED DETAILS
    getUserWithDetails(userId) {
        const user = this.users.findById(userId);
        if (!user)
            return null;
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
        const averageRating = reviewsReceived.length > 0
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
    getAllUsersWithDetails(excludeUserId) {
        return this.data.users
            .filter((u) => !excludeUserId || u.id !== excludeUserId)
            .map((u) => this.getUserWithDetails(u.id));
    }
}
exports.db = new Database();
