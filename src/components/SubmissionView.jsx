import React from 'react';
import { flattenQuestions } from '../utils/helpers';

/**
 * SubmissionView renders a read-only hierarchical summary
 * of all questions after the form is submitted.
 *
 * Props:
 *  - questions: the full question tree from App state
 *  - onBack: callback to return to the edit view
 */
function SubmissionView({ questions, onBack }) {
  const flatList = flattenQuestions(questions);

  return (
    <div className="submission-view">
      <div className="submission-header">
        <div className="submission-icon">✓</div>
        <h2>Form Submitted Successfully</h2>
        <p>Here is a summary of all your questions in hierarchical order.</p>
      </div>

      {flatList.length === 0 ? (
        <div className="empty-submission">
          <p>No questions were submitted.</p>
        </div>
      ) : (
        <div className="submission-list">
          {flatList.map((q) => {
            // Calculate depth from the number of dots in the label
            // e.g. Q1 = depth 0, Q1.1 = depth 1, Q1.1.2 = depth 2
            const depth = (q.number.match(/\./g) || []).length;

            return (
              <div
                key={q.id}
                className="submission-item"
                style={{ marginLeft: `${depth * 28}px` }}
              >
                <div className="submission-item-number">{q.number}</div>
                <div className="submission-item-body">
                  <p className="submission-item-text">
                    {q.text || <em className="no-text">( No question text entered )</em>}
                  </p>
                  <div className="submission-item-meta">
                    <span className={`type-badge type-badge--${q.type}`}>
                      {q.type === 'short-answer' ? 'Short Answer' : 'True / False'}
                    </span>
                    {q.type === 'true-false' && q.answer && (
                      <span className={`answer-badge answer-badge--${q.answer}`}>
                        Answer: {q.answer === 'true' ? 'True' : 'False'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="submission-actions">
        <button className="btn btn-primary" onClick={onBack}>
          ← Back to Edit
        </button>
      </div>
    </div>
  );
}

export default SubmissionView;
