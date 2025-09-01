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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'about'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);

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
                  <h3>📊 Growth Insights</h3>
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
