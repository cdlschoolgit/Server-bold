const chaptersData = require('../data/chapters.json');

const getQuestionsManagerHtml = (initialTab = 'questions') => {
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
      --bg-page: #f4f5f7;
      --bg-card: #ffffff;
      --color-black: #111827;
      --color-dark-gray: #374151;
      --color-mid-gray: #6b7280;
      --color-border: #e5e7eb;
      --color-border-dark: #111827;
      --color-yellow: #facc15;
      --color-yellow-hover: #eab308;
      --color-yellow-dark: #ca8a04;
      --color-yellow-light: #fefce8;
      --color-yellow-badge: #fef08a;
      --color-red: #ef4444;
      --color-red-light: #fef2f2;
      --color-green: #15803d;
      --color-green-light: #f0fdf4;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-page);
      color: var(--color-black);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    header {
      background-color: #ffffff;
      border-bottom: 2px solid var(--color-border-dark);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 14px 24px;
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
      gap: 14px;
      text-decoration: none;
      color: inherit;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background-color: var(--color-yellow);
      border: 2px solid var(--color-border-dark);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .brand-title {
      font-size: 19px;
      font-weight: 800;
      color: var(--color-black);
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 12px;
      color: var(--color-dark-gray);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* View Tabs */
    .tabs-group {
      display: flex;
      background-color: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .tab-btn {
      padding: 9px 18px;
      font-size: 13.5px;
      font-weight: 700;
      border: none;
      background: #ffffff;
      color: var(--color-dark-gray);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .tab-btn:not(:last-child) {
      border-right: 2px solid var(--color-border-dark);
    }

    .tab-btn:hover {
      background-color: var(--color-yellow-light);
      color: var(--color-black);
    }

    .tab-btn.active {
      background-color: var(--color-border-dark);
      color: #ffffff;
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
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease;
    }

    .btn-yellow {
      background-color: var(--color-yellow);
      color: var(--color-black);
      border: 2px solid var(--color-border-dark);
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .btn-yellow:hover {
      background-color: var(--color-yellow-hover);
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px var(--color-border-dark);
    }

    .btn-yellow:active {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--color-border-dark);
    }

    .btn-black {
      background-color: var(--color-border-dark);
      color: #ffffff;
      border: 2px solid var(--color-border-dark);
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .btn-black:hover {
      background-color: #000000;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px var(--color-border-dark);
    }

    .btn-white {
      background-color: #ffffff;
      color: var(--color-black);
      border: 2px solid var(--color-border-dark);
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .btn-white:hover {
      background-color: #f3f4f6;
    }

    .btn-danger {
      background-color: var(--color-red-light);
      color: #b91c1c;
      border: 1.5px solid #f87171;
    }

    .btn-danger:hover {
      background-color: #fee2e2;
    }

    .btn-sm {
      padding: 6px 14px;
      font-size: 13px;
    }

    /* Main Container */
    main {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      flex: 1;
    }

    /* Controls Panel */
    .controls-panel {
      background-color: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 3px 3px 0px var(--color-border-dark);
    }

    .controls-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 280px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      background-color: #ffffff;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      color: var(--color-black);
      font-size: 14.5px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .search-input:focus {
      border-color: var(--color-border-dark);
      background-color: var(--color-yellow-light);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      pointer-events: none;
      color: var(--color-mid-gray);
    }

    .select-dropdown {
      padding: 12px 18px;
      background-color: #ffffff;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      color: var(--color-black);
      font-size: 14.5px;
      font-family: inherit;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      min-width: 260px;
    }

    .select-dropdown:focus {
      border-color: var(--color-border-dark);
    }

    .stats-bar {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 13.5px;
      color: var(--color-dark-gray);
      font-weight: 600;
    }

    .badge-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-yellow);
      color: var(--color-black);
      border: 1.5px solid var(--color-border-dark);
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 13px;
    }

    /* Questions Grid */
    .questions-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .question-card {
      background-color: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 12px;
      padding: 22px 24px;
      box-shadow: 3px 3px 0px var(--color-border-dark);
      transition: transform 0.1s ease;
    }

    .question-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .module-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--color-yellow-badge);
      border: 1.5px solid var(--color-yellow-dark);
      color: #713f12;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .question-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--color-black);
      line-height: 1.5;
      margin-bottom: 18px;
    }

    /* Options List */
    .options-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    @media (min-width: 860px) {
      .options-list {
        grid-template-columns: 1fr 1fr;
      }
    }

    .option-item {
      padding: 12px 16px;
      background-color: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: var(--color-dark-gray);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      line-height: 1.5;
      position: relative;
    }

    .option-letter {
      width: 26px;
      height: 26px;
      background-color: #f3f4f6;
      color: var(--color-black);
      border: 1.5px solid #d1d5db;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
    }

    /* Correct Answer Highlighting (Yellow & Black High-Contrast) */
    .option-item.correct-answer {
      background-color: var(--color-yellow-light);
      border: 2px solid var(--color-yellow-dark);
      color: var(--color-black);
      font-weight: 700;
    }

    .option-item.correct-answer .option-letter {
      background-color: var(--color-yellow);
      border-color: var(--color-yellow-dark);
      color: var(--color-black);
    }

    .correct-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      background-color: var(--color-border-dark);
      color: var(--color-yellow);
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-left: auto;
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 12px;
      box-shadow: 3px 3px 0px var(--color-border-dark);
      color: var(--color-mid-gray);
    }

    .empty-icon {
      font-size: 44px;
      margin-bottom: 12px;
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(17, 24, 39, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal {
      background-color: #ffffff;
      border: 3px solid var(--color-border-dark);
      border-radius: 14px;
      max-width: 750px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 6px 6px 0px var(--color-border-dark);
      transform: scale(0.98);
      transition: transform 0.15s ease;
    }

    .modal-overlay.active .modal {
      transform: scale(1);
    }

    .modal-header {
      padding: 18px 24px;
      border-bottom: 2px solid var(--color-border-dark);
      background-color: var(--color-yellow);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--color-black);
    }

    .modal-close {
      background: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 6px;
      color: var(--color-black);
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 1px 1px 0px var(--color-border-dark);
    }

    .modal-close:hover {
      background-color: #f3f4f6;
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--color-black);
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 11px 14px;
      background-color: #ffffff;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      color: var(--color-black);
      font-size: 14px;
      font-family: inherit;
      outline: none;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      border-color: var(--color-border-dark);
      background-color: var(--color-yellow-light);
    }

    .form-textarea {
      resize: vertical;
      min-height: 85px;
    }

    /* Modal Options Editor */
    .options-edit-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-edit-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
    }

    .option-edit-row.selected-as-correct {
      border-color: var(--color-yellow-dark);
      background-color: var(--color-yellow-light);
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      color: var(--color-dark-gray);
      cursor: pointer;
      white-space: nowrap;
    }

    .radio-label input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--color-yellow-dark);
      cursor: pointer;
    }

    .option-edit-row.selected-as-correct .radio-label {
      color: #854d0e;
    }

    .btn-remove-opt {
      background: #fee2e2;
      border: 1.5px solid #f87171;
      border-radius: 6px;
      color: #b91c1c;
      cursor: pointer;
      font-size: 14px;
      font-weight: 800;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .btn-remove-opt:hover {
      background: #fecaca;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 2px solid var(--color-border-dark);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      background-color: #f8fafc;
    }

    /* System Status Tab View */
    .status-view {
      display: none;
    }

    .status-view.active {
      display: block;
    }

    .status-card {
      background-color: #ffffff;
      border: 2px solid var(--color-border-dark);
      border-radius: 14px;
      padding: 35px 30px;
      box-shadow: 4px 4px 0px var(--color-border-dark);
      max-width: 820px;
      margin: 0 auto;
    }

    .status-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--color-yellow);
      color: var(--color-black);
      border: 2px solid var(--color-border-dark);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--color-green);
      border: 1px solid var(--color-border-dark);
    }

    .status-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--color-black);
      margin-bottom: 8px;
    }

    .status-desc {
      font-size: 15px;
      color: var(--color-dark-gray);
      line-height: 1.5;
    }

    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 25px;
    }

    @media (max-width: 600px) {
      .status-grid { grid-template-columns: 1fr; }
    }

    .info-box {
      background-color: #f8fafc;
      border: 2px solid var(--color-border-dark);
      border-radius: 10px;
      padding: 16px;
      box-shadow: 2px 2px 0px var(--color-border-dark);
    }

    .info-box-label {
      font-size: 12px;
      font-weight: 800;
      color: var(--color-mid-gray);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .info-box-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-black);
    }

    .notice-box {
      background-color: var(--color-yellow-light);
      border: 2px solid var(--color-yellow-dark);
      border-radius: 10px;
      padding: 16px 20px;
      font-size: 13.5px;
      color: var(--color-black);
      line-height: 1.5;
      margin-bottom: 25px;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 25px;
      right: 25px;
      background-color: var(--color-border-dark);
      color: #ffffff;
      border: 2px solid var(--color-yellow);
      padding: 14px 22px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast.active {
      transform: translateY(0);
      opacity: 1;
    }

    .toast-icon {
      color: var(--color-yellow);
      font-size: 18px;
      font-weight: 800;
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
          <div class="brand-sub">ELDT Theory Curriculum & Question Manager</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-group">
        <button id="tabBtnQuestions" class="tab-btn ${initialTab === 'questions' ? 'active' : ''}" onclick="switchTab('questions')">
          <span>📝</span> Questions & Answers
        </button>
        <button id="tabBtnStatus" class="tab-btn ${initialTab === 'status' ? 'active' : ''}" onclick="switchTab('status')">
          <span>⚡</span> System Status
        </button>
      </div>

      <div class="header-actions">
        <button class="btn btn-yellow" onclick="openCreateModal()">
          <span>+</span> Add New Question
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main>
    <!-- TAB 1: Questions Manager View -->
    <div id="questionsTabContent" class="${initialTab === 'questions' ? '' : 'status-view'}">
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
          <div style="color: var(--color-dark-gray);">
            Passing Standard: <strong style="color: var(--color-black); background: var(--color-yellow); padding: 2px 6px; border-radius: 4px;">&ge; 80%</strong> correct answers per module
          </div>
        </div>
      </div>

      <!-- Questions Container -->
      <div id="questionsContainer" class="questions-grid">
        <div class="empty-state">
          <div class="empty-icon">⏳</div>
          <h3 style="color: var(--color-black); font-weight: 800;">Loading curriculum questions...</h3>
        </div>
      </div>
    </div>

    <!-- TAB 2: System Status View -->
    <div id="statusTabContent" class="status-view ${initialTab === 'status' ? 'active' : ''}">
      <div class="status-card">
        <div class="status-header">
          <div class="status-badge">
            <span class="pulse-dot"></span>
            API SYSTEM OPERATIONAL
          </div>
          <h2 class="status-title">United CDL Training School</h2>
          <p class="status-desc">
            Backend Application Services for Entry-Level Driver Training (ELDT), Student Assessments, and Question Administration.
          </p>
        </div>

        <div class="status-grid">
          <div class="info-box">
            <div class="info-box-label">Service Environment</div>
            <div class="info-box-value">Production API Gateway</div>
          </div>
          <div class="info-box">
            <div class="info-box-label">Organization</div>
            <div class="info-box-value">United CDL Training School</div>
          </div>
          <div class="info-box">
            <div class="info-box-label">Curriculum Modules</div>
            <div class="info-box-value">35 Standards-Compliant Lessons</div>
          </div>
          <div class="info-box">
            <div class="info-box-label">Support Contact</div>
            <div class="info-box-value">support@unitedeldt.com</div>
          </div>
        </div>

        <div class="notice-box">
          <strong>Notice:</strong> This server and its API endpoints are proprietary systems owned and operated by United CDL Training School. Access is restricted to authorized students and institutional personnel.
        </div>

        <div style="text-align: center;">
          <button class="btn btn-yellow" onclick="switchTab('questions')">
            <span>📝</span> Back to Question Manager &rarr;
          </button>
        </div>
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
          <textarea id="editQuestionText" class="form-textarea" placeholder="Enter question text here..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            Options (Select the radio button for the Correct Answer)
          </label>
          <div id="editOptionsContainer" class="options-edit-container">
            <!-- Dynamic option inputs injected here -->
          </div>
          <button type="button" class="btn btn-white btn-sm" style="margin-top: 6px; align-self: flex-start;" onclick="addOptionRow()">
            + Add Another Option
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-white" onclick="closeModal()">Cancel</button>
        <button class="btn btn-yellow" id="btnSaveQuestion" onclick="saveQuestion()">Save Changes</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <span class="toast-icon">✓</span> <span id="toastMessage">Question saved successfully!</span>
  </div>

  <script>
    const chaptersMap = ${chaptersMapJson};
    let allQuestions = [];
    let filteredQuestions = [];

    // Tab switcher
    function switchTab(tab) {
      const tabBtnQ = document.getElementById('tabBtnQuestions');
      const tabBtnS = document.getElementById('tabBtnStatus');
      const contentQ = document.getElementById('questionsTabContent');
      const contentS = document.getElementById('statusTabContent');

      if (tab === 'questions') {
        tabBtnQ.classList.add('active');
        tabBtnS.classList.remove('active');
        contentQ.classList.remove('status-view');
        contentS.classList.add('status-view');
        contentS.classList.remove('active');
      } else {
        tabBtnS.classList.add('active');
        tabBtnQ.classList.remove('active');
        contentQ.classList.add('status-view');
        contentS.classList.remove('status-view');
        contentS.classList.add('active');
      }
    }

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
              <h3 style="color: var(--color-black); font-weight: 800;">No questions found or database is initializing.</h3>
              <p style="margin-top: 8px;">Click <strong>+ Add New Question</strong> to create your first question.</p>
            </div>\`;
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        document.getElementById('questionsContainer').innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3 style="color: var(--color-black); font-weight: 800;">Failed to load questions from server</h3>
            <p style="margin-top: 8px;">\${err.message}</p>
            <button class="btn btn-yellow" style="margin-top: 16px;" onclick="loadQuestions()">Retry</button>
          </div>\`;
      }
    }

    function handleFilterChange() {
      applyFilters();
    }

    function applyFilters() {
      const searchTerm = (document.getElementById('searchInput').value || '').trim().toLowerCase();
      const chapterVal = document.getElementById('chapterSelect').value;

      filteredQuestions = allQuestions.filter(q => {
        const matchesChapter = !chapterVal || String(q.chapterId) === String(chapterVal);
        const matchesSearch = !searchTerm || (
          (q.questionText && q.questionText.toLowerCase().includes(searchTerm)) ||
          (Array.isArray(q.quesOptions) && q.quesOptions.some(opt => opt && opt.toLowerCase().includes(searchTerm))) ||
          (q.quesAnswer && q.quesAnswer.toLowerCase().includes(searchTerm))
        );
        return matchesChapter && matchesSearch;
      });

      document.getElementById('showingCount').innerText = filteredQuestions.length;
      document.getElementById('totalCount').innerText = allQuestions.length;

      renderQuestionsList();
    }

    function renderQuestionsList() {
      const container = document.getElementById('questionsContainer');

      if (filteredQuestions.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3 style="color: var(--color-black); font-weight: 800;">No matching questions found</h3>
            <p style="margin-top: 8px;">Try clearing your search query or selecting a different module.</p>
          </div>\`;
        return;
      }

      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

      const html = filteredQuestions.map((q, idx) => {
        const chapterName = chaptersMap[q.chapterId] || \`Module \${q.chapterId}\`;
        const options = Array.isArray(q.quesOptions) ? q.quesOptions : [];
        const answer = (q.quesAnswer || '').trim();

        const optionsHtml = options.map((opt, i) => {
          const letter = letters[i] || String(i + 1);
          const isCorrect = opt.trim().toLowerCase() === answer.toLowerCase();
          return \`
            <div class="option-item \${isCorrect ? 'correct-answer' : ''}">
              <div class="option-letter">\${letter}</div>
              <div style="flex: 1;">\${escapeHtml(opt)}</div>
              \${isCorrect ? '<span class="correct-badge">✓ Correct</span>' : ''}
            </div>
          \`;
        }).join('');

        return \`
          <div class="question-card" id="q-card-\${q._id}">
            <div class="question-header">
              <span class="module-pill">Module \${q.chapterId}: \${chapterName}</span>
              <div class="card-actions">
                <button class="btn btn-yellow btn-sm" onclick="openEditModal('\${q._id}')">
                  ✏️ Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteQuestion('\${q._id}')">
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div class="question-title">
              \${escapeHtml(q.questionText)}
            </div>
            <div class="options-list">
              \${optionsHtml}
            </div>
          </div>
        \`;
      }).join('');

      container.innerHTML = html;
    }

    // Modal Operations
    function openEditModal(questionId) {
      const q = allQuestions.find(item => item._id === questionId);
      if (!q) return;

      document.getElementById('modalTitle').innerText = 'Edit Question';
      document.getElementById('editQuestionId').value = q._id;
      document.getElementById('editChapterId').value = q.chapterId;
      document.getElementById('editQuestionText').value = q.questionText || '';

      const container = document.getElementById('editOptionsContainer');
      container.innerHTML = '';

      const options = Array.isArray(q.quesOptions) && q.quesOptions.length > 0
        ? q.quesOptions
        : ['', '', '', ''];

      const correctAnswer = (q.quesAnswer || '').trim();

      options.forEach((opt, idx) => {
        const isCorrect = opt.trim().toLowerCase() === correctAnswer.toLowerCase();
        addOptionRow(opt, isCorrect);
      });

      document.getElementById('editModal').classList.add('active');
    }

    function openCreateModal() {
      document.getElementById('modalTitle').innerText = 'Add New Question';
      document.getElementById('editQuestionId').value = '';
      const currentFilter = document.getElementById('chapterSelect').value;
      document.getElementById('editChapterId').value = currentFilter || '1';
      document.getElementById('editQuestionText').value = '';

      const container = document.getElementById('editOptionsContainer');
      container.innerHTML = '';
      addOptionRow('', true);
      addOptionRow('', false);
      addOptionRow('', false);
      addOptionRow('', false);

      document.getElementById('editModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('editModal').classList.remove('active');
    }

    function addOptionRow(value = '', isChecked = false) {
      const container = document.getElementById('editOptionsContainer');
      const rowId = 'opt-row-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

      const row = document.createElement('div');
      row.className = 'option-edit-row ' + (isChecked ? 'selected-as-correct' : '');
      row.id = rowId;

      row.innerHTML = \`
        <label class="radio-label" title="Mark as correct answer">
          <input type="radio" name="modalCorrectAnswerRadio" \${isChecked ? 'checked' : ''} onchange="handleRadioChange('\${rowId}')">
          <span>Correct</span>
        </label>
        <input type="text" class="form-input opt-input" value="\${escapeHtml(value)}" placeholder="Enter option text..." style="flex: 1;">
        <button type="button" class="btn-remove-opt" onclick="removeOptionRow('\${rowId}')" title="Delete Option">✕</button>
      \`;

      container.appendChild(row);
    }

    function handleRadioChange(selectedRowId) {
      const allRows = document.querySelectorAll('.option-edit-row');
      allRows.forEach(row => {
        if (row.id === selectedRowId) {
          row.classList.add('selected-as-correct');
        } else {
          row.classList.remove('selected-as-correct');
        }
      });
    }

    function removeOptionRow(rowId) {
      const row = document.getElementById(rowId);
      if (row) {
        const wasChecked = row.querySelector('input[type="radio"]').checked;
        row.remove();
        if (wasChecked) {
          const firstRemaining = document.querySelector('.option-edit-row');
          if (firstRemaining) {
            firstRemaining.querySelector('input[type="radio"]').checked = true;
            firstRemaining.classList.add('selected-as-correct');
          }
        }
      }
    }

    // Save Question (Create or Update)
    async function saveQuestion() {
      const qId = document.getElementById('editQuestionId').value;
      const chapterId = document.getElementById('editChapterId').value;
      const questionText = document.getElementById('editQuestionText').value.trim();

      if (!questionText) {
        alert('Please enter question text.');
        return;
      }

      const rows = document.querySelectorAll('.option-edit-row');
      const quesOptions = [];
      let quesAnswer = '';

      rows.forEach(r => {
        const input = r.querySelector('.opt-input');
        const text = input ? input.value.trim() : '';
        if (text) {
          quesOptions.push(text);
          const radio = r.querySelector('input[type="radio"]');
          if (radio && radio.checked) {
            quesAnswer = text;
          }
        }
      });

      if (quesOptions.length < 2) {
        alert('Please provide at least 2 options.');
        return;
      }

      if (!quesAnswer) {
        alert('Please select which option is the correct answer by clicking its radio button.');
        return;
      }

      const payload = {
        questionText,
        chapterId: Number(chapterId),
        quesOptions,
        quesAnswer,
      };

      const btnSave = document.getElementById('btnSaveQuestion');
      btnSave.disabled = true;
      btnSave.innerText = 'Saving...';

      try {
        let url = '/api/admin/questions';
        let method = 'POST';

        if (qId) {
          url = \`/api/admin/questions/\${qId}\`;
          method = 'PUT';
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          if (qId) {
            const index = allQuestions.findIndex(q => q._id === qId);
            if (index !== -1) {
              allQuestions[index] = data.question;
            }
            showToast('✓ Question updated successfully!');
          } else {
            allQuestions.unshift(data.question);
            showToast('✓ New question added successfully!');
          }

          closeModal();
          applyFilters();
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
