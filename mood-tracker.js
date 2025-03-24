let userData = {
    gender: null,
    mood: null,
    responses: []
};

// Questions based on gender and mood
const questions = {
    female: {
        happy: [
            "Aha! Whats the best thing that happened today?",
            "What small moment today made your heart smile the most?",
            "So you feel happy or confident right now?",
        ],
        sad: [
            "I understand you're feeling down. What's weighing on your mind?",
            "Sometimes sharing helps. What triggered this feeling?",
            "On a scale of gentle rain to storm, how heavy does this sadness feel?"
        ],
        angry: [
            "I see you're frustrated. What sparked this feeling?",
            "What would help release some of this tension right now?",
            "If you could change one thing in this moment, what would it be?"
        ],
        anxious: [
            "Let's breathe together. What's making your mind race?",
            "Is this a familiar feeling or something new?",
            "What's the biggest worry on your mind right now?"
        ],
        neutral: [
            "How would you describe your energy level today?",
            "What could make this moment a bit brighter?",
            "Is there something specific keeping you in this middle ground?"
        ]
    },
    male: {
        happy: [
            "What victory or achievement brought this good mood?",
            "Is there someone who helped create this positive feeling?",
            "What would make this great moment even better?"
        ],
        sad: [
            "I'm here to listen. What's bringing you down?",
            "Sometimes life hits hard. What's the main thing troubling you?",
            "Would you say this is situational or something deeper?"
        ],
        angry: [
            "What's the root cause of this frustration?",
            "On a scale of 1-10, how intense is this feeling?",
            "What would help you feel more in control right now?"
        ],
        anxious: [
            "What's the main thing causing this anxiety?",
            "Is this about something happening now or in the future?",
            "What usually helps when you feel this way?"
        ],
        neutral: [
            "What's keeping your mood balanced today?",
            "Is this your usual state or different from normal?",
            "What could tip the scales toward positive?"
        ]
    }
};

// Enhanced suggestions based on mood with specific reasons and coping strategies
const suggestions = {
    happy: [
        "🌟 Achievement unlocked! Write down this success in your gratitude journal",
        "🎵 Create a 'Happy Moments' playlist to capture this feeling",
        "📸 Take a selfie or photo to remember this positive moment",
        "🤝 Share your joy with someone - happiness multiplies when shared",
        "🎯 Use this energy to tackle something you've been putting off"
    ],
    sad: [
        "😔 Feeling lonely or disconnected from others",
        "💔 Going through a breakup or relationship issues",
        "📉 Work or academic stress getting you down",
        "👥 Missing someone special in your life",
        "🌧️ Seasonal or weather-related mood dip",
        "⏰ Feeling stuck in life or lacking direction",
        "💭 Overthinking past events or decisions",
        "🏥 Health concerns affecting your mood",
        "💰 Financial worries weighing you down",
        "🎭 Identity or self-worth struggles"
    ],
    angry: [
        "😠 Someone disrespected your boundaries",
        "⚖️ Dealing with unfairness or injustice",
        "🗣️ Communication breakdown with someone",
        "❌ Plans got cancelled or disrupted",
        "💼 Work-related frustrations",
        "🏠 Family or relationship conflicts",
        "🎮 Technical issues ruining your day",
        "⏱️ Running late or time pressure",
        "💪 Feeling powerless in a situation",
        "🔄 Repeating patterns that trigger you"
    ],
    anxious: [
        "📅 Upcoming deadline or important event",
        "👥 Social situation making you nervous",
        "💭 Overthinking future scenarios",
        "📱 Information overload or social media",
        "🎯 Perfectionism causing stress",
        "💼 Work presentation or meeting",
        "💕 Relationship uncertainty",
        "💰 Financial concerns",
        "🏥 Health-related worries",
        "🌍 Global events causing stress"
    ],
    neutral: [
        "😐 Just going through the motions today",
        "🔄 Regular routine, nothing special",
        "💭 Mind feels clear but not excited",
        "🌤️ Waiting for something to happen",
        "📊 Balanced but looking for inspiration",
        "🎯 Focused but not particularly emotional",
        "🧘‍♂️ Feeling centered and calm",
        "📝 Getting tasks done without stress",
        "🤔 Contemplative but not worried",
        "⚖️ Everything's okay, just neutral"
    ]
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    gender: document.getElementById('genderScreen'),
    assessment: document.getElementById('assessmentScreen'),
    chat: document.getElementById('chatScreen')
};

