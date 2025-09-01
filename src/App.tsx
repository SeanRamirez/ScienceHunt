import React, { useState, useEffect } from 'react';
import './App.css';

interface Career {
  id: string;
  title: string;
  description: string;
  salary: string;
  education: string;
  skills: string[];
  category: string;
  growth: string;
  companies: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
}

interface SkillAssessment {
  skillId: string;
  skillName: string;
  proficiency: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'skills' | 'about'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  
  // Skill Gap Analysis states
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [selectedCareerForAnalysis, setSelectedCareerForAnalysis] = useState<Career | null>(null);
  const [showSkillResults, setShowSkillResults] = useState(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const careers: Career[] = [
    {
      id: '1',
      title: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems.',
      salary: '$85,000 - $150,000',
      education: 'Bachelor\'s in Computer Science or related field',
      skills: ['Programming', 'Problem Solving', 'System Design', 'Collaboration'],
      category: 'Technology',
      growth: '22% (Much faster than average)',
      companies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta']
    },
    {
      id: '2',
      title: 'Data Scientist',
      description: 'Analyze complex data to help organizations make better decisions.',
      salary: '$95,000 - $160,000',
      education: 'Master\'s in Data Science, Statistics, or Computer Science',
      skills: ['Statistics', 'Machine Learning', 'Python/R', 'Data Visualization'],
      category: 'Technology',
      growth: '36% (Much faster than average)',
      companies: ['Netflix', 'Uber', 'Airbnb', 'Spotify', 'LinkedIn']
    },
    {
      id: '3',
      title: 'Mechanical Engineer',
      description: 'Design and build mechanical devices, engines, and machines.',
      salary: '$70,000 - $120,000',
      education: 'Bachelor\'s in Mechanical Engineering',
      skills: ['CAD Software', 'Physics', 'Manufacturing', 'Project Management'],
      category: 'Engineering',
      growth: '7% (As fast as average)',
      companies: ['Tesla', 'Boeing', 'General Electric', 'Ford', 'Toyota']
    },
    {
      id: '4',
      title: 'Biomedical Engineer',
      description: 'Develop medical devices and technologies to improve healthcare.',
      salary: '$75,000 - $130,000',
      education: 'Bachelor\'s in Biomedical Engineering',
      skills: ['Biology', 'Medical Devices', 'Regulatory Compliance', 'Innovation'],
      category: 'Engineering',
      growth: '10% (Faster than average)',
      companies: ['Medtronic', 'Johnson & Johnson', 'Boston Scientific', 'Stryker']
    },
    {
      id: '5',
      title: 'Environmental Scientist',
      description: 'Study environmental problems and develop solutions.',
      salary: '$60,000 - $100,000',
      education: 'Bachelor\'s in Environmental Science or related field',
      skills: ['Environmental Analysis', 'Research', 'Policy Understanding', 'Field Work'],
      category: 'Science',
      growth: '8% (As fast as average)',
      companies: ['EPA', 'Environmental Consulting Firms', 'Non-profits']
    },
    {
      id: '6',
      title: 'Research Scientist',
      description: 'Conduct research to advance knowledge in various scientific fields.',
      salary: '$70,000 - $120,000',
      education: 'Ph.D. in relevant scientific field',
      skills: ['Research Methods', 'Data Analysis', 'Scientific Writing', 'Critical Thinking'],
      category: 'Science',
      growth: '8% (As fast as average)',
      companies: ['Universities', 'Research Institutions', 'Pharmaceutical Companies']
    },
    {
      id: '7',
      title: 'Cybersecurity Analyst',
      description: 'Protect computer systems and networks from cyber threats.',
      salary: '$80,000 - $140,000',
      education: 'Bachelor\'s in Cybersecurity, Computer Science, or related field',
      skills: ['Network Security', 'Threat Analysis', 'Incident Response', 'Security Tools'],
      category: 'Technology',
      growth: '35% (Much faster than average)',
      companies: ['CrowdStrike', 'Palo Alto Networks', 'FireEye', 'Government Agencies']
    },
    {
      id: '8',
      title: 'Civil Engineer',
      description: 'Design and oversee construction of infrastructure projects.',
      salary: '$65,000 - $110,000',
      education: 'Bachelor\'s in Civil Engineering',
      skills: ['Structural Design', 'Project Planning', 'Construction Management', 'AutoCAD'],
      category: 'Engineering',
      growth: '8% (As fast as average)',
      companies: ['AECOM', 'Jacobs', 'Bechtel', 'Government Agencies']
    }
  ];

  const skills: Skill[] = [
    // Programming & Technical Skills
    { id: 'programming', name: 'Programming', category: 'Technical', description: 'Ability to write code in various programming languages', difficulty: 'intermediate', resources: ['Codecademy', 'freeCodeCamp', 'LeetCode'] },
    { id: 'python', name: 'Python', category: 'Technical', description: 'Python programming language proficiency', difficulty: 'beginner', resources: ['Python.org tutorials', 'DataCamp', 'Real Python'] },
    { id: 'javascript', name: 'JavaScript', category: 'Technical', description: 'JavaScript programming for web development', difficulty: 'beginner', resources: ['MDN Web Docs', 'Eloquent JavaScript', 'JavaScript.info'] },
    { id: 'java', name: 'Java', category: 'Technical', description: 'Java programming language skills', difficulty: 'intermediate', resources: ['Oracle Java Tutorials', 'Baeldung', 'Java Code Geeks'] },
    { id: 'sql', name: 'SQL', category: 'Technical', description: 'Database querying and management', difficulty: 'beginner', resources: ['SQLZoo', 'Mode Analytics', 'W3Schools SQL'] },
    
    // Data Science & Analytics
    { id: 'statistics', name: 'Statistics', category: 'Analytics', description: 'Statistical analysis and data interpretation', difficulty: 'intermediate', resources: ['Khan Academy Statistics', 'Coursera Statistics', 'StatQuest'] },
    { id: 'machine-learning', name: 'Machine Learning', category: 'Analytics', description: 'ML algorithms and model development', difficulty: 'advanced', resources: ['Coursera ML Course', 'Fast.ai', 'Kaggle Courses'] },
    { id: 'data-visualization', name: 'Data Visualization', category: 'Analytics', description: 'Creating charts, graphs, and visual representations of data', difficulty: 'intermediate', resources: ['Tableau Public', 'D3.js', 'Plotly'] },
    { id: 'r', name: 'R Programming', category: 'Analytics', description: 'R language for statistical computing', difficulty: 'intermediate', resources: ['R for Data Science', 'RStudio Tutorials', 'DataCamp R'] },
    
    // Engineering Skills
    { id: 'cad', name: 'CAD Software', category: 'Engineering', description: 'Computer-Aided Design software proficiency', difficulty: 'intermediate', resources: ['AutoCAD Tutorials', 'Fusion 360', 'SolidWorks'] },
    { id: 'physics', name: 'Physics', category: 'Engineering', description: 'Understanding of physical principles and mechanics', difficulty: 'intermediate', resources: ['Khan Academy Physics', 'MIT OpenCourseWare', 'Physics Classroom'] },
    { id: 'manufacturing', name: 'Manufacturing', category: 'Engineering', description: 'Knowledge of manufacturing processes and techniques', difficulty: 'intermediate', resources: ['Manufacturing Processes', 'Society of Manufacturing Engineers', 'MIT Manufacturing'] },
    
    // Soft Skills
    { id: 'problem-solving', name: 'Problem Solving', category: 'Soft Skills', description: 'Analytical thinking and creative problem-solving abilities', difficulty: 'beginner', resources: ['Critical Thinking Course', 'Problem Solving Techniques', 'Brain Training Apps'] },
    { id: 'collaboration', name: 'Collaboration', category: 'Soft Skills', description: 'Working effectively in teams and groups', difficulty: 'beginner', resources: ['Team Building Activities', 'Communication Skills Course', 'Leadership Training'] },
    { id: 'project-management', name: 'Project Management', category: 'Soft Skills', description: 'Planning, organizing, and managing projects', difficulty: 'intermediate', resources: ['PMP Certification', 'Agile Methodology', 'Project Management Institute'] },
    
    // Research & Analysis
    { id: 'research-methods', name: 'Research Methods', category: 'Research', description: 'Scientific research methodology and experimental design', difficulty: 'intermediate', resources: ['Research Methods Course', 'Scientific Writing', 'Experimental Design'] },
    { id: 'data-analysis', name: 'Data Analysis', category: 'Research', description: 'Analyzing and interpreting research data', difficulty: 'intermediate', resources: ['Data Analysis Course', 'SPSS Tutorials', 'Excel for Data Analysis'] },
    { id: 'scientific-writing', name: 'Scientific Writing', category: 'Research', description: 'Writing research papers and technical documents', difficulty: 'intermediate', resources: ['Scientific Writing Course', 'Academic Writing', 'Technical Writing'] },
    
    // Specialized Skills
    { id: 'network-security', name: 'Network Security', category: 'Cybersecurity', description: 'Understanding of network security principles and practices', difficulty: 'advanced', resources: ['CompTIA Security+', 'Cisco CCNA Security', 'Cybrary'] },
    { id: 'threat-analysis', name: 'Threat Analysis', category: 'Cybersecurity', description: 'Identifying and analyzing security threats', difficulty: 'advanced', resources: ['SANS Courses', 'Cybersecurity Bootcamp', 'HackTheBox'] },
    { id: 'biology', name: 'Biology', category: 'Science', description: 'Understanding of biological systems and processes', difficulty: 'intermediate', resources: ['Khan Academy Biology', 'MIT Biology', 'Biology for Engineers'] },
    { id: 'environmental-analysis', name: 'Environmental Analysis', category: 'Science', description: 'Environmental assessment and analysis techniques', difficulty: 'intermediate', resources: ['Environmental Science Course', 'EPA Resources', 'Environmental Analysis Methods'] }
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'What type of work environment do you prefer?',
      options: ['Working with computers and technology', 'Working with physical systems and machines', 'Working in laboratories or research settings', 'Working outdoors or in the field'],
      category: 'environment'
    },
    {
      id: 2,
      question: 'What skills do you enjoy using most?',
      options: ['Problem-solving and logical thinking', 'Creative design and innovation', 'Research and analysis', 'Hands-on building and testing'],
      category: 'skills'
    },
    {
      id: 3,
      question: 'What level of education are you willing to pursue?',
      options: ['Bachelor\'s degree', 'Master\'s degree', 'Ph.D. or advanced degree', 'Certifications and ongoing learning'],
      category: 'education'
    },
    {
      id: 4,
      question: 'What type of impact do you want to make?',
      options: ['Improving technology and digital experiences', 'Solving environmental challenges', 'Advancing scientific knowledge', 'Building physical infrastructure'],
      category: 'impact'
    },
    {
      id: 5,
      question: 'What salary range are you looking for?',
      options: ['$50,000 - $80,000', '$80,000 - $120,000', '$120,000 - $160,000', '$160,000+'],
      category: 'salary'
    }
  ];

