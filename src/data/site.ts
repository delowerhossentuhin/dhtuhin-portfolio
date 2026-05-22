/**
 * site.ts — Single source of truth for static content.
 * All values here were sourced directly from Delower Hossen Tuhin's CV
 * (April 2026 revision) and the project brief. Update here and the entire
 * site reflows; structured for clean future migration into the database.
 */

export const profile = {
  name: 'Delower Hossen Tuhin',
  shortName: 'Tuhin',
  title: 'Computer Science & Engineering • Research-Bound',
  tagline: 'Building intelligent systems at the intersection of privacy, perception, and applied AI.',
  longBio: [
    "I am a final-year undergraduate in Computer Science & Engineering at American International University-Bangladesh, graduating in May 2026 with a 3.95 CGPA. My work sits at the intersection of federated learning, computer vision for medical imaging, and interpretable AI — the corners of the field where mathematical rigor meets real-world consequence.",
    "Currently a Research Intern at the Advanced Machine Intelligence Research (AMIR) Lab, I focus on privacy-preserving distributed learning. Before AMIR, I contributed to Web3 systems and quantum-blockchain architectures at Deepchain Lab, and conducted ML research as a Research Assistant at Tech Wing's Lab.",
    "My ambition is to pursue a PhD and dedicate my career to research that genuinely matters — work that survives peer review, scales beyond the lab, and respects the people whose data trained it. Outside the lab, I write, watch cinema with a notebook beside me, and tinker with self-hosted infrastructure.",
  ],
  philosophy:
    "Research is patient work. The best results come from systems that are simple where they can be, rigorous where they must be, and honest about what they cannot do.",
  email: 'tuhindelower@gmail.com',
  contactEmail: 'dellowerhossentuhin@gmail.com',
  phone: '+880 1304 027 527',
  location: 'Dhaka, Bangladesh',
  status: 'Open to PhD positions for Fall 2026',
  resumePath: '/cv/Delower_Hossen_Tuhin_CV.pdf',
  social: {
    linkedin: 'https://www.linkedin.com/in/delower-hossen-tuhin/',
    researchgate: 'https://www.researchgate.net/profile/Delower-Hossen-Tuhin',
    scholar: 'https://scholar.google.com/citations?user=PCTa-RwAAAAJ&hl=en&authuser=1',
    orcid: 'https://orcid.org/0009-0009-6560-6138',
    github: 'https://github.com/delowerhossentuhin',
    facebook: 'https://www.facebook.com/dellowerhossentuhin',
    instagram: 'https://www.instagram.com/d.h._tuhin/',
  },
} as const;

export const education = [
  {
    institution: 'American International University-Bangladesh',
    degree: 'B.Sc. in Computer Science and Engineering',
    period: 'Sept 2022 — May 2026 (Expected)',
    score: 'CGPA: 3.95 / 4.00',
    highlights: ["Dean's List Honor (2024, 2025)", 'Academic Excellence Scholarship (2023–2026)'],
  },
  {
    institution: 'Murari Chand College, Sylhet',
    degree: 'Higher Secondary Certificate (HSC)',
    period: 'Completed Dec 2021',
    score: 'GPA: 5.00 / 5.00',
    highlights: ['Govt. Education Board Junior Scholarship — Sylhet Zone, 2016'],
  },
] as const;

export const experience = [
  {
    role: 'Research Intern',
    org: 'Advanced Machine Intelligence Research (AMIR) Lab',
    period: 'Jan 28, 2026 — Present',
    focus: 'Federated Learning',
    bullets: [
      'Conducting research in the federated learning domain — privacy-preserving model training across decentralized clients.',
      'Implementing and optimizing deep-learning models in PyTorch and TensorFlow.',
      'Representing the lab at academic seminars and collaborative reading groups.',
    ],
  },
  {
    role: 'Research & Development Intern',
    org: 'Deepchain Lab',
    period: 'Nov 28, 2025 — Jan 28, 2026',
    focus: 'Web3 & Quantum-Blockchain',
    bullets: [
      'Researched Web3 product surfaces and decentralized-application ecosystems.',
      'Explored architectures that integrate quantum computing with blockchain settlement layers.',
      'Contributed to full-stack production code in React and Next.js.',
    ],
  },
  {
    role: 'Research Assistant',
    org: "Tech Wing's Lab",
    period: 'Oct 2024 — Present',
    focus: 'Applied Machine Learning',
    bullets: [
      'Analyzed and processed research datasets in Python (pandas, scikit-learn).',
      'Developed and validated ML models across multiple lab-internal projects.',
      'Authored technical reports and reproducibility documentation in LaTeX.',
    ],
  },
] as const;

