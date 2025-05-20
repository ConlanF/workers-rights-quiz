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

  let formHTML = `<h2>${section.section}</h2><form id="quizForm">`;

  section.topics.forEach((topic, topicIndex) => {
    const topicId = `${index}-${topicIndex}`;
    formHTML += `
      <fieldset>
        <legend><strong>${topic.title}</strong></legend>
        ${topic.options
          .map(
            (opt) => `
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

  formHTML += `<button type="submit">Next</button></form>`;
  app.innerHTML = formHTML;

  document.getElementById("quizForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll("input[type=radio]:checked");
    if (inputs.length < section.topics.length) {
      alert("Please answer all questions before continuing.");
      return;
    }

    inputs.forEach((input) => {
      answers[input.name] = parseInt(input.value);
    });

    nextSection();
  });
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
  const scores = calculateScores();

  let html = `<h2>Results</h2>`;

  scores.forEach((sectionResult) => {
    html += `
      <div>
        <h3>${sectionResult.section}</h3>
        <p><strong>Grade:</strong> ${sectionResult.grade}</p>
        <p><strong>Score:</strong> ${sectionResult.score} out of ${sectionResult.maxScore}</p>
      </div>
    `;
  });

  // Calculate overall score
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const overallGrade = getGrade(totalScore / totalMax);

  html += `
    <hr/>
    <h3>Overall Workplace Grade: ${overallGrade}</h3>
    <p>Total: ${totalScore} out of ${totalMax}</p>
  `;

  app.innerHTML = html;
}

loadRubric();

function calculateScores() {
  const scores = [];

  rubricData.forEach((section, sectionIndex) => {
    let sectionScore = 0;
    let maxScore = 0;

    section.topics.forEach((topic, topicIndex) => {
      const key = `${sectionIndex}-${topicIndex}`;
      const selectedScore = answers[key];

      sectionScore += selectedScore;
      maxScore += 3; // Max score per question is always 3
    });

    scores.push({
      section: section.section,
      score: sectionScore,
      maxScore,
      grade: getGrade(sectionScore / maxScore),
    });
  });

  return scores;
}

function getGrade(percentage) {
  if (percentage >= 0.9) return "A";
  if (percentage >= 0.8) return "B";
  if (percentage >= 0.7) return "C";
  if (percentage >= 0.6) return "D";
  return "F";
}
