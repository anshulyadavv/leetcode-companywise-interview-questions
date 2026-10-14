# CodePractice

A local-first practice tracker and question bank for technical interviews.

Practice LeetCode questions categorized by company, track your progress over time, and plan daily study sessions with a built-in focus timer.

![CodePractice Dashboard](public/images/dashboard.png)

## What's Inside

- **Company-specific question lists**: Browse questions asked in technical interviews at Google, Meta, Amazon, and over 680 other companies, sorted by how often they appear.
- **Task planner and focus timer (now available)**: Plan your study schedule across day, week, month, and year views. Add questions to daily task lists and use the built-in Pomodoro timer to stay focused.
- **Activity and progress tracking**: Keep track of solved questions with an activity graph and breakdown across easy, medium, and hard difficulties.
- **Local storage**: Runs completely in the browser with no account or sign-up required. Your progress stays saved on your device.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Compile question data**:

   ```bash
   npm run prebuild
   ```

3. **Start the local server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Zustand
- Lucide React

## Upcoming Features

More updates are coming soon. We are actively working on:

- System design interview prep
- Computer science fundamentals (operating systems, networking, and databases)

Stay tuned.

## License

MIT