export const publications = [
  {
    id: 'pub-fault-diagnosis-2025',
    title: 'Intelligent Fault Diagnosis in Power Systems Using Random Forest and Ensemble Learning',
    authors: ['K. Redwan', 'M. R. Shamim', 'A. Sultana', 'D. H. Tuhin', 'et al.'],
    venue: 'Measurement: Energy',
    publisher: 'Elsevier',
    year: 2025,
    type: 'journal',
    tier: 'Q1, IF = 5.6',
    doi: '10.1016/j.meaene.2026.100098',
    url: 'https://doi.org/10.1016/j.meaene.2026.100098',
    status: 'published',
    abstract:
      'Random-forest based ensemble pipeline for detecting and classifying transient faults in power distribution networks. The model improves recall on minority-class fault events by combining bagged decision ensembles with class-balanced sampling.',
    keywords: ['Random Forest', 'Ensemble Learning', 'Power Systems', 'Fault Diagnosis'],
  },
  {
    id: 'pub-phishing-distilbert-2025',
    title: 'Enhanced Phishing Payload Detection Using Fine-Tuned DistilBERT and XAI-Based NLP Models',
    authors: ['S. Datto', 'D. H. Tuhin', 'et al.'],
    venue: '38th IEEE Region 10 Conference (TENCON 2025)',
    publisher: 'IEEE',
    year: 2025,
    type: 'conference',
    tier: 'Sabah, Malaysia',
    doi: '10.1109/TENCON66050.2025.11374958',
    url: 'https://doi.org/10.1109/TENCON66050.2025.11374958',
    status: 'published',
    abstract:
      'A fine-tuned DistilBERT classifier for phishing-payload detection paired with SHAP-based explanations, balancing inference latency with interpretability for security-operations workflows.',
    keywords: ['DistilBERT', 'XAI', 'Phishing Detection', 'NLP', 'Cybersecurity'],
  },
  {
    id: 'pub-edtech-ethics-2025',
    title: 'Ethical Dilemmas in EdTech: Student Perspectives on Data Privacy in Online Learning Platforms',
    authors: ['E. Haque', 'D. H. Tuhin', 'et al.'],
    venue: 'International Conference on Data Science, AI and Applications',
    publisher: 'Springer (University of Salford, UK)',
    year: 2025,
    type: 'conference',
    tier: 'United Kingdom',
    doi: '10.1007/978-3-032-11352-8_7',
    url: 'https://doi.org/10.1007/978-3-032-11352-8_7',
    status: 'published',
    abstract:
      'Mixed-methods study of student attitudes toward data-collection practices in online learning platforms, surfacing tensions between personalization gains and consent fatigue.',
    keywords: ['EdTech', 'Data Privacy', 'Ethics', 'Survey Research'],
  },
  {
    id: 'pub-gamification-2025',
    title: 'Effectiveness of Gamification in Education 4.0 to Enhance Student Learning Outcomes in Bangladesh',
    authors: ['M. Mostafa', 'R. Zannah', 'M. N. R. Islam', 'A. K. M. Emran', 'M. T. H. Rubel', 'A. Islam', 'D. H. Tuhin', 'et al.'],
    venue: '8th Industrial Engineering and Operations Management (IEOM) Conference',
    publisher: 'IEOM Society',
    year: 2025,
    type: 'conference',
    tier: 'Dhaka, Bangladesh',
    doi: '10.46254/BA08.20250167',
    url: 'https://doi.org/10.46254/BA08.20250167',
    status: 'published',
    abstract:
      'Quasi-experimental evaluation of gamification interventions across Bangladeshi higher-education cohorts, measuring engagement and assessment outcomes.',
    keywords: ['Gamification', 'Education 4.0', 'Learning Analytics'],
  },
  {
    id: 'pub-forensic-fraud-2025',
    title: 'Multimodal Forensic Accounting Fraud Detection Using Transformer-Based NLP Models',
    authors: [
      'Md. T. H. Rubel',
      'T. A. Patwary',
      'N. F. Ivy',
      'T. D. Dip',
      'M. M. Mim',
      'M. S. Farshe',
      'D. H. Tuhin',
      'A. Shufian',
    ],
    venue: '8th Industrial Engineering and Operations Management (IEOM) Conference',
    publisher: 'IEOM Society',
    year: 2025,
    type: 'conference',
    tier: 'Dhaka, Bangladesh',
    doi: '10.46254/BA08.20250172',
    url: 'https://doi.org/10.46254/BA08.20250172',
    status: 'published',
    abstract:
      'Transformer-based multimodal pipeline that fuses textual disclosures and tabular financial signals to flag fraudulent accounting patterns in regulatory filings.',
    keywords: ['Fraud Detection', 'Transformers', 'Forensic Accounting', 'Multimodal NLP'],
  },
  {
    id: 'pub-postpartum-2026',
    title: 'An Interpretable Attention-Based CNN Framework for Postpartum Depression Prediction',
    authors: ['A. A. Anurag', 'D. H. Tuhin', 'et al.'],
    venue: '39th IEEE Region 10 Conference (TENCON 2026)',
    publisher: 'IEEE',
    year: 2026,
    type: 'conference',
    tier: 'Bali, Indonesia',
    doi: null,
    url: null,
    status: 'submitted',
    abstract:
      'Attention-augmented CNN classifier that exposes per-feature saliency for clinical interpretation of postpartum-depression risk, validated on de-identified screening data.',
    keywords: ['CNN', 'Attention', 'Medical AI', 'Interpretability', 'Mental Health'],
  },
  {
    id: 'pub-federated-cxr-2026',
    title: 'A Comparative Analysis of Centralized and Federated Learning for Privacy-Preserving Chest X-ray Classification',
    authors: ['M. M. Mim', 'M. S. Farshe', 'D. H. Tuhin', 'et al.'],
    venue: 'International Conference on Engineering and Frontier Technologies (ICEFront)',
    publisher: 'ICEFront',
    year: 2026,
    type: 'conference',
    tier: 'Tangail, Bangladesh',
    doi: null,
    url: null,
    status: 'submitted',
    abstract:
      'Head-to-head comparison of centralized and federated training regimes on chest X-ray classification, measuring trade-offs across accuracy, communication overhead, and patient-privacy guarantees.',
    keywords: ['Federated Learning', 'Medical Imaging', 'Privacy', 'Chest X-ray'],
  },
] as const;

