<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const raw = localStorage.getItem('workerQuizAnswers')
const answers = raw ? JSON.parse(raw) : null

if (!answers) {
  // If user navigated here directly, send them back
  router.push('/')
}

// Define grading function
function getGrade(percent) {
  if (percent >= 0.9) return 'A'
  if (percent >= 0.8) return 'B'
  if (percent >= 0.7) return 'C'
  if (percent >= 0.6) return 'D'
  return 'F'
}

function startOver() {
  localStorage.removeItem('workerQuizAnswers')
  router.push('/')
}
</script>

<template>
  <div v-if="answers">
    <h2>Results</h2>

    <div v-for="(sectionAnswers, sectionTitle) in answers" :key="sectionTitle">
      <h3>{{ sectionTitle }}</h3>
      <p>
        Score: {{
          Object.values(sectionAnswers).reduce((a, b) => a + b, 0)
        }}
        /
        {{
          Object.values(sectionAnswers).length * 4
        }}
      </p>
      <p>
        Grade:
        {{
          getGrade(
            Object.values(sectionAnswers).reduce((a, b) => a + b, 0) /
              (Object.values(sectionAnswers).length * 4)
          )
        }}
      </p>
    </div>

    <hr />

    <h3>Overall Score</h3>
    <p>
      {{
        Object.values(answers)
          .flatMap((section) => Object.values(section))
          .reduce((a, b) => a + b, 0)
      }}
      /
      {{
        Object.values(answers)
          .flatMap((section) => Object.values(section))
          .length * 4
      }}
    </p>
    <p>
      Grade:
      {{
        getGrade(
          Object.values(answers)
            .flatMap((section) => Object.values(section))
            .reduce((a, b) => a + b, 0) /
            (Object.values(answers).flatMap((section) => Object.values(section)).length * 4)
        )
      }}
    </p>
  </div>
  <button @click="startOver">Start Over</button>
</template>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
