import React, { useState } from 'react';
import {
  createQuestion,
  updateQuestionById,
  deleteQuestionById,
  addChildToQuestion,
  getQuestionNumber,
} from '../utils/helpers';

/**
 * QuestionItem is a recursive component that renders a single question
 * along with all of its nested child questions.
 *
 * Props:
 *  - question: the question object { id, text, type, answer, children }
 *  - number: display label like "Q1", "Q1.1", etc.
 *  - onUpdate: callback(updatedTree) — passes entire updated tree up to App
 *  - onDelete: callback(id) — tells the parent to remove this question
 *  - questions: the full question tree (needed to run tree operations)
 *  - setQuestions: state setter from App
 *  - depth: nesting depth (0 = top level), used for visual indentation
 */
function QuestionItem({ question, number, onDelete, setQuestions, questions, depth = 0 }) {
  const [showChildren, setShowChildren] = useState(true);

  // Update the text field for this question
  const handleTextChange = (e) => {
    setQuestions((prev) =>
      updateQuestionById(prev, question.id, () => ({ text: e.target.value }))
    );
  };

  // When the type dropdown changes, reset answer and children
  const handleTypeChange = (e) => {
    setQuestions((prev) =>
      updateQuestionById(prev, question.id, () => ({
        type: e.target.value,
        answer: null,
        children: [],
      }))
    );
  };

  // Handle the True/False radio button selection
  const handleAnswerChange = (value) => {
    setQuestions((prev) =>
      updateQuestionById(prev, question.id, (q) => ({
        answer: value,
        // If switching from True to False, remove all children
        children: value === 'false' ? [] : q.children,
      }))
    );
  };

  // Add a new child question under this question
  const handleAddChild = () => {
    const newChild = createQuestion();
    setQuestions((prev) => addChildToQuestion(prev, question.id, newChild));
    setShowChildren(true);
  };

  // Remove a specific child (or descendant) from the tree
  const handleDeleteChild = (childId) => {
    setQuestions((prev) => deleteQuestionById(prev, childId));
  };

  const isAnsweredTrue = question.type === 'true-false' && question.answer === 'true';
  const hasChildren = question.children && question.children.length > 0;

  // Left border color gets lighter as nesting goes deeper
  const depthColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];
  const borderColor = depthColors[depth % depthColors.length];

  return (
    <div
      className="question-item"
      style={{
        borderLeft: depth > 0 ? `3px solid ${borderColor}` : 'none',
        marginLeft: depth > 0 ? '0' : '0',
        paddingLeft: depth > 0 ? '16px' : '0',
      }}
    >
      {/* Question header row */}
      <div className="question-header">
        <span className="question-number">{number}</span>

        <div className="question-inputs">
          <input
            type="text"
            className="question-text-input"
            placeholder={`Enter question ${number}...`}
            value={question.text}
            onChange={handleTextChange}
          />

          <select
            className="question-type-select"
            value={question.type}
            onChange={handleTypeChange}
          >
            <option value="short-answer">Short Answer</option>
            <option value="true-false">True / False</option>
          </select>
        </div>

        <button
          className="btn btn-delete"
          onClick={() => onDelete(question.id)}
          title="Delete this question"
          aria-label={`Delete question ${number}`}
        >
          ✕
        </button>
      </div>

      {/* True/False answer selector */}
      {question.type === 'true-false' && (
        <div className="answer-selector">
          <span className="answer-label">Answer:</span>
          <label className="radio-label">
            <input
              type="radio"
              name={`answer-${question.id}`}
              value="true"
              checked={question.answer === 'true'}
              onChange={() => handleAnswerChange('true')}
            />
            True
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name={`answer-${question.id}`}
              value="false"
              checked={question.answer === 'false'}
              onChange={() => handleAnswerChange('false')}
            />
            False
          </label>
        </div>
      )}

      {/* Child questions — only shown when answer is True */}
      {isAnsweredTrue && (
        <div className="children-section">
          {hasChildren && (
            <button
              className="btn btn-toggle"
              onClick={() => setShowChildren((prev) => !prev)}
            >
              {showChildren ? '▾ Hide sub-questions' : '▸ Show sub-questions'}
            </button>
          )}

          {showChildren && hasChildren && (
            <div className="children-list">
              {question.children.map((child, index) => (
                <QuestionItem
                  key={child.id}
                  question={child}
                  number={getQuestionNumber(index, number)}
                  onDelete={handleDeleteChild}
                  setQuestions={setQuestions}
                  questions={questions}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}

          <button className="btn btn-add-child" onClick={handleAddChild}>
            + Add Sub-question
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionItem;