export const researchInterests = [
  {
    title: 'Federated Learning & Privacy Preservation',
    icon: 'Network',
    description:
      'Decentralized training across devices and institutions without ever centralizing the data. Building systems where utility and privacy are not zero-sum.',
  },
  {
    title: 'Computer Vision for Medical Imaging',
    icon: 'Microscope',
    description:
      'Deep models for classification and segmentation of clinical imagery — chest X-rays, screening data — with interpretability surfaces clinicians can actually use.',
  },
  {
    title: 'Machine Learning for Power System Fault Detection',
    icon: 'Zap',
    description:
      'Ensemble classifiers for transient fault diagnosis in power distribution networks, with emphasis on minority-class recall.',
  },
  {
    title: 'Deep Learning for Anomaly Detection',
    icon: 'Activity',
    description:
      'Self-supervised and attention-based architectures for identifying rare events in security, finance, and infrastructure data streams.',
  },
  {
    title: 'Edge AI for Real-Time Systems',
    icon: 'Cpu',
    description:
      'Compressing and quantizing models so they survive the trip from a research workstation to a constrained-memory device.',
  },
  {
    title: 'Interpretable & Explainable AI',
    icon: 'Eye',
    description:
      'Attention visualizations, SHAP-based attributions, and model-card practices that turn black boxes into auditable systems.',
  },
] as const;

