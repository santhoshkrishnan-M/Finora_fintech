const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample scenarios for students in English
  const studentScenario = await prisma.scenario.create({
    data: {
      category: 'student',
      language: 'en',
      title: 'First Job Salary Decision',
      description: 'You just got your first job with a monthly salary of ₹30,000',
      situation: 'You have just received your first salary of ₹30,000. After expenses, you have ₹10,000 remaining. What should you do with this money?',
      difficultyLevel: 'beginner',
      options: {
        create: [
          {
            optionText: 'Spend it all on a new phone that costs ₹10,000',
            isCorrect: false,
            explanation: 'While getting a new phone might be tempting, spending all your savings on a single purchase leaves you with no emergency fund and no habit of saving.',
          },
          {
            optionText: 'Save ₹5,000 in a savings account and keep ₹5,000 for emergencies',
            isCorrect: true,
            explanation: 'Excellent choice! Building an emergency fund and maintaining savings is a smart financial habit. This balanced approach helps you prepare for unexpected expenses while building long-term savings.',
          },
          {
            optionText: 'Lend it all to a friend who needs money urgently',
            isCorrect: false,
            explanation: 'While helping friends is admirable, lending all your savings can be risky. Always keep some money for your own emergencies before helping others.',
          },
        ],
      },
    },
  });

  // Create sample learning path for students
  const studentPath = await prisma.learningPath.create({
    data: {
      category: 'student',
      language: 'en',
      title: 'Financial Basics for Students',
      description: 'Learn the fundamentals of managing money as a student',
      modules: {
        create: [
          {
            order: 1,
            title: 'Introduction to Money Management',
            content: 'Money management is the skill of planning how to use your money wisely. It includes tracking income, controlling expenses, and saving for the future.',
            moduleType: 'lesson',
          },
          {
            order: 2,
            title: 'Creating Your First Budget',
            content: 'A budget is a plan for your money. List your income (pocket money, part-time job), then list your expenses (food, transport, entertainment). The goal is to spend less than you earn.',
            moduleType: 'lesson',
          },
          {
            order: 3,
            title: 'The Power of Saving',
            content: 'Saving even small amounts regularly can grow into significant money over time. Start with saving 10-20% of any money you receive. This habit will benefit you for life.',
            moduleType: 'lesson',
          },
        ],
      },
    },
  });

  // Create sample scenario for professionals
  const professionalScenario = await prisma.scenario.create({
    data: {
      category: 'professional',
      language: 'en',
      title: 'Year-End Bonus Decision',
      description: 'You received a bonus of ₹1,00,000 at work',
      situation: 'Your company has given you a performance bonus of ₹1,00,000. You already have an emergency fund. What is the best way to use this bonus?',
      difficultyLevel: 'intermediate',
      options: {
        create: [
          {
            optionText: 'Use it all for a luxury vacation',
            isCorrect: false,
            explanation: 'While vacations are important, using your entire bonus for leisure means missing an opportunity to build long-term wealth or achieve financial goals.',
          },
          {
            optionText: 'Invest ₹70,000 in SIP and use ₹30,000 for family needs',
            isCorrect: true,
            explanation: 'Perfect balance! Investing a major portion in SIP helps build long-term wealth through compounding, while keeping some for family shows you are responsible and caring.',
          },
          {
            optionText: 'Keep it all in savings account for now',
            isCorrect: false,
            explanation: 'While keeping money in savings is safe, you miss out on better returns. Since you already have an emergency fund, investing this bonus can help it grow faster.',
          },
        ],
      },
    },
  });

  // Create learning path for professionals
  const professionalPath = await prisma.learningPath.create({
    data: {
      category: 'professional',
      language: 'en',
      title: 'Wealth Building for Working Professionals',
      description: 'Advanced strategies to grow your income and build wealth',
      modules: {
        create: [
          {
            order: 1,
            title: 'Understanding Your Income',
            content: 'Your income includes salary, bonuses, and any side income. Understanding your gross income, deductions, and net take-home helps in better planning.',
            moduleType: 'lesson',
          },
          {
            order: 2,
            title: 'Tax Planning Basics',
            content: 'Tax planning helps you legally reduce your tax burden. Common options include PPF, ELSS, insurance premiums, and home loan interest. Plan before the financial year ends.',
            moduleType: 'lesson',
          },
          {
            order: 3,
            title: 'Introduction to SIP',
            content: 'Systematic Investment Plan (SIP) means investing a fixed amount regularly in mutual funds. It helps build wealth through rupee cost averaging and compounding over time.',
            moduleType: 'lesson',
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully!');
  console.log('Created scenarios:', { studentScenario: studentScenario.id, professionalScenario: professionalScenario.id });
  console.log('Created learning paths:', { studentPath: studentPath.id, professionalPath: professionalPath.id });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
