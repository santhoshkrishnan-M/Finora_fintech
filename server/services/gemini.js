const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Language mapping for Gemini
const LANGUAGE_MAP = {
  'en': 'English',
  'ta': 'Tamil',
  'hi': 'Hindi',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'kn': 'Kannada'
};

async function generateFinancialStrategy(userProfile, strategyType, parameters, language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const languageName = LANGUAGE_MAP[language] || 'English';
    
    // Handle financialGoals whether it's a comma-separated string or array
    const goalsText = typeof userProfile.financialGoals === 'string' 
      ? userProfile.financialGoals 
      : userProfile.financialGoals.join(', ');

    const prompt = `
You are a financial advisor for FINORA, a financial guidance platform for Indian users.

CRITICAL: Respond ONLY in ${languageName} language. Do not use any other language in your response.

User Profile:
- Category: ${userProfile.userCategory}
- Age Range: ${userProfile.ageRange}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Expenses: ₹${userProfile.monthlyExpenses}
- Risk Level: ${userProfile.riskComfortLevel}
- Financial Goals: ${goalsText}

Strategy Type: ${strategyType}
Parameters: ${JSON.stringify(parameters)}

Provide a clear, beginner-friendly explanation of this financial strategy in simple ${languageName} language that is culturally appropriate for Indian users.
Focus on:
1. What is this strategy and how it works
2. Why it's suitable for this user's profile
3. Expected outcomes and timeline
4. Important things to remember
5. Practical recommendations

DO NOT:
- Make market predictions
- Recommend specific stocks or products
- Use complex financial jargon
- Be overly promotional

Keep the response under 500 words and use a professional, educational tone.
Write your ENTIRE response in ${languageName} only.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate strategy explanation');
  }
}

async function generateScenarioFeedback(userProfile, scenario, selectedOption, isCorrect, language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const languageName = LANGUAGE_MAP[language] || 'English';

    const prompt = `
You are a financial educator for FINORA, a financial guidance platform for Indian users.

CRITICAL: Respond ONLY in ${languageName} language. Do not use any other language in your response.

Scenario: ${scenario.title}
Situation: ${scenario.situation}
User's Choice: ${selectedOption.optionText}
Correct: ${isCorrect ? 'Yes' : 'No'}

Provide personalized feedback for this user's decision in simple ${languageName} language:
1. Explain whether their choice was good or not and why
2. What are the financial implications
3. What they should consider in similar situations
4. A practical tip for their specific situation

Keep the response encouraging and educational, under 300 words.
Write your ENTIRE response in ${languageName} only.
Use simple language appropriate for a ${userProfile.userCategory}.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate feedback');
  }
}

