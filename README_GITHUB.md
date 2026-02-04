# FINORA - Personal Finance Management Platform

A comprehensive fintech web application built with Next.js and Express.js that provides personalized financial guidance using AI.

## Features

- 🤖 **AI-Powered Guidance** - FRIDAY chatbot powered by Google Gemini for personalized financial advice
- 💰 **Budget Planning** - Track income and expenses with smart recommendations
- 🎯 **Savings Strategies** - Learn about SIP, RD, Emergency Funds, Gold & Silver investments
- 📚 **Financial Learning** - Interactive scenarios to practice decision-making
- 🌐 **Multi-Language Support** - Available in English, Tamil, Hindi, Telugu, Malayalam, and Kannada
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Prisma ORM
- **AI**: Google Gemini API
- **Authentication**: JWT
- **Internationalization**: next-intl

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Finora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   - `JWT_SECRET`: Generate a secure random string
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start the development servers**
   
   Open two terminal windows:
   
   Terminal 1 - Backend:
   ```bash
   npm run server
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/              # Database schema and migrations
├── server/              # Express.js backend
│   ├── routes/          # API routes
│   ├── services/        # Business logic (Gemini AI)
│   ├── middleware/      # Authentication middleware
│   └── index.js         # Server entry point
├── src/
│   ├── app/             # Next.js pages and routing
│   ├── components/      # React components
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utilities and API client
│   └── store/           # State management (Zustand)
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start Next.js development server (port 3000)
- `npm run server` - Start Express.js backend server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
