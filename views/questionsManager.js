const chaptersData = require('../data/chapters.json');

const getQuestionsManagerHtml = () => {
  const chaptersOptions = chaptersData
    .map(
      (c) =>
        `<option value="${c.customIndex}">Module ${c.customIndex}: ${c.name.replace(/^\d+[_]/, '')}</option>`
    )
    .join('');

  const chaptersMapJson = JSON.stringify(
    chaptersData.reduce((acc, c) => {
      acc[c.customIndex] = c.name.replace(/^\d+[_]/, '');
      return acc;
    }, {})
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>United CDL Training School - Question Manager</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0a0f1d;
      --bg-card: #111827;
      --bg-card-hover: #162032;
      --border-color: #1f293d;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --brand-primary: #0f5a70;
      --brand-accent: #38bdf8;
      --success-green: #10b981;
      --success-bg: rgba(16, 185, 129, 0.12);
      --danger-red: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.15);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    header {
      background: rgba(17, 24, 39, 0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 24px;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(15, 90, 112, 0.4);
    }

    .brand-title {
      font-size: 19px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .brand-sub {
      font-size: 12px;
      color: var(--brand-accent);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #0369a1, #075985);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #1f293d;
      color: #e5e7eb;
      border: 1px solid #374151;
    }

    .btn-secondary:hover {
      background: #374151;
    }

    .btn-danger {
      background: var(--danger-bg);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    /* Main Content */
    main {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 28px 24px;
      flex: 1;
    }

    /* Control Bar */
    .controls-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 28px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .controls-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 260px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      background: #0d1527;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--brand-accent);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 16px;
    }

    .select-dropdown {
      padding: 12px 18px;
      background: #0d1527;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      min-width: 280px;
    }

    .select-dropdown:focus {
      border-color: var(--brand-accent);
    }

    .stats-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #1f293d;
      font-size: 13.5px;
      color: var(--text-muted);
      flex-wrap: wrap;
      gap: 10px;
    }

    .badge-count {
      background: rgba(56, 189, 248, 0.15);
      color: var(--brand-accent);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
    }

    /* Questions Grid */
    .questions-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .question-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 24px;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }

    .question-card:hover {
      border-color: #2d3748;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
    }

    .module-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(15, 90, 112, 0.35);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #7dd3fc;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 700;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .question-title {
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    /* Options List */
    .options-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    @media (min-width: 900px) {
      .options-list {
        grid-template-columns: 1fr 1fr;
      }
    }

    .option-item {
      padding: 14px 18px;
      background: #0d1527;
      border: 1px solid #1e293b;
      border-radius: 10px;
      font-size: 14px;
      color: #cbd5e1;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      line-height: 1.5;
      position: relative;
    }

    .option-letter {
      width: 24px;
      height: 24px;
      background: #1e293b;
      color: #94a3b8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* Correct Answer Highlighting */
    .option-item.correct-answer {
      background: rgba(16, 185, 129, 0.1);
      border: 1.5px solid #10b981;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
    }

    .option-item.correct-answer .option-letter {
      background: #10b981;
      color: #ffffff;
    }

    .correct-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: #10b981;
      color: #ffffff;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-left: auto;
      flex-shrink: 0;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      max-width: 750px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      transform: scale(0.96);
      transition: transform 0.2s ease;
    }

    .modal-overlay.active .modal {
      transform: scale(1);
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
    }

    .modal-close {
      background: transparent;
      border: none;
      color: #9ca3af;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }

    .modal-close:hover { color: #ffffff; }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13.5px;
      font-weight: 600;
      color: #cbd5e1;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 12px 16px;
      background: #0d1527;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      border-color: var(--brand-accent);
    }

    .form-textarea {
      resize: vertical;
      min-height: 90px;
    }

    /* Modal Options Editor */
    .options-edit-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option-edit-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #0d1527;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #1f293d;
    }

    .option-edit-row.selected-as-correct {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.08);
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      font-weight: 600;
      color: #94a3b8;
      cursor: pointer;
      white-space: nowrap;
    }

    .radio-label input[type="radio"] {
      accent-color: #10b981;
      cursor: pointer;
    }

    .option-edit-row.selected-as-correct .radio-label {
      color: #34d399;
    }

    .btn-remove-opt {
      background: transparent;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
    }

    .btn-remove-opt:hover { color: #f87171; }

    .modal-footer {
      padding: 18px 24px;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #10b981;
      color: #ffffff;
      padding: 14px 24px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast.active {
      transform: translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>

  <!-- Navbar -->
  <header>
    <div class="nav-container">
      <div class="brand">
        <div class="brand-icon">🚛</div>
        <div>
          <div class="brand-title">United CDL Training School</div>
          <div class="brand-sub">ELDT Question & Assessment Manager</div>
        </div>
      </div>
      <div class="header-actions">
        <a href="/status" class="btn btn-secondary" style="text-decoration: none;">
          <span>⚡</span> System Status
        </a>
        <button class="btn btn-primary" onclick="openCreateModal()">
          <span>+</span> Add New Question
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main>
    <div class="controls-panel">
      <div class="controls-row">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="searchInput" class="search-input" placeholder="Search questions by text or keywords..." oninput="handleFilterChange()">
        </div>
        <select id="chapterSelect" class="select-dropdown" onchange="handleFilterChange()">
          <option value="">All Modules (1 - 35)</option>
          ${chaptersOptions}
        </select>
      </div>
      <div class="stats-bar">
        <div>
          Showing <span id="showingCount" class="badge-count">0</span> of <span id="totalCount" class="badge-count">0</span> Questions
        </div>
        <div style="color: #64748b;">
          Passing Criterion: <strong style="color: #10b981;">&ge; 80%</strong> correct answers per module
        </div>
      </div>
    </div>

    <!-- Questions Container -->
    <div id="questionsContainer" class="questions-grid">
      <div class="empty-state">
        <div class="empty-icon">⏳</div>
        <h3>Loading curriculum questions...</h3>
      </div>
    </div>
  </main>

  <!-- Edit / Create Modal -->
  <div id="editModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modalTitle" class="modal-title">Edit Question</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="editQuestionId">

        <div class="form-group">
          <label class="form-label">Module / Chapter</label>
          <select id="editChapterId" class="form-select">
            ${chaptersOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Question Text</label>
          <textarea id="editQuestionText" class="form-textarea" placeholder="Enter question description here..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            Options (Select radio button for the Correct Answer)
          </label>
          <div id="editOptionsContainer" class="options-edit-container">
            <!-- Dynamic option inputs injected here -->
          </div>
          <button type="button" class="btn btn-secondary" style="margin-top: 8px; align-self: flex-start;" onclick="addOptionRow()">
            + Add Option
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="btnSaveQuestion" onclick="saveQuestion()">Save Changes</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <span>✓</span> <span id="toastMessage">Question saved successfully!</span>
  </div>

  <script>
    const chaptersMap = ${chaptersMapJson};
    let allQuestions = [];
    let filteredQuestions = [];

    // Fetch questions on page load
    async function loadQuestions() {
      try {
        const res = await fetch('/api/admin/questions');
        const data = await res.json();
        if (data.success && Array.isArray(data.questions)) {
          allQuestions = data.questions;
          applyFilters();
        } else {
          document.getElementById('questionsContainer').innerHTML = \`
            <div class="empty-state">
              <div class="empty-icon">⚠️</div>
              <h3>Failed to load questions</h3>
              <p>\${data.message || 'Please check database connection.'}</p>
            </div>\`;
        }
      } catch (err) {
        console.error(err);
        document.getElementById('questionsContainer').innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3>Error connecting to server</h3>
            <p>\${err.message}</p>
          </div>\`;
      }
    }

    function applyFilters() {
      const search = (document.getElementById('searchInput').value || '').toLowerCase().trim();
      const chapter = document.getElementById('chapterSelect').value;

      filteredQuestions = allQuestions.filter(q => {
        const matchesChapter = !chapter || String(q.chapterId) === String(chapter);
        const matchesSearch = !search ||
          (q.questionText || '').toLowerCase().includes(search) ||
          (q.quesOptions || []).some(opt => (opt || '').toLowerCase().includes(search));
        return matchesChapter && matchesSearch;
      });

      document.getElementById('totalCount').innerText = allQuestions.length;
      document.getElementById('showingCount').innerText = filteredQuestions.length;
      renderQuestions();
    }

    function handleFilterChange() {
      applyFilters();
    }

    function renderQuestions() {
      const container = document.getElementById('questionsContainer');

      if (filteredQuestions.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No questions match your filter</h3>
            <p>Try selecting a different module or clearing the search box.</p>
          </div>\`;
        return;
      }

      container.innerHTML = filteredQuestions.map((q, idx) => {
        const moduleName = chaptersMap[q.chapterId] || \`Module \${q.chapterId}\`;
        const optionsHtml = (q.quesOptions || []).map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          const isCorrect = (opt || '').trim() === (q.quesAnswer || '').trim();
          return \`
            <div class="option-item \${isCorrect ? 'correct-answer' : ''}">
              <div class="option-letter">\${letter}</div>
              <div style="flex: 1;">\${escapeHtml(opt)}</div>
              \${isCorrect ? '<div class="correct-badge">✓ Correct Answer</div>' : ''}
            </div>\`;
        }).join('');

        return \`
          <div class="question-card" id="card-\${q._id}">
            <div class="card-header">
              <div class="module-pill">
                <span>📘</span> Module \${q.chapterId}: \${moduleName}
              </div>
              <div class="card-actions">
                <button class="btn btn-secondary" onclick="openEditModal('\${q._id}')">
                  ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteQuestion('\${q._id}')">
                  🗑️
                </button>
              </div>
            </div>
            <div class="question-title">
              \${idx + 1}. \${escapeHtml(q.questionText)}
            </div>
            <div class="options-list">
              \${optionsHtml}
            </div>
          </div>\`;
      }).join('');
    }

    // Modal Handling
    function openCreateModal() {
      document.getElementById('modalTitle').innerText = 'Add New Question';
      document.getElementById('editQuestionId').value = '';
      document.getElementById('editQuestionText').value = '';
      document.getElementById('editChapterId').value = document.getElementById('chapterSelect').value || '1';

      // Default 4 empty options
      renderOptionRows(['', '', '', ''], 0);
      document.getElementById('editModal').classList.add('active');
    }

    function openEditModal(questionId) {
      const question = allQuestions.find(q => q._id === questionId);
      if (!question) return;

      document.getElementById('modalTitle').innerText = 'Edit Question';
      document.getElementById('editQuestionId').value = question._id;
      document.getElementById('editChapterId').value = question.chapterId;
      document.getElementById('editQuestionText').value = question.questionText || '';

      const correctIndex = (question.quesOptions || []).findIndex(
        opt => (opt || '').trim() === (question.quesAnswer || '').trim()
      );

      renderOptionRows(question.quesOptions || [], correctIndex >= 0 ? correctIndex : 0);
      document.getElementById('editModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('editModal').classList.remove('active');
    }

    function renderOptionRows(optionsArray, selectedIndex = 0) {
      const container = document.getElementById('editOptionsContainer');
      container.innerHTML = optionsArray.map((opt, idx) => \`
        <div class="option-edit-row \${idx === selectedIndex ? 'selected-as-correct' : ''}" id="opt-row-\${idx}">
          <label class="radio-label">
            <input type="radio" name="correctRadio" value="\${idx}" \${idx === selectedIndex ? 'checked' : ''} onchange="updateCorrectSelection(\${idx})">
            Correct
          </label>
          <input type="text" class="form-input opt-val-input" value="\${escapeHtml(opt)}" placeholder="Option \${String.fromCharCode(65 + idx)} text...">
          <button type="button" class="btn-remove-opt" onclick="removeOptionRow(\${idx})" title="Remove option">✕</button>
        </div>
      \`).join('');
    }

    function updateCorrectSelection(selectedIndex) {
      const rows = document.querySelectorAll('.option-edit-row');
      rows.forEach((r, idx) => {
        if (idx === selectedIndex) {
          r.classList.add('selected-as-correct');
        } else {
          r.classList.remove('selected-as-correct');
        }
      });
    }

    function addOptionRow() {
      const currentValues = Array.from(document.querySelectorAll('.opt-val-input')).map(input => input.value);
      const selectedRadio = document.querySelector('input[name="correctRadio"]:checked');
      const selectedIndex = selectedRadio ? parseInt(selectedRadio.value) : 0;
      currentValues.push('');
      renderOptionRows(currentValues, selectedIndex);
    }

    function removeOptionRow(index) {
      const currentValues = Array.from(document.querySelectorAll('.opt-val-input')).map(input => input.value);
      if (currentValues.length <= 2) {
        alert('A question must have at least 2 options.');
        return;
      }
      currentValues.splice(index, 1);
      renderOptionRows(currentValues, 0);
    }

    // Save Question (Create / Update)
    async function saveQuestion() {
      const id = document.getElementById('editQuestionId').value;
      const chapterId = document.getElementById('editChapterId').value;
      const questionText = document.getElementById('editQuestionText').value.trim();

      const optionInputs = document.querySelectorAll('.opt-val-input');
      const quesOptions = Array.from(optionInputs).map(i => i.value.trim()).filter(v => v !== '');

      if (!questionText) {
        alert('Please enter question text.');
        return;
      }

      if (quesOptions.length < 2) {
        alert('Please provide at least 2 non-empty options.');
        return;
      }

      const selectedRadio = document.querySelector('input[name="correctRadio"]:checked');
      const selectedIndex = selectedRadio ? parseInt(selectedRadio.value) : 0;
      const quesAnswer = quesOptions[selectedIndex] || quesOptions[0];

      const btnSave = document.getElementById('btnSaveQuestion');
      btnSave.disabled = true;
      btnSave.innerText = 'Saving...';

      try {
        const url = id ? \`/api/admin/questions/\${id}\` : '/api/admin/questions';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chapterId,
            questionText,
            quesOptions,
            quesAnswer,
          })
        });

        const data = await res.json();
        if (data.success) {
          if (id) {
            const idx = allQuestions.findIndex(q => q._id === id);
            if (idx >= 0) allQuestions[idx] = data.question;
            showToast('✓ Question updated successfully!');
          } else {
            allQuestions.unshift(data.question);
            showToast('✓ New question created successfully!');
          }
          applyFilters();
          closeModal();
        } else {
          alert('Error: ' + (data.message || 'Failed to save question'));
        }
      } catch (err) {
        console.error(err);
        alert('Network error while saving question: ' + err.message);
      } finally {
        btnSave.disabled = false;
        btnSave.innerText = 'Save Changes';
      }
    }

    // Delete Question
    async function deleteQuestion(id) {
      if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
        return;
      }

      try {
        const res = await fetch(\`/api/admin/questions/\${id}\`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          allQuestions = allQuestions.filter(q => q._id !== id);
          applyFilters();
          showToast('✓ Question deleted successfully.');
        } else {
          alert('Error: ' + (data.message || 'Failed to delete'));
        }
      } catch (err) {
        console.error(err);
        alert('Network error deleting question.');
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMessage').innerText = msg;
      toast.classList.add('active');
      setTimeout(() => toast.classList.remove('active'), 3500);
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Initialize
    loadQuestions();
  </script>
</body>
</html>`;
};

module.exports = { getQuestionsManagerHtml };