async function generateSectionGuidance(userProfile, sectionType, language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const languageName = LANGUAGE_MAP[language] || 'English';
    
    const goalsText = typeof userProfile.financialGoals === 'string' 
      ? userProfile.financialGoals 
      : userProfile.financialGoals.join(', ');

    const monthlyDisposable = userProfile.monthlyIncome - userProfile.monthlyExpenses;
    
    let sectionPrompt = '';
    
    switch(sectionType) {
      case 'budget':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Expenses: ₹${userProfile.monthlyExpenses}
- Disposable Income: ₹${monthlyDisposable}
- Goals: ${goalsText}
- Risk Level: ${userProfile.riskComfortLevel}

Generate PPT-friendly budget guidance in this EXACT slide structure:

SLIDE 1: Budget Planning for You
- Title: Smart Budget Management
- Subtitle: Personalized for ${userProfile.userCategory}

SLIDE 2: Your Financial Profile
- User Category: ${userProfile.userCategory}
- Key Goal: [Primary goal from their list]
- Monthly Savings Potential: ₹${monthlyDisposable}
- Risk Level: ${userProfile.riskComfortLevel}

SLIDE 3: Recommended Budget Strategy
- Strategy: [Best budgeting approach for their profile]
- Why it suits you: [1 line]
- Priority: High

SLIDE 4: The 50-30-20 Rule (or suitable alternative)
- What: [1 line explanation]
- Why it matters for you: [Specific to their situation]
- How to apply:
  1. [Specific step with amounts]
  2. [Specific step with amounts]
  3. [Specific step with amounts]
- Time horizon: Immediate implementation

SLIDE 5: Expense Tracking Method
- What: [1 line explanation]
- Why it matters for you: [Specific benefit]
- How to start:
  1. [Actionable step]
  2. [Actionable step]
  3. [Actionable step]
- Time horizon: Start this month

SLIDE 6: Action Plan
- Month 1: [Specific action with amount]
- Month 2-3: [Specific action]
- Month 4-6: [Specific action]
- Suggested allocation: [Percentage breakdown]

SLIDE 7: Key Takeaways
- [Concise point 1]
- [Concise point 2]
- [Concise point 3]
- [Encouraging final point]

Use bullet points only. No paragraphs. Keep professional and clear.`;
        break;
        
      case 'savings':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Expenses: ₹${userProfile.monthlyExpenses}
- Disposable Income: ₹${monthlyDisposable}
- Goals: ${goalsText}
- Risk Level: ${userProfile.riskComfortLevel}

Generate PPT-friendly savings guidance in this EXACT slide structure:

SLIDE 1: Savings Strategies for You
- Title: Build Your Wealth
- Subtitle: Personalized strategies for ${userProfile.userCategory}

SLIDE 2: Your Financial Profile
- User Category: ${userProfile.userCategory}
- Key Goal: [Primary goal]
- Risk Comfort Level: ${userProfile.riskComfortLevel}
- Monthly Savings Potential: ₹${monthlyDisposable}

SLIDE 3: Recommended Strategies Overview
- Strategy 1: [Name] - Priority: High
  Why: [1 line reason]
- Strategy 2: [Name] - Priority: Medium
  Why: [1 line reason]
- Strategy 3: [Name] - Priority: Medium
  Why: [1 line reason]

SLIDE 4: Emergency Fund Strategy
- What: [1 line explanation]
- Why it matters for you: [Specific to their situation]
- How to start:
  1. [Specific step with target amount]
  2. [Specific step]
  3. [Specific step]
- Time horizon: 6-12 months to build

SLIDE 5: SIP (Systematic Investment Plan)
- What: [1 line explanation]
- Why it matters for you: [Specific benefit for their goals]
- How to start:
  1. [Specific step with suggested amount]
  2. [Specific step]
  3. [Specific step]
- Time horizon: Long-term (5+ years)

SLIDE 6: Recurring Deposit / Fixed Income
- What: [1 line explanation]
- Why it matters for you: [Specific benefit]
- How to start:
  1. [Specific step]
  2. [Specific step]
  3. [Specific step]
- Time horizon: Short to medium term (1-3 years)

SLIDE 7: Action Plan
- Step 1: [Immediate action this month]
- Step 2: [Action for months 2-3]
- Step 3: [Action for months 4-6]
- Suggested allocation: [Percentage breakdown across strategies]

SLIDE 8: Key Takeaways
- [Clear point 1]
- [Clear point 2]
- [Clear point 3]
- [Motivating final point]

Use bullet points only. No paragraphs. Keep professional and clear.`;
        break;
        
      case 'learning-scenarios':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Goals: ${goalsText}

Generate PPT-friendly scenario guidance in this EXACT slide structure:

SLIDE 1: Financial Decision Scenario
- Title: Real-World Financial Challenge
- Subtitle: Practice smart decision-making

SLIDE 2: Your Profile
- User Category: ${userProfile.userCategory}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Key Goal: [Primary goal]

SLIDE 3: The Situation
- [Realistic scenario relevant to their life as ${userProfile.userCategory}]
- [2-3 clear bullet points describing the challenge]

SLIDE 4: Option A
- What: [Brief description]
- Pros:
  • [Advantage 1]
  • [Advantage 2]
- Cons:
  • [Disadvantage 1]
  • [Disadvantage 2]

SLIDE 5: Option B
- What: [Brief description]
- Pros:
  • [Advantage 1]
  • [Advantage 2]
- Cons:
  • [Disadvantage 1]
  • [Disadvantage 2]

SLIDE 6: Key Factors to Consider
- [Factor 1 specific to their situation]
- [Factor 2 specific to their goals]
- [Factor 3 financial principle]

SLIDE 7: Decision Framework
- Ask yourself:
  1. [Question about short-term impact]
  2. [Question about long-term goals]
  3. [Question about risk tolerance]

SLIDE 8: Takeaways
- [Learning point 1]
- [Learning point 2]
- [Encouragement to apply this thinking]

Use bullet points only. Keep concise and educational.`;
        break;
        
      case 'learning-path':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Goals: ${goalsText}
- Risk Level: ${userProfile.riskComfortLevel}

Generate PPT-friendly learning path in this EXACT slide structure:

SLIDE 1: Your Learning Journey
- Title: Financial Knowledge Roadmap
- Subtitle: Structured path for ${userProfile.userCategory}

SLIDE 2: Your Profile
- User Category: ${userProfile.userCategory}
- Financial Goals: [Primary goal]
- Risk Comfort Level: ${userProfile.riskComfortLevel}

SLIDE 3: Learning Overview
- Phase 1: Foundation (Month 1-2)
- Phase 2: Building Skills (Month 3-4)
- Phase 3: Advanced Concepts (Month 5-6)

SLIDE 4: Phase 1 - Foundation Topics
- Topic 1: [Core concept]
  • Why learn this: [Relevance to their goals]
  • Key takeaway: [Main point]
- Topic 2: [Core concept]
  • Why learn this: [Relevance]
  • Key takeaway: [Main point]

SLIDE 5: Phase 2 - Building Skills
- Topic 3: [Intermediate concept]
  • Why learn this: [How it builds on Phase 1]
  • Key takeaway: [Main point]
- Topic 4: [Intermediate concept]
  • Why learn this: [Practical application]
  • Key takeaway: [Main point]

SLIDE 6: Phase 3 - Advanced Concepts
- Topic 5: [Advanced topic]
  • When to explore: [Timeline]
- Topic 6: [Advanced topic]
  • When to explore: [Timeline]
- Topic 7: [Specialized topic for their goals]

SLIDE 7: Action Plan
- This Week: [Specific first step]
- This Month: [What to learn]
- Next 3 Months: [Progressive goals]
- Resources: [Where to learn]

SLIDE 8: Key Takeaways
- [Learning principle 1]
- [Learning principle 2]
- [Motivation to start]
- [Expected outcome]

Use bullet points only. Keep structured and motivating.`;
        break;
        
      case 'profile':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Goals: ${goalsText}

Generate PPT-friendly profile guidance in this EXACT slide structure:

SLIDE 1: Your Profile Matters
- Title: Personalized Guidance Through Data
- Subtitle: Keep your profile updated for better advice

SLIDE 2: Why Profile Updates Matter
- Better recommendations aligned with your life stage
- More accurate strategies for your income level
- Relevant guidance for your specific goals
- Timely advice as your situation changes

SLIDE 3: Key Data We Use
- Financial situation:
  • Income and expense levels
  • Savings capacity
- Your preferences:
  • Risk comfort level
  • Financial goals
- Life context:
  • Category (${userProfile.userCategory})
  • Life stage needs

SLIDE 4: About Your Current Goals
- Current goals: ${goalsText}
- Why this matters: [Brief note on how goals shape recommendations]
- Update if: [Situations when to update goals]

SLIDE 5: When to Update Your Profile
- Income changes (promotion, new job)
- Life events (marriage, child, home purchase)
- Goal shifts (new priorities)
- Risk tolerance changes

SLIDE 6: Key Takeaways
- Updated profile means better guidance
- Review quarterly or after major life changes
- Your data stays private and secure
- Takes only 2 minutes to update

Use bullet points only. Keep professional and clear.`;
        break;
        
      case 'getting-started':
        sectionPrompt = `
You are FRIDAY, a personalized financial guidance assistant.

User Profile:
- Category: ${userProfile.userCategory}
- Goals: ${goalsText}

Generate PPT-friendly welcome guidance in this EXACT slide structure:

SLIDE 1: Welcome to FINORA
- Title: Your Financial Journey Starts Here
- Subtitle: Personalized guidance for ${userProfile.userCategory}

SLIDE 2: What We Help You Achieve
- [Benefit 1 specific to their goals]
- [Benefit 2 specific to their category]
- [Benefit 3 about financial confidence]
- [Benefit 4 about practical tools]

SLIDE 3: Your Goals
- Primary Goals: ${goalsText}
- Why it matters: [How FINORA addresses these]
- Our approach: Personalized, step-by-step guidance

SLIDE 4: Platform Features
- Budget Planner: Track income and expenses
- Savings Strategies: Learn SIP, RD, Emergency Funds
- Learning Scenarios: Practice real decisions
- FRIDAY AI: Get instant guidance anytime

SLIDE 5: Your First Steps
- Step 1: [First section to explore with reason]
- Step 2: [Second section to explore with reason]
- Step 3: [Third action to take]
- Step 4: Ask FRIDAY any question

SLIDE 6: Quick Start Tips
- Start with budget planning to understand your finances
- Set up one savings strategy this month
- Practice with one learning scenario
- Keep your profile updated

SLIDE 7: Key Takeaways
- Financial planning is a journey, not a destination
- Small steps lead to big results
- We're here to guide you every step
- Start today with one simple action

Use bullet points only. Keep encouraging and clear.

### Remember:
[Short motivational message specific to their category]

Use bullet points (•) and numbered steps. Keep it under 300 words, welcoming, and clear.`;
        break;
        
      default:
        throw new Error('Invalid section type');
    }

    const prompt = `
You are FRIDAY, the personal financial guide for FINORA.

CRITICAL LANGUAGE RULE:
Respond ONLY in ${languageName} language. Do not use any other language in your response.

${sectionPrompt}

STRICT OUTPUT RULES:
- Use ONLY bullet points (•) - NO paragraphs
- Use numbered lists (1, 2, 3) for sequential steps
- Keep each bullet point to 1-2 lines maximum
- Use clear slide headings (SLIDE X: with proper spacing)
- Add blank lines between slides for visual separation
- Use sub-bullets with indentation for hierarchy
- Include proper spacing: 
  * Blank line after each slide heading
  * Blank line between major sections
  * Group related points together
- DO NOT use emojis in slide content
- DO NOT make market predictions or guarantees
- DO NOT promote specific products or platforms
- Keep language simple, professional, and clear
- Base all advice on Indian financial context
- Make content scannable and easy to copy to PowerPoint

FORMATTING EXAMPLE:
SLIDE 1: Title

- Point 1
- Point 2

SLIDE 2: Next Section

- Main point
  • Sub-point with indentation
  • Another sub-point
- Next main point

Write your ENTIRE response in ${languageName} only.
Follow the PPT slide structure EXACTLY as shown above with proper spacing.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate section guidance');
  }
}

