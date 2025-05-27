<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function startQuiz() {
  localStorage.removeItem('workerQuizAnswers')
  router.push('/quiz')
}
</script>

<template>
  <div class="card">
    <h1>Workplace Practices Quiz</h1>
    <p>
      This quiz helps you evaluate your workplace practices in categories such as compensation, safety, and fairness. No data is collected.
    </p>
    <p>
      For each question, choose the option that most closely reflects your current or prospective workplace.
    </p>
    <button @click="startQuiz">Begin Quiz</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
