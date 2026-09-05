import { DomainItem, SkillItem } from '../types';

export const DOMAINS: DomainItem[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Telemedicine',
    category: 'HealthTech',
    description: 'Patient monitoring, doctor consultations, medical image analysis, and clinic management.',
    popular: true,
  },
  {
    id: 'fintech',
    name: 'FinTech & Smart Banking',
    category: 'Finance',
    description: 'Personal expense trackers, fraud detection, micro-investing, and automated budgeting.',
    popular: true,
  },
  {
    id: 'edtech',
    name: 'EdTech & Smart Learning',
    category: 'Education',
    description: 'Interactive quizzes, AI study buddies, adaptive revision schedules, and student flashcards.',
    popular: true,
  },
  {
    id: 'cleantech',
    name: 'Climate & Clean Energy',
    category: 'Sustainability',
    description: 'Carbon footprint calculators, solar energy usage trackers, and electronic waste recycling networks.',
    popular: true,
  },
  {
    id: 'agtech',
    name: 'Smart Agriculture & Farming',
    category: 'AgTech',
    description: 'Crop disease detection, soil moisture monitoring, market price prediction, and farm management.',
    popular: true,
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Privacy',
    category: 'Security',
    description: 'Phishing email scanners, password strength auditors, secure file storage, and network vulnerability checks.',
    popular: true,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Smart Retail',
    category: 'Retail',
    description: 'Product recommendation systems, inventory forecasting, AR item preview, and review sentiment checkers.',
    popular: true,
  },
  {
    id: 'logistics',
    name: 'Supply Chain & Delivery',
    category: 'Logistics',
    description: 'Delivery route optimization, warehouse inventory tracking, real-time shipment monitoring, and fleet dispatch.',
    popular: false,
  },
  {
    id: 'robotics-iot',
    name: 'IoT & Smart Home Automation',
    category: 'Embedded',
    description: 'Home power consumption monitors, smart appliance automation, remote environmental sensors, and alerts.',
    popular: true,
  },
  {
    id: 'autonomous',
    name: 'Autonomous Vehicles & Traffic',
    category: 'Mobility',
    description: 'Smart traffic light management, parking space spotter, driver drowsiness alerts, and pothole mapping.',
    popular: false,
  },
  {
    id: 'social-impact',
    name: 'Social Good & Accessibility',
    category: 'Civic',
    description: 'Audio assistance for visually impaired, sign-language interpreters, disaster relief coordination, and food bank maps.',
    popular: true,
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Wellness',
    category: 'HealthTech',
    description: 'Mood tracking journals, guided breathing assistants, habit building, and stress relief companions.',
    popular: true,
  },
  {
    id: 'legaltech',
    name: 'LegalTech & Contract Analysis',
    category: 'Legal',
    description: 'Terms of service summarizers, clause analyzers, tenant rights guidance, and dispute resolution assistants.',
    popular: false,
  },
  {
    id: 'gaming-ar',
    name: 'Interactive Gaming & AR/VR',
    category: 'Entertainment',
    description: 'Virtual lab experiments, 3D physics simulators, gamified skill learning, and AR educational models.',
    popular: false,
  },
  {
    id: 'spacetech',
    name: 'SpaceTech & Satellite Imagery',
    category: 'Aerospace',
    description: 'Satellite weather map analyzers, orbital debris trackers, light pollution monitors, and astronomy observation loggers.',
    popular: false,
  },
  {
    id: 'biotech',
    name: 'BioTech & Genomic Data',
    category: 'Science',
    description: 'DNA sequence pattern matching, protein structure visualizers, and bio-marker trend analyzers.',
    popular: false,
  },
  {
    id: 'drone-tech',
    name: 'Drone & Aerial Surveillance',
    category: 'Robotics',
    description: 'Wildfire spotters, perimeter security patrols, agricultural crop health flyovers, and emergency delivery.',
    popular: false,
  },
  {
    id: 'hr-recruiting',
    name: 'HR & Talent Matching',
    category: 'Enterprise',
    description: 'Resume parser and skill matchers, mock technical interview bots, and peer feedback systems.',
    popular: false,
  },
];

export const SKILLS_CATALOG: SkillItem[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', popular: true },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', popular: true },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', popular: false },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', popular: true },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', popular: true },
  { id: 'javascript', name: 'JavaScript', category: 'Frontend', popular: false },
  { id: 'html-css', name: 'HTML & CSS', category: 'Frontend', popular: false },

  // Backend
  { id: 'python', name: 'Python', category: 'Backend', popular: true },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend', popular: true },
  { id: 'nodejs', name: 'Node.js', category: 'Backend', popular: true },
  { id: 'express', name: 'Express.js', category: 'Backend', popular: true },
  { id: 'django', name: 'Django', category: 'Backend', popular: false },
  { id: 'flask', name: 'Flask', category: 'Backend', popular: false },
  { id: 'golang', name: 'Go (Golang)', category: 'Backend', popular: false },
  { id: 'java', name: 'Java / Spring Boot', category: 'Backend', popular: false },
  { id: 'rust', name: 'Rust', category: 'Backend', popular: false },

  // AI & ML
  { id: 'gemini', name: 'Gemini AI', category: 'AI / ML', popular: true },
  { id: 'pytorch', name: 'PyTorch', category: 'AI / ML', popular: true },
  { id: 'tensorflow', name: 'TensorFlow', category: 'AI / ML', popular: false },
  { id: 'scikit', name: 'Scikit-Learn', category: 'AI / ML', popular: true },
  { id: 'langchain', name: 'LangChain', category: 'AI / ML', popular: true },
  { id: 'huggingface', name: 'Hugging Face', category: 'AI / ML', popular: false },
  { id: 'opencv', name: 'OpenCV (Vision)', category: 'AI / ML', popular: true },
  { id: 'rag', name: 'RAG & Vector Search', category: 'AI / ML', popular: true },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', popular: true },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', popular: true },
  { id: 'mysql', name: 'MySQL', category: 'Database', popular: false },
  { id: 'redis', name: 'Redis', category: 'Database', popular: true },
  { id: 'sqlite', name: 'SQLite', category: 'Database', popular: false },
  { id: 'supabase', name: 'Supabase', category: 'Database', popular: true },
  { id: 'chromadb', name: 'ChromaDB / Pinecone', category: 'Database', popular: false },

  // Cloud & DevOps
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps', popular: true },
  { id: 'aws', name: 'AWS Cloud', category: 'Cloud & DevOps', popular: true },
  { id: 'firebase', name: 'Firebase', category: 'Cloud & DevOps', popular: true },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Cloud & DevOps', popular: false },
  { id: 'github-actions', name: 'GitHub Actions (CI/CD)', category: 'Cloud & DevOps', popular: false },

  // Mobile
  { id: 'flutter', name: 'Flutter', category: 'Mobile', popular: true },
  { id: 'react-native', name: 'React Native', category: 'Mobile', popular: true },
  { id: 'android-kotlin', name: 'Android (Kotlin)', category: 'Mobile', popular: false },

  // Embedded & IoT
  { id: 'raspberry-pi', name: 'Raspberry Pi', category: 'Embedded / IoT', popular: false },
  { id: 'arduino', name: 'Arduino / ESP32', category: 'Embedded / IoT', popular: false },
  { id: 'mqtt', name: 'MQTT Protocol', category: 'Embedded / IoT', popular: false },

  // Cybersecurity
  { id: 'wireshark', name: 'Wireshark & Network Sec', category: 'Cybersecurity', popular: false },
  { id: 'cryptography', name: 'Cryptography & Hashing', category: 'Cybersecurity', popular: false },
];
