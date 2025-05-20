let rubricData;
let currentSectionIndex = 0;
let answers = {};

async function loadRubric() {
  const res = await fetch("rubric.json");
  rubricData = await res.json();
  showIntro();
}

function showIntro() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Worker+ Self-Assessment</h1>
    <p>This quiz helps you evaluate your workplace practices in categories such as compensation, safety, and fairness. No data is collected.</p>
    <p>Choose the option that most closely reflects your current or prospective workplace.</p>
    <button onclick="startQuiz()">Start Quiz</button>
  `;
}

function startQuiz() {
  showSection(currentSectionIndex);
}

function showSection(index) {
  const section = rubricData[index];
  const app = document.getElementById("app");
  app.innerHTML = `<h2>${section.section}</h2>`;

  section.topics.forEach((topic, topicIndex) => {
    const topicId = `${index}-${topicIndex}`;
    app.innerHTML += `
      <fieldset>
        <legend><strong>${topic.title}</strong></legend>
        ${topic.options
          .map(
            (opt, optIndex) => `
          <label>
            <input type="radio" name="${topicId}" value="${opt.score}" required>
            ${opt.label}
          </label><br/>
        `
          )
          .join("")}
      </fieldset>
    `;
  });

  app.innerHTML += `
    <button onclick="nextSection()">Next</button>
  `;
}

function nextSection() {
  currentSectionIndex++;
  if (currentSectionIndex < rubricData.length) {
    showSection(currentSectionIndex);
  } else {
    showResults();
  }
}

function showResults() {
  const app = document.getElementById("app");
  app.innerHTML = `<h2>Results</h2><p>(Scoring logic coming soon!)</p>`;
}

loadRubric();