export const skills = [
  {
    category: 'Programming Languages',
    icon: 'Code2',
    items: [
      { name: 'Python', level: 95, tag: 'Excellent' },
      { name: 'C++', level: 85, tag: 'Very Good' },
      { name: 'Java', level: 75, tag: 'Good' },
      { name: 'C#', level: 70, tag: 'Good' },
      { name: 'R', level: 70, tag: 'Good' },
    ],
  },
  {
    category: 'Machine Learning & AI',
    icon: 'Brain',
    items: [
      { name: 'TensorFlow', level: 92, tag: 'Excellent' },
      { name: 'PyTorch', level: 78, tag: 'Good' },
      { name: 'Scikit-learn', level: 93, tag: 'Excellent' },
      { name: 'MATLAB', level: 72, tag: 'Good' },
    ],
  },
  {
    category: 'Data Visualization',
    icon: 'BarChart3',
    items: [
      { name: 'Matplotlib', level: 92, tag: 'Excellent' },
      { name: 'Seaborn', level: 85, tag: 'Very Good' },
      { name: 'Chart.js', level: 72, tag: 'Good' },
    ],
  },
  {
    category: 'Web Development',
    icon: 'Globe',
    items: [
      { name: 'HTML5', level: 95, tag: 'Excellent' },
      { name: 'CSS3 / Tailwind', level: 92, tag: 'Excellent' },
      { name: 'JavaScript', level: 84, tag: 'Very Good' },
      { name: 'React.js', level: 84, tag: 'Very Good' },
      { name: 'Next.js', level: 75, tag: 'Good' },
    ],
  },
  {
    category: 'Research Tools',
    icon: 'FlaskConical',
    items: [
      { name: 'LaTeX', level: 95, tag: 'Excellent' },
      { name: 'Git / GitHub', level: 78, tag: 'Good' },
      { name: 'MS Office 365', level: 95, tag: 'Excellent' },
    ],
  },
] as const;

export const achievements = [
  {
    title: "Dean's List Honor",
    organization: 'American International University-Bangladesh',
    year: '2024, 2025',
    description: "Awarded for sustained academic excellence at the top of the CSE cohort.",
    icon: 'Award',
  },
  {
    title: 'Academic Excellence Scholarship',
    organization: 'American International University-Bangladesh',
    year: '2023 – 2026',
    description: "Merit-based scholarship covering the duration of undergraduate study.",
    icon: 'GraduationCap',
  },
  {
    title: "Aspire Leaders Program",
    organization: 'Aspire Institute, Inc. (with Harvard University faculty)',
    year: 'August 2024',
    description: 'Selective global leadership-development program with faculty participation from Harvard.',
    icon: 'Star',
  },
  {
    title: 'Junior Scholarship',
    organization: 'Bangladesh Govt. Education Board — Sylhet Zone',
    year: '2016',
    description: 'Awarded by the national education board for academic distinction at the junior level.',
    icon: 'Medal',
  },
  {
    title: 'Primary Scholarship',
    organization: 'Bangladesh Govt. Education Board — Sylhet Zone',
    year: '2013',
    description: 'Earliest formal academic recognition — board-wide scholarship in the Sylhet zone.',
    icon: 'Trophy',
  },
] as const;

export const memberships = [
  {
    name: 'IEEE — Institute of Electrical and Electronics Engineers',
    role: 'Student Member',
    period: 'Jan 2023 — Jan 2024',
    id: '#99854185',
    note: "The world's largest professional association for the advancement of technology.",
  },
  {
    name: 'AIUB Film Club (AFC)',
    role: 'Member',
    period: 'Oct 2022 — Present',
    id: null,
    note: 'Organizing film screenings, workshops, and creative media projects on campus.',
  },
] as const;

export const languages = [
  { name: 'English', level: 'IELTS Overall 6.5', breakdown: 'L 8.0 · R 6.0 · S 6.0 · W 6.5' },
  { name: 'Bengali', level: 'Native', breakdown: '' },
] as const;

export const references = [
  {
    name: 'Dr. Debajyoti Karmaker',
    title: 'Associate Professor, Head [Undergraduate Program]',
    department: 'Department of Computer Science',
    institution: 'American International University-Bangladesh',
    email: 'd.karmaker@aiub.edu',
  },
  {
    name: 'Dr. Mohammad Mahmudul Hasan',
    title: 'Associate Professor',
    department: 'Department of Computer Science',
    institution: 'American International University-Bangladesh',
    email: 'm.hasan@aiub.edu',
  },
] as const;

