# NexiFuse - Patient Data Playground + AI Decision Simulator

An interactive platform for exploring healthcare AI outputs, testing scenarios, and adjusting privacy or guardrails with real-time traceability and reliability.

## Features

- **User Authentication**: Role-based access (Doctor, Admin, Viewer)
- **Dynamic Scenarios**: Preloaded challenge scenarios + custom scenario creation
- **Interactive Timeline**: Multi-day patient data visualization
- **AI Analysis**: OpenAI-powered or mock AI analysis of patient notes
- **Guardrails & Privacy**: Toggle validation rules and privacy masking in real-time
- **Replay & Comparison**: Re-run analyses with different settings
- **Audit Logging**: Complete traceability of all actions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js (JWT-based)
- **AI Integration**: OpenAI API (optional, falls back to mock)
- **Storage**: In-memory (no database required)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the project:

```bash
cd nexifuse
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY`: (Optional) Your OpenAI API key. If not provided, mock AI will be used.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

| Role   | Email                  | Password    | Permissions                          |
|--------|------------------------|-------------|--------------------------------------|
| Doctor | doctor@nexifuse.com    | password123 | Full access to all features          |
| Admin  | admin@nexifuse.com     | password123 | User management + audit logs         |
| Viewer | viewer@nexifuse.com    | password123 | Read-only access to scenarios        |

## Project Structure

```
nexifuse/
├── app/
│   ├── api/              # API routes
│   │   ├── analyze/      # AI analysis endpoint
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── logs/         # Audit logs endpoint
│   │   ├── replay/       # Replay analysis endpoint
│   │   ├── scenarios/    # Scenarios CRUD
│   │   └── health/       # Health check
│   ├── dashboard/        # Main dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── AnalysisOutput.tsx
│   ├── AuditLogs.tsx
│   ├── ControlPanel.tsx
│   ├── Header.tsx
│   ├── ScenarioSelector.tsx
│   └── Timeline.tsx
├── lib/                  # Core logic
│   ├── ai-service.ts     # AI integration
│   ├── auth.ts           # NextAuth config
│   ├── guardrail-service.ts
│   ├── privacy-service.ts
│   ├── store.ts          # In-memory data store
│   ├── store-client.ts   # Client state management
│   ├── types.ts          # TypeScript types
│   └── users.ts          # User data
└── middleware.ts         # Auth middleware
```

## API Endpoints

| Endpoint          | Method | Description                           | Auth Required |
|-------------------|--------|---------------------------------------|---------------|
| `/api/auth/*`     | *      | NextAuth authentication               | No            |
| `/api/analyze`    | POST   | Analyze patient notes                 | Yes           |
| `/api/scenarios`  | GET    | Get all scenarios                     | Yes           |
| `/api/scenarios`  | POST   | Create custom scenario                | Yes (Doctor+) |
| `/api/logs`       | GET    | Get audit logs                        | Yes (Admin+)  |
| `/api/replay`     | POST   | Replay analysis with new settings     | Yes           |
| `/api/health`     | GET    | System health check                   | No            |

## Usage Guide

### 1. Select a Scenario

Choose from 5 preloaded challenge scenarios:
- **Symptom Escalation**: Rapidly worsening respiratory symptoms
- **Conflicting Symptoms**: Contradictory patient information
- **Privacy Edge Case**: Patient note with extensive PII
- **Multi-System Involvement**: Complex case affecting multiple organs
- **Medication Interaction Risk**: Potential drug interactions

Or create your own custom scenario.

### 2. Configure Timeline

- View the scenario's timeline events
- Add, edit, or remove events
- Each event represents a day in the patient's journey

### 3. Adjust Controls

**Guardrails:**
- Enable/disable audit logging
- Toggle validation rules:
  - Check contradictions
  - Flag high risk
  - Confidence threshold

**Privacy Masking:**
- Mask PII (names, emails, SSN, addresses)
- Mask age
- Mask gender

### 4. Run Analysis

Click "Run AI Analysis" to process the timeline events. The AI will:
- Analyze each day's patient note
- Extract symptoms and possible conditions
- Assign confidence scores and risk levels
- Provide explanations

### 5. Review Results

View structured output including:
- Structured summary
- Identified symptoms
- Possible conditions
- Confidence score (0-100%)
- Risk level (Low/Medium/High)
- Explanation

### 6. Replay & Compare

Use the replay feature to:
- Re-run analysis with different guardrail settings
- Compare privacy masking effects
- See how changes impact the output

### 7. Audit Logs

Admins and Doctors can view complete audit trails:
- Timestamp of each action
- User ID and role
- Input/output data
- Validation status
- Request IDs for traceability

## Preloaded Challenge Scenarios

### 1. Symptom Escalation Challenge
Tests the AI's ability to detect worsening conditions over time.

### 2. Conflicting Symptoms
Challenges the AI with contradictory patient information.

### 3. Privacy Edge Case
Demonstrates privacy masking with extensive PII.

### 4. Multi-System Involvement
Complex case requiring holistic analysis.

### 5. Medication Interaction Risk
Tests detection of dangerous drug interactions.

## Configuration

### Using OpenAI API

To use real AI analysis instead of mock:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add to `.env.local`:
```
OPENAI_API_KEY=sk-...
```
3. Restart the dev server

### Mock AI

If no OpenAI API key is provided, the system uses a keyword-based mock AI that:
- Detects common symptoms (fever, cough, pain, etc.)
- Suggests possible conditions
- Assigns risk levels based on severity indicators
- Provides basic explanations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `AUTH_SECRET`
   - `OPENAI_API_KEY` (optional)
   - `NEXTAUTH_URL` (your production URL)
4. Deploy

**Note**: In-memory storage resets on each deployment. For production, consider adding a database.

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Limitations

- **Data Persistence**: In-memory storage means data is lost on server restart
- **Scalability**: Not optimized for high-traffic production use
- **Concurrent Users**: Shared in-memory state may have race conditions
- **Mock AI**: Limited accuracy compared to real OpenAI integration

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- WebSocket support for real-time updates
- Versioned AI outputs with diff view
- Configurable risk detection thresholds
- Enhanced visualization with charts
- Export functionality for reports
- User management UI for admins

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
