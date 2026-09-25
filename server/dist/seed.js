"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./services/db");
function seedDatabase() {
    console.log('🌱 Seeding SkillSwap database with realistic student profiles...');
    const passwordHash = bcryptjs_1.default.hashSync('password123', 10);
    // 1. Predefined Skills with Categories
    const skillsList = [
        { name: 'Python', category: 'Programming' },
        { name: 'Java', category: 'Programming' },
        { name: 'C', category: 'Programming' },
        { name: 'C++', category: 'Programming' },
        { name: 'JavaScript', category: 'Programming' },
        { name: 'TypeScript', category: 'Programming' },
        { name: 'React', category: 'Web Development' },
        { name: 'HTML/CSS', category: 'Web Development' },
        { name: 'Spring Boot', category: 'Backend' },
        { name: 'SQL', category: 'Database' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'UI/UX Design', category: 'Design' },
        { name: 'Figma', category: 'Design' },
        { name: 'Photoshop', category: 'Design' },
        { name: 'Graphic Design', category: 'Design' },
        { name: 'Illustrator', category: 'Design' },
        { name: 'Blender', category: '3D & Animation' },
        { name: 'Video Editing', category: 'Multimedia' },
        { name: 'Premiere Pro', category: 'Multimedia' },
        { name: 'Photography', category: 'Multimedia' },
        { name: 'Public Speaking', category: 'Soft Skills' },
        { name: 'Business Strategy', category: 'Business' },
        { name: 'Pitching', category: 'Soft Skills' },
        { name: 'Mathematics', category: 'Academics' },
        { name: 'MATLAB', category: 'Engineering' },
        { name: 'Algorithms', category: 'Computer Science' },
        { name: 'Data Science', category: 'AI & Data' },
        { name: 'Machine Learning', category: 'AI & Data' },
    ];
    skillsList.forEach((s) => db_1.db.skills.create(s));
    // 2. Demo Students
    const students = [
        {
            name: 'Arun Kumar',
            email: 'arun@skillswap.edu',
            passwordHash,
            college: 'Indian Institute of Technology',
            department: 'Computer Science & Engineering',
            year: '3rd Year',
            bio: 'Passionate programmer who loves writing Python scripts, backend algorithms, and SQL queries. Looking to level up my front-end and design skills to build better user interfaces!',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            availability: 'Weekends',
            learningMode: 'Hybrid',
            offered: ['Python', 'SQL', 'C++'],
            required: ['UI/UX Design', 'Figma'],
        },
        {
            name: 'Priya Sharma',
            email: 'priya@skillswap.edu',
            passwordHash,
            college: 'National Institute of Design',
            department: 'Interaction & UI/UX Design',
            year: '3rd Year',
            bio: 'UI/UX enthusiast obsessed with clean typography, Figma design systems, and delightful user experiences. Eager to master Python for data visualization and creative scripting!',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            availability: 'Weekends',
            learningMode: 'Hybrid',
            offered: ['UI/UX Design', 'Figma', 'Photoshop'],
            required: ['Python', 'Data Science'],
        },
        {
            name: 'Rahul Verma',
            email: 'rahul@skillswap.edu',
            passwordHash,
            college: 'KSR College of Technology',
            department: 'Information Technology',
            year: '4th Year',
            bio: 'Enterprise backend developer building robust microservices with Java and Spring Boot. Wanting to learn React and modern frontend frameworks.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            availability: 'Evenings',
            learningMode: 'Online',
            offered: ['Java', 'Spring Boot', 'PostgreSQL'],
            required: ['React', 'TypeScript'],
        },
        {
            name: 'Sneha Patel',
            email: 'sneha@skillswap.edu',
            passwordHash,
            college: 'Anna University',
            department: 'Computer Science',
            year: '2nd Year',
            bio: 'Frontend enthusiast crafting interactive web apps with React and modern CSS. Keen to understand backend development with Java and object-oriented architectures.',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
            availability: 'Evenings',
            learningMode: 'Online',
            offered: ['React', 'JavaScript', 'HTML/CSS'],
            required: ['Java', 'Spring Boot'],
        },
        {
            name: 'Karthik Raja',
            email: 'karthik@skillswap.edu',
            passwordHash,
            college: 'Loyola College',
            department: 'Visual Communication',
            year: '3rd Year',
            bio: 'Videographer and story-teller editing cinematic YouTube content and color grades. Wanting to improve my branding and vector graphic design skills.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            availability: 'Flexible',
            learningMode: 'Hybrid',
            offered: ['Video Editing', 'Photography', 'Premiere Pro'],
            required: ['Graphic Design', 'Blender'],
        },
        {
            name: 'Ananya Roy',
            email: 'ananya@skillswap.edu',
            passwordHash,
            college: 'College of Fine Arts',
            department: 'Digital Multimedia & Arts',
            year: '4th Year',
            bio: 'Brand identity designer, vector illustrator, and 3D hobbyist. Looking for a peer to teach me video post-production and motion graphics.',
            avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed292022?auto=format&fit=crop&w=400&q=80',
            availability: 'Flexible',
            learningMode: 'Hybrid',
            offered: ['Graphic Design', 'Illustrator', 'Blender'],
            required: ['Video Editing', 'Premiere Pro'],
        },
        {
            name: 'Vikram Menon',
            email: 'vikram@skillswap.edu',
            passwordHash,
            college: 'PSG College of Technology',
            department: 'Electrical & Electronics',
            year: '2nd Year',
            bio: 'Math lover and circuit hobbyist. Happy to help peers with linear algebra, calculus, and MATLAB in exchange for practical Python and ML tutoring.',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
            availability: 'Weekends',
            learningMode: 'In-Person',
            offered: ['Mathematics', 'MATLAB', 'C'],
            required: ['Python', 'Machine Learning'],
        },
        {
            name: 'Divya Sundaram',
            email: 'divya@skillswap.edu',
            passwordHash,
            college: 'Vellore Institute of Technology',
            department: 'Data Science',
            year: '3rd Year',
            bio: 'Data nerd working with scikit-learn, deep learning models, and big data. Need help refining my public speaking and presentation pitching skills.',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            availability: 'Flexible',
            learningMode: 'Online',
            offered: ['Machine Learning', 'Data Science', 'Python'],
            required: ['Public Speaking', 'Pitching'],
        },
        {
            name: 'Rohan Mehta',
            email: 'rohan@skillswap.edu',
            passwordHash,
            college: 'Department of Management Studies',
            department: 'Business & Entrepreneurship',
            year: '2nd Year',
            bio: 'Student startup founder, debater, and public speaker. Looking to learn modern web development so I can prototype my venture ideas directly.',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            availability: 'Weekdays',
            learningMode: 'Hybrid',
            offered: ['Public Speaking', 'Business Strategy', 'Pitching'],
            required: ['React', 'JavaScript'],
        },
        {
            name: 'Meera Nair',
            email: 'meera@skillswap.edu',
            passwordHash,
            college: 'Government College of Technology',
            department: 'Computer Science',
            year: '1st Year',
            bio: 'First year engineering student with strong foundations in C and discrete math. Excited to learn modern web development and JavaScript from seniors!',
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
            availability: 'Weekends',
            learningMode: 'Online',
            offered: ['C', 'Algorithms', 'Mathematics'],
            required: ['JavaScript', 'HTML/CSS'],
        },
    ];
    const createdUserIds = {};
    for (const s of students) {
        const user = db_1.db.users.create({
            name: s.name,
            email: s.email,
            passwordHash: s.passwordHash,
            college: s.college,
            department: s.department,
            year: s.year,
            bio: s.bio,
            avatar: s.avatar,
            availability: s.availability,
            learningMode: s.learningMode,
        });
        createdUserIds[s.email] = user.id;
        // Add offered skills
        for (const skillName of s.offered) {
            const skill = db_1.db.skills.findOrCreate(skillName);
            db_1.db.userOfferedSkills.add(user.id, skill.id);
        }
        // Add required skills
        for (const skillName of s.required) {
            const skill = db_1.db.skills.findOrCreate(skillName);
            db_1.db.userRequiredSkills.add(user.id, skill.id);
        }
    }
    // 3. Seed some past completed exchanges and authentic reviews
    // Example: Priya previously taught UI/UX to Vikram, and Sneha taught React to Rahul
    const priyaId = createdUserIds['priya@skillswap.edu'];
    const vikramId = createdUserIds['vikram@skillswap.edu'];
    const snehaId = createdUserIds['sneha@skillswap.edu'];
    const rahulId = createdUserIds['rahul@skillswap.edu'];
    if (priyaId && vikramId) {
        const req1 = db_1.db.exchangeRequests.create({
            senderId: vikramId,
            receiverId: priyaId,
            offeredSkillName: 'Mathematics',
            requiredSkillName: 'UI/UX Design',
            message: 'Hi Priya! Could you help me with Figma wireframing in exchange for Calculus tutoring?',
        });
        db_1.db.exchangeRequests.updateStatus(req1.id, 'COMPLETED');
        const ex1 = db_1.db.exchanges.create({
            requestId: req1.id,
            senderId: vikramId,
            receiverId: priyaId,
            offeredSkillName: 'Mathematics',
            requiredSkillName: 'UI/UX Design',
        });
        db_1.db.exchanges.complete(ex1.id);
        // Vikram reviews Priya
        db_1.db.reviews.create({
            exchangeId: ex1.id,
            reviewerId: vikramId,
            revieweeId: priyaId,
            rating: 5,
            feedback: 'Priya is an incredible mentor! She patiently explained Figma auto-layout and design hierarchy. Highly recommend exchanging skills with her!',
        });
        // Priya reviews Vikram
        db_1.db.reviews.create({
            exchangeId: ex1.id,
            reviewerId: priyaId,
            revieweeId: vikramId,
            rating: 5,
            feedback: 'Vikram explained vector calculus concepts so clearly with intuitive visual analogies. Super helpful!',
        });
    }
    if (snehaId && rahulId) {
        const req2 = db_1.db.exchangeRequests.create({
            senderId: rahulId,
            receiverId: snehaId,
            offeredSkillName: 'Java',
            requiredSkillName: 'React',
            message: 'Hey Sneha, let’s exchange Java fundamentals for React hooks!',
        });
        db_1.db.exchangeRequests.updateStatus(req2.id, 'COMPLETED');
        const ex2 = db_1.db.exchanges.create({
            requestId: req2.id,
            senderId: rahulId,
            receiverId: snehaId,
            offeredSkillName: 'Java',
            requiredSkillName: 'React',
        });
        db_1.db.exchanges.complete(ex2.id);
        db_1.db.reviews.create({
            exchangeId: ex2.id,
            reviewerId: rahulId,
            revieweeId: snehaId,
            rating: 5,
            feedback: 'Sneha knows React inside out. She helped me build my first component library and state management structure in just two sessions!',
        });
    }
    console.log('✅ Seed completed successfully! 10 demo student accounts created.');
    console.log('🔑 Credentials for demo accounts: arun@skillswap.edu / password123, priya@skillswap.edu / password123');
}
// When executed directly via `tsx src/seed.ts`
if (require.main === module) {
    seedDatabase();
}