// Seed gallery items
export const seedGallery = [
  {
    id: 'g1',
    src: '/images/gallery/deans-list-honors.jpg',
    alt: "Receiving Dean's List Honor certificate at AIUB campus",
    title: "Dean's List Honors",
    caption: 'A quiet moment after the ceremony — AIUB campus, Dhaka.',
    category: 'Academic',
    span: 'tall',
  },
  {
    id: 'g2',
    src: '/images/gallery/convocation-volunteer.jpg',
    alt: 'Volunteering at the AIUB Convocation Ceremony',
    title: 'Convocation Volunteer',
    caption: 'Volunteering at the 22nd Convocation Ceremony, AIUB.',
    category: 'Campus Life',
    span: 'normal',
  },
  {
    id: 'g3',
    src: '/images/gallery/deans-list-ceremony.jpg',
    alt: "Dean's List awarding ceremony stage moment",
    title: 'On Stage',
    caption: 'On stage at the Dean\'s List & Honorable Mention ceremony.',
    category: 'Academic',
    span: 'wide',
  },
  {
    id: 'g4',
    src: '/images/gallery/campus-life.jpg',
    alt: 'Around the AIUB campus hallway',
    title: 'Between Classes',
    caption: 'A normal day between classes — AIUB main building.',
    category: 'Campus Life',
    span: 'normal',
  },
  {
    id: 'g5',
    src: '/images/gallery/early-days.jpg',
    alt: 'Early days at university',
    title: 'Earlier',
    caption: 'Earlier years — when the path forward was still being drafted.',
    category: 'Personal',
    span: 'normal',
  },
] as const;