// Initialize with welcome screen active
document.addEventListener('DOMContentLoaded', () => {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens.welcome.classList.add('active');
});

const startBtn = document.querySelector('.start-btn');
const genderOptions = document.querySelectorAll('.gender-option');
const moodOptions = document.querySelectorAll('.mood-option');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');
const suggestionsList = document.querySelector('.suggestions-list');
const progressSteps = document.querySelectorAll('.progress-step');

// Event Listeners
startBtn.addEventListener('click', () => {
    switchScreen('welcome', 'gender');
    updateProgress(1);
});

genderOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove previous selection
        genderOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selection to clicked option
        option.classList.add('selected');
        
        userData.gender = option.dataset.gender;
        updateProgress(2);
        
        // Delay transition for visual feedback
        setTimeout(() => {
            switchScreen('gender', 'assessment');
        }, 500);
    });
});

moodOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove previous selection
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selection to clicked option
        option.classList.add('selected');
        
        userData.mood = option.dataset.mood;
        updateProgress(3);
        
        // Delay transition for visual feedback
        setTimeout(() => {
            switchScreen('assessment', 'chat');
            initializeChat();
        }, 500);
    });
});

sendButton.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage();
    }
});

// Functions
function switchScreen(from, to) {
    if (!screens[from] || !screens[to]) return;
    
    // Fade out current screen
    screens[from].classList.remove('active');
    
    // Fade in new screen
    setTimeout(() => {
        screens[to].classList.add('active');
    }, 300); // Half of the transition time to ensure smooth animation
}

function updateProgress(step) {
    progressSteps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

function initializeChat() {
    // Clear previous messages
    chatMessages.innerHTML = '';
    suggestionsList.innerHTML = '';
    
    // Add welcome message based on mood
    const welcomeMessages = {
        happy: "That's wonderful to hear! Let's explore what's bringing you joy.",
        sad: "I'm here to listen and support you through this difficult time.",
        angry: "I understand you're frustrated. Let's work through this together.",
        anxious: "It's okay to feel anxious. Let's take it one step at a time.",
        neutral: "Sometimes a neutral day is just what we need. Let's explore your thoughts."
    };
    
    addBotMessage(welcomeMessages[userData.mood] || `Hi! I notice you're feeling ${userData.mood} today. Let's talk about it.`);
    
    // Add first question
    setTimeout(() => {
        const firstQuestion = questions[userData.gender][userData.mood][0];
        addBotMessage(firstQuestion);
    }, 1000);
    
    // Add suggestions with improved styling
    const suggestionTitle = document.createElement('h3');
    suggestionTitle.textContent = getSuggestionTitle(userData.mood);
    suggestionsList.appendChild(suggestionTitle);

    suggestions[userData.mood].forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            chatInput.value = `I'm feeling this way because: ${suggestion.split(' ').slice(1).join(' ')}`;
        });
        suggestionsList.appendChild(div);
    });
}

function getSuggestionTitle(mood) {
    const titles = {
        happy: "🌟 Ways to Celebrate This Feeling",
        sad: "💭 What's Making You Feel Down?",
        angry: "😤 What's Triggering This Feeling?",
        anxious: "😰 Sources of Your Anxiety",
        neutral: "😐 Current State of Mind"
    };
    return titles[mood] || "Suggestions";
}

function handleUserMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    chatInput.value = '';
    
    // Process response
    processUserResponse(message);
}

