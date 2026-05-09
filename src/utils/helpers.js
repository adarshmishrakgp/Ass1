/**
 * Generates a unique ID for each question node.
 * Using a simple timestamp + random approach for readability.
 */
export function generateId() {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Creates a fresh question object with default values.
 */
export function createQuestion(overrides = {}) {
  return {
    id: generateId(),
    text: '',
    type: 'short-answer', // 'short-answer' | 'true-false'
    answer: null,         // 'true' | 'false' | null (only relevant for true-false type)
    children: [],
    ...overrides,
  };
}

/**
 * Recursively finds a question node by its ID in the tree.
 * Returns the node reference if found, otherwise null.
 */
export function findQuestionById(questions, id) {
  for (const q of questions) {
    if (q.id === id) return q;
    const found = findQuestionById(q.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Recursively updates a question node matched by ID.
 * Returns a new array (immutable update).
 */
export function updateQuestionById(questions, id, updater) {
  return questions.map((q) => {
    if (q.id === id) {
      return { ...q, ...updater(q) };
    }
    return {
      ...q,
      children: updateQuestionById(q.children, id, updater),
    };
  });
}

/**
 * Recursively deletes a question node (and its children) by ID.
 * Returns a new array without the deleted node.
 */
export function deleteQuestionById(questions, id) {
  return questions
    .filter((q) => q.id !== id)
    .map((q) => ({
      ...q,
      children: deleteQuestionById(q.children, id),
    }));
}

/**
 * Adds a child question to the node with the given parent ID.
 */
export function addChildToQuestion(questions, parentId, newChild) {
  return updateQuestionById(questions, parentId, (q) => ({
    children: [...q.children, newChild],
  }));
}

/**
 * Generates hierarchical numbering like Q1, Q1.1, Q1.1.2, etc.
 * @param {number} index - Zero-based index of this question among its siblings
 * @param {string|null} parentNumber - The display number of the parent (e.g. "Q1.1")
 */
export function getQuestionNumber(index, parentNumber = null) {
  if (!parentNumber) {
    return `Q${index + 1}`;
  }
  // Strip the leading "Q" if present and append the new level
  const base = parentNumber.startsWith('Q') ? parentNumber.slice(1) : parentNumber;
  return `Q${base}.${index + 1}`;
}

/**
 * Flattens the question tree into a flat list with numbering,
 * used for the submission summary view.
 */
export function flattenQuestions(questions, parentNumber = null) {
  const result = [];
  questions.forEach((q, index) => {
    const number = getQuestionNumber(index, parentNumber);
    result.push({ ...q, number });
    if (q.children && q.children.length > 0) {
      result.push(...flattenQuestions(q.children, number));
    }
  });
  return result;
}
