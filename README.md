# Project Gutenberg Explorer

## Overview
Project Gutenberg Explorer is a web application that allows users to explore and analyze books from Project Gutenberg. This application provides features to fetch book content, display it, and perform various text analyses using Large Language Models (LLMs).

## Features
- Fetch and display books from Project Gutenberg by ID
- Save and list previously accessed books
- Perform text analysis on book content:
  - Generate summaries
  - Analyze sentiment
  - Identify key characters
  - Detect language

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui for component library
- OpenAI API for text analysis
- Zod for input validation
- React Query for data fetching and caching
- Jest for testing

## Prerequisites
- Node.js (v14 or later)
- npm or yarn
- OpenAI API key

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/metinferatii/project-gutenberg-explorer.git
   cd project-gutenberg-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage
1. Enter a Project Gutenberg book ID in the input field on the homepage.
2. Click "Explore" to fetch and display the book content.
3. Use the tabs to perform different types of analysis on the book content.
4. Previously accessed books will be listed for quick access.

## Testing
Run the test suite with:
```bash
npm test
```
or
```bash
yarn test
```

## Deployment
This project is set up to be easily deployed on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy your main branch.

Make sure to set up the `OPENAI_API_KEY` environment variable in your Vercel project settings.

## Acknowledgments
- Project Gutenberg for providing free access to a vast library of books
- OpenAI for their powerful language models
- The Next.js team for their excellent framework
- The creators and maintainers of all the libraries used in this project