function addUserMessage(message) {
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processUserResponse(message) {
    userData.responses.push(message);
    
    // Check for quiz-related keywords
    const wantsQuiz = /quiz|assessment|evaluate|check/i.test(message.toLowerCase());
    
    if (wantsQuiz) {
        setTimeout(() => {
            addBotMessage("I'll redirect you to our mood assessment quiz. It will help us understand your current emotional state better.");
            setTimeout(() => {
                window.location.href = 'mood-quiz.html';
            }, 2000);
        }, 1000);
        return;
    }
    
    // Get empathetic response based on current question and answer
    setTimeout(() => {
        const questionIndex = userData.responses.length - 1;
        const response = getEmpathicResponse(message, questionIndex);
        addBotMessage(response);

        // After responding, check if we should continue conversation
        setTimeout(() => {
            if (questionIndex < questions[userData.gender][userData.mood].length - 1) {
                // Ask next question
                addBotMessage(questions[userData.gender][userData.mood][questionIndex + 1]);
            } else {
                // Continue with dynamic conversation
                const followUp = generateDynamicFollowUp(message, userData.mood);
                addBotMessage(followUp);
            }
        }, 1500);
    }, 1000);
}

// Add new function for dynamic follow-up responses
function generateDynamicFollowUp(message, mood) {
    const lowercaseMsg = message.toLowerCase();
    
    // Detect message sentiment
    const hasPositive = /(good|great|better|happy|excited|wonderful|love|enjoy)/i.test(lowercaseMsg);
    const hasNegative = /(bad|worse|sad|angry|frustrated|anxious|worried|stress)/i.test(lowercaseMsg);
    const hasAction = /(try|want|need|going|plan|think|hope)/i.test(lowercaseMsg);
    const hasQuestion = /(\?|how|what|why|when|where|who)/i.test(lowercaseMsg);

    const dynamicResponses = {
        happy: {
            positive: [
                "Your enthusiasm is contagious! What else brings you this kind of joy? 🌟",
                "I love how you're embracing these positive moments! What's another highlight from your day? ✨",
                "That's such a wonderful perspective! Have you shared this happiness with others? 🎉",
                "You're radiating such positive energy! What's your secret to maintaining this joy? 💫",
                "It's amazing to see you so upbeat! What's the next exciting thing you're looking forward to? 🌈"
            ],
            action: [
                "That's a great plan! How can we make it even more enjoyable? 🎯",
                "Love your proactive approach! What's the first step you'll take? 🚀",
                "You're on a roll! What inspired this positive direction? ⭐",
                "Such wonderful initiative! How can we build on this momentum? 🌟",
                "That's an exciting move! What made you decide to take this step? 💫"
            ],
            question: [
                "That's a great question! Let's explore what makes you happiest about this situation. 🤔",
                "Interesting thought! What do you think is contributing to your positive mood? 💭",
                "I love your curiosity! What other positive aspects would you like to explore? 🌟",
                "That's worth celebrating! What other questions are on your mind? ✨",
                "Great point to ponder! How does asking this make you feel? 🎯"
            ]
        },
        sad: {
            negative: [
                "I hear the pain in your words. Would you like to tell me more about what's weighing on your heart? 💜",
                "That sounds really difficult. What kind of support would be most helpful right now? 🫂",
                "I'm here to listen. How long have you been carrying this feeling? 🌸",
                "Your feelings are valid. What would gentle kindness look like for you today? 💫",
                "Sometimes the weight feels heavy. What usually helps you feel even a tiny bit better? 🌱"
            ],
            action: [
                "It's brave of you to want to take action. What small step feels manageable right now? 🌟",
                "Taking any step when feeling down is courageous. How can I support your journey? 💪",
                "That's a thoughtful approach. What makes this feel like the right move? 🎯",
                "I admire your resilience. What helped you decide to take this step? 💭",
                "Every small action matters. What would make this step feel safer? 🫂"
            ],
            question: [
                "That's a meaningful question. Let's explore it together with compassion. 💜",
                "I appreciate you asking that. What thoughts led you to this question? 🤝",
                "Sometimes questions help us understand our feelings better. What answers are you hoping to find? 💭",
                "That's something worth exploring. How does asking this question make you feel? 🌸",
                "Thank you for sharing your thoughts. What else is on your mind? 💫"
            ]
        },
        angry: {
            negative: [
                "Your frustration is completely valid. What would help release some of this tension? 💪",
                "I can hear how intense this feels. What's the most infuriating part? 🎯",
                "That sounds really frustrating. How long has this been building up? 🔥",
                "It's okay to be angry. What boundaries feel like they've been crossed? ⚡",
                "This situation sounds challenging. What would justice look like for you? 💢"
            ],
            action: [
                "Channeling anger into action can be powerful. What's your first move? 🎯",
                "That's a strong step forward. How can we make this action most effective? 💪",
                "Taking control of the situation - I like it. What's driving this decision? ⚡",
                "Action can be empowering. What outcome are you hoping for? 🔥",
                "That's a powerful choice. How can we ensure it serves you well? 💫"
            ],
            question: [
                "Important question. Let's break this down with clarity and purpose. 🎯",
                "That's worth exploring. What answers would feel satisfying? 💭",
                "Good point to raise. How would understanding this help you move forward? 💪",
                "Let's examine this together. What aspects feel most urgent? 🤔",
                "Thoughtful question. What insights are you hoping to gain? 🌟"
            ]
        },
        anxious: {
            negative: [
                "Those anxious thoughts can be overwhelming. What's the biggest worry right now? 💭",
                "I hear the concern in your words. Can we break this down into smaller pieces? 🫂",
                "Anxiety can feel so heavy. What helps you feel grounded usually? 🌸",
                "It's okay to feel uncertain. What's the scariest part of this? 💫",
                "These feelings are valid. What would help you feel safer? 🌱"
            ],
            action: [
                "Taking action despite anxiety is brave. What small step feels possible? 🌟",
                "That's a courageous move. How can we make it feel more manageable? 💪",
                "Breaking it down helps. Which part would you like to tackle first? 🎯",
                "Every step counts. What support do you need to move forward? 💭",
                "That's thoughtful planning. How can we reduce the overwhelm? 🫂"
            ],
            question: [
                "Let's explore this question gently. What feels most uncertain? 💭",
                "Good question to ask. How does uncertainty affect your thoughts? 🤔",
                "That's worth understanding better. What answers would help you feel more secure? 🌟",
                "Let's work through this together. What aspects need more clarity? 💫",
                "Thank you for asking. How can we make this feel less overwhelming? 🌸"
            ]
        },
        neutral: {
            general: [
                "Interesting perspective. What would shift this moment from neutral to positive? 🌱",
                "Sometimes neutral is a good place to be. What are you noticing right now? 💭",
                "This could be a moment for reflection. What's on your mind? 🤔",
                "Neutral can be peaceful. How are you experiencing this state? ✨",
                "Let's explore this space together. What feels most present for you? 🌟"
            ],
            action: [
                "That's a balanced approach. What inspired this direction? 🎯",
                "Taking action from a calm state can be powerful. What's your vision? 💫",
                "Thoughtful move. How does this align with what you want? 🌱",
                "That seems well-considered. What outcome are you hoping for? 💭",
                "Interesting choice. What helped you decide on this path? ⭐"
            ],
            question: [
                "Good question to explore. What sparked this curiosity? 🤔",
                "Let's think about this together. What insights are you seeking? 💭",
                "That's worth considering. How does asking this question feel? 🌱",
                "Thoughtful inquiry. What would be helpful to understand better? 💫",
                "Interesting point to ponder. Where would you like this exploration to lead? 🎯"
            ]
        }
    };

    // Select appropriate response category
    let responseCategory;
    if (hasQuestion) responseCategory = 'question';
    else if (hasAction) responseCategory = 'action';
    else if (mood === 'neutral') responseCategory = 'general';
    else if (hasNegative || hasPositive) responseCategory = hasNegative ? 'negative' : 'positive';
    else responseCategory = mood === 'happy' ? 'positive' : 'negative';

    // Get responses for the current mood and category
    const responses = dynamicResponses[mood][responseCategory] || dynamicResponses[mood].general;
    
    // Select a random response
    return responses[Math.floor(Math.random() * responses.length)];
}

function getEmpathicResponse(message, questionIndex) {
    const mood = userData.mood;
    const gender = userData.gender;
    const lowercaseMsg = message.toLowerCase();

    // Check for common emotional keywords
    const hasPositive = /(good|great|better|happy|excited|wonderful|love|enjoy)/i.test(lowercaseMsg);
    const hasNegative = /(bad|worse|sad|angry|frustrated|anxious|worried|stress)/i.test(lowercaseMsg);
    const hasUncertain = /(maybe|perhaps|not sure|kind of|sometimes)/i.test(lowercaseMsg);

    // Responses based on mood and question index
    const responses = {
        happy: {
            0: [
                "That's amazing! It's wonderful to hear about these positive moments. 🌟",
                "Your joy is contagious! I'm so glad you're experiencing this. ✨",
                "What a beautiful moment to celebrate! 🎉"
            ],
            1: [
                "Those small moments often hold the biggest joy. Thank you for sharing! 💫",
                "It's these little things that make life special, isn't it? 🌸",
                "I can feel the warmth in your words! 🌟"
            ],
            2: [
                "Your positive energy is radiating through your words! 🌞",
                "It's so refreshing to hear about your happiness! 🎈",
                "Let's hold onto this wonderful feeling! ⭐"
            ]
        },
        sad: {
            0: [
                "I hear you, and it's completely okay to feel this way. You're not alone in this. 🫂",
                "Thank you for sharing that with me. It takes courage to open up. 💜",
                "I'm here to listen and support you through this. 🌸"
            ],
            1: [
                "That must be really difficult to deal with. How are you coping? 💭",
                "I understand why that would make you feel this way. Let's work through this together. 🤝",
                "It's natural to feel affected by this. You're handling it with such strength. 💪"
            ],
            2: [
                "Your feelings are valid, no matter how heavy they feel. 🌧️",
                "Thank you for being so honest about your emotions. That's the first step toward healing. 🌈",
                "I'm right here with you, ready to help however I can. 🫂"
            ]
        },
        angry: {
            0: [
                "That would frustrate anyone. Your feelings are completely valid. 💪",
                "I can understand why that would make you angry. Let's work through this. 🎯",
                "Thank you for explaining what triggered this. It helps to name it. 📝"
            ],
            1: [
                "Those are some really good insights into what might help. 🌟",
                "It's great that you're thinking about ways to manage this feeling. 💭",
                "You're handling this very thoughtfully. Let's explore these ideas. 🎯"
            ],
            2: [
                "Having that control and making changes can really help. 🎯",
                "That's a very constructive way to look at the situation. 💪",
                "You're already taking steps toward positive change. That's excellent! ⭐"
            ]
        },
        anxious: {
            0: [
                "Thank you for sharing your worries. Let's break them down together. 🫂",
                "It's brave of you to face these anxious thoughts. I'm here to help. 💫",
                "I understand these racing thoughts can be overwhelming. You're not alone. 🌸"
            ],
            1: [
                "It helps to recognize patterns in our anxiety. You're doing great at identifying this. 🎯",
                "Understanding whether this is familiar can help us find better coping strategies. 💭",
                "You're showing great self-awareness in recognizing these feelings. 🌟"
            ],
            2: [
                "Let's focus on what we can control in this situation. 🎯",
                "You're doing the right thing by addressing these worries head-on. 💪",
                "We'll find ways to make these worries more manageable. 🌈"
            ]
        },
        neutral: {
            0: [
                "It's interesting how you describe your energy levels. Let's explore that. 🌱",
                "Sometimes a neutral state can be a good place for reflection. 💭",
                "Thank you for that honest assessment of where you're at. 🎯"
            ],
            1: [
                "Those are interesting thoughts about what might help. 💫",
                "Sometimes small changes can shift our entire perspective. ✨",
                "That's a thoughtful way to look at improving your mood. 🌟"
            ],
            2: [
                "Understanding what keeps us balanced is really valuable. 🎯",
                "You seem very in tune with your emotional state. That's a strength! 💫",
                "This kind of self-awareness is really helpful. 🌱"
            ]
        }
    };

    // Get appropriate responses array
    const moodResponses = responses[mood][questionIndex];
    
    // Select response based on message content and add follow-up
    let response = moodResponses[Math.floor(Math.random() * moodResponses.length)];
    
    // Add dynamic follow-up based on the content of their message
    if (hasPositive && mood !== 'happy') {
        response += "\n\nI'm glad you can find some positivity even in this situation. That's a valuable skill! 🌟";
    } else if (hasNegative && mood === 'happy') {
        response += "\n\nEven in happy moments, it's okay to acknowledge other feelings too. You're being very honest! 💫";
    } else if (hasUncertain) {
        response += "\n\nIt's okay to be uncertain. We can explore these feelings together. 🤝";
    }

    return response;
}

function providePersonalizedAnalysis() {
    const responses = userData.responses;
    const mood = userData.mood;
    const gender = userData.gender;

    // Analyze responses for keywords and sentiment
    const keywords = {
        positive: ['good', 'great', 'better', 'happy', 'excited', 'wonderful', 'love', 'enjoy'],
        negative: ['bad', 'worse', 'sad', 'angry', 'frustrated', 'anxious', 'worried', 'stress'],
        action: ['want', 'need', 'try', 'plan', 'hope', 'think', 'feel', 'wish']
    };

    // Generate personalized feedback
    let analysis = getPersonalizedOpening(mood, responses);
    addBotMessage(analysis);

    setTimeout(() => {
        // Add mood-specific solutions
        const solutions = getMoodSpecificSolutions(mood, responses);
        addBotMessage(solutions.join('\n\n'));

        setTimeout(() => {
            // Add exercises and activities
            const exercises = getRecommendedExercises(mood, responses);
            addBotMessage("Here are some exercises that might help you right now:");
            addBotMessage(exercises.join('\n\n'));

            setTimeout(() => {
                addBotMessage("Would you like me to explain any of these suggestions in more detail? Or would you prefer to try something else?");
            }, 1500);
        }, 2000);
    }, 2000);
}

function getPersonalizedOpening(mood, responses) {
    const openings = {
        happy: [
            "It's wonderful to see such positive energy! From what you've shared, your happiness seems to come from a place of genuine achievement and connection.",
            "Your responses radiate such warmth! I can tell this isn't just a surface-level happiness.",
            "What a delightful conversation! Your positive outlook is truly inspiring."
        ],
        sad: [
            "I hear the weight in your words, and I want you to know it's completely okay to feel this way. Let's work through this together.",
            "Thank you for being so open about your feelings. It takes courage to acknowledge sadness.",
            "I'm picking up on some deep emotions in your responses. Let's find some light together."
        ],
        angry: [
            "I can sense the intensity of your frustration, and your feelings are absolutely valid.",
            "Your responses show you're dealing with some challenging situations. Let's channel this energy constructively.",
            "I appreciate you sharing these strong emotions. It's healthy to acknowledge anger."
        ],
        anxious: [
            "I notice patterns of concern in your responses. Let's break these big worries into smaller, manageable pieces.",
            "Your mind seems to be carrying a lot right now. Let's try to lighten that load together.",
            "I can feel the uncertainty in your words. Let's find some solid ground to stand on."
        ],
        neutral: [
            "Your responses suggest a state of calm reflection. Let's explore how to make the most of this balanced energy.",
            "There's something powerful about being in this neutral space. It's like a clean canvas.",
            "I sense a readiness for positive change in your responses."
        ]
    };

    return openings[mood][Math.floor(Math.random() * openings[mood].length)];
}

function getMoodSpecificSolutions(mood, responses) {
    const solutions = {
        happy: [
            "🌟 Channel this positive energy: Create a 'Joy Journal' to document these great moments. When you're feeling down in the future, you can look back at these entries.",
            "🎯 Set a 'Happiness Goal': Use this momentum to tackle something you've been wanting to do. Your positive state makes this the perfect time!",
            "🤝 Spread the Joy: Consider reaching out to someone who might need a boost. Your current positive energy could be exactly what they need."
        ],
        sad: [
            "🫂 Gentle Self-Care Plan: Start with small, nurturing activities - maybe a warm shower, your favorite tea, or soft music.",
            "📝 Expression Through Words: Try writing down your feelings without judgment. Sometimes seeing our thoughts on paper helps us process them better.",
            "🌱 Small Steps Forward: Let's break down one concern into tiny, manageable actions. No pressure, just small movements forward."
        ],
        angry: [
            "💪 Physical Release: Try this quick exercise - tense all your muscles for 5 seconds, then release. Feel the difference?",
            "🎯 Redirect the Energy: Channel this intensity into a focused activity - cleaning, organizing, or even some push-ups.",
            "📝 Anger Mapping: Let's write down what triggered this feeling and create an action plan for similar situations."
        ],
        anxious: [
            "🧘‍♂️ Grounding Technique: Let's try the 5-4-3-2-1 method - name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.",
            "🎯 Worry Time-Box: Set aside 10 minutes to fully focus on your worries. When the time's up, consciously switch to a different activity.",
            "📋 Action/Wait List: Let's separate your concerns into things you can act on now and things that need time."
        ],
        neutral: [
            "🎨 Creative Exploration: This is a great time to try something new - your balanced state makes learning easier.",
            "🎯 Goal Setting: Your clear mindset makes this perfect for planning future activities or setting meaningful goals.",
            "🌱 Mindful Observation: Use this neutral state to notice small details around you - it's like a meditation in daily life."
        ]
    };

    return solutions[mood];
}

function getRecommendedExercises(mood, responses) {
    const exercises = {
        happy: [
            "🎵 Joy Amplification Exercise:\n- Put on your favorite upbeat song\n- Dance or move freely for just 2 minutes\n- Notice how the happiness grows with movement",
            "📸 Memory Anchoring:\n- Take 3 photos of things making you happy right now\n- Write a quick note about each one\n- Create a small happiness collection",
            "🌟 Gratitude Spiral:\n- Start with one good thing\n- Find another thing connected to it\n- Keep connecting happy thoughts like a chain"
        ],
        sad: [
            "🫂 Comfort Cocoon Exercise:\n- Find a cozy spot\n- Wrap yourself in something soft\n- Take 5 deep, slow breaths\n- Imagine being hugged by warmth",
            "🎨 Color Therapy:\n- Get any drawing tools\n- Start with dark colors for your feelings\n- Gradually blend in brighter colors\n- Watch the transformation",
            "🌧️ Rain to Rainbow Visualization:\n- Close your eyes\n- Picture your sadness as gentle rain\n- Slowly imagine a rainbow forming\n- Feel the shift in energy"
        ],
        angry: [
            "💪 Power Release Series:\n- 10 seconds of quick punches in the air\n- 10 seconds of shoulder rolls\n- 10 seconds of deep lion's breath\n- Feel the tension dissolve",
            "🎯 Anger to Action:\n- Write the trigger in big letters\n- Tear the paper into tiny pieces\n- Use the pieces to create art\n- Transform the energy",
            "🌊 Wave Breathing:\n- Breathe in like a wave building\n- Hold at the peak\n- Release with a whoosh\n- Feel the anger flow away"
        ],
        anxious: [
            "🎯 Anxiety Defusion:\n- Name your anxiety (like 'the worry cloud')\n- Watch it float above your head\n- Gradually make it smaller\n- See it drift away",
            "🫂 Safe Space Sequence:\n- Find your calm corner\n- Place one hand on your heart\n- Count 4 in, hold 4, out 6\n- Repeat until centered",
            "🎨 Worry Web to Wisdom:\n- Draw your anxious thoughts\n- Connect related ones with lines\n- Circle what you can control\n- Focus on those circles"
        ],
        neutral: [
            "🌱 Sensation Exploration:\n- Close your eyes\n- Notice 3 body sensations\n- Rate their intensity 1-10\n- Watch them change",
            "🎯 Energy Elevation:\n- Start with small movements\n- Gradually increase speed\n- Find your ideal energy level\n- Maintain that sweet spot",
            "🎨 Mood Crafting:\n- Choose a desired feeling\n- List 3 small steps toward it\n- Take one step now\n- Notice the shift"
        ]
    };

    return exercises[mood];
}

chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
});

