import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import QuestionItem from './components/QuestionItem';
import SubmissionView from './components/SubmissionView';
import {
  createQuestion,
  deleteQuestionById,
  getQuestionNumber,
} from './utils/helpers';

const LOCAL_STORAGE_KEY = 'nested_form_questions';

function App() {
  const [questions, setQuestions] = useState(() => {
    // Restore from local storage on first load (Bonus: persistence)
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load from local storage:', err);
    }
    return [];
  });

  const [submitted, setSubmitted] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  // Persist to local storage whenever questions change (Bonus: persistence)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
      // Show a brief "Saved" indicator
      setSaveIndicator(true);
      const timer = setTimeout(() => setSaveIndicator(false), 1500);
      return () => clearTimeout(timer);
    } catch (err) {
      console.warn('Failed to save to local storage:', err);
    }
  }, [questions]);

  // Add a new top-level question
  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  // Remove a question (and all its children) by ID
  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => deleteQuestionById(prev, id));
  };

  // Clear the entire form
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all questions?')) {
      setQuestions([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please add at least one question before submitting.');
      return;
    }
    setSubmitted(true);
  };

  // Go back to editing
  const handleBack = () => {
    setSubmitted(false);
  };

  // Bonus: Drag-and-drop reordering of top-level parent questions
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // If dropped outside the list or in the same position, do nothing
    if (!destination) return;
    if (destination.index === source.index) return;

    setQuestions((prev) => {
      const updated = Array.from(prev);
      const [moved] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, moved);
      return updated;
    });
  };

  if (submitted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Nested Form Builder</h1>
        </header>
        <main className="app-main">
          <SubmissionView questions={questions} onBack={handleBack} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Nested Form Builder</h1>
            <p className="header-subtitle">
              Build dynamic forms with nested True/False sub-questions
            </p>
          </div>
          <div className="header-actions">
            {saveIndicator && <span className="save-indicator">✓ Saved</span>}
            {questions.length > 0 && (
              <button className="btn btn-ghost" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="form-wrapper">
          {questions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No questions yet</h3>
              <p>Click the button below to add your first question.</p>
            </div>
          ) : (
            <>
              <div className="drag-hint">
                <span>↕ Drag the handle to reorder parent questions</span>
              </div>

              {/* Drag-and-drop context for top-level questions (Bonus) */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="question-list">
                  {(provided) => (
                    <div
                      className="questions-list"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {questions.map((question, index) => (
                        <Draggable
                          key={question.id}
                          draggableId={question.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`question-card ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                            >
                              {/* Drag handle */}
                              <div
                                className="drag-handle"
                                {...provided.dragHandleProps}
                                title="Drag to reorder"
                                aria-label="Drag handle"
                              >
                                ⠿
                              </div>

                              <div className="question-card-body">
                                <QuestionItem
                                  question={question}
                                  number={getQuestionNumber(index, null)}
                                  onDelete={handleDeleteQuestion}
                                  setQuestions={setQuestions}
                                  questions={questions}
                                  depth={0}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          {/* Action bar */}
          <div className="action-bar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddQuestion}
            >
              + Add New Question
            </button>

            {questions.length > 0 && (
              <button type="submit" className="btn btn-primary">
                Submit Form
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
