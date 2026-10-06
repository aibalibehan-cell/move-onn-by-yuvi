/* ==========================================================================
   Move ONN Consultancy - Dedicated Jobs Page Controller (js/jobs.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Move ONN Controller
   Zero External Dependencies - 22 Verified Live Job Opportunities
   ========================================================================== */

const INITIAL_JOBS = [
  {
    "id": 1,
    "title": "Senior Full Stack Developer",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "3-6 Yrs",
    "salary": "₹ 14,00,000 - 24,00,000 PA",
    "location": "Bengaluru (Hybrid)",
    "city": "bengaluru",
    "workMode": "hybrid",
    "expYears": 4,
    "salaryNum": 18,
    "dept": "engineering",
    "posted": "1 Day Ago",
    "isHot": true,
    "skills": [
      "React.js",
      "Node.js",
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "AWS"
    ],
    "snippet": "Looking for an experienced Full Stack Engineer to lead web application architecture, API development, and cloud deployments using modern JavaScript frameworks.",
    "openings": 3,
    "applicants": 48,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Architect and develop high-performance, responsive web applications using React.js, Node.js, and TypeScript.</li>\n        <li>Design robust RESTful and GraphQL APIs integrated with PostgreSQL and cloud storage.</li>\n        <li>Collaborate with cross-functional teams to translate business requirements into scalable tech solutions.</li>\n        <li>Participate in code reviews, optimize database queries, and implement CI/CD pipelines.</li>\n      </ul>\n      <h4>Required Candidate Profile:</h4>\n      <ul>\n        <li>3 to 6 years of solid full-stack development experience.</li>\n        <li>Strong command over React, Next.js, Node.js, and modern ECMAScript standards.</li>\n        <li>Experience with Docker, AWS ECS/S3, and automated testing frameworks.</li>\n        <li>Bachelor's or Master's degree in Computer Science, IT, or equivalent.</li>\n      </ul>\n      <h4>Perks & Benefits:</h4>\n      <ul>\n        <li>Flexible hybrid work schedule (2 days office / 3 days remote).</li>\n        <li>Comprehensive health insurance covering parents and spouse.</li>\n        <li>Annual learning and certification stipend.</li>\n        <li>Performance bonus and wellness allowances.</li>\n      </ul>\n    "
  },
  {
    "id": 2,
    "title": "React Frontend Engineer",
    "company": "Tata Consultancy Services (TCS)",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.1",
    "reviews": "28.5k Reviews",
    "exp": "2-5 Yrs",
    "salary": "₹ 8,50,000 - 15,00,000 PA",
    "location": "Hyderabad / Secunderabad",
    "city": "hyderabad",
    "workMode": "office",
    "expYears": 3,
    "salaryNum": 12,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "React",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Redux Toolkit",
      "Webpack"
    ],
    "snippet": "Join our digital consulting division to create enterprise-scale frontend architectures and responsive web portals for Fortune 500 financial clients.",
    "openings": 5,
    "applicants": 82,
    "description": "\n    <h4>Role & Responsibilities:</h4>\n    <ul>\n      <li>Develop enterprise-scale web portals using modern React.js, Redux Toolkit, and vanilla JavaScript.</li>\n      <li>Optimize complex web components for maximum speed, accessibility, and responsiveness.</li>\n      <li>Collaborate with UX/UI designers to transform wireframes into pixel-perfect interfaces.</li>\n      <li>Perform rigorous cross-browser and cross-device testing.</li>\n    </ul>\n    <h4>Required Candidate Profile:</h4>\n    <ul>\n      <li>2 to 5 years of hands-on experience in frontend web development.</li>\n      <li>Deep knowledge of JavaScript (ES6+), React hooks, state management, and modern CSS frameworks.</li>\n      <li>Experience working with RESTful APIs, Git, and automated testing tools.</li>\n    </ul>\n  "
  },
  {
    "id": 3,
    "title": "Python Data Engineer",
    "company": "Infosys Technologies",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.0",
    "reviews": "35.2k Reviews",
    "exp": "3-7 Yrs",
    "salary": "₹ 11,00,000 - 18,50,000 PA",
    "location": "Pune, Maharashtra / Remote",
    "city": "pune",
    "workMode": "remote",
    "expYears": 4,
    "salaryNum": 15,
    "dept": "data",
    "posted": "2 Days Ago",
    "isHot": false,
    "skills": [
      "Python",
      "Apache Spark",
      "SQL",
      "Snowflake",
      "ETL Pipelines",
      "Airflow"
    ],
    "snippet": "Build resilient big data ETL pipelines, data warehouses in Snowflake, and real-time streaming pipelines using Python and Spark.",
    "openings": 2,
    "applicants": 35,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Build batch and streaming data ingestion pipelines using Python, PySpark, and Kafka.</li>\n        <li>Design and maintain analytics schemas in Snowflake and Google BigQuery.</li>\n        <li>Schedule and orchestrate complex DAGs using Apache Airflow.</li>\n        <li>Ensure data accuracy, deduplication, and regulatory compliance.</li>\n      </ul>\n      <h4>Required Candidate Profile:</h4>\n      <ul>\n        <li>3+ years in data engineering or big data ecosystem.</li>\n        <li>Advanced SQL query tuning and distributed computing knowledge.</li>\n        <li>Experience working in 100% remote distributed teams.</li>\n      </ul>\n    "
  },
  {
    "id": 4,
    "title": "DevOps & Cloud Architect",
    "company": "Google India",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.7",
    "reviews": "15.4k Reviews",
    "exp": "5-10 Yrs",
    "salary": "₹ 28,00,000 - 45,00,000 PA",
    "location": "Bengaluru, Karnataka",
    "city": "bengaluru",
    "workMode": "hybrid",
    "expYears": 6,
    "salaryNum": 35,
    "dept": "engineering",
    "posted": "Few Hours Ago",
    "isHot": true,
    "skills": [
      "Kubernetes",
      "Docker",
      "Terraform",
      "GCP",
      "CI/CD",
      "Linux",
      "Prometheus"
    ],
    "snippet": "Architect mission-critical cloud infrastructure, automate deployment pipelines with Terraform, and oversee Kubernetes container orchestration.",
    "openings": 1,
    "applicants": 89,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Design multi-region GCP/AWS infrastructure with 99.99% availability targets.</li>\n        <li>Manage containerized workloads on Kubernetes clusters with Istio service mesh.</li>\n        <li>Implement automated IaC (Infrastructure as Code) using Terraform and Ansible.</li>\n        <li>Establish enterprise security postures, secret management, and SOC2 audits.</li>\n      </ul>\n    "
  },
  {
    "id": 5,
    "title": "Associate Software Engineer (Fresher)",
    "company": "Wipro Technologies",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "3.9",
    "reviews": "22k Reviews",
    "exp": "0-1 Yrs",
    "salary": "₹ 4,50,000 - 6,50,000 PA",
    "location": "Delhi / NCR (Noida/Gurugram)",
    "city": "delhi",
    "workMode": "office",
    "expYears": 0,
    "salaryNum": 5,
    "dept": "engineering",
    "posted": "1 Day Ago",
    "isHot": true,
    "skills": [
      "Java",
      "Python",
      "SQL",
      "Data Structures",
      "OOP",
      "Git"
    ],
    "snippet": "Exciting campus and off-campus opportunity for fresh engineering graduates to learn enterprise software development, cloud systems, and agile delivery.",
    "openings": 15,
    "applicants": 340,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Undergo 3 months comprehensive bootcamp in Java, Cloud, and Software Engineering.</li>\n        <li>Work alongside senior engineers on real-world client engagements.</li>\n        <li>Write clean, tested, and documented code following best practices.</li>\n      </ul>\n      <h4>Eligibility:</h4>\n      <ul>\n        <li>B.E. / B.Tech / MCA graduates (2024, 2025, 2026 batches).</li>\n        <li>Minimum 60% throughout academics with no active backlogs.</li>\n      </ul>\n    "
  },
  {
    "id": 6,
    "title": "Senior IT Management Consultant",
    "company": "Deloitte Consulting India",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.3",
    "reviews": "18.2k Reviews",
    "exp": "4-8 Yrs",
    "salary": "₹ 18,00,000 - 30,00,000 PA",
    "location": "Mumbai, Maharashtra",
    "city": "mumbai",
    "workMode": "hybrid",
    "expYears": 5,
    "salaryNum": 24,
    "dept": "consulting",
    "posted": "3 Days Ago",
    "isHot": false,
    "skills": [
      "IT Strategy",
      "Digital Transformation",
      "ERP",
      "Stakeholder Management",
      "Agile"
    ],
    "snippet": "Lead digital transformation initiatives, enterprise architecture roadmaps, and ERP modernization programs for Fortune 500 clients.",
    "openings": 2,
    "applicants": 42,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Advise C-level executives on technology strategy, cloud adoption, and IT cost optimization.</li>\n        <li>Conduct gap analysis and design modern target operating models.</li>\n        <li>Lead RFP evaluation, vendor management, and program governance.</li>\n      </ul>\n    "
  },
  {
    "id": 7,
    "title": "Node.js Backend Developer",
    "company": "Accenture Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.2",
    "reviews": "45k Reviews",
    "exp": "2-4 Yrs",
    "salary": "₹ 9,00,000 - 16,00,000 PA",
    "location": "Chennai, Tamil Nadu",
    "city": "chennai",
    "workMode": "hybrid",
    "expYears": 3,
    "salaryNum": 13,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "Node.js",
      "Express",
      "MongoDB",
      "Redis",
      "Kafka",
      "Microservices"
    ],
    "snippet": "Develop high-throughput REST and WebSocket backends with Node.js, Redis caching, and event-driven architecture.",
    "openings": 4,
    "applicants": 67,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Develop asynchronous microservices capable of handling millions of requests per day.</li>\n        <li>Implement caching layers using Redis and message queues using Kafka/RabbitMQ.</li>\n        <li>Write comprehensive unit tests with Jest and Supertest.</li>\n      </ul>\n    "
  },
  {
    "id": 8,
    "title": "HR Talent Acquisition Specialist",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "2-5 Yrs",
    "salary": "₹ 6,00,000 - 11,00,000 PA",
    "location": "Delhi / NCR",
    "city": "delhi",
    "workMode": "office",
    "expYears": 3,
    "salaryNum": 8,
    "dept": "hr",
    "posted": "1 Day Ago",
    "isHot": false,
    "skills": [
      "Technical Recruitment",
      "Sourcing",
      "Move ONN Portal",
      "Interviewing",
      "Onboarding"
    ],
    "snippet": "Lead end-to-end recruitment life cycle for niche tech talents across AI, Cloud, and Full Stack development roles.",
    "openings": 2,
    "applicants": 29,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Source and screen top technical talent through Move ONN, LinkedIn, and internal databases.</li>\n        <li>Coordinate technical interviews and manage salary negotiations.</li>\n        <li>Maintain accurate ATS trackers and deliver superior candidate experience.</li>\n      </ul>\n    "
  },
  {
    "id": 9,
    "title": "Software Development Engineer (Full Stack)",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "1-4 Yrs",
    "salary": "₹ 7,50,000 - 14,00,000 PA",
    "location": "Patna, Bihar (Hybrid)",
    "city": "patna",
    "workMode": "hybrid",
    "expYears": 2,
    "salaryNum": 10,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "JavaScript",
      "React.js",
      "Node.js",
      "MySQL",
      "REST APIs",
      "Git"
    ],
    "snippet": "Exciting software engineering role at Apex Consultancy Patna office. Build enterprise client portals, custom workflow systems, and responsive web apps.",
    "openings": 4,
    "applicants": 26,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Build, test, and deploy web applications for domestic and international clients.</li>\n        <li>Collaborate with technical architects in Bangalore and Patna development centers.</li>\n        <li>Write unit and integration tests to ensure code quality.</li>\n      </ul>\n      <h4>Required Candidate Profile:</h4>\n      <ul>\n        <li>1 to 4 years of hands-on experience in JavaScript, React, and Node.js.</li>\n        <li>B.Tech / MCA or equivalent computer science degree.</li>\n        <li>Strong problem-solving abilities and communication skills.</li>\n      </ul>\n    "
  },
  {
    "id": 10,
    "title": "Java Full Stack Developer",
    "company": "Cognizant Technology Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.0",
    "reviews": "29.8k Reviews",
    "exp": "2-5 Yrs",
    "salary": "₹ 8,00,000 - 15,00,000 PA",
    "location": "Patna, Bihar / Remote",
    "city": "patna",
    "workMode": "remote",
    "expYears": 3,
    "salaryNum": 11,
    "dept": "engineering",
    "posted": "1 Day Ago",
    "isHot": true,
    "skills": [
      "Java 17",
      "Spring Boot",
      "Microservices",
      "Angular",
      "Hibernate",
      "PostgreSQL"
    ],
    "snippet": "Cognizant is hiring Java Spring Boot professionals for remote / Patna development hub. Experience in Spring Cloud and microservices preferred.",
    "openings": 6,
    "applicants": 54,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Develop microservices using Spring Boot and Spring Cloud.</li>\n        <li>Design frontend user experiences in Angular 14+.</li>\n        <li>Implement secure APIs with OAuth2 and JWT.</li>\n      </ul>\n    "
  },
  {
    "id": 11,
    "title": "UI/UX Product Designer",
    "company": "Zomato",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.4",
    "reviews": "9.1k Reviews",
    "exp": "2-6 Yrs",
    "salary": "₹ 15,00,000 - 26,00,000 PA",
    "location": "Gurugram / Remote (All India)",
    "city": "delhi",
    "workMode": "remote",
    "expYears": 3,
    "salaryNum": 20,
    "dept": "engineering",
    "posted": "3 Days Ago",
    "isHot": true,
    "skills": [
      "Figma",
      "UI Design",
      "UX Research",
      "Wireframing",
      "Design Systems",
      "Prototyping"
    ],
    "snippet": "Design consumer-facing workflows and merchant applications used by millions across India. Work with design systems in Figma.",
    "openings": 2,
    "applicants": 84,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Craft user journey maps, wireframes, and high-fidelity interactive prototypes.</li>\n        <li>Conduct user interviews and usability testing sessions.</li>\n        <li>Maintain and expand our core component library in Figma.</li>\n      </ul>\n    "
  },
  {
    "id": 12,
    "title": "QA Automation Engineer",
    "company": "HCLTech",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "3.8",
    "reviews": "25k Reviews",
    "exp": "3-6 Yrs",
    "salary": "₹ 7,00,000 - 13,00,000 PA",
    "location": "Patna / Noida (Hybrid)",
    "city": "patna",
    "workMode": "hybrid",
    "expYears": 3,
    "salaryNum": 10,
    "dept": "engineering",
    "posted": "2 Days Ago",
    "isHot": false,
    "skills": [
      "Selenium",
      "Java",
      "Cypress",
      "API Testing",
      "Postman",
      "CI/CD Jenkins"
    ],
    "snippet": "Lead automated regression testing, API test suites, and CI/CD quality gates for enterprise banking software.",
    "openings": 3,
    "applicants": 41,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Develop automated end-to-end tests using Selenium WebDriver and Cypress.</li>\n        <li>Integrate test suites with Jenkins CI/CD pipeline.</li>\n        <li>Perform API load and contract testing with Postman and RestAssured.</li>\n      </ul>\n    "
  },
  {
    "id": 13,
    "title": "Mobile App Developer (Flutter & React Native)",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "2-5 Yrs",
    "salary": "₹ 9,00,000 - 16,50,000 PA",
    "location": "Patna, Bihar / Remote",
    "city": "patna",
    "workMode": "hybrid",
    "expYears": 3,
    "salaryNum": 13,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "Flutter",
      "Dart",
      "React Native",
      "Android",
      "iOS",
      "Firebase"
    ],
    "snippet": "Build cross-platform mobile apps for iOS and Android with Flutter and React Native. Smooth 60fps animations and offline sync.",
    "openings": 3,
    "applicants": 38,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Architect cross-platform mobile apps from scratch using Flutter and Dart.</li>\n        <li>Integrate push notifications, payment gateways, and location services.</li>\n        <li>Publish and manage production releases on Google Play Store and Apple App Store.</li>\n      </ul>\n    "
  },
  {
    "id": 14,
    "title": "AI & Machine Learning Engineer",
    "company": "Move ONN Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.8",
    "reviews": "140 Reviews",
    "exp": "3-7 Yrs",
    "salary": "₹ 20,00,000 - 36,00,000 PA",
    "location": "Bengaluru / Remote (All India)",
    "city": "bengaluru",
    "workMode": "remote",
    "expYears": 4,
    "salaryNum": 28,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "Python",
      "PyTorch",
      "LLMs",
      "LangChain",
      "FastAPI",
      "Docker",
      "Vector DBs"
    ],
    "snippet": "Architect generative AI solutions, autonomous agent workflows, and scalable machine learning pipelines on cloud infrastructure.",
    "openings": 2,
    "applicants": 64,
    "description": "\n    <h4>Role & Responsibilities:</h4>\n    <ul>\n      <li>Design and deploy generative AI applications utilizing LLMs, RAG architectures, and agentic workflows.</li>\n      <li>Fine-tune open-source models (Llama, Mistral) and build low-latency inference endpoints with FastAPI.</li>\n      <li>Implement vector indexing with Pinecone, Milvus, or Qdrant for semantic search applications.</li>\n    </ul>\n    <h4>Required Candidate Profile:</h4>\n    <ul>\n      <li>3+ years developing production-grade machine learning and natural language processing pipelines.</li>\n      <li>Expertise in Python, PyTorch/TensorFlow, Docker, and AWS/GCP cloud environments.</li>\n    </ul>\n  "
  },
  {
    "id": 15,
    "title": "Java Cloud Architect",
    "company": "Wipro Technologies",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "3.9",
    "reviews": "19.8k Reviews",
    "exp": "6-10 Yrs",
    "salary": "₹ 22,00,000 - 38,00,000 PA",
    "location": "Patna, Bihar / Hybrid",
    "city": "patna",
    "workMode": "hybrid",
    "expYears": 7,
    "salaryNum": 30,
    "dept": "engineering",
    "posted": "3 Days Ago",
    "isHot": true,
    "skills": [
      "Java",
      "Spring Boot",
      "Microservices",
      "Kubernetes",
      "AWS",
      "Kafka"
    ],
    "snippet": "Lead large-scale cloud migration and microservices architecture design for banking and financial enterprises.",
    "openings": 2,
    "applicants": 41,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Architect distributed cloud-native microservices using Spring Boot, Kafka, and Kubernetes.</li>\n        <li>Lead technical governance, architectural blueprints, and security compliance.</li>\n      </ul>\n    "
  },
  {
    "id": 16,
    "title": "Senior Product Manager",
    "company": "Zomato Media",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.3",
    "reviews": "6.8k Reviews",
    "exp": "4-8 Yrs",
    "salary": "₹ 18,00,000 - 32,00,000 PA",
    "location": "Gurugram / Delhi NCR",
    "city": "delhi",
    "workMode": "office",
    "expYears": 5,
    "salaryNum": 25,
    "dept": "consulting",
    "posted": "1 Day Ago",
    "isHot": true,
    "skills": [
      "Product Strategy",
      "Agile",
      "Roadmapping",
      "Data Analytics",
      "UX Strategy"
    ],
    "snippet": "Drive product discovery, customer journey mapping, and growth features for millions of daily active users.",
    "openings": 1,
    "applicants": 78,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Own end-to-end product lifecycle from ideation to launch and post-launch iteration.</li>\n        <li>Work closely with engineering, data science, and business leadership.</li>\n      </ul>\n    "
  },
  {
    "id": 17,
    "title": "DevOps & SRE Specialist",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "3-6 Yrs",
    "salary": "₹ 13,00,000 - 22,00,000 PA",
    "location": "Patna, Bihar",
    "city": "patna",
    "workMode": "office",
    "expYears": 4,
    "salaryNum": 17,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": false,
    "skills": [
      "Terraform",
      "CI/CD",
      "AWS",
      "Docker",
      "Prometheus",
      "Linux"
    ],
    "snippet": "Manage high-availability cloud infrastructure, automated deployment pipelines, and zero-downtime releases.",
    "openings": 2,
    "applicants": 29,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Maintain multi-region AWS cloud infrastructure via Terraform and Ansible.</li>\n        <li>Build resilient CI/CD pipelines in GitLab / GitHub Actions.</li>\n      </ul>\n    "
  },
  {
    "id": 18,
    "title": "HR Business Partner",
    "company": "Deloitte India",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.2",
    "reviews": "51.2k Reviews",
    "exp": "3-7 Yrs",
    "salary": "₹ 9,00,000 - 16,00,000 PA",
    "location": "Mumbai, Maharashtra",
    "city": "mumbai",
    "workMode": "hybrid",
    "expYears": 4,
    "salaryNum": 12,
    "dept": "hr",
    "posted": "4 Days Ago",
    "isHot": false,
    "skills": [
      "Talent Acquisition",
      "Employee Relations",
      "HR Analytics",
      "Compliance"
    ],
    "snippet": "Partner with consulting business units to lead talent acquisition, performance management, and organizational culture.",
    "openings": 1,
    "applicants": 54,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Drive strategic talent acquisition and retention programs.</li>\n        <li>Facilitate leadership coaching, team performance reviews, and organizational design.</li>\n      </ul>\n    "
  },
  {
    "id": 19,
    "title": "UI/UX Product Designer",
    "company": "Swiggy",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.2",
    "reviews": "15.4k Reviews",
    "exp": "2-5 Yrs",
    "salary": "₹ 10,00,000 - 18,00,000 PA",
    "location": "Bengaluru (Hybrid)",
    "city": "bengaluru",
    "workMode": "hybrid",
    "expYears": 3,
    "salaryNum": 14,
    "dept": "engineering",
    "posted": "2 Days Ago",
    "isHot": true,
    "skills": [
      "Figma",
      "Design Systems",
      "Prototyping",
      "User Research",
      "Wireframing"
    ],
    "snippet": "Design clean, engaging, and accessible mobile and web interfaces for high-scale consumer applications.",
    "openings": 2,
    "applicants": 92,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Create intuitive user journeys, wireframes, high-fidelity mockups, and interactive prototypes.</li>\n        <li>Maintain and evolve our multi-brand design system in Figma.</li>\n      </ul>\n    "
  },
  {
    "id": 20,
    "title": "Data Analyst & BI Developer",
    "company": "Infosys Technologies",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.0",
    "reviews": "35.2k Reviews",
    "exp": "1-4 Yrs",
    "salary": "₹ 6,50,000 - 11,00,000 PA",
    "location": "Patna, Bihar / Remote",
    "city": "patna",
    "workMode": "remote",
    "expYears": 2,
    "salaryNum": 9,
    "dept": "data",
    "posted": "Just Now",
    "isHot": false,
    "skills": [
      "SQL",
      "Power BI",
      "Tableau",
      "Python",
      "Excel",
      "Data Modeling"
    ],
    "snippet": "Translate complex business datasets into actionable Power BI dashboards and executive performance reports.",
    "openings": 3,
    "applicants": 44,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Build automated ETL jobs and dashboards in Power BI and Tableau.</li>\n        <li>Perform ad-hoc deep dive analytics to support executive decision-making.</li>\n      </ul>\n    "
  },
  {
    "id": 21,
    "title": "Talent Acquisition Specialist",
    "company": "Apex Consultancy Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.5",
    "reviews": "320 Reviews",
    "exp": "1-3 Yrs",
    "salary": "₹ 5,00,000 - 8,50,000 PA",
    "location": "Patna, Bihar",
    "city": "patna",
    "workMode": "office",
    "expYears": 2,
    "salaryNum": 7,
    "dept": "hr",
    "posted": "2 Days Ago",
    "isHot": false,
    "skills": [
      "Technical Recruitment",
      "Sourcing",
      "LinkedIn Recruiter",
      "Candidate Experience"
    ],
    "snippet": "Source, screen, and recruit exceptional software engineering talent across India for fast-growing IT clients.",
    "openings": 2,
    "applicants": 31,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Execute end-to-end recruitment lifecycle for software engineers and cloud professionals.</li>\n        <li>Leverage modern sourcing channels, headhunting, and campus drives.</li>\n      </ul>\n    "
  },
  {
    "id": 22,
    "title": "Junior Frontend Developer (Fresher)",
    "company": "Move ONN Solutions",
    "logo": "assets/images/moveonn-logo.png",
    "rating": "4.8",
    "reviews": "140 Reviews",
    "exp": "0-1 Yrs",
    "salary": "₹ 4,50,000 - 7,00,000 PA",
    "location": "Patna, Bihar / Hybrid",
    "city": "patna",
    "workMode": "hybrid",
    "expYears": 0,
    "salaryNum": 6,
    "dept": "engineering",
    "posted": "Just Now",
    "isHot": true,
    "skills": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React Basics",
      "Git",
      "Bootstrap"
    ],
    "snippet": "Exciting opportunity for fresh engineering graduates to learn modern web development, React, and responsive UI design.",
    "openings": 4,
    "applicants": 120,
    "description": "\n      <h4>Role & Responsibilities:</h4>\n      <ul>\n        <li>Build semantic HTML/CSS web components and assist in React frontend development.</li>\n        <li>Collaborate with senior software architects and learn industry coding standards.</li>\n      </ul>\n      <h4>Required Candidate Profile:</h4>\n      <ul>\n        <li>B.Tech / BCA / MCA in Computer Science or related field (2024 / 2025 batch).</li>\n        <li>Strong grasp of core JavaScript, DOM manipulation, and responsive web design.</li>\n      </ul>\n    "
  }
];

