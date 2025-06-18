<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const rubric = ref([])
const sectionIndex = ref(0)
const currentSection = ref(null)
const answers = ref({})
const router = useRouter()

onMounted(async () => {
  const res = await fetch('/src/data/rubric.json')
  const json = await res.json()
  rubric.value = json
  currentSection.value = json[sectionIndex.value]
})

// Called when user clicks Next Section
function goToNextSection() {
  const section = rubric.value[sectionIndex.value]
  const topics = section.topics

  // Validate all questions are answered
  for (const topic of topics) {
    if (answers.value[section.section]?.[topic.title] === undefined) {
      alert('Please answer all questions before continuing.')
      return
    }
  }

  sectionIndex.value++
  if (sectionIndex.value < rubric.value.length) {
    currentSection.value = rubric.value[sectionIndex.value]
    scrollToTop()
  } else {
    localStorage.setItem('workerQuizAnswers', JSON.stringify(answers.value))
    router.push('/results')
  }
}

function resetQuiz() {
  localStorage.removeItem('workerQuizAnswers')
  router.push('/')
}

// Called when user selects an option
function recordAnswer(section, topic, score) {
  if (!answers.value[section]) {
    answers.value[section] = {}
  }
  answers.value[section][topic] = score
}

function goToPreviousSection() {
  if (sectionIndex.value > 0) {
    sectionIndex.value--
    currentSection.value = rubric.value[sectionIndex.value]
    scrollToTop()
  }
}

// Scroll to top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div v-if="currentSection">
    <h2>{{ currentSection.section }}</h2>

    <div
      v-for="(topic, topicIndex) in currentSection.topics"
      :key="topicIndex"
      class="topic-block"
    >
      <h3>{{ topic.title }}</h3>
      <div
        class="answer-option"
        v-for="(option, optIndex) in topic.options"
        :key="optIndex"
        :class="{
          selected: answers[currentSection.section]?.[topic.title] === option.score,
        }"
        @click="recordAnswer(currentSection.section, topic.title, option.score)"
      >
        {{ option.label }}
      </div>
    </div>

    <div class="nav-buttons">
      <button @click="goToPreviousSection" :disabled="sectionIndex === 0">Back</button>
      <button @click="resetQuiz">Restart</button>
      <button @click="goToNextSection">Next Section</button>
    </div>
  </div>

  <div v-else>
    <p>Loading quiz...</p>
  </div>
</template>

<style scoped>
.topic-block {
  margin-bottom: 2rem;
  text-align: left;
}

.answer-option {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  background-color: #f9f9f9;
  min-height: 4.5rem;
  font-weight: 500;
  box-sizing: border-box;
  word-break: break-word;
  line-height: 1.5;
}

.answer-option:hover {
  background-color: #f0f0f0;
}

.answer-option.selected {
  background-color: #e6f5ff;
  border-color: #007acc;
}


.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
