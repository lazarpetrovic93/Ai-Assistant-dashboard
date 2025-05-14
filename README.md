# AI Dashboard

A modern dashboard application for managing and generating reports with AI assistance.

## Features

### Report Management
- Create, edit, and delete reports
- Drag and drop to reorder reports
- Responsive design for all screen sizes
- Persistent storage using localStorage
- Rich text content support (paragraphs, lists, tables, images)

### AI Assistant
- Interactive chat interface
- Generate draft reports
- Summarize existing reports
- Responsive design with mobile optimization
  - Fixed at bottom on mobile/tablet
  - Expandable on smaller screens
  - Side panel on desktop

### UI/UX Features
- Material UI components
- Dark/Light theme support
- Smooth animations and transitions
- Drag and drop functionality
- Responsive layout
- Modern and clean design

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Reports
- Click "Add New Report" to create a report
- Drag the handle on the left to reorder reports
- Click the edit icon to modify a report
- Click the delete icon to remove a report
- Reports are automatically saved to localStorage

### AI Assistant
- Type your message and click "Send" to chat
- Click "Generate Draft" to create a new report draft
- Click "Summarize Content" to get a summary of all reports
- On mobile/tablet:
  - Assistant is fixed at the bottom
  - Click to expand/collapse
- On desktop:
  - Assistant appears as a side panel
  - Always visible

## Technologies Used

- React
- TypeScript
- Material UI
- OpenAI API
- dnd-kit (drag and drop)
- Vite

## Development

- Built with Vite for fast development
- TypeScript for type safety
- ESLint and Prettier for code quality
- Responsive design with Material UI breakpoints