  const categories = ['all', 'Technology', 'Engineering', 'Science'];

  const filteredCareers = careers.filter(career => {
    const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    // Simple recommendation algorithm based on answers
    const answers = Object.values(quizAnswers);
    let recommendedCategory = 'Technology'; // default

    if (answers[0] === 'Working with physical systems and machines' || 
        answers[1] === 'Hands-on building and testing' ||
        answers[3] === 'Building physical infrastructure') {
      recommendedCategory = 'Engineering';
    } else if (answers[0] === 'Working in laboratories or research settings' ||
               answers[1] === 'Research and analysis' ||
               answers[3] === 'Advancing scientific knowledge') {
      recommendedCategory = 'Science';
    }

    const recommendations = careers.filter(career => career.category === recommendedCategory);
    setRecommendedCareers(recommendations);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setRecommendedCareers([]);
  };

  // Skill Gap Analysis functions
  const startSkillAnalysis = (career: Career) => {
    setSelectedCareerForAnalysis(career);
    setCurrentSkillIndex(0);
    setShowSkillResults(false);
    setSkillAssessments([]);
  };

  const handleSkillAssessment = (proficiency: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    const currentSkill = skills[currentSkillIndex];
    const newAssessment: SkillAssessment = {
      skillId: currentSkill.id,
      skillName: currentSkill.name,
      proficiency: proficiency
    };

    setSkillAssessments(prev => [...prev, newAssessment]);

    if (currentSkillIndex < skills.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1);
    } else {
      setShowSkillResults(true);
    }
  };

