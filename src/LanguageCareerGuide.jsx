import React, { useState } from 'react';

export default function LanguageCareerGuide() {
  const [selectedLang, setSelectedLang] = useState('c');

  const languages = [
    {
      id: 'c',
      name: 'C Language',
      icon: '⚙️',
      color: '#38bdf8',
      tagline: 'The Mother of All Modern Languages',
      beginnerDifficulty: 'Medium (Teaches Memory & Pointers)',
      fields: [
        'Operating Systems (Linux, Windows, macOS Kernel)',
        'Embedded Systems & Microcontrollers (Robotics, Automotive)',
        'IoT (Internet of Things) & Smart Devices',
        'Game Engine Core (Unreal Engine C++)',
        'Database Engines (MySQL, PostgreSQL Core)'
      ],
      jobTitles: [
        'Embedded Systems Engineer',
        'Firmware Developer',
        'System Software Developer',
        'Robotics Software Engineer'
      ],
      famousApps: ['Linux OS Kernel', 'Windows Kernel', 'Git VCS', 'Python Interpreter (CPython)'],
      whyLearn: 'If you master C, learning any other programming language like Java, Python, or JS becomes extremely easy because C teaches you how the computer hardware and RAM memory actually work under the hood!'
    },
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      color: '#f59e0b',
      tagline: 'Enterprise Class & Android Development',
      beginnerDifficulty: 'Moderate (Strict Rules & Object-Oriented)',
      fields: [
        'Enterprise Backend Systems (Banking, FinTech, E-Commerce)',
        'Android Native App Development',
        'Big Data Engineering (Hadoop, Apache Spark)',
        'Cloud Infrastructure & Microservices (Spring Boot)'
      ],
      jobTitles: [
        'Java Backend Developer',
        'Android Developer',
        'Enterprise Application Engineer',
        'FinTech Software Architect'
      ],
      famousApps: ['Android OS Apps', 'Minecraft', 'Amazon Backend Services', 'Uber Backend'],
      whyLearn: 'Java is trusted by 90% of Fortune 500 companies for large-scale, high-security server applications. It is famous for "Write Once, Run Anywhere".'
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#34d399',
      tagline: 'AI, Data Science & Fast Prototyping',
      beginnerDifficulty: 'Easiest (Reads like English)',
      fields: [
        'Artificial Intelligence (AI) & Machine Learning (PyTorch, TensorFlow)',
        'Data Science & Analytics (Pandas, NumPy)',
        'Web Backends (Django, FastAPI)',
        'Cybersecurity & Automation Scripting'
      ],
      jobTitles: [
        'Data Scientist / Analyst',
        'AI / Machine Learning Engineer',
        'Python Web Developer',
        'Automation / QA Scripting Engineer'
      ],
      famousApps: ['ChatGPT / OpenAI Backend', 'Instagram Backend', 'Spotify Recommendation Engine', 'Netflix Algorithm'],
      whyLearn: 'Python has the cleanest, simplest syntax for beginners. It is the #1 language worldwide for Artificial Intelligence, Machine Learning, and Data Analysis.'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '🌐',
      color: '#f472b6',
      tagline: 'The Language of the Web & Full Stack',
      beginnerDifficulty: 'Easy (Instant Visual Feedback in Browsers)',
      fields: [
        'Front-End Web Development (React, Vue, Next.js)',
        'Full-Stack Web Development (Node.js, Express)',
        'Cross-Platform Mobile Apps (React Native)',
        'Desktop Apps (Electron - VS Code, Discord)'
      ],
      jobTitles: [
        'Frontend Web Developer',
        'Full-Stack Web Engineer',
        'React / Node.js Developer',
        'UI/UX Web Engineer'
      ],
      famousApps: ['YouTube Web App', 'Netflix Web App', 'VS Code Editor', 'Discord App'],
      whyLearn: 'JavaScript is the ONLY language that runs natively inside every web browser on Earth. If you want to build websites, web dashboards, or web apps, JavaScript is mandatory.'
    }
  ];

  const current = languages.find(l => l.id === selectedLang) || languages[0];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
            Which Language Should You Learn? (Career & Field Guide)
          </h2>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
          Confused about which language to pick? Every programming language is a tool built for specific jobs. 
          Click a language below to explore which career fields, jobs, and apps use it!
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {languages.map(l => {
          const isActive = selectedLang === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setSelectedLang(l.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: isActive ? `2px solid ${l.color}` : '1px solid #334155',
                background: isActive ? `${l.color}20` : '#0f172a',
                color: isActive ? l.color : '#94a3b8',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{l.icon}</span>
              <span>{l.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Details Card */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '14px',
        padding: '24px',
        border: `1.5px solid ${current.color}`,
        boxShadow: `0 0 20px ${current.color}15`
      }}>
        {/* Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>{current.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: current.color }}>
                  {current.name}
                </h3>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
                  {current.tagline}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            Beginner Difficulty: <strong style={{ color: '#fff' }}>{current.beginnerDifficulty}</strong>
          </div>
        </div>

        {/* Why Learn It Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          borderLeft: `4px solid ${current.color}`
        }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: current.color }}>
            💡 Why Learn {current.name}?
          </h4>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#e2e8f0', lineHeight: '1.5' }}>
            {current.whyLearn}
          </p>
        </div>

        {/* Grid: Fields & Job Titles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Fields */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #334155'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span> Fields & Industries
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
              {current.fields.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Job Titles */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #334155'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💼</span> Target Job Roles
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
              {current.jobTitles.map((j, i) => (
                <li key={i}><strong>{j}</strong></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Famous Apps Built With This */}
        <div style={{
          background: '#090d16',
          padding: '14px 18px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
            🌟 Famous Software Built With {current.name}:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {current.famousApps.map((app, i) => (
              <span key={i} style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#f1f5f9',
                fontWeight: '500'
              }}>
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