async function generateFRIDAYResponse(userProfile, userMessage, conversationHistory = [], language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const languageName = LANGUAGE_MAP[language] || 'English';
    
    const goalsText = typeof userProfile.financialGoals === 'string' 
      ? userProfile.financialGoals 
      : userProfile.financialGoals.join(', ');

    const monthlyDisposable = userProfile.monthlyIncome - userProfile.monthlyExpenses;
    const savingsRate = ((monthlyDisposable / userProfile.monthlyIncome) * 100).toFixed(1);

    const historyText = conversationHistory.length > 0
      ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : 'No previous conversation';

    // Get current date
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const prompt = `
You are FRIDAY, the personal financial guidance assistant for FINORA.

CRITICAL LANGUAGE RULE:
Respond ONLY in ${languageName} language. Do not use any other language in your response.

USER DATA AVAILABLE:
- User Category: ${userProfile.userCategory}
- Age Range: ${userProfile.ageRange}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Expenses: ₹${userProfile.monthlyExpenses}
- Monthly Savings Potential: ₹${monthlyDisposable} (${savingsRate}%)
- Risk Comfort Level: ${userProfile.riskComfortLevel}
- Financial Goals: ${goalsText}
- Has Emergency Fund: ${userProfile.hasEmergencyFund ? 'Yes' : 'No'}
- Current Savings: ₹${userProfile.currentSavings || 0}

Previous Conversation:
${historyText}

User's Question: ${userMessage}

STRICT RESPONSE FORMAT (MANDATORY):
You MUST structure your response EXACTLY as follows with proper spacing and visual hierarchy:

═══════════════════════════════════════════
📅 Date: ${dateStr}
═══════════════════════════════════════════

FRIDAY GUIDANCE

───────────────────────────────────────────
1️⃣ USER FINANCIAL CONTEXT
───────────────────────────────────────────
   • Category: ${userProfile.userCategory}
   • Primary Goal: [Pick most relevant from: ${goalsText}]
   • Risk Level: ${userProfile.riskComfortLevel}
   • Monthly Savings Capacity: ₹${monthlyDisposable}

───────────────────────────────────────────
2️⃣ KEY OBSERVATIONS
───────────────────────────────────────────
[Based on their specific data - provide 2-3 insights]

   • [Observation 1: About their savings rate or financial health]
   
   • [Observation 2: About goal alignment or opportunities]
   
   • [Observation 3: About their risk profile or current status]

───────────────────────────────────────────
3️⃣ RECOMMENDED ACTIONS
───────────────────────────────────────────
[Prioritized list of 3-5 strategies relevant to their question and profile]

   Priority 1: [Strategy Name]
   • What: [Brief 1-line explanation]
   • Why for you: [Specific reason based on their profile]
   • Action: [Specific step]

   Priority 2: [Strategy Name]
   • What: [Brief 1-line explanation]
   • Why for you: [Specific reason]
   • Action: [Specific step]

   Priority 3: [Strategy Name]
   • What: [Brief 1-line explanation]
   • Why for you: [Specific reason]
   • Action: [Specific step]

[Include from: Emergency Fund, SIP, RD, Gold, Silver, SWP based on relevance]

───────────────────────────────────────────
4️⃣ GOLD & SILVER GUIDANCE (MANDATORY)
───────────────────────────────────────────

🪙 GOLD
   • Role: [Why gold matters for ${userProfile.userCategory} with ${userProfile.riskComfortLevel} risk]
   • When Preferred: [Specific situations like inflation protection, stability]
   • Allocation: [Range e.g., "5-10% of portfolio" or "₹X-Y per month"]
   • Forms: [ETF / Digital Gold / Physical - recommend based on profile]

🪙 SILVER
   • Role: [Silver's purpose for their situation]
   • When to Consider: [Conditions like diversification, higher growth appetite]
   • vs Gold: [Key difference - higher volatility, different use case]
   • Allocation: [Smaller range than gold, e.g., "2-5%"]

───────────────────────────────────────────
5️⃣ NEXT STEP (Action This Week)
───────────────────────────────────────────

   ▶ [ONE clear, specific, actionable step they should take immediately]
   
   [Include specific amount or percentage if relevant]
   [Make it achievable within 7 days]

═══════════════════════════════════════════

BEHAVIORAL RULES:
- Use the EXACT visual structure shown above with separators (═══ and ───)
- Include emoji markers (📅 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 🪙 ▶) for section headers only
- Keep content professional - NO emojis in actual text/bullet points
- Use proper spacing: blank lines between sections and sub-sections
- Use indentation (spaces) for sub-points to create visual hierarchy
- Bold headers and key terms in content
- Keep bullet points concise (1-2 lines max each)
- Use action verbs and specific numbers
- Write in calm, professional financial advisor tone
- NO long paragraphs - only bullet points and short lines
- NO predictions or guaranteed returns
- NO promotion of specific products or brands
- Base all advice on Indian financial context
- If user asks about specific investments, provide education not recommendations
- Always relate advice to THEIR specific profile data

MANDATORY FORMATTING CHECKS:
✓ Visual separators (═══ and ───) must be present
✓ Section numbers with emoji markers (1️⃣ 2️⃣ etc.)
✓ Proper indentation with spaces
✓ Blank lines between sections
✓ Gold section must use 🪙 symbol
✓ Next step must use ▶ symbol
✓ All 5 sections must be present
✓ Date must be at top with 📅 symbol

Write your ENTIRE response in ${languageName} only.
Follow the structure EXACTLY.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate FRIDAY response');
  }
}

async function generateStarterQuestions(userProfile, language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const languageName = LANGUAGE_MAP[language] || 'English';
    
    const goalsText = typeof userProfile.financialGoals === 'string' 
      ? userProfile.financialGoals 
      : userProfile.financialGoals.join(', ');

    const monthlyDisposable = userProfile.monthlyIncome - userProfile.monthlyExpenses;

    const prompt = `
You are FRIDAY, the personal financial guide for FINORA.

CRITICAL: Respond ONLY in ${languageName} language. Do not use any other language.

User Profile:
- Category: ${userProfile.userCategory}
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Savings Potential: ₹${monthlyDisposable}
- Risk Level: ${userProfile.riskComfortLevel}
- Goals: ${goalsText}
- Has Emergency Fund: ${userProfile.hasEmergencyFund ? 'Yes' : 'No'}

Generate 4 relevant starter questions this user might want to ask FRIDAY.
Each question should be:
- Short (under 15 words)
- Highly specific to their profile and financial situation
- Practical and immediately actionable
- Related to savings strategies (SIP, RD, Emergency Fund, Gold, Silver)
- In ${languageName} language

EXAMPLES (adapt to user profile):
- "How much should I invest in SIP every month?"
- "Should I invest in gold or silver?"
- "How to build an emergency fund?"
- "What is the best savings strategy for me?"

Format: Return ONLY the 4 questions, one per line, without numbering or extra text.
Write your ENTIRE response in ${languageName} only.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split('\n').filter(q => q.trim().length > 0).slice(0, 4);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate starter questions');
  }
}

module.exports = {
  generateFinancialStrategy,
  generateScenarioFeedback,
  generateSectionGuidance,
  generateFRIDAYResponse,
  generateStarterQuestions,
};