// Seed cinematic-journal entries — hand-picked starter list. Admin can edit.
export const seedCinema = [
  {
    id: 'c1',
    title: 'Interstellar',
    year: 2014,
    category: 'Movie' as const,
    genres: ['Sci-Fi', 'Drama'],
    rating: 5,
    status: 'Watched' as const,
    watchDate: '2024-12-18',
    posterColor: '#1e3a8a',
    review:
      'A love letter to gravity, time, and the people we cannot bear to leave behind. Watched on a slow Wednesday with the lights off — Hans Zimmer\'s organ rebuilt my chest from the inside out.',
    quote: '"We used to look up at the sky and wonder at our place in the stars. Now we just look down and worry about our place in the dirt."',
  },
  {
    id: 'c2',
    title: 'Oppenheimer',
    year: 2023,
    category: 'Movie' as const,
    genres: ['Biopic', 'Drama', 'Historical'],
    rating: 4.5,
    status: 'Watched' as const,
    watchDate: '2024-09-02',
    posterColor: '#7c2d12',
    review:
      'The scariest film in years pretends to be about a bomb but is really about a meeting. Nolan\'s discipline finally meets a subject that demands his obsessions.',
    quote: '"Now I am become Death, the destroyer of worlds."',
  },
  {
    id: 'c3',
    title: 'The Imitation Game',
    year: 2014,
    category: 'Movie' as const,
    genres: ['Biopic', 'Drama', 'Thriller'],
    rating: 4.5,
    status: 'Watched' as const,
    watchDate: '2024-07-14',
    posterColor: '#0c4a6e',
    review:
      'A reminder that the cost of being early is often paid privately. Cumberbatch\'s Turing is brittle in the way real geniuses tend to be — never quite at ease in a room.',
    quote: '"Sometimes it is the people no one imagines anything of who do the things no one can imagine."',
  },
  {
    id: 'c4',
    title: 'Breaking Bad',
    year: 2008,
    category: 'TV Series' as const,
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 5,
    status: 'Watched' as const,
    watchDate: '2024-03-10',
    posterColor: '#365314',
    review:
      'A masterclass in patience. Every season earns the next one. The writing trusts the viewer in a way modern television rarely does anymore.',
    quote: '"I am the one who knocks."',
  },
  {
    id: 'c5',
    title: 'Chernobyl',
    year: 2019,
    category: 'TV Series' as const,
    genres: ['Drama', 'Historical', 'Thriller'],
    rating: 5,
    status: 'Watched' as const,
    watchDate: '2024-05-22',
    posterColor: '#404040',
    review:
      'Five episodes that explain more about institutional rot than five hundred pages of theory. The silence does most of the work.',
    quote: '"What is the cost of lies?"',
  },
  {
    id: 'c6',
    title: 'Dune: Part Two',
    year: 2024,
    category: 'Movie' as const,
    genres: ['Sci-Fi', 'Epic', 'Drama'],
    rating: 4.5,
    status: 'Watched' as const,
    watchDate: '2024-04-05',
    posterColor: '#92400e',
    review:
      'Villeneuve makes scale feel personal. The sand is a character. The score arrives like weather.',
    quote: '"Long live the fighters."',
  },
  {
    id: 'c7',
    title: 'The Three-Body Problem',
    year: 2024,
    category: 'TV Series' as const,
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    rating: 4,
    status: 'Watched' as const,
    watchDate: '2024-08-01',
    posterColor: '#1e293b',
    review:
      'Not as patient as the books, but the dread carries through. Worth it for the cosmology alone.',
    quote: '"In nature, nothing exists alone."',
  },
  {
    id: 'c8',
    title: 'Arrival',
    year: 2016,
    category: 'Movie' as const,
    genres: ['Sci-Fi', 'Drama'],
    rating: 5,
    status: 'Rewatched' as const,
    watchDate: '2025-01-09',
    posterColor: '#0f766e',
    review:
      'Watched it the first time for the puzzle, the second time for the grief. A film about choosing pain because it is also where the meaning lives.',
    quote: '"Memory is a strange thing. It doesn\'t work like I thought it did."',
  },
  {
    id: 'c9',
    title: 'Severance',
    year: 2022,
    category: 'TV Series' as const,
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    rating: 5,
    status: 'Watching' as const,
    watchDate: '2026-04-12',
    posterColor: '#1e1b4b',
    review:
      'Production design from a parallel timeline. Every frame is composed like a Hopper painting on muscle relaxants.',
    quote: '"Please enjoy each character equally."',
  },
  {
    id: 'c10',
    title: 'Parasite',
    year: 2019,
    category: 'Movie' as const,
    genres: ['Drama', 'Thriller', 'Dark Comedy'],
    rating: 5,
    status: 'Watched' as const,
    watchDate: '2024-02-14',
    posterColor: '#7f1d1d',
    review:
      'Tonal control of the kind that wins awards because it deserves them. The basement reveal still rearranges my pulse.',
    quote: '"You know what kind of plan never fails? No plan."',
  },
  {
    id: 'c11',
    title: 'Blade Runner 2049',
    year: 2017,
    category: 'Movie' as const,
    genres: ['Sci-Fi', 'Noir', 'Drama'],
    rating: 4.5,
    status: 'Watched' as const,
    watchDate: '2024-11-30',
    posterColor: '#9a3412',
    review:
      'Deakins makes orange feel like grief. A slow film for people who are willing to stay.',
    quote: '"Sometimes to love someone, you got to be a stranger."',
  },
  {
    id: 'c12',
    title: 'Foundation',
    year: 2021,
    category: 'TV Series' as const,
    genres: ['Sci-Fi', 'Drama'],
    rating: 3.5,
    status: 'Watchlist' as const,
    watchDate: null,
    posterColor: '#581c87',
    review:
      "On the list — curious to see how they adapted Asimov's prediction-as-history premise for prestige TV.",
    quote: '',
  },
] as const;

