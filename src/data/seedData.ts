import {
  RoadmapPhase,
  RoadmapTask,
  Milestone,
  Project,
  ResourceItem,
  AppSettings,
  AlgorithmProblem
} from '../types'

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'settings',
  theme: 'light',
  dailyFocusOverride: undefined,
  weeklyTargetHours: 17,
  categoryTargets: {
    Projects: 7,
    DSA: 4,
    Learning: 3,
    'CS fundamentals': 2,
    Career: 1,
  },
  preferredStudyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  remindersEnabled: false,
  roadmapVersion: 1,
  showSkippedTasks: false,
}

export const SEED_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'Programming Foundations',
    startDate: '2026-10-20',
    endDate: '2026-12-31',
    objective: 'Become comfortable writing, debugging, testing, and explaining Java programs independently.',
    topics: [
      'Java JDK & IDE setup',
      'Git & GitHub basics',
      'Variables & types',
      'Conditionals & loops',
      'Methods & arrays',
      'OOP principles (Classes, Encapsulation)',
      'Collections framework',
      'Exception handling & I/O',
      'Unit testing with JUnit',
      'CLI Expense Tracker'
    ],
    taskIds: [
      'task-p1-01', 'task-p1-02', 'task-p1-03', 'task-p1-04', 'task-p1-05',
      'task-p1-06', 'task-p1-07', 'task-p1-08', 'task-p1-09', 'task-p1-10',
      'task-p1-11', 'task-p1-12', 'task-p1-13'
    ],
    milestoneIds: ['ms-p1-1', 'ms-p1-2'],
    completionCriteria: [
      'Independently write, debug, and run Java programs',
      'Understand OOP fundamentals and standard Collections',
      'Consistent Git commit habits with clear messages on GitHub',
      'Complete and test the command-line expense tracker project'
    ],
    recommendedResources: [
      { title: 'Dev.java Learn', url: 'https://dev.java/learn/', note: 'Official Oracle Java tutorials' },
      { title: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2', note: 'Chapters 1-3 for version control' }
    ],
    order: 1,
    status: 'active'
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Data Structures and Algorithms',
    startDate: '2027-01-01',
    endDate: '2027-03-31',
    objective: 'Master fundamental data structures and problem-solving patterns, completing 40–60 well-understood problems.',
    topics: [
      'Big-O notation & complexity analysis',
      'Dynamic arrays & strings',
      'Hash maps & hash sets',
      'Two pointers & sliding window',
      'Linked lists (singly & doubly)',
      'Stacks & queues',
      'Binary search & sorting algorithms',
      'Recursion & backtracking basics',
      'Binary trees, heaps, BFS & DFS'
    ],
    taskIds: [
      'task-p2-01', 'task-p2-02', 'task-p2-03', 'task-p2-04', 'task-p2-05',
      'task-p2-06', 'task-p2-07', 'task-p2-08', 'task-p2-09', 'task-p2-10'
    ],
    milestoneIds: ['ms-p2-1', 'ms-p2-2'],
    completionCriteria: [
      'Understand and articulate time and space complexity for all standard data structures',
      'Solve 40–60 problems independently across core patterns',
      'Maintain an active revision list for problems that required assistance'
    ],
    recommendedResources: [
      { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', note: 'Visual roadmap for algorithm patterns' }
    ],
    order: 2,
    status: 'upcoming'
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'Backend Engineering',
    startDate: '2027-04-01',
    endDate: '2027-06-30',
    objective: 'Design, build, test, and deploy production-ready RESTful APIs with Spring Boot and PostgreSQL.',
    topics: [
      'HTTP protocol, REST semantics & status codes',
      'Relational database design & normalization',
      'SQL: joins, indexes, constraints, transactions',
      'Spring Boot & dependency injection',
      'Data persistence with Spring Data JPA / Hibernate',
      'Request validation & centralized exception handling',
      'Authentication & authorization (JWT / Session)',
      'Automated integration testing with MockMvc & Testcontainers'
    ],
    taskIds: [
      'task-p3-01', 'task-p3-02', 'task-p3-03', 'task-p3-04', 'task-p3-05',
      'task-p3-06', 'task-p3-07', 'task-p3-08'
    ],
    milestoneIds: ['ms-p3-1', 'ms-p3-2'],
    completionCriteria: [
      'Design relational schemas and write efficient SQL queries',
      'Build and secure a multi-endpoint REST API with Spring Boot',
      'Deploy the backend API with live database connection and automated tests'
    ],
    recommendedResources: [
      { title: 'Spring Boot Official Guides', url: 'https://spring.io/guides' },
      { title: 'SQLBolt Practice', url: 'https://sqlbolt.com/' },
      { title: 'roadmap.sh Backend', url: 'https://roadmap.sh/backend' }
    ],
    order: 3,
    status: 'upcoming'
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'Production Practices & Portfolio Project',
    startDate: '2027-07-01',
    endDate: '2027-09-30',
    objective: 'Ship a containerized, robust portfolio project with automated CI/CD and production telemetry.',
    topics: [
      'Linux CLI workflows & bash scripting',
      'Docker containerization & multi-stage builds',
      'Environment variable & secret management',
      'CI/CD automation with GitHub Actions',
      'Structured logging, metrics & health endpoints',
      'Secure API design (CORS, rate limiting, sanitization)',
      'Production deployment on cloud / VPS'
    ],
    taskIds: [
      'task-p4-01', 'task-p4-02', 'task-p4-03', 'task-p4-04', 'task-p4-05',
      'task-p4-06', 'task-p4-07'
    ],
    milestoneIds: ['ms-p4-1'],
    completionCriteria: [
      'Deploy Drone Lap-Timing and Event Management application',
      'Configure automated GitHub Actions for build, test, and container packaging',
      'Provide comprehensive README with architectural diagrams and setup guides'
    ],
    recommendedResources: [
      { title: 'Docker Official Documentation', url: 'https://docs.docker.com/' },
      { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' }
    ],
    order: 4,
    status: 'upcoming'
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    title: 'CS Fundamentals & Collaboration',
    startDate: '2027-10-01',
    endDate: '2027-12-31',
    objective: 'Deepen core computer science knowledge and collaborate on open-source or team codebases.',
    topics: [
      'Operating Systems: Processes vs Threads, CPU scheduling',
      'Concurrency: Race conditions, deadlocks, locks & synchronization',
      'Memory management, virtual memory & cache hierarchy',
      'Computer Networking: TCP/IP, DNS, TLS/SSL, HTTP/2',
      'Database internals: B-Trees, WAL, query execution plans',
      'Collaborative Git: PR workflows, code reviews, issue triaging'
    ],
    taskIds: [
      'task-p5-01', 'task-p5-02', 'task-p5-03', 'task-p5-04', 'task-p5-05',
      'task-p5-06'
    ],
    milestoneIds: ['ms-p5-1', 'ms-p5-2'],
    completionCriteria: [
      'Explain fundamental OS and networking concepts clearly',
      'Submit meaningful pull requests to an open-source project or deliver team project',
      'Conduct a thorough technical audit of all portfolio projects'
    ],
    recommendedResources: [
      { title: 'TeachYourselfCS', url: 'https://teachyourselfcs.com/', note: 'Rigorous OS and Networking guides' }
    ],
    order: 5,
    status: 'upcoming'
  },
  {
    id: 'phase-6',
    phaseNumber: 6,
    title: 'Interview Foundations & Applications Prep',
    startDate: '2028-01-01',
    endDate: '2028-03-31',
    objective: 'Reach 80–120 cumulative algorithm problems and prepare technical resume and portfolio.',
    topics: [
      'Advanced DSA: Graphs (Dijkstra, Topological Sort), Dynamic Programming',
      'System design basics: Load balancers, caching (Redis), replication, CDN',
      'Technical resume targeting international internship & junior criteria',
      'GitHub portfolio curation & clear project narratives',
      'Eligibility verification for candidates residing in Nepal'
    ],
    taskIds: [
      'task-p6-01', 'task-p6-02', 'task-p6-03', 'task-p6-04', 'task-p6-05',
      'task-p6-06'
    ],
    milestoneIds: ['ms-p6-1'],
    completionCriteria: [
      'Complete 80–120 verified algorithm problems with optimal time/space complexity',
      'Produce polished 1-page software engineering resume',
      'Map list of international companies hiring remote or sponsoring relocation'
    ],
    recommendedResources: [
      { title: 'Microsoft Interview Tips', url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html' },
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }
    ],
    order: 6,
    status: 'upcoming'
  },
  {
    id: 'phase-7',
    phaseNumber: 7,
    title: 'Real Engineering Experience',
    startDate: '2028-04-01',
    endDate: '2028-06-30',
    objective: 'Obtain real engineering experience through internship, university research, or production open-source work.',
    topics: [
      'Systematic internship & research applications',
      'Technical phone screens & live coding practice',
      'Code reviews & production debugging',
      'Iterative refinement based on application & interview feedback'
    ],
    taskIds: [
      'task-p7-01', 'task-p7-02', 'task-p7-03', 'task-p7-04', 'task-p7-05'
    ],
    milestoneIds: ['ms-p7-1'],
    completionCriteria: [
      'Active submissions to eligible opportunities',
      'Perform weekly live interview practice',
      'Document all feedback and address identified gaps'
    ],
    recommendedResources: [
      { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/' }
    ],
    order: 7,
    status: 'upcoming'
  },
  {
    id: 'phase-8',
    phaseNumber: 8,
    title: 'Targeted Interview Preparation',
    startDate: '2028-07-01',
    endDate: '2028-09-30',
    objective: 'Sharpen timed problem solving, mock technical interviews, and behavioral communication.',
    topics: [
      'Timed 30-45 minute coding rounds',
      'Behavioral questions using STAR method',
      'System design whiteboard walkthroughs',
      'Debugging & edge-case testing under time pressure'
    ],
    taskIds: [
      'task-p8-01', 'task-p8-02', 'task-p8-03', 'task-p8-04', 'task-p8-05'
    ],
    milestoneIds: ['ms-p8-1'],
    completionCriteria: [
      'Solve 2–4 timed problems weekly explaining thought process out loud',
      'Conduct weekly mock interviews with peers or mentors',
      'Master walkthroughs of past portfolio architecture decisions'
    ],
    recommendedResources: [
      { title: 'Pramp Mock Interviews', url: 'https://www.pramp.com/' }
    ],
    order: 8,
    status: 'upcoming'
  },
  {
    id: 'phase-9',
    phaseNumber: 9,
    title: 'Applications & Transition to Work',
    startDate: '2028-10-01',
    endDate: '2028-12-31',
    objective: 'Execute focused international applications for junior and new-grad roles for 2028–2029 hiring.',
    topics: [
      'Continuous application pipeline tracking',
      'Online assessments & take-home projects',
      'Final round interviews & technical presentations',
      'Offer evaluations, negotiation & visa logistics'
    ],
    taskIds: [
      'task-p9-01', 'task-p9-02', 'task-p9-03', 'task-p9-04', 'task-p9-05'
    ],
    milestoneIds: ['ms-p9-1'],
    completionCriteria: [
      'Maintain active pipeline of targeted job applications with tracked statuses',
      'Complete assessments and technical rounds systematically',
      'Transition into competitive entry-level software engineer readiness'
    ],
    recommendedResources: [
      { title: 'Levels.fyi', url: 'https://www.levels.fyi/' }
    ],
    order: 9,
    status: 'upcoming'
  }
]

export const SEED_TASKS: RoadmapTask[] = [
  // --- Phase 1: 7-Day Initial Checklist (Scheduled Oct 20 - Oct 26, 2026) ---
  {
    id: 'task-p1-01',
    phaseId: 'phase-1',
    title: 'Verify JDK, IntelliJ IDEA, Git, and GitHub; create java-foundations repository',
    description: 'Verify Java 21 JDK installation, configure IntelliJ IDEA with code formatting, check git credentials, and initialize a public java-foundations repository on GitHub with a clear README.',
    category: 'Learning',
    estimatedMinutes: 30,
    targetDate: '2026-10-20',
    scheduledDate: '2026-10-20',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-02',
    phaseId: 'phase-1',
    title: 'Practise variables, input/output, conditionals, and loops with 5 exercises',
    description: 'Write 5 small Java console programs practicing primitive types, Scanner input, switch expressions, while/for loops, and accumulator patterns.',
    category: 'Learning',
    estimatedMinutes: 45,
    targetDate: '2026-10-21',
    scheduledDate: '2026-10-21',
    status: 'not_started',
    priority: 'normal',
    projectId: 'proj-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-03',
    phaseId: 'phase-1',
    title: 'Practise methods, arrays, and strings with 5 exercises',
    description: 'Solve 5 focused exercises: string manipulation, array reversal, element search, method decomposition, and pass-by-value demonstration in Java.',
    category: 'Learning',
    estimatedMinutes: 45,
    targetDate: '2026-10-22',
    scheduledDate: '2026-10-22',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-04',
    phaseId: 'phase-1',
    title: 'Learn classes, objects, and encapsulation; model an expense record',
    description: 'Design the Expense class with encapsulated fields (id, description, amount, category, date), constructor validation, getters, and a formatted toString method.',
    category: 'Projects',
    estimatedMinutes: 60,
    targetDate: '2026-10-23',
    scheduledDate: '2026-10-23',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-05',
    phaseId: 'phase-1',
    title: 'Build basic command-line expense tracker (Add, List, Total)',
    description: 'Implement an interactive menu loop supporting: 1) Add expense, 2) List all expenses with formatted columns, 3) Calculate total spent.',
    category: 'Projects',
    estimatedMinutes: 60,
    targetDate: '2026-10-24',
    scheduledDate: '2026-10-24',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-06',
    phaseId: 'phase-1',
    title: 'Add input validation, error handling, file persistence, and tests',
    description: 'Handle invalid user inputs gracefully, save and reload expenses from a CSV or JSON file, and write JUnit unit tests for the expense manager logic.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2026-10-25',
    scheduledDate: '2026-10-25',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-07',
    phaseId: 'phase-1',
    title: 'Review code, write README, publish project, and plan next week',
    description: 'Refactor code for clean architecture, write setup & execution instructions in README.md with sample output screenshots, push to GitHub, and set weekly goals.',
    category: 'Projects',
    estimatedMinutes: 45,
    targetDate: '2026-10-26',
    scheduledDate: '2026-10-26',
    status: 'not_started',
    priority: 'normal',
    projectId: 'proj-1',
    milestoneId: 'ms-p1-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  // --- Phase 1: Remainder of Phase 1 (Nov - Dec 2026) ---
  {
    id: 'task-p1-08',
    phaseId: 'phase-1',
    title: 'Master Java Collections Framework (List, Set, Map)',
    description: 'Study ArrayList vs LinkedList, HashSet vs TreeSet, HashMap vs TreeMap. Implement practical exercises using each.',
    category: 'Learning',
    estimatedMinutes: 90,
    targetDate: '2026-11-08',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-09',
    phaseId: 'phase-1',
    title: 'Study OOP: Inheritance, Interfaces, and Abstract Classes',
    description: 'Understand polymorphism, interface contracts, abstract base classes, and composition over inheritance through small domain models.',
    category: 'Learning',
    estimatedMinutes: 90,
    targetDate: '2026-11-20',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-10',
    phaseId: 'phase-1',
    title: 'Deep dive into Java Generics and Exceptions',
    description: 'Learn generic classes and methods, bounded wildcards, custom checked vs unchecked exceptions, and try-with-resources patterns.',
    category: 'Learning',
    estimatedMinutes: 60,
    targetDate: '2026-12-05',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-11',
    phaseId: 'phase-1',
    title: 'Unit testing with JUnit 5 and AssertJ',
    description: 'Write robust unit test suites covering edge cases, parameterized tests, exception verification, and test lifecycle.',
    category: 'Learning',
    estimatedMinutes: 60,
    targetDate: '2026-12-15',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-12',
    phaseId: 'phase-1',
    title: 'Enhance Expense Tracker with category budgeting and monthly reports',
    description: 'Add monthly breakdown calculations, category budget limits with alerts, and structured data export.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2026-12-25',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-1',
    milestoneId: 'ms-p1-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p1-13',
    phaseId: 'phase-1',
    title: 'Phase 1 Comprehensive Review & Git hygiene audit',
    description: 'Audit repository commits, verify automated build with Maven/Gradle, and verify readiness for Data Structures in January.',
    category: 'Learning',
    estimatedMinutes: 60,
    targetDate: '2026-12-30',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 2: DSA (Jan - Mar 2027) ---
  {
    id: 'task-p2-01',
    phaseId: 'phase-2',
    title: 'Big-O notation, time and space complexity analysis',
    description: 'Learn asymptotic analysis: worst, average, and best-case performance for arrays, lists, maps, and common algorithms.',
    category: 'DSA',
    estimatedMinutes: 60,
    targetDate: '2027-01-08',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-02',
    phaseId: 'phase-2',
    title: 'Array and String manipulation patterns (10 problems)',
    description: 'Solve fundamental problems: Two Sum, Contains Duplicate, Valid Anagram, Group Anagrams, Top K Frequent Elements.',
    category: 'DSA',
    estimatedMinutes: 120,
    targetDate: '2027-01-18',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-03',
    phaseId: 'phase-2',
    title: 'Two Pointers and Sliding Window techniques (10 problems)',
    description: 'Solve Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters.',
    category: 'DSA',
    estimatedMinutes: 120,
    targetDate: '2027-01-31',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-04',
    phaseId: 'phase-2',
    title: 'Stack and Queue implementations and applications (8 problems)',
    description: 'Solve Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation, Daily Temperatures, Implement Queue using Stacks.',
    category: 'DSA',
    estimatedMinutes: 90,
    targetDate: '2027-02-12',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-05',
    phaseId: 'phase-2',
    title: 'Linked List operations and cycle detection (8 problems)',
    description: 'Implement singly linked list from scratch. Solve Reverse Linked List, Merge Two Sorted Lists, Reorder List, Linked List Cycle.',
    category: 'DSA',
    estimatedMinutes: 90,
    targetDate: '2027-02-22',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-06',
    phaseId: 'phase-2',
    title: 'Binary Search variants and boundary conditions (8 problems)',
    description: 'Master standard binary search, Search a 2D Matrix, Koko Eating Bananas, Find Minimum in Rotated Sorted Array.',
    category: 'DSA',
    estimatedMinutes: 90,
    targetDate: '2027-03-05',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-07',
    phaseId: 'phase-2',
    title: 'Binary Trees, BFS, DFS, and BST validation (10 problems)',
    description: 'Solve Invert Binary Tree, Maximum Depth of Binary Tree, Same Tree, Subtree of Another Tree, Lowest Common Ancestor of a BST.',
    category: 'DSA',
    estimatedMinutes: 120,
    targetDate: '2027-03-18',
    status: 'not_started',
    priority: 'important',
    milestoneId: 'ms-p2-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-08',
    phaseId: 'phase-2',
    title: 'Heaps and Priority Queues (5 problems)',
    description: 'Understand Min-Heap/Max-Heap array representation. Solve Kth Largest Element in an Array, Last Stone Weight.',
    category: 'DSA',
    estimatedMinutes: 60,
    targetDate: '2027-03-25',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-09',
    phaseId: 'phase-2',
    title: 'Algorithm Revision: Re-solve flagged "needs revision" problems',
    description: 'Re-test problems solved with assistance or marked for revision to ensure independent recall and optimal space-time tradeoffs.',
    category: 'DSA',
    estimatedMinutes: 90,
    targetDate: '2027-03-29',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p2-10',
    phaseId: 'phase-2',
    title: 'Milestone 2 Audit: Verify 40–60 independently solved problems',
    description: 'Verify problem counts, log explanations, complexity notes, and benchmark progress in Algorithm Problem Tracker.',
    category: 'DSA',
    estimatedMinutes: 45,
    targetDate: '2027-03-31',
    status: 'not_started',
    priority: 'normal',
    milestoneId: 'ms-p2-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 3: Backend Engineering (Apr - Jun 2027) ---
  {
    id: 'task-p3-01',
    phaseId: 'phase-3',
    title: 'HTTP, REST principles, JSON data formats, and status codes',
    description: 'Learn REST constraints, idempotency, HTTP methods (GET, POST, PUT, PATCH, DELETE), headers, and status code conventions.',
    category: 'Learning',
    estimatedMinutes: 60,
    targetDate: '2027-04-10',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-02',
    phaseId: 'phase-3',
    title: 'PostgreSQL schema design, constraints, and joins with SQLBolt',
    description: 'Design 3NF relational schemas with primary/foreign keys, unique constraints, and indexes. Practice inner, left, and outer joins.',
    category: 'Learning',
    estimatedMinutes: 90,
    targetDate: '2027-04-20',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-03',
    phaseId: 'phase-3',
    title: 'Spring Boot initialization and layered architecture setup',
    description: 'Set up Spring Boot with Web, Validation, Data JPA, and PostgreSQL driver. Configure controller, service, repository, and DTO layers.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-04-30',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-04',
    phaseId: 'phase-3',
    title: 'Implement CRUD operations with Spring Data JPA and Hibernate',
    description: 'Build user and task entity models, repository query methods, transactional service methods, and pagination/filtering.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2027-05-15',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-05',
    phaseId: 'phase-3',
    title: 'Global exception handling and Bean Validation',
    description: 'Configure @ControllerAdvice with custom ProblemDetail error responses for entity not found, validation errors, and server errors.',
    category: 'Projects',
    estimatedMinutes: 60,
    targetDate: '2027-05-25',
    status: 'not_started',
    priority: 'normal',
    projectId: 'proj-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-06',
    phaseId: 'phase-3',
    title: 'Authentication & authorization with Spring Security & JWT',
    description: 'Implement user registration, password hashing with BCrypt, JWT token issuing, and role/ownership security checks on protected routes.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2027-06-08',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-07',
    phaseId: 'phase-3',
    title: 'Automated integration tests with MockMvc and Testcontainers',
    description: 'Write integration test suite running against real PostgreSQL Testcontainers instance verifying auth and CRUD flows.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-06-20',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    milestoneId: 'ms-p3-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p3-08',
    phaseId: 'phase-3',
    title: 'Deploy backend API to cloud provider with OpenAPI docs',
    description: 'Generate Swagger/OpenAPI documentation. Deploy application and managed PostgreSQL to Render/Railway/Fly.io. Write deployment instructions.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-06-30',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-2',
    milestoneId: 'ms-p3-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 4: Production Practices (Jul - Sep 2027) ---
  {
    id: 'task-p4-01',
    phaseId: 'phase-4',
    title: 'Linux shell proficiency & bash scripting for builds',
    description: 'Practice Unix permission models, process management, log inspection with grep/sed/awk, and write build helper scripts.',
    category: 'CS fundamentals',
    estimatedMinutes: 60,
    targetDate: '2027-07-15',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-02',
    phaseId: 'phase-4',
    title: 'Containerize backend and database with Docker & Compose',
    description: 'Write multi-stage Dockerfiles producing minimal JRE runtime images. Configure docker-compose.yml for local multi-service testing.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-07-30',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-3',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-03',
    phaseId: 'phase-4',
    title: 'Design Drone Lap-Timing & Event Management data architecture',
    description: 'Model events, participants, drone classes, RFID/optical transponder lap-times, leaderboards, and user role permissions.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2027-08-15',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-3',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-04',
    phaseId: 'phase-4',
    title: 'Implement fast lap-time recording and real-time leaderboards',
    description: 'Implement precise millisecond lap tracking, ranking calculations, penalty adjustments, and CSV/JSON export endpoints.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2027-08-30',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-3',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-05',
    phaseId: 'phase-4',
    title: 'Configure automated CI/CD pipeline with GitHub Actions',
    description: 'Automate linting, unit tests, integration tests, container image build, and automated push to Docker registry.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-09-12',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-3',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-06',
    phaseId: 'phase-4',
    title: 'Add structured JSON logging, health indicators, and rate limiting',
    description: 'Configure Spring Actuator health checks, SLF4J structured logging, and bucket4j API rate limiting for abuse prevention.',
    category: 'Projects',
    estimatedMinutes: 60,
    targetDate: '2027-09-22',
    status: 'not_started',
    priority: 'normal',
    projectId: 'proj-3',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p4-07',
    phaseId: 'phase-4',
    title: 'Deploy Drone App and write comprehensive architectural README',
    description: 'Deploy live application, provide architecture diagram, curl test instructions, and verify public portfolio visibility.',
    category: 'Projects',
    estimatedMinutes: 90,
    targetDate: '2027-09-30',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-3',
    milestoneId: 'ms-p4-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 5: CS Fundamentals & Collaboration (Oct - Dec 2027) ---
  {
    id: 'task-p5-01',
    phaseId: 'phase-5',
    title: 'Operating systems: Process lifecycle, threads, and CPU scheduling',
    description: 'Study process memory layout, context switching, scheduling algorithms, and IPC mechanisms.',
    category: 'CS fundamentals',
    estimatedMinutes: 60,
    targetDate: '2027-10-15',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p5-02',
    phaseId: 'phase-5',
    title: 'Concurrency in practice: Race conditions, deadlocks, and atomics',
    description: 'Implement multithreaded simulations in Java using synchronized, ReentrantLock, CountDownLatch, and AtomicInteger.',
    category: 'CS fundamentals',
    estimatedMinutes: 90,
    targetDate: '2027-10-31',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p5-03',
    phaseId: 'phase-5',
    title: 'Networking deep dive: TCP handshake, DNS, TLS 1.3, HTTP/2',
    description: 'Analyze Wireshark packet captures of HTTP/HTTPS requests. Explain connection establishment, latency, and socket programming.',
    category: 'CS fundamentals',
    estimatedMinutes: 90,
    targetDate: '2027-11-15',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p5-04',
    phaseId: 'phase-5',
    title: 'Database query execution plans, B-Tree indexes, and isolation levels',
    description: 'Run EXPLAIN ANALYZE on complex PostgreSQL queries, test index scans vs seq scans, and observe dirty read / phantom read phenomena under isolation levels.',
    category: 'CS fundamentals',
    estimatedMinutes: 90,
    targetDate: '2027-11-30',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p5-05',
    phaseId: 'phase-5',
    title: 'Open-source or team collaboration: Contribute PR or lead team feature',
    description: 'Triage open issues in a popular open-source Java/Spring/Dev tool or collaborate with peers on a team project with PR reviews.',
    category: 'Career',
    estimatedMinutes: 120,
    targetDate: '2027-12-15',
    status: 'not_started',
    priority: 'important',
    projectId: 'proj-4',
    milestoneId: 'ms-p5-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p5-06',
    phaseId: 'phase-5',
    title: 'Complete portfolio technical audit: Code quality, docs, and demo links',
    description: 'Verify 3 tier projects: CLI tool, backend REST API, and deployed full application. Ensure live links, tests, and documentation are pristine.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2027-12-30',
    status: 'not_started',
    priority: 'normal',
    milestoneId: 'ms-p5-2',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 6: Interview Foundations (Jan - Mar 2028) ---
  {
    id: 'task-p6-01',
    phaseId: 'phase-6',
    title: 'Advanced DSA: Graph representations, BFS, DFS, and topological sort',
    description: 'Solve Course Schedule, Number of Islands, Clone Graph, Pacific Atlantic Water Flow.',
    category: 'DSA',
    estimatedMinutes: 120,
    targetDate: '2028-01-20',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p6-02',
    phaseId: 'phase-6',
    title: 'Dynamic Programming patterns: 1D and 2D memoization',
    description: 'Solve Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence, Unique Paths.',
    category: 'DSA',
    estimatedMinutes: 120,
    targetDate: '2028-02-10',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p6-03',
    phaseId: 'phase-6',
    title: 'System Design basics: Caching, load balancers, database replication',
    description: 'Study horizontal vs vertical scaling, Redis caching strategies (cache-aside, write-through), CAP theorem, and single points of failure.',
    category: 'CS fundamentals',
    estimatedMinutes: 90,
    targetDate: '2028-02-25',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p6-04',
    phaseId: 'phase-6',
    title: 'Build concise, high-impact Software Engineering resume',
    description: 'Write 1-page resume highlighting projects, measurable impact, tech stack, education, and links. Avoid generic summaries.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-03-10',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p6-05',
    phaseId: 'phase-6',
    title: 'Verify international opportunity eligibility for Nepal candidates',
    description: 'Research internship and new-grad roles open to remote work from Nepal or providing visa sponsorship (e.g. EU, UK, Singapore, US programs).',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-03-20',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p6-06',
    phaseId: 'phase-6',
    title: 'Cumulative Algorithm Milestone: 80–120 problems verified',
    description: 'Verify cumulative 80-120 solved problems with solid conceptual understanding and repeatable solutions.',
    category: 'DSA',
    estimatedMinutes: 60,
    targetDate: '2028-03-31',
    status: 'not_started',
    priority: 'important',
    milestoneId: 'ms-p6-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 7: Real Experience (Apr - Jun 2028) ---
  {
    id: 'task-p7-01',
    phaseId: 'phase-7',
    title: 'Submit applications for Summer internships and research software roles',
    description: 'Apply consistently to validated eligible positions. Customize application notes and record each submission in the Application Tracker.',
    category: 'Career',
    estimatedMinutes: 90,
    targetDate: '2028-04-15',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p7-02',
    phaseId: 'phase-7',
    title: 'Weekly peer or mentor mock technical interviews',
    description: 'Conduct live coding sessions over Zoom or Pramp, explaining thought process under pressure and handling edge cases.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-05-01',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p7-03',
    phaseId: 'phase-7',
    title: 'Complete production feature in team codebase or client project',
    description: 'Deliver tested, reviewed PR in a team project with active pull requests and adherence to styling guidelines.',
    category: 'Projects',
    estimatedMinutes: 120,
    targetDate: '2027-05-20',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p7-04',
    phaseId: 'phase-7',
    title: 'Incorporate interview and code review feedback into weak areas',
    description: 'Identify conceptual stumbling blocks from recent practice and spend focused sessions strengthening them.',
    category: 'Learning',
    estimatedMinutes: 60,
    targetDate: '2028-06-10',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p7-05',
    phaseId: 'phase-7',
    title: 'Phase 7 Experience review: Outcomes and learnings',
    description: 'Summarize work completed in internship, research, or substantial open-source initiative.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-06-30',
    status: 'not_started',
    priority: 'important',
    milestoneId: 'ms-p7-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 8: Targeted Interview Prep (Jul - Sep 2028) ---
  {
    id: 'task-p8-01',
    phaseId: 'phase-8',
    title: 'Solve 2–4 timed 45-minute coding problems weekly',
    description: 'Simulate real interview conditions: no IDE auto-complete, 45-minute timer, testing edge cases before running code.',
    category: 'DSA',
    estimatedMinutes: 90,
    targetDate: '2028-07-20',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p8-02',
    phaseId: 'phase-8',
    title: 'Prepare STAR stories for behavioral interviews',
    description: 'Draft 6 structured STAR narratives: leadership, disagreement, handling failure, technical setback, tight deadline, collaboration.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-08-05',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p8-03',
    phaseId: 'phase-8',
    title: 'Practice 4 end-to-end System Design architectures',
    description: 'Design URL shortener, Rate Limiter, Notification Service, and Drone Telemetry Ingestion. Practice API, data model, scale estimation.',
    category: 'CS fundamentals',
    estimatedMinutes: 90,
    targetDate: '2028-08-25',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p8-04',
    phaseId: 'phase-8',
    title: 'Walkthrough practice for all portfolio project architectures',
    description: 'Rehearse presenting portfolio projects in 5 minutes: problem, trade-offs, tech choices, testing strategy, challenges overcome.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-09-15',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p8-05',
    phaseId: 'phase-8',
    title: 'Final technical readiness simulation & mock assessment',
    description: 'Complete full mock technical loop (Coding + System Design + Behavioral). Verify confidence explaining solutions clearly.',
    category: 'Career',
    estimatedMinutes: 90,
    targetDate: '2028-09-30',
    status: 'not_started',
    priority: 'important',
    milestoneId: 'ms-p8-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },

  // --- Phase 9: Applications & Transition (Oct - Dec 2028) ---
  {
    id: 'task-p9-01',
    phaseId: 'phase-9',
    title: 'Launch targeted applications for 2028-2029 international roles',
    description: 'Submit tailored applications to vetted global engineering teams hiring for remote or visa sponsorship roles.',
    category: 'Career',
    estimatedMinutes: 90,
    targetDate: '2028-10-15',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p9-02',
    phaseId: 'phase-9',
    title: 'Complete online coding assessments (OAs) within 48h of receipt',
    description: 'Maintain high standards on HackerRank/Codility tests with clean, optimal complexity code and tests.',
    category: 'Career',
    estimatedMinutes: 90,
    targetDate: '2028-11-01',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p9-03',
    phaseId: 'phase-9',
    title: 'Execute technical rounds, live interviews, and onsite presentations',
    description: 'Engage actively with interviewers, communicate assumptions, handle hints constructively, and ask meaningful questions.',
    category: 'Career',
    estimatedMinutes: 120,
    targetDate: '2028-11-20',
    status: 'not_started',
    priority: 'important',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p9-04',
    phaseId: 'phase-9',
    title: 'Evaluate offers, relocation packages, and career progression paths',
    description: 'Analyze compensation, growth mentorship, visa details, and technology stack before signing.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-12-10',
    status: 'not_started',
    priority: 'normal',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'task-p9-05',
    phaseId: 'phase-9',
    title: 'Culmination: Competitive readiness for international software engineering roles',
    description: 'Roadmap complete: fully verified foundational coding, algorithmic mastery, backend systems, cloud deployment, and engineering rigor.',
    category: 'Career',
    estimatedMinutes: 60,
    targetDate: '2028-12-31',
    status: 'not_started',
    priority: 'important',
    milestoneId: 'ms-p9-1',
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  }
]

export const SEED_MILESTONES: Milestone[] = [
  {
    id: 'ms-p1-1',
    phaseId: 'phase-1',
    title: '7-Day Foundations Sprint: CLI Expense Tracker v1',
    description: 'Initial 7-day checklist completed with a working command-line expense tracker.',
    completionCriteria: [
      'Verified Java JDK, IDE, and Git repository setup',
      'Input validation and structured error handling implemented',
      'Working file persistence (CSV or JSON)',
      'Automated unit tests with JUnit passing',
      'Published on GitHub with clear documentation'
    ],
    targetDate: '2026-10-26',
    status: 'pending'
  },
  {
    id: 'ms-p1-2',
    phaseId: 'phase-1',
    title: 'Java Programming Foundations Mastery',
    description: 'Can independently write, debug, and test OOP applications in Java.',
    completionCriteria: [
      'Comprehensive understanding of Java Collections (List, Set, Map)',
      'Clean object-oriented modeling with encapsulation and inheritance',
      'Consistent Git commit history across projects',
      'Expense Tracker enhanced with monthly reports and budgeting'
    ],
    targetDate: '2026-12-31',
    status: 'pending'
  },
  {
    id: 'ms-p2-1',
    phaseId: 'phase-2',
    title: 'Core Algorithm Patterns Mastery',
    description: 'Independent competence across two pointers, sliding window, binary search, and trees.',
    completionCriteria: [
      'Mastered time and space complexity explanations',
      'At least 25 problems solved independently without hints',
      'Clean implementations of DFS, BFS, and binary search boundaries'
    ],
    targetDate: '2027-02-28',
    status: 'pending'
  },
  {
    id: 'ms-p2-2',
    phaseId: 'phase-2',
    title: 'DSA Milestone: 40–60 Verified Problems',
    description: 'Complete 40–60 well-understood algorithm problems logged in tracker.',
    completionCriteria: [
      '40 to 60 algorithm problems solved and documented',
      'All problems solved with help categorized in revision list',
      'Re-solved flagged problems independently'
    ],
    targetDate: '2027-03-31',
    status: 'pending'
  },
  {
    id: 'ms-p3-1',
    phaseId: 'phase-3',
    title: 'Complete Spring Boot Backend API with PostgreSQL',
    description: 'A production-grade REST API with relational persistence, JWT security, and automated tests.',
    completionCriteria: [
      'REST API built with Spring Boot',
      'PostgreSQL database integrated with relational schema',
      'Authentication and per-user authorization implemented',
      'Automated unit and integration tests passing'
    ],
    targetDate: '2027-06-20',
    status: 'pending'
  },
  {
    id: 'ms-p3-2',
    phaseId: 'phase-3',
    title: 'First Deployed Backend API',
    description: 'Deployed study/task management API accessible online with Swagger docs.',
    completionCriteria: [
      'Application deployed to cloud host (Render/Railway/Fly.io)',
      'Live PostgreSQL database connected',
      'README includes setup instructions and API documentation',
      'Publicly testable via Postman or OpenAPI/Swagger UI'
    ],
    targetDate: '2027-06-30',
    status: 'pending'
  },
  {
    id: 'ms-p4-1',
    phaseId: 'phase-4',
    title: 'Shipped Drone Lap-Timing Portfolio Application',
    description: 'Containerized, CI/CD-tested drone lap-timing application running in production.',
    completionCriteria: [
      'Multi-stage Dockerfile and docker-compose setup',
      'Automated GitHub Actions CI/CD pipeline',
      'Leaderboards and lap calculations with millisecond precision',
      'Deployed application with live demo and architecture README'
    ],
    targetDate: '2027-09-30',
    status: 'pending'
  },
  {
    id: 'ms-p5-1',
    phaseId: 'phase-5',
    title: 'Open-Source or Team Engineering Contribution',
    description: 'Substantial collaborative engineering evidence on public GitHub repository.',
    completionCriteria: [
      'Meaningful pull request accepted into open-source or team project',
      'Participated in peer code reviews and architectural discussions',
      'Demonstrated collaborative Git branching workflows'
    ],
    targetDate: '2027-12-15',
    status: 'pending'
  },
  {
    id: 'ms-p5-2',
    phaseId: 'phase-5',
    title: 'Three-Tier Portfolio Audit Complete',
    description: 'Three completed, documented, and test-covered projects in portfolio.',
    completionCriteria: [
      'One small polished CLI project (Expense Tracker)',
      'One complete deployed backend API (Task API)',
      'One larger deployed containerized application (Drone Lap-Timer)',
      'All GitHub repositories have documentation, architecture diagrams, and tests'
    ],
    targetDate: '2027-12-31',
    status: 'pending'
  },
  {
    id: 'ms-p6-1',
    phaseId: 'phase-6',
    title: 'Interview Foundations & Cumulative DSA Milestone (80–120 Problems)',
    description: 'Cumulative algorithm milestone achieved with technical resume ready for applications.',
    completionCriteria: [
      '80–120 verified algorithm problems solved cumulatively',
      '1-page software engineering resume audited and finalized',
      'List of international programs accepting Nepal residents documented'
    ],
    targetDate: '2028-03-31',
    status: 'pending'
  },
  {
    id: 'ms-p7-1',
    phaseId: 'phase-7',
    title: 'Real Engineering Experience Secured or Completed',
    description: 'Internship, academic research software role, or substantial production client work.',
    completionCriteria: [
      'Substantial real-world engineering contributions delivered',
      'Documented feedback from senior developers or mentors',
      'Strengthened key identified technical weak spots'
    ],
    targetDate: '2028-06-30',
    status: 'pending'
  },
  {
    id: 'ms-p8-1',
    phaseId: 'phase-8',
    title: 'Technical Interview Readiness',
    description: 'Consistently passing timed mock coding and system design interviews.',
    completionCriteria: [
      'Solved timed unseen problems while communicating clearly out loud',
      'STAR behavioral stories polished and practiced',
      'Can design scalable architectures on virtual whiteboard with tradeoffs'
    ],
    targetDate: '2028-09-30',
    status: 'pending'
  },
  {
    id: 'ms-p9-1',
    phaseId: 'phase-9',
    title: 'International Software Engineering Competitiveness Achieved',
    description: 'Roadmap complete: prepared for 2028-2029 entry-level international hiring.',
    completionCriteria: [
      'Active application pipeline with tracked interview stages',
      'Passed technical screens and assessments',
      'Fully prepared candidate with production portfolio and algorithmic competence'
    ],
    targetDate: '2028-12-31',
    status: 'pending'
  }
]

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Command-Line Expense Tracker',
    description: 'A clean, robust CLI application in Java for logging personal expenses, category totals, input validation, and file persistence.',
    status: 'in_progress',
    startDate: '2026-10-20',
    targetDate: '2026-10-26',
    repositoryUrl: 'https://github.com/iamut/java-foundations',
    phaseId: 'phase-1',
    taskIds: ['task-p1-04', 'task-p1-05', 'task-p1-06', 'task-p1-07', 'task-p1-12'],
    features: [
      { id: 'f-1', title: 'Interactive console menu with input validation', completed: false },
      { id: 'f-2', title: 'Add, edit, list, and delete expenses', completed: false },
      { id: 'f-3', title: 'Calculate overall and category-specific totals', completed: false },
      { id: 'f-4', title: 'File persistence (CSV/JSON)', completed: false },
      { id: 'f-5', title: 'Automated JUnit 5 test suite', completed: false },
      { id: 'f-6', title: 'Clean README with setup and sample outputs', completed: false }
    ],
    notes: 'Starting project of the roadmap. Focus on strong OOP encapsulation, clean code, and zero runtime crashes on bad user input.'
  },
  {
    id: 'proj-2',
    name: 'Study/Task Management Backend API',
    description: 'Production-ready RESTful API built with Java, Spring Boot, Spring Security (JWT), and PostgreSQL.',
    status: 'planned',
    startDate: '2027-04-01',
    targetDate: '2027-06-30',
    phaseId: 'phase-3',
    taskIds: ['task-p3-02', 'task-p3-03', 'task-p3-04', 'task-p3-05', 'task-p3-06', 'task-p3-07', 'task-p3-08'],
    features: [
      { id: 'f-21', title: 'JWT User registration and authentication', completed: false },
      { id: 'f-22', title: 'Per-user task and study log authorization', completed: false },
      { id: 'f-23', title: 'PostgreSQL database with indexed relations', completed: false },
      { id: 'f-24', title: 'Pagination, sorting, and status filtering', completed: false },
      { id: 'f-25', title: 'Integration tests with Testcontainers', completed: false },
      { id: 'f-26', title: 'Swagger/OpenAPI documentation and Cloud deployment', completed: false }
    ],
    notes: 'Demonstrates core backend competence: HTTP, security, database design, and automated testing.'
  },
  {
    id: 'proj-3',
    name: 'Drone Lap-Timing & Event Management',
    description: 'Full-stack application for managing drone racing events, transponder lap-times, leaderboards, and telemetry data export.',
    status: 'planned',
    startDate: '2027-07-01',
    targetDate: '2027-09-30',
    phaseId: 'phase-4',
    taskIds: ['task-p4-02', 'task-p4-03', 'task-p4-04', 'task-p4-05', 'task-p4-06', 'task-p4-07'],
    features: [
      { id: 'f-31', title: 'Event management & heat generation', completed: false },
      { id: 'f-32', title: 'Millisecond-precision lap-time recording', completed: false },
      { id: 'f-33', title: 'Live leaderboard rankings and penalty management', completed: false },
      { id: 'f-34', title: 'Data export in CSV and JSON formats', completed: false },
      { id: 'f-35', title: 'Multi-stage Docker containerization', completed: false },
      { id: 'f-36', title: 'GitHub Actions CI/CD pipeline and cloud deployment', completed: false }
    ],
    notes: 'Bridges personal domain passion in drone engineering with production backend and DevOps practices.'
  },
  {
    id: 'proj-4',
    name: 'Open-Source or Collaborative Team Project',
    description: 'Direct engineering contribution to a public open-source project or substantial collaborative team software build.',
    status: 'planned',
    startDate: '2027-10-01',
    targetDate: '2027-12-31',
    phaseId: 'phase-5',
    taskIds: ['task-p5-05'],
    features: [
      { id: 'f-41', title: 'Codebase triage and issue identification', completed: false },
      { id: 'f-42', title: 'Fork, branch, and implementation of requested feature/bugfix', completed: false },
      { id: 'f-43', title: 'Thorough unit/integration tests for proposed changes', completed: false },
      { id: 'f-44', title: 'Pull Request submission and constructive code review resolution', completed: false },
      { id: 'f-45', title: 'Merged PR into production codebase', completed: false }
    ],
    notes: 'Proves capability to read unfamiliar large codebases and collaborate effectively with other engineers.'
  }
]

export const SEED_RESOURCES: ResourceItem[] = [
  {
    id: 'res-java',
    title: 'Dev.java Learn',
    topic: 'Java',
    description: 'The official Oracle Java learning platform covering modern Java 17/21 language features, syntax, and libraries.',
    url: 'https://dev.java/learn/',
    requiresInternet: true,
    status: 'in_progress',
    notes: 'Primary reference for standard Java syntax and modern APIs.'
  },
  {
    id: 'res-spring',
    title: 'Spring Boot Guides',
    topic: 'Spring Boot',
    description: 'Official hands-on guides from the Spring team for building REST services, data persistence, and security.',
    url: 'https://spring.io/guides',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-sql',
    title: 'SQLBolt Practice',
    topic: 'SQL practice',
    description: 'Interactive in-browser SQL lessons covering queries, joins, filtering, aggregations, and schema constraints.',
    url: 'https://sqlbolt.com/',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-git',
    title: 'Pro Git Book v2',
    topic: 'Git',
    description: 'Comprehensive, official guide to Git version control, branching models, internals, and remote repository hygiene.',
    url: 'https://git-scm.com/book/en/v2',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-backend',
    title: 'Backend Developer Roadmap',
    topic: 'Backend development roadmap',
    description: 'Visual step-by-step roadmap to becoming a modern backend engineer covering protocols, caching, and databases.',
    url: 'https://roadmap.sh/backend',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-neetcode',
    title: 'NeetCode Roadmap',
    topic: 'Data structures and algorithms',
    description: 'Structured visual problem roadmap grouping algorithm problems by patterns and difficulty.',
    url: 'https://neetcode.io/roadmap',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-msft',
    title: 'Technical Interviewing Guide',
    topic: 'Technical interview preparation',
    description: 'Official guidance from Microsoft engineers on preparing for coding interviews, problem solving, and communication.',
    url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html',
    requiresInternet: true,
    status: 'not_started'
  },
  {
    id: 'res-github-pack',
    title: 'GitHub Student Developer Pack',
    topic: 'GitHub Student Developer Pack',
    description: 'Free developer tools, domain credits, cloud access, and IDE licenses for enrolled students.',
    url: 'https://education.github.com/pack',
    requiresInternet: true,
    status: 'not_started',
    notes: 'Apply with university student email or student ID.'
  }
]

export const SEED_ALGORITHM_PROBLEMS: AlgorithmProblem[] = [
  {
    id: 'algo-1',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum/',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(N) space',
    solutionNotes: 'Use a hash map to store complement values (target - num) and their indices.',
    nextReviewDate: '2026-11-01'
  },
  {
    id: 'algo-2',
    title: 'Valid Anagram',
    url: 'https://leetcode.com/problems/valid-anagram/',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(1) space (26 chars)',
    solutionNotes: 'Count frequency of characters using integer frequency array or hash map.',
    nextReviewDate: '2026-11-05'
  },
  {
    id: 'algo-3',
    title: 'Best Time to Buy and Sell Stock',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    topic: 'Sliding Window',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(1) space',
    solutionNotes: 'Track minimum buy price seen so far while computing potential profit at each day.',
    nextReviewDate: '2026-11-10'
  },
  {
    id: 'algo-4',
    title: 'Valid Parentheses',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    topic: 'Stack',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(N) space',
    solutionNotes: 'Push matching closing brackets onto a stack when open brackets appear; verify top on close.',
    nextReviewDate: '2026-11-15'
  },
  {
    id: 'algo-5',
    title: 'Binary Search',
    url: 'https://leetcode.com/problems/binary-search/',
    topic: 'Binary Search',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(log N) time, O(1) space',
    solutionNotes: 'Maintain low and high pointers, calculate mid using low + (high - low) / 2 to avoid overflow.',
    nextReviewDate: '2026-11-20'
  },
  {
    id: 'algo-6',
    title: 'Reverse Linked List',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    topic: 'Linked List',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(1) space',
    solutionNotes: 'Iterative pointer manipulation using prev, curr, and next temp pointer.',
    nextReviewDate: '2026-11-25'
  },
  {
    id: 'algo-7',
    title: 'Invert Binary Tree',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    topic: 'Trees',
    difficulty: 'Easy',
    status: 'attempted',
    complexity: 'O(N) time, O(H) space',
    solutionNotes: 'Recursive swap of left and right child pointers down to leaf nodes.',
    nextReviewDate: '2026-12-01'
  },
  {
    id: 'algo-8',
    title: 'Maximum Subarray (Kadane)',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    status: 'attempted',
    complexity: 'O(N) time, O(1) space',
    solutionNotes: "Kadane's algorithm: maintain current running sum, resetting to 0 if negative, while updating max sum.",
    nextReviewDate: '2026-12-05'
  }
]