// Enhanced quiz integration
function checkQuizResults() {
    const quizScore = localStorage.getItem('quizMoodScore');
    const lastQuizDate = localStorage.getItem('lastQuizDate');
    const chatbotResponses = JSON.parse(localStorage.getItem('chatbotResponses') || '[]');
    
    if (quizScore && lastQuizDate) {
        const quizDate = new Date(lastQuizDate);
        const today = new Date();
        
        // Check if quiz was taken today
        if (quizDate.toDateString() === today.toDateString()) {
            const moodSuggestion = getMoodSuggestionFromScore(parseFloat(quizScore));
            
            // Add quiz responses to chat
            chatbotResponses.forEach(response => {
                addBotMessage(response);
            });
            
            // Process the overall mood
            processUserResponse(moodSuggestion);
            
            // Add a transition message
            setTimeout(() => {
                addBotMessage("I see you've completed the mood assessment quiz. Let's continue our conversation based on your responses. How are you feeling now?");
            }, 1000);
        }
    }
}

function getMoodSuggestionFromScore(score) {
    if (score >= 4) {
        return "Based on the quiz, I'm feeling quite positive and energetic today! 🌟";
    } else if (score >= 3) {
        return "The quiz shows I'm feeling balanced and steady today. 🙂";
    } else {
        return "According to the quiz, I'm experiencing some challenges today. 💜";
    }
}

// Modify the existing startChat function
function startChat() {
    checkQuizResults(); // Check for quiz results first
    if (!chatStarted) {
        const welcomeMessage = "Hi! I'm here to chat about your mood and feelings. ";
        const quizPrompt = "Would you like to take a quick mood assessment quiz? Or we can just chat about how you're feeling.";
        
        addBotMessage(welcomeMessage);
        setTimeout(() => {
            addBotMessage(quizPrompt);
        }, 1000);
        
        chatStarted = true;
    }
} 