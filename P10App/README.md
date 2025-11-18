# P10 App - F1 Prediction Game

A mobile-first web application for Formula 1 fans to make strategic race predictions and compete with friends.

## Features

- 🏁 Predict the 10th place finisher, first retirement, and fastest lap for each race
- 🏆 Automatic scoring with bonus points
- 📊 Real-time leaderboards
- 👥 Private leagues for friendly competition
- 📱 Mobile-first design for on-the-go predictions

## Tech Stack

- **Frontend**: React PWA (Vite)
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: TBD

## Project Structure

```
P10App/
├── client/          # React PWA (Vite)
├── api/             # Express API
├── supabase/        # SQL migrations + seeds
├── docs/            # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Local Development

1. Clone the repository
2. Set up environment variables (see `.env.example` files in each directory)
3. Install dependencies:
   ```bash
   # Install API dependencies
   cd api
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```
4. Start the development servers:
   ```bash
   # Start API server
   cd api
   npm run dev
   
   # In a new terminal, start the client
   cd client
   npm run dev
   ```

## Deployment

Deployment instructions will be added soon.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
