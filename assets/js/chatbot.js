document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const aiMessages = document.getElementById('ai-messages');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const minimizeBtn = document.querySelector('.ai-controls .ai-control-btn:first-child');
    const closeBtn = document.querySelector('.ai-controls .ai-control-btn:last-child');

    // Resume Data Model
    const resumeData = {
        personal: {
            name: "Aditya Arun Gajbhiye",
            email: "adityagajbhiye77@gmail.com",
            phone: "9604072368",
            address: "Teacher's colony, Ganesh Ward, Gopinvada Road, Post- Shahapur, Dist- Bhandara, Maharashtra, 441906",
            shortBio: "Pre-final year student at IIT BHU with expertise in Web Development, DSA, and Blockchain. Mentor for JEE aspirants, tech enthusiast, and problem-solving geek."
        },
        education: {
            college: {
                name: "IIT (BHU), Varanasi",
                degree: "B-Tech in Pharmaceutical Engineering & Technology",
                cgpa: "7.05",
                year: "2026",
                semesters: {
                    sem1: "6.08",
                    sem2: "7.46",
                    sem3: "6.91",
                    sem4: "7.80",
                    sem6: "Not completed yet"
                }
            },
            school12: {
                name: "Jawahar Navodaya Vidyalaya Gondia",
                percentage: "91.40%",
                year: "2021"
            },
            school10: {
                name: "Jawahar Navodaya Vidyalaya Gondia",
                percentage: "83.80%",
                year: "2019"
            }
        },
        skills: {
            languages: ["C++", "C", "Python", "JavaScript", "HTML", "CSS"],
            devops: ["Docker", "Jenkins", "AWS"],
            databases: ["SQL", "MongoDB"],
            testing: ["Jest", "Mocha"],
            web: ["React.js", "Node.js", "MERN Stack"],
            softSkills: ["Leadership", "Business Analysis", "Startup Consulting", "Team Mentoring"]
        },
        experience: [
            {
                company: "Mentor Prep",
                role: "Mentor",
                duration: "May 2024 - June 2024",
                description: [
                    "Completed Virtual Internship on Mentoring and Management",
                    "Guided students in exam preparation through personalized mentorship",
                    "Collaborated with IITian mentors"
                ]
            },
            {
                company: "GuideUp",
                role: "Founder",
                duration: "Present",
                description: [
                    "Created a startup offering mentorship to JEE and NEET aspirants",
                    "Connected students with top mentors from IITs and AIIMS"
                ]
            }
        ],
        projects: [
            {
                name: "Cancer Research Using AI/ML",
                duration: "6 months",
                description: [
                    "Conducted data analysis on cancer research using AI and ML",
                    "Developed web-based data collection platform",
                    "Created Analysis Portal for data visualization"
                ],
                technologies: ["Python", "Machine Learning", "Data Analysis"]
            },
            {
                name: "Mini Weather Station - IoT Project",
                duration: "Aug 2022 - Nov 2022",
                description: [
                    "Developed temperature and humidity monitoring system",
                    "Implemented wireless data logging to remote server",
                    "Utilized AWS for cloud services"
                ],
                technologies: ["IoT", "AWS", "Embedded Systems"]
            }
        ],
        achievements: [
            "2nd position in regional level ICT project exhibition",
            "2nd rank in State Level VVM (Vidyarthi Vigyan Manthan)",
            "Competitive programmer on Codeforces and LeetCode",
            "Robotics enthusiast (participated in IIT Hyderabad's TECHTRON)"
        ],
        leadership: [
            {
                role: "Spirit'23",
                description: [
                    "Led fundraising initiatives (engaged 50+ companies)",
                    "Enhanced event visibility through sponsor relationships"
                ]
            },
            {
                role: "Spirit'24",
                description: [
                    "Coordinated PR for international conference",
                    "Managed relations with 15+ distinguished guests",
                    "Point of contact for senior executives like Romi Singh (Sun Pharma Sr. VP)"
                ]
            }
        ]
    };

    // Natural Language Processing Functions
    function extractKeywords(message) {
        const words = message.toLowerCase().split(/\s+/);
        const keywords = [];
        
        // Common keywords mapping
        const keywordMap = {
            // Personal
            'name': 'personal.name',
            'email': 'personal.email',
            'contact': 'personal',
            'phone': 'personal.phone',
            'address': 'personal.address',
            'bio': 'personal.shortBio',
            
            // Education
            'college': 'education.college.name',
            'university': 'education.college.name',
            'iit': 'education.college.name',
            'bhu': 'education.college.name',
            'degree': 'education.college.degree',
            'cgpa': 'education.college.cgpa',
            'semester': 'education.college.semesters',
            'school': 'education.school12.name',
            '12th': 'education.school12',
            '10th': 'education.school10',
            
            // Skills
            'skill': 'skills',
            'language': 'skills.languages',
            'devops': 'skills.devops',
            'database': 'skills.databases',
            'testing': 'skills.testing',
            'web': 'skills.web',
            'soft': 'skills.softSkills',
            
            // Experience
            'experience': 'experience',
            'work': 'experience',
            'internship': 'experience',
            'job': 'experience',
            'mentor prep': 'experience.0',
            'guideup': 'experience.1',
            
            // Projects
            'project': 'projects',
            'research': 'projects.0',
            'cancer': 'projects.0',
            'weather': 'projects.1',
            'iot': 'projects.1',
            
            // Achievements
            'achievement': 'achievements',
            'award': 'achievements',
            'rank': 'achievements',
            'position': 'achievements',
            
            // Leadership
            'leadership': 'leadership',
            'spirit': 'leadership',
            'responsibility': 'leadership'
        };
        
        // Check for multi-word phrases first
        for (const [phrase, path] of Object.entries(keywordMap)) {
            if (message.toLowerCase().includes(phrase)) {
                keywords.push({ phrase, path });
            }
        }
        
        return keywords.length > 0 ? keywords : null;
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, p) => o && o[p], obj);
    }

    // Enhanced Response Generation
    function generateResponse(keywords, userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Greetings
        if (/^(hi|hello|hey|greetings)/i.test(userMessage)) {
            return `Hello! I'm your AI resume assistant. How can I help you learn more about Aditya's professional background today?`;
        }
        
        // Thanks
        if (/^(thanks|thank you|appreciate)/i.test(userMessage)) {
            return `You're welcome! Let me know if you'd like to know anything else about Aditya's qualifications or experience.`;
        }
        
        // Personal information
        if (keywords.some(k => k.path.startsWith('personal'))) {
            const personalInfo = keywords.find(k => k.path.startsWith('personal'));
            const infoType = personalInfo.path.split('.')[1];
            
            if (infoType === 'name') {
                return `Aditya's full name is <strong>${resumeData.personal.name}</strong>.`;
            }
            else if (infoType === 'email') {
                return `You can contact Aditya via email at <strong>${resumeData.personal.email}</strong>.`;
            }
            else if (infoType === 'phone') {
                return `Aditya's phone number is <strong>${resumeData.personal.phone}</strong>.`;
            }
            else if (infoType === 'address') {
                return `Aditya's address is:<br><strong>${resumeData.personal.address}</strong>`;
            }
            else if (infoType === 'shortBio') {
                return `Here's a brief introduction:<br><em>"${resumeData.personal.shortBio}"</em>`;
            }
            else {
                return `Aditya's contact information:<br>
                - Email: <strong>${resumeData.personal.email}</strong><br>
                - Phone: <strong>${resumeData.personal.phone}</strong><br>
                - Address: <strong>${resumeData.personal.address}</strong>`;
            }
        }
        
        // Education queries
        if (keywords.some(k => k.path.startsWith('education'))) {
            const eduKeyword = keywords.find(k => k.path.startsWith('education'));
            const eduType = eduKeyword.path.split('.')[1];
            
            if (eduType === 'college') {
                const detail = eduKeyword.path.split('.')[2];
                if (detail === 'name') {
                    return `Aditya is currently studying at <strong>${resumeData.education.college.name}</strong>.`;
                }
                else if (detail === 'degree') {
                    return `Aditya is pursuing a <strong>${resumeData.education.college.degree}</strong> at ${resumeData.education.college.name}.`;
                }
                else if (detail === 'cgpa') {
                    return `Aditya's current CGPA at ${resumeData.education.college.name} is <strong>${resumeData.education.college.cgpa}</strong> (till Semester IV).`;
                }
                else if (detail === 'semesters') {
                    return `Aditya's semester-wise performance at ${resumeData.education.college.name}:<br>
                    - Semester I: <strong>${resumeData.education.college.semesters.sem1}</strong><br>
                    - Semester II: <strong>${resumeData.education.college.semesters.sem2}</strong><br>
                    - Semester III: <strong>${resumeData.education.college.semesters.sem3}</strong><br>
                    - Semester IV: <strong>${resumeData.education.college.semesters.sem4}</strong>`;
                }
                else {
                    return `Aditya's college education:<br>
                    - Institution: <strong>${resumeData.education.college.name}</strong><br>
                    - Degree: <strong>${resumeData.education.college.degree}</strong><br>
                    - Current CGPA: <strong>${resumeData.education.college.cgpa}</strong><br>
                    - Expected Graduation: <strong>${resumeData.education.college.year}</strong>`;
                }
            }
            else if (eduType === 'school12') {
                return `Aditya completed his 12th standard from <strong>${resumeData.education.school12.name}</strong> with <strong>${resumeData.education.school12.percentage}</strong> in ${resumeData.education.school12.year}.`;
            }
            else if (eduType === 'school10') {
                return `Aditya completed his 10th standard from <strong>${resumeData.education.school10.name}</strong> with <strong>${resumeData.education.school10.percentage}</strong> in ${resumeData.education.school10.year}.`;
            }
            else {
                return `Aditya's educational background:<br><br>
                <strong>College:</strong><br>
                - ${resumeData.education.college.degree} at ${resumeData.education.college.name}<br>
                - CGPA: ${resumeData.education.college.cgpa} (till Sem IV)<br>
                - Expected Graduation: ${resumeData.education.college.year}<br><br>
                <strong>12th Standard:</strong><br>
               - ${resumeData.education.school12.name} (${resumeData.education.school12.percentage})<br><br>
                <strong>10th Standard:</strong><br>
                - ${resumeData.education.school10.name} (${resumeData.education.school10.percentage})`;
            }
        }
        
        // Skills queries
        if (keywords.some(k => k.path.startsWith('skills'))) {
            const skillType = keywords.find(k => k.path.startsWith('skills')).path.split('.')[1];
            
            if (!skillType) {
                return `Aditya has a diverse set of technical and professional skills:<br><br>
                <strong>Programming Languages:</strong><br>
                - ${resumeData.skills.languages.join(', ')}<br><br>
                <strong>DevOps & Cloud:</strong><br>
                - ${resumeData.skills.devops.join(', ')}<br><br>
                <strong>Web Development:</strong><br>
                - ${resumeData.skills.web.join(', ')}<br><br>
                <strong>Databases:</strong><br>
                - ${resumeData.skills.databases.join(', ')}<br><br>
                <strong>Testing:</strong><br>
                - ${resumeData.skills.testing.join(', ')}<br><br>
                <strong>Soft Skills:</strong><br>
                - ${resumeData.skills.softSkills.join(', ')}`;
            }
            else if (skillType === 'languages') {
                return `Aditya is proficient in these programming languages:<br>
                - ${resumeData.skills.languages.join('<br>- ')}`;
            }
            else if (skillType === 'devops') {
                return `Aditya's DevOps and Cloud skills include:<br>
                - ${resumeData.skills.devops.join('<br>- ')}`;
            }
            else if (skillType === 'web') {
                return `Aditya's web development skills:<br>
                - ${resumeData.skills.web.join('<br>- ')}<br><br>
                He's particularly experienced with the MERN stack (MongoDB, Express, React, Node.js).`;
            }
            else if (skillType === 'softSkills') {
                return `Aditya's professional soft skills:<br>
                - ${resumeData.skills.softSkills.join('<br>- ')}`;
            }
            else {
                return `Aditya has skills in ${skillType}:<br>
                - ${getNestedValue(resumeData.skills, skillType).join('<br>- ')}`;
            }
        }
        
        // Experience queries
        if (keywords.some(k => k.path.startsWith('experience'))) {
            const exp = keywords.find(k => k.path.startsWith('experience'));
            const expIndex = exp.path.split('.')[1];
            
            if (expIndex) {
                const experience = resumeData.experience[expIndex];
                return `<strong>${experience.role} at ${experience.company}</strong> (${experience.duration}):<br>
                - ${experience.description.join('<br>- ')}`;
            }
            else {
                let response = `<strong>Work Experience:</strong><br><br>`;
                resumeData.experience.forEach(exp => {
                    response += `<strong>${exp.role} at ${exp.company}</strong> (${exp.duration}):<br>
                    - ${exp.description.join('<br>- ')}<br><br>`;
                });
                return response;
            }
        }
        
        // Project queries
        if (keywords.some(k => k.path.startsWith('projects'))) {
            const proj = keywords.find(k => k.path.startsWith('projects'));
            const projIndex = proj.path.split('.')[1];
            
            if (projIndex) {
                const project = resumeData.projects[projIndex];
                return `<strong>Project: ${project.name}</strong> (${project.duration}):<br>
                - ${project.description.join('<br>- ')}<br><br>
                <strong>Technologies used:</strong> ${project.technologies.join(', ')}`;
            }
            else {
                let response = `<strong>Projects:</strong><br><br>`;
                resumeData.projects.forEach(proj => {
                    response += `<strong>${proj.name}</strong> (${proj.duration}):<br>
                    - ${proj.description.join('<br>- ')}<br><br>`;
                });
                return response;
            }
        }
        
        // Achievement queries
        if (keywords.some(k => k.path.startsWith('achievements'))) {
            return `<strong>Notable Achievements:</strong><br>
            - ${resumeData.achievements.join('<br>- ')}`;
        }
        
        // Leadership queries
        if (keywords.some(k => k.path.startsWith('leadership'))) {
            const lead = keywords.find(k => k.path.startsWith('leadership'));
            const leadIndex = lead.path.split('.')[1];
            
            if (leadIndex) {
                const leadership = resumeData.leadership[leadIndex];
                return `<strong>${leadership.role}:</strong><br>
                - ${leadership.description.join('<br>- ')}`;
            }
            else {
                let response = `<strong>Leadership Positions:</strong><br><br>`;
                resumeData.leadership.forEach(lead => {
                    response += `<strong>${lead.role}:</strong><br>
                    - ${lead.description.join('<br>- ')}<br><br>`;
                });
                return response;
            }
        }
        
        // Default response
        return `I can help you learn about Aditya's:<br><br>
        <div class="response-options">
            <div class="option-card" onclick="this.parentNode.parentNode.querySelector('#ai-input').value='What is your educational background?'">
                <div class="option-icon">🎓</div>
                <div class="option-text">Education</div>
            </div>
            <div class="option-card" onclick="this.parentNode.parentNode.querySelector('#ai-input').value='What skills do you have?'">
                <div class="option-icon">💻</div>
                <div class="option-text">Skills</div>
            </div>
            <div class="option-card" onclick="this.parentNode.parentNode.querySelector('#ai-input').value='Tell me about your projects'">
                <div class="option-icon">🚀</div>
                <div class="option-text">Projects</div>
            </div>
            <div class="option-card" onclick="this.parentNode.parentNode.querySelector('#ai-input').value='What is your work experience?'">
                <div class="option-icon">💼</div>
                <div class="option-text">Experience</div>
            </div>
        </div>
        <p>Or ask me something specific like:<br>
        - "What's your CGPA?"<br>
        - "Tell me about your cancer research project"<br>
        - "What DevOps tools are you familiar with?"</p>`;
    }

    // Chat Interface Functions
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            aiInput.value = '';
            showTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                const keywords = extractKeywords(message);
                const response = keywords ? 
                    generateResponse(keywords, message) : 
                    `I'm not sure I understand. Could you rephrase your question?<br><br>
                    Try asking about my:<br>
                    - Education background<br>
                    - Technical skills<br>
                    - Work experience<br>
                    - Projects`;
                
                addMessage(response, 'assistant');
            }, 1000 + Math.random() * 1000);
        }
    }

    function addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('ai-message', sender);
        
        if (sender === 'assistant') {
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="assets/images/ai-avatar.png" alt="AI" loading="lazy">
                </div>
                <div class="message-content">
                    ${content}
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="assets/images/user-avatar.png" alt="You" loading="lazy">
                </div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
        }
        
        aiMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('ai-message', 'assistant');
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <img src="assets/images/ai-avatar.png" alt="AI" loading="lazy">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        aiMessages.appendChild(typingElement);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingElement = document.getElementById('typingIndicator');
        if (typingElement) typingElement.remove();
    }

    function scrollToBottom() {
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Event Listeners
    aiSend.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            aiInput.value = this.textContent;
            aiInput.focus();
        });
    });

    minimizeBtn.addEventListener('click', () => {
        document.querySelector('.ai-resume-assistant').classList.toggle('minimized');
    });

    closeBtn.addEventListener('click', () => {
        document.querySelector('.ai-resume-assistant').classList.add('hidden');
        // Could add a small floating button to reopen the chat
    });

    // Initial welcome message after a delay
    setTimeout(() => {
        if (aiMessages.children.length <= 1) {
            const welcomeMessages = [
                "I'm your AI resume assistant. I can provide detailed information about Aditya's professional background.",
                "You can ask me about Aditya's education, skills, work experience, projects, or achievements.",
                "Try asking something like:<br>- 'Tell me about your education'<br>- 'What projects have you worked on?'<br>- 'What are your technical skills?'"
            ];
            
            welcomeMessages.forEach((msg, i) => {
                setTimeout(() => {
                    addMessage(msg, 'assistant');
                }, i * 800);
            });
        }
    }, 1500);
});