// Seed blog posts — Admin can add more via dashboard.
export const seedBlogs = [
  {
    id: 'b1',
    slug: 'reading-papers-without-drowning',
    title: 'Reading Papers Without Drowning: A Junior Researcher\'s Field Notes',
    excerpt:
      "On the first hundred ML papers — what to skim, what to read, and how to stop pretending you understood the math.",
    coverColor: '#1e3a8a',
    category: 'Research',
    tags: ['Research Methods', 'Reading List', 'Graduate Prep'],
    readTime: 9,
    date: '2026-04-12',
    featured: true,
    content: `# Reading Papers Without Drowning

I used to print every paper. I would highlight the abstract, write earnest notes in the margins, then put the paper in a folder I would never open again. The folder grew. The reading slowed. The shame compounded.

A senior researcher pulled me aside and said: **read for what the paper does, not for what it claims.** The trick is to ask three questions in this order — and stop as soon as one of them fails.

## 1. What is the problem, and why now?

If the introduction can't make me care in a single paragraph, the rest of the paper is borrowed credibility. Read the intro and the related-work paragraph that connects to it. If the framing is sloppy, the experiments will be sloppy too.

## 2. What is the experimental claim?

Skip to the results table. Look at the **second-best** baseline. Most of the story is in the gap between the proposed method and that baseline, not in the gap to the worst one. If the gap is small and the variance is large, the contribution is smaller than the title suggests.

## 3. Can I reproduce it tonight?

A paper that doesn't share code, hyperparameters, and a dataset link is asking you to take it on faith. Faith is for religion. For ML, ask for a repo.

---

This is a draft of a longer post I am still writing. The point is not to be cynical — the point is that **junior researchers drown because they treat every paper with equal seriousness.** They don't deserve it. Most papers are journeyman work. A few are extraordinary. Your job is to find the extraordinary ones, and that requires reading less, not more.`,
  },
  {
    id: 'b2',
    slug: 'federated-learning-isnt-magic',
    title: "Federated Learning Isn't Magic — It's a Trade",
    excerpt:
      "Privacy gains, communication costs, and the part of the literature that quietly assumes everyone behaves.",
    coverColor: '#0c4a6e',
    category: 'Research',
    tags: ['Federated Learning', 'Privacy', 'Distributed Systems'],
    readTime: 11,
    date: '2026-03-08',
    featured: true,
    content: `# Federated Learning Isn't Magic — It's a Trade

The pitch is clean: train on data that never leaves the device. Hospitals keep their patients' data. Phones keep their users' data. The model gets smarter without anyone surrendering their secrets.

The pitch is mostly true. It is also incomplete.

## What you actually trade

You trade **centralization** for **coordination overhead**. Every communication round costs bandwidth and time. The straggler problem — one slow client holding up everyone — is real, and the fixes are imperfect.

You trade **data leakage** for **gradient leakage**. Gradients can be reverse-engineered. Differential privacy helps, but it costs accuracy. Secure aggregation helps, but it costs latency. There is no version of this where you get all three: privacy, accuracy, speed.

## What the literature quietly assumes

Most FL papers assume **honest-but-curious** clients. A real adversary is not honest. The gap between "honest-but-curious" and "actively trying to poison your global model" is where production systems live, and the literature on robust aggregation under Byzantine clients is, frankly, behind where it should be.

## What I'm working on

My current work at the AMIR Lab is about making this trade-off legible. If a hospital is going to commit to a federated training run, they deserve to know — before the first round — what their privacy budget buys them in terms of model utility. The honest answer is usually not what the marketing says.

More to come.`,
  },
  {
    id: 'b3',
    slug: 'building-this-website',
    title: 'Why I Built This Website The Hard Way',
    excerpt:
      "Notes on choosing Next.js over a template, designing for research, and refusing to ship 'generic portfolio energy'.",
    coverColor: '#164e63',
    category: 'Engineering',
    tags: ['Next.js', 'Design', 'Personal'],
    readTime: 7,
    date: '2026-02-21',
    featured: false,
    content: `# Why I Built This Website The Hard Way

A friend asked me last week why I didn't just use a template. The site you're reading was a month of evenings. I could have spun up something on Notion in an hour.

The honest answer is that **the website is part of the application**. Not the visa application — the application of being a young researcher trying to be taken seriously. The site is read by program directors, principal investigators, and committee members who form opinions in seconds. Generic energy reads as generic ambition.

So I wrote it by hand in Next.js, with Tailwind for the system and Framer Motion for the moments. No template. No "AI portfolio generator." The cinematic-journal page exists because cinema matters to me, and a research portfolio that hides everything except the research is a research portfolio without a person inside it.

If you're reading this and trying to build something similar — start with the question of what you want a stranger to feel after thirty seconds on your homepage. Build for that feeling. The rest is plumbing.`,
  },
] as const;

export type Publication = (typeof publications)[number];
export type Skill = (typeof skills)[number];
export type CinemaEntry = (typeof seedCinema)[number];
export type GalleryItem = (typeof seedGallery)[number];
export type BlogPost = (typeof seedBlogs)[number];
