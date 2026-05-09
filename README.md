# Nested Form Builder

A dynamic form builder built with **React + Vite** that supports recursive nested sub-questions, drag-and-drop reordering, and local storage persistence.

---

## Features

### Core
- **Add Parent Questions** – Click "Add New Question" to create a top-level question with a text input and type selector (Short Answer or True/False).
- **Nested Child Questions** – When a True/False question is answered as "True", an "Add Sub-question" button appears. Child questions can themselves have children, enabling unlimited recursive nesting.
- **Auto-Numbering** – Questions are automatically numbered in hierarchical format: `Q1`, `Q1.1`, `Q1.1.1`, `Q2`, etc.
- **Delete** – Every question (parent or child) has a delete button that removes it along with all its descendants.
- **Form Submission** – On submit, a clean hierarchical summary of all questions is displayed with their types and answers.

### Bonus
- **Local Storage Persistence** – The form state is automatically saved to `localStorage` after every change. Refreshing the page restores your previous work.
- **Drag-and-Drop Reordering** – Parent questions can be reordered using the `⠿` drag handle on the left side of each card (powered by `@hello-pangea/dnd`).

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| @hello-pangea/dnd | Drag-and-drop (successor to react-beautiful-dnd) |

---

## Getting Started

### Prerequisites
- Node.js **v16+**
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nested-form.git
cd nested-form

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
nested-form/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component, state management, drag-and-drop
    ├── index.css             # Global styles
    ├── components/
    │   ├── QuestionItem.jsx  # Recursive question component
    │   └── SubmissionView.jsx # Read-only summary after submit
    └── utils/
        └── helpers.js        # Pure utility functions (tree operations, numbering)
```

---

## How It Works

- The question tree is stored as a plain JavaScript array of nested objects in React state.
- All tree operations (update, delete, add child) are implemented as pure functions in `src/utils/helpers.js` to keep the components clean.
- `QuestionItem` is a **recursive component** — it renders itself for each child question, which allows arbitrary nesting depth.
- Auto-numbering is computed on the fly during render by passing the parent's number down as a prop.