let allJobs = [...INITIAL_JOBS];
let savedJobIds = JSON.parse(localStorage.getItem('moveonn_saved_jobs') || localStorage.getItem('Move ONN_saved_jobs') || '[]');
let appliedJobIds = JSON.parse(localStorage.getItem('moveonn_applied_jobs') || localStorage.getItem('Move ONN_applied_jobs') || '[]');
let activeTab = 'recommended';
let currentApplyJob = null;

// Safe User Helper
function getJobUser() {
  try {
    const raw = localStorage.getItem('moveonn_user') || null || localStorage.getItem('Move ONN_user') || localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

// Toast Notification
function triggerToast(msg) {
  if (typeof window.showToast === 'function') {
    window.showToast(msg);
  } else {
    const toast = document.getElementById('Move ONNToast');
    if (toast) {
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
  }
}

// 1. FILTER & SORT JOBS
function getFilteredJobs() {
  const keywordEl = document.getElementById('searchKeyword');
  const locEl = document.getElementById('searchLocation');
  const expEl = document.getElementById('searchExp');
  const sortEl = document.getElementById('feedSortSelect');

  const q = keywordEl ? keywordEl.value.toLowerCase().trim() : '';
  const loc = locEl ? locEl.value.toLowerCase().trim() : '';
  const expMin = expEl ? expEl.value : '';
  const sortBy = sortEl ? sortEl.value : 'relevance';

  // Sidebar checkboxes
  const workModes = Array.from(document.querySelectorAll('input[name="workMode"]:checked')).map(cb => cb.value);
  const expRanges = Array.from(document.querySelectorAll('input[name="expRange"]:checked')).map(cb => cb.value);
  const locations = Array.from(document.querySelectorAll('input[name="location"]:checked')).map(cb => cb.value);
  const depts = Array.from(document.querySelectorAll('input[name="dept"]:checked')).map(cb => cb.value);

  let results = allJobs.filter(job => {
    // Tab filtering
    if (activeTab === 'saved' && !savedJobIds.includes(job.id)) return false;
    if (activeTab === 'applied' && !appliedJobIds.includes(job.id)) return false;
    if (activeTab === 'topmatches' && !job.isHot) return false;

    // Keyword filter: smart multi-token search
    if (q) {
      const qTokens = q.split(/[\s,]+/).filter(t => t.length > 0);
      const fullText = (job.title + ' ' + job.company + ' ' + job.skills.join(' ') + ' ' + job.snippet).toLowerCase();
      const matchQ = qTokens.some(t => fullText.includes(t));
      if (!matchQ) return false;
    }

    // Location text filter: smart token search + includes Remote jobs
    if (loc) {
      const locTokens = loc.split(/[\s,]+/).filter(t => t.length > 1);
      const matchLoc = locTokens.length === 0 || locTokens.some(token => 
        job.location.toLowerCase().includes(token) || 
        job.city.toLowerCase().includes(token)
      ) || job.workMode === 'remote';
      if (!matchLoc) return false;
    }

    // Exp selector
    if (expMin !== '' && job.expYears < parseInt(expMin, 10)) return false;

    // Work mode
    if (workModes.length > 0 && !workModes.includes(job.workMode)) return false;

    // Location checkboxes
    if (locations.length > 0 && !locations.includes(job.city)) return false;

    // Department checkboxes
    if (depts.length > 0 && !depts.includes(job.dept)) return false;

    // Exp ranges
    if (expRanges.length > 0) {
      const matchExpRange = expRanges.some(r => {
        if (r === '0-1') return job.expYears <= 1;
        if (r === '1-3') return job.expYears >= 1 && job.expYears <= 3;
        if (r === '3-5') return job.expYears >= 3 && job.expYears <= 5;
        if (r === '5+') return job.expYears >= 5;
        return false;
      });
      if (!matchExpRange) return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === 'salary') {
    results.sort((a, b) => (b.salaryNum || 0) - (a.salaryNum || 0));
  } else if (sortBy === 'date') {
    results.sort((a, b) => {
      if (a.posted.includes('Just Now') || a.posted.includes('Few Hours')) return -1;
      if (b.posted.includes('Just Now') || b.posted.includes('Few Hours')) return 1;
      return 0;
    });
  }

  return results;
}

// 2. RENDER JOB CARDS
function renderCards() {
  const container = document.getElementById('jobCardsList');
  if (!container) return;

  const filtered = getFilteredJobs();

  // Update counts & summary headline
  const summaryEl = document.getElementById('feedSummaryText');
  const sortEl = document.getElementById('feedSortSelect');
  if (sortEl) {
    sortEl.style.display = filtered.length === 0 ? 'none' : 'block';
  }
  if (summaryEl) {
    if (activeTab === 'saved') {
      summaryEl.innerHTML = `Showing <strong id="jobsCountText">${filtered.length}</strong> saved jobs`;
    } else if (activeTab === 'applied') {
      summaryEl.innerHTML = `Showing <strong id="jobsCountText">${filtered.length}</strong> applied jobs`;
    } else if (activeTab === 'topmatches') {
      summaryEl.innerHTML = `Showing <strong id="jobsCountText">${filtered.length}</strong> top matching jobs for you`;
    } else {
      if (filtered.length === 0) {
        summaryEl.innerHTML = `Showing <strong id="jobsCountText">0</strong> jobs matching your criteria`;
      } else {
        summaryEl.innerHTML = `Showing <strong id="jobsCountText">${filtered.length}</strong> recommended jobs based on your profile`;
      }
    }
  }

  const recCountEl = document.getElementById('badgeRecommendedCount');
  if (recCountEl) recCountEl.textContent = allJobs.length;

  const topCountEl = document.getElementById('badgeTopMatchesCount');
  if (topCountEl) topCountEl.textContent = allJobs.filter(j => j.isHot).length;

  const savedCountEl = document.getElementById('badgeSavedCount');
  if (savedCountEl) savedCountEl.textContent = savedJobIds.length;

  const appliedCountEl = document.getElementById('badgeAppliedCount');
  if (appliedCountEl) appliedCountEl.textContent = appliedJobIds.length;

  if (filtered.length === 0) {
    if (activeTab === 'saved') {
      container.innerHTML = `
        <div class="empty-feed-card" style="background:#ffffff; border-radius:12px; padding:64px 32px; text-align:center; border:1px solid #e4e2e0; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin: 0 0 24px 0; width:100%; box-sizing:border-box;">
          <div style="width:64px; height:64px; margin:0 auto 20px; border-radius:50%; background:#f0f7ff; display:flex; align-items:center; justify-content:center; color:var(--primary);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 style="font-size:20px; font-weight:700; color:var(--text-dark); margin:0 0 8px;">No saved jobs yet</h3>
          <p style="color:var(--text-muted); font-size:15px; margin:0 auto 24px; max-width:420px; line-height:1.5;">Bookmark jobs that interest you to compare requirements, track updates, and apply when you're ready.</p>
          <button type="button" onclick="window.switchTab('recommended')" style="background:var(--primary); color:#ffffff; border:none; padding:12px 32px; border-radius:24px; font-weight:700; font-size:15px; cursor:pointer; transition:background 0.15s ease; box-shadow:0 2px 6px rgba(0,70,135,0.2);">Explore Recommended Jobs</button>
        </div>
      `;
      return;
    }
    if (activeTab === 'applied') {
      container.innerHTML = `
        <div class="empty-feed-card" style="background:#ffffff; border-radius:12px; padding:64px 32px; text-align:center; border:1px solid #e4e2e0; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin: 0 0 24px 0; width:100%; box-sizing:border-box;">
          <div style="width:64px; height:64px; margin:0 auto 20px; border-radius:50%; background:#f0fdf4; display:flex; align-items:center; justify-content:center; color:#16a34a;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 style="font-size:20px; font-weight:700; color:var(--text-dark); margin:0 0 8px;">No applications submitted yet</h3>
          <p style="color:var(--text-muted); font-size:15px; margin:0 auto 24px; max-width:420px; line-height:1.5;">Explore top matching opportunities and apply directly with your profile.</p>
          <button type="button" onclick="window.switchTab('recommended')" style="background:var(--primary); color:#ffffff; border:none; padding:12px 32px; border-radius:24px; font-weight:700; font-size:15px; cursor:pointer; transition:background 0.15s ease; box-shadow:0 2px 6px rgba(0,70,135,0.2);">Explore Recommended Jobs</button>
        </div>
      `;
      return;
    }
    container.innerHTML = `
      <div class="empty-feed-card" style="background:#ffffff; border-radius:12px; padding:64px 32px; text-align:center; border:1px solid #e4e2e0; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin: 0 0 24px 0; width:100%; box-sizing:border-box;">
        <div style="width:64px; height:64px; margin:0 auto 20px; border-radius:50%; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#64748b;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3 style="font-size:20px; font-weight:700; color:var(--text-dark); margin:0 0 8px;">No matching jobs found</h3>
        <p style="color:var(--text-muted); font-size:15px; margin:0 auto 24px; max-width:420px; line-height:1.5;">We couldn't find any jobs matching your specific filters. Try expanding your search criteria or resetting filters.</p>
        <button type="button" onclick="window.clearAllFilters()" style="background:var(--primary); color:#ffffff; border:none; padding:12px 32px; border-radius:24px; font-weight:700; font-size:15px; cursor:pointer; transition:background 0.15s ease; box-shadow:0 2px 6px rgba(0,70,135,0.2);">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(job => {
    const isSaved = savedJobIds.includes(job.id);
    const isApplied = appliedJobIds.includes(job.id);

    return `
      <article class="moveonn-job-card" data-job-id="${job.id}">
        <div class="card-top">
          <div>
            <a class="job-title-link" onclick="openJobDetails(${job.id})">${job.title}</a>
            <div class="company-row">
              <span class="company-name">${job.company}</span>
              <span class="star-rating"><svg width="12" height="12" viewBox="0 0 24 24" fill="#ffa41b" style="vertical-align:text-top; margin-right:3px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${job.rating}</span>
              <span class="reviews-count">(${job.reviews})</span>
            </div>
          </div>
          <button type="button" class="btn-bookmark ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob(${job.id}, event)" title="${isSaved ? 'Job Saved' : 'Save Job'}" aria-label="Save Job">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${isSaved ? 'var(--primary)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>

        <div class="card-meta-row">
          <div class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span>${job.exp}</span>
          </div>
          <div class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9H6"></path></svg>
            <span>${job.salary}</span>
          </div>
          <div class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${job.location}</span>
          </div>
        </div>

        <p class="card-snippet">${job.snippet}</p>

        <div class="card-skills-row">
          ${job.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
        </div>

        <div class="card-footer-row">
          <div class="card-footer-left">
            <span>${job.posted}</span>
            ${job.isHot ? '<span class="badge-early">Actively Hiring</span>' : '<span class="badge-early">Early Applicant</span>'}
          </div>
          <div class="card-footer-right">
            <button type="button" class="btn-quick-apply ${isApplied ? 'applied' : ''}" onclick="openQuickApplyModal(${job.id}, event)">
              ${isApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// 3. TAB SWITCHING
function switchTab(tab) {
  activeTab = tab;
  // If switching to recommended and currently 0 results because of search filters, clear filters
  if (tab === 'recommended' && getFilteredJobs().length === 0) {
    document.querySelectorAll('.moveonn-filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    const keywordEl = document.getElementById('searchKeyword');
    if (keywordEl) keywordEl.value = '';
    const locEl = document.getElementById('searchLocation');
    if (locEl) locEl.value = '';
    const expEl = document.getElementById('searchExp');
    if (expEl) expEl.value = '';
  }
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  renderCards();
}
window.switchTab = switchTab;

// 4. SAVE JOB
function toggleSaveJob(id, e) {
  if (e) e.stopPropagation();
  const idx = savedJobIds.indexOf(id);
  if (idx !== -1) {
    savedJobIds.splice(idx, 1);
    triggerToast('Job removed from saved jobs');
  } else {
    savedJobIds.push(id);
    triggerToast('Job saved to your profile!');
  }
  localStorage.setItem('moveonn_saved_jobs', JSON.stringify(savedJobIds));
  renderCards();
}

// 5. QUICK APPLY MODAL
function openQuickApplyModal(id, e) {
  if (e) e.stopPropagation();
  currentApplyJob = allJobs.find(j => j.id === id);
  if (!currentApplyJob) return;

  if (appliedJobIds.includes(id)) {
    triggerToast('You have already applied to this job!');
    return;
  }

  const modal = document.getElementById('quickApplyModal');
  if (!modal) return;

  const titleEl = document.getElementById('modalJobTitle');
  if (titleEl) titleEl.textContent = 'Apply to ' + currentApplyJob.title;

  const compEl = document.getElementById('modalCompany');
  if (compEl) compEl.textContent = currentApplyJob.company + ' • ' + currentApplyJob.location;

  const user = getJobUser();
  if (user) {
    const nameEl = document.getElementById('applicantNameText');
    if (nameEl) nameEl.textContent = user.name || 'Yuvi';
    const emailEl = document.getElementById('applicantEmailText');
    if (emailEl) emailEl.textContent = (user.email || 'yuvi@gmail.com') + ' • +91 98765 43210';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeQuickApplyModal() {
  const modal = document.getElementById('quickApplyModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// 6. JOB DETAILS SLIDE-OVER
function openJobDetails(id) {
  const job = allJobs.find(j => j.id === id);
  if (!job) return;

  const panel = document.getElementById('slideOverContent');
  const isApplied = appliedJobIds.includes(job.id);
  const isSaved = savedJobIds.includes(job.id);

  if (panel) {
    panel.innerHTML = `
      <div style="margin-bottom:20px;">
        <h2 style="font-size:22px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">${job.title}</h2>
        <div style="font-size:15px; font-weight:600; color:var(--primary); margin-bottom:4px;">${job.company}</div>
        <div style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">${job.location} • Posted ${job.posted}</div>
        <div style="font-size:17px; font-weight:700; color:var(--text-dark); margin-bottom:16px;">${job.salary}</div>
        <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
          <button onclick="openQuickApplyModal(${job.id})" style="background:var(--primary); color:#fff; border:none; height:42px; padding:0 24px; border-radius:9999px; font-weight:600; font-size:14px; cursor:pointer; white-space:nowrap;">
            ${isApplied ? 'Application Submitted' : 'Apply Now'}
          </button>
          <button onclick="toggleSaveJob(${job.id})" style="background:#f4f5f7; color:var(--text-dark); border:1px solid #d4d2d0; height:42px; padding:0 20px; border-radius:9999px; font-weight:600; font-size:14px; cursor:pointer; white-space:nowrap;">
            ${isSaved ? 'Saved' : 'Save Job'}
          </button>
        </div>
        <hr style="border:none; border-top:1px solid var(--border-color); margin-bottom:20px;">
        <h3 style="font-size:16px; font-weight:700; color:var(--text-dark); margin-bottom:12px;">Job Description</h3>
        <div style="font-size:14px; color:#474d6a; line-height:1.7;">
          ${job.description || '<p>' + job.snippet + '</p>'}
        </div>
        <h3 style="font-size:16px; font-weight:700; color:var(--text-dark); margin:20px 0 10px;">Key Skills</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${job.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }

  const slideOver = document.getElementById('jobDetailsSlideOver');
  if (slideOver) {
    slideOver.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeJobDetails() {
  const slideOver = document.getElementById('jobDetailsSlideOver');
  if (slideOver) slideOver.style.display = 'none';
  document.body.style.overflow = '';
}

// 7. CLEAR ALL FILTERS
function clearAllFilters() {
  document.querySelectorAll('.moveonn-filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
  const keywordEl = document.getElementById('searchKeyword');
  if (keywordEl) keywordEl.value = '';
  const locEl = document.getElementById('searchLocation');
  if (locEl) locEl.value = '';
  const expEl = document.getElementById('searchExp');
  if (expEl) expEl.value = '';
  activeTab = 'recommended';
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'recommended');
  });
  renderCards();
}

// 8. EVENT ATTACHMENT & INIT
function initJobsPage() {
  // Subtabs
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  // Modal events
  const closeApplyBtn = document.getElementById('closeApplyModalBtn');
  if (closeApplyBtn) closeApplyBtn.onclick = closeQuickApplyModal;

  const applyForm = document.getElementById('applyJobForm');
  if (applyForm) {
    applyForm.onsubmit = (e) => {
      e.preventDefault();
      if (!currentApplyJob) return;
      appliedJobIds.push(currentApplyJob.id);
      localStorage.setItem('moveonn_applied_jobs', JSON.stringify(appliedJobIds));
      closeQuickApplyModal();
      triggerToast('Application submitted successfully to ' + currentApplyJob.company + '!');
      renderCards();
    };
  }

  const closeSlideBtn = document.getElementById('closeSlideOverBtn');
  if (closeSlideBtn) closeSlideBtn.onclick = closeJobDetails;

  const slideOver = document.getElementById('jobDetailsSlideOver');
  if (slideOver) {
    slideOver.onclick = (e) => {
      if (e.target === slideOver) closeJobDetails();
    };
  }

  const quickModal = document.getElementById('quickApplyModal');
  if (quickModal) {
    quickModal.onclick = (e) => {
      if (e.target === quickModal) closeQuickApplyModal();
    };
  }

  // Clear filters
  const clearBtn = document.getElementById('btnClearAllFilters');
  if (clearBtn) clearBtn.onclick = clearAllFilters;

  // Search Button & Inputs
  const searchBtn = document.getElementById('btnMoveonnSearch');
  if (searchBtn) searchBtn.onclick = renderCards;

  const keywordInput = document.getElementById('searchKeyword');
  if (keywordInput) {
    keywordInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); renderCards(); } };
    keywordInput.oninput = renderCards;
  }

  const locInput = document.getElementById('searchLocation');
  if (locInput) {
    locInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); renderCards(); } };
    locInput.oninput = renderCards;
  }

  const expInput = document.getElementById('searchExp');
  if (expInput) expInput.onchange = renderCards;

  const sortSelect = document.getElementById('feedSortSelect');
  if (sortSelect) sortSelect.onchange = renderCards;

  // Checkbox changes
  document.querySelectorAll('.moveonn-filters-sidebar input[type="checkbox"]').forEach(cb => {
    cb.onchange = renderCards;
  });

  // URL Query Parameters (?q=...&l=...&exp=...&tab=...)
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const l = params.get('l');
  const exp = params.get('exp');
  const tab = params.get('tab');

  if (q && keywordInput) keywordInput.value = q;
  if (l && locInput) locInput.value = l;
  if (exp && expInput) expInput.value = exp;
  if (tab) switchTab(tab);
  else renderCards();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJobsPage);
} else {
  initJobsPage();
}

// Explicitly bind all UI event handlers to window
window.switchTab = switchTab;
window.clearAllFilters = clearAllFilters;
window.toggleSaveJob = toggleSaveJob;
window.openQuickApplyModal = openQuickApplyModal;
window.closeQuickApplyModal = closeQuickApplyModal;
window.openJobDetails = openJobDetails;
window.closeJobDetails = closeJobDetails;
window.renderCards = renderCards;

