
const express = require('express');
const app = express();
app.use(express.json());

const resumeData = {
  name: "Aditya Arun Gajbhiye",
  skills: ["C++", "C", "Python", "HTML", "CSS", "JavaScript", "Docker", "Jenkins", "SQL", "MongoDB", "Jest", "Mocha", "AWS"],
  education: [
    { degree: "B.Tech", institution: "Pharmaceutical Engineering & Technology IIT (BHU)", score: "7.05" },
    { degree: "CBSE XII", institution: "Jawahar Navodaya Vidyalaya Gondia", score: "91.40%" },
    { degree: "CBSE X", institution: "Jawahar Navodaya Vidyalaya Gondia", score: "83.80%" }
  ],
  projects: [
    { name: "Mini Weather Station", description: "IoT project for temperature/humidity monitoring with AWS cloud integration" },
    { name: "Cancer Research AI/ML", description: "Data analysis project using machine learning techniques" }
  ],
  experience: [
    { role: "Mentor", company: "Mentor Prep", duration: "May 2024 - Jun 2024", description: "Virtual internship on mentoring and management" }
  ]
};

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  let response = "I can answer questions about Aditya's: skills, education, projects, or work experience.";
  
  // Simple keyword matching - replace with actual NLP in production
  if (message.toLowerCase().includes('skill')) {
    response = `Technical Skills:\n- ${resumeData.skills.join('\n- ')}`;
  }
  else if (message.toLowerCase().includes('educat') || message.toLowerCase().includes('degree')) {
    response = `Education:\n${resumeData.education.map(e => `- ${e.degree} from ${e.institution} (${e.score})`).join('\n')}`;
  }
  // Add more response handlers as needed
  
  res.json({ reply: response });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI service running on port ${PORT}`));