  const getSkillGapAnalysis = () => {
    if (!selectedCareerForAnalysis) return [];

    const careerSkills = selectedCareerForAnalysis.skills;
    const gaps = [];

    for (const careerSkill of careerSkills) {
      const matchingSkill = skills.find(skill => 
        skill.name.toLowerCase().includes(careerSkill.toLowerCase()) ||
        careerSkill.toLowerCase().includes(skill.name.toLowerCase())
      );

      if (matchingSkill) {
        const assessment = skillAssessments.find(a => a.skillId === matchingSkill.id);
        const proficiency = assessment?.proficiency || 'none';
        
        gaps.push({
          skill: matchingSkill,
          required: 'intermediate', // Default requirement
          current: proficiency,
          gap: getGapLevel(proficiency, 'intermediate'),
          resources: matchingSkill.resources
        });
      }
    }

    return gaps;
  };

  const getGapLevel = (current: string, required: string): 'none' | 'small' | 'medium' | 'large' => {
    const levels = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(current);
    const requiredIndex = levels.indexOf(required);
    const difference = requiredIndex - currentIndex;

    if (difference <= 0) return 'none';
    if (difference === 1) return 'small';
    if (difference === 2) return 'medium';
    return 'large';
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'none': return '#10B981'; // green
      case 'small': return '#F59E0B'; // yellow
      case 'medium': return '#F97316'; // orange
      case 'large': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const resetSkillAnalysis = () => {
    setSelectedCareerForAnalysis(null);
    setSkillAssessments([]);
    setShowSkillResults(false);
    setCurrentSkillIndex(0);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🔬 STEM Career Guide</h1>
          <nav className="nav">
            <button 
              className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              Explore Careers
            </button>
            <button 
              className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              Career Quiz
            </button>
            <button 
              className={`nav-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skill Analysis
            </button>
            <button 
              className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'explore' && (
          <div className="explore-section">
            <div className="filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search careers, skills, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="careers-grid">
              {filteredCareers.map(career => (
                <div key={career.id} className="career-card">
                  <div className="career-header">
                    <h3 className="career-title">{career.title}</h3>
                    <span className="career-category">{career.category}</span>
                  </div>
                  <p className="career-description">{career.description}</p>
                  <div className="career-details">
                    <div className="detail-item">
                      <strong>Salary:</strong> {career.salary}
                    </div>
                    <div className="detail-item">
                      <strong>Education:</strong> {career.education}
                    </div>
                    <div className="detail-item">
                      <strong>Growth:</strong> {career.growth}
                    </div>
                  </div>
                  <div className="skills-section">
                    <strong>Key Skills:</strong>
                    <div className="skills-list">
                      {career.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="companies-section">
                    <strong>Top Companies:</strong>
                    <p className="companies-list">{career.companies.join(', ')}</p>
                  </div>
                  <button 
                    className="analyze-skills-btn"
                    onClick={() => startSkillAnalysis(career)}
                  >
                    Analyze My Skills
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="quiz-section">
            {!showResults ? (
              <div className="quiz-container">
                <div className="quiz-progress">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </div>
                <div className="question-card">
                  <h2 className="question-text">
                    {quizQuestions[currentQuestion].question}
                  </h2>
                  <div className="options-list">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${quizAnswers[currentQuestion] === option ? 'selected' : ''}`}
                        onClick={() => handleQuizAnswer(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="quiz-navigation">
                    {currentQuestion > 0 && (
                      <button 
                        className="nav-button secondary"
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      >
                        Previous
                      </button>
                    )}
                    <button 
                      className={`nav-button primary ${!quizAnswers[currentQuestion] ? 'disabled' : ''}`}
                      onClick={nextQuestion}
                      disabled={!quizAnswers[currentQuestion]}
                    >
                      {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="results-container">
                <h2 className="results-title">Your Career Recommendations</h2>
                <p className="results-description">
                  Based on your answers, here are some STEM careers that might be a great fit for you:
                </p>
                <div className="recommendations-grid">
                  {recommendedCareers.map(career => (
                    <div key={career.id} className="recommendation-card">
                      <h3 className="recommendation-title">{career.title}</h3>
                      <p className="recommendation-description">{career.description}</p>
                      <div className="recommendation-details">
                        <div><strong>Salary:</strong> {career.salary}</div>
                        <div><strong>Growth:</strong> {career.growth}</div>
                      </div>
                      <button 
                        className="analyze-skills-btn"
                        onClick={() => startSkillAnalysis(career)}
                      >
                        Analyze My Skills
                      </button>
                    </div>
                  ))}
                </div>
                <button className="reset-quiz-btn" onClick={resetQuiz}>
                  Take Quiz Again
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            {!selectedCareerForAnalysis ? (
              <div className="skills-intro">
                <h2>Skill Gap Analysis</h2>
                <p>Choose a career to analyze your current skills and identify what you need to learn.</p>
                <div className="careers-grid">
                  {careers.map(career => (
                    <div key={career.id} className="career-card">
                      <div className="career-header">
                        <h3 className="career-title">{career.title}</h3>
                        <span className="career-category">{career.category}</span>
                      </div>
                      <p className="career-description">{career.description}</p>
                      <button 
                        className="analyze-skills-btn"
                        onClick={() => startSkillAnalysis(career)}
                      >
                        Analyze My Skills
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : !showSkillResults ? (
              <div className="skill-assessment-container">
                <div className="skill-progress">
                  Skill {currentSkillIndex + 1} of {skills.length}
                </div>
                <div className="skill-question-card">
                  <h2 className="skill-question-title">
                    How would you rate your proficiency in:
                  </h2>
                  <h3 className="skill-name">{skills[currentSkillIndex].name}</h3>
                  <p className="skill-description">{skills[currentSkillIndex].description}</p>
                  <div className="proficiency-options">
                    {['none', 'beginner', 'intermediate', 'advanced', 'expert'].map(level => (
                      <button
                        key={level}
                        className="proficiency-btn"
                        onClick={() => handleSkillAssessment(level as any)}
                      >
                        <span className="proficiency-level">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                        <span className="proficiency-description">
                          {level === 'none' && 'No experience'}
                          {level === 'beginner' && 'Basic understanding'}
                          {level === 'intermediate' && 'Some practical experience'}
                          {level === 'advanced' && 'Significant experience'}
                          {level === 'expert' && 'Mastery level'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="skill-results-container">
                <h2 className="skill-results-title">
                  Skill Gap Analysis for {selectedCareerForAnalysis.title}
                </h2>
                <p className="skill-results-description">
                  Here's what you need to learn to pursue this career:
                </p>
                
                <div className="skill-gaps">
                  {getSkillGapAnalysis().map((gap, index) => (
                    <div key={index} className="skill-gap-card">
                      <div className="skill-gap-header">
                        <h3 className="skill-gap-name">{gap.skill.name}</h3>
                        <div className="skill-gap-indicator" style={{ backgroundColor: getGapColor(gap.gap) }}>
                          {gap.gap.toUpperCase()}
                        </div>
                      </div>
                      <div className="skill-gap-details">
                        <div className="skill-level-comparison">
                          <span className="current-level">Current: {gap.current}</span>
                          <span className="required-level">Required: {gap.required}</span>
                        </div>
                        <div className="skill-resources">
                          <strong>Learning Resources:</strong>
                          <ul>
                            {gap.resources.map((resource, idx) => (
                              <li key={idx}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="reset-skills-btn" onClick={resetSkillAnalysis}>
                  Analyze Another Career
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-content">
              <h2>About STEM Career Guide</h2>
              <p>
                Welcome to the STEM Career Guide! This application helps students and professionals 
                explore exciting career opportunities in Science, Technology, Engineering, and Mathematics.
              </p>
              <div className="features">
                <div className="feature">
                  <h3>🎯 Career Exploration</h3>
                  <p>Discover detailed information about various STEM careers, including salary ranges, 
                     required education, and key skills needed for success.</p>
                </div>
                <div className="feature">
                  <h3>🧠 Career Quiz</h3>
                  <p>Take our interactive quiz to get personalized career recommendations based on your 
                     interests, skills, and preferences.</p>
                </div>
                <div className="feature">
                  <h3>📊 Skill Gap Analysis</h3>
                  <p>Analyze your current skills against career requirements and get personalized learning 
                     recommendations to fill the gaps.</p>
                </div>
                <div className="feature">
                  <h3>📈 Growth Insights</h3>
                  <p>Learn about job growth projections and top companies hiring in each field to make 
                     informed career decisions.</p>
                </div>
              </div>
              <div className="stats">
                <div className="stat">
                  <h4>8+</h4>
                  <p>Career Paths</p>
                </div>
                <div className="stat">
                  <h4>3</h4>
                  <p>Categories</p>
                </div>
                <div className="stat">
                  <h4>20+</h4>
                  <p>Skills Analyzed</p>
                </div>
                <div className="stat">
                  <h4>5</h4>
                  <p>Quiz Questions</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
