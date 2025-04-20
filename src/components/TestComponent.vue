<template>
  <div class="test-container">
    <!-- Test Display Mode -->
    <div v-if="!testEditingMode">
      <h2>{{ testForm.name }}</h2>

      <div v-if="!testCompleted">
        <div v-for="(question, qIndex) in testForm.questions" :key="qIndex" class="question-container">
          <h3>{{ qIndex + 1 }}. {{ question.text }}</h3>

          <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-option">
            <input
                type="radio"
                :id="'q'+qIndex+'a'+aIndex"
                :name="'question'+qIndex"
                :value="aIndex"
                v-model="testResults[qIndex]"
            >
            <label :for="'q'+qIndex+'a'+aIndex">{{ answer.text }}</label>
          </div>
        </div>

        <button @click="submitTest" class="submit-btn">Submit Test</button>
      </div>

      <div v-else class="results-container">
        <h3>Test Results</h3>
        <div v-for="(question, qIndex) in testForm.questions" :key="qIndex" class="result-item">
          <p>
            <strong>{{ qIndex + 1 }}. {{ question.text }}</strong><br>
            Your answer: {{ getAnswerText(qIndex, testResults[qIndex]) }}<br>
            <span :class="{'correct': isAnswerCorrect(qIndex, testResults[qIndex]), 'incorrect': !isAnswerCorrect(qIndex, testResults[qIndex])}">
              {{ isAnswerCorrect(qIndex, testResults[qIndex]) ? 'Correct!' : 'Incorrect' }}
            </span>
          </p>
        </div>
        <button @click="resetTest" class="reset-btn">Retake Test</button>
      </div>

      <button v-if="!testCompleted" @click="enterEditMode" class="edit-btn">Edit Test</button>
    </div>

    <!-- Test Editing Mode -->
    <div v-else class="edit-mode">
      <h2>Edit Test: {{ testForm.name }}</h2>

      <div class="form-group">
        <label for="test-name">Test Name:</label>
        <input id="test-name" v-model="testForm.name" type="text" class="form-control">
      </div>

      <div v-for="(question, qIndex) in testForm.questions" :key="qIndex" class="question-edit">
        <div class="form-group">
          <label :for="'question-text-'+qIndex">Question {{ qIndex + 1 }}:</label>
          <input
              :id="'question-text-'+qIndex"
              v-model="question.text"
              type="text"
              class="form-control"
          >
        </div>

        <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-edit">
          <div class="form-group">
            <label :for="'answer-text-'+qIndex+'-'+aIndex">Answer {{ aIndex + 1 }}:</label>
            <div class="answer-input-group">
              <input
                  :id="'answer-text-'+qIndex+'-'+aIndex"
                  v-model="answer.text"
                  type="text"
                  class="form-control answer-text"
              >
              <input
                  type="radio"
                  :name="'correct-answer-'+qIndex"
                  :value="aIndex"
                  v-model="question.correctAnswer"
                  @change="updateCorrectAnswers(question)"
              >
              <label>Correct</label>
            </div>
          </div>
        </div>

        <button @click="addAnswer(qIndex)" class="add-answer-btn">Add Answer</button>
        <button @click="removeQuestion(qIndex)" class="remove-btn">Remove Question</button>
      </div>

      <button @click="addQuestion" class="add-question-btn">Add Question</button>
      <button @click="saveChanges" class="save-btn">Save Changes</button>
      <button @click="cancelEdit" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialTest: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      testCompleted: false,
      testResults: {},
      testForm: JSON.parse(JSON.stringify(this.initialTest)),
      testEditingMode: false
    }
  },
  methods: {
    submitTest() {
      this.testCompleted = true;
      this.$emit('test-completed', this.testResults);
    },
    resetTest() {
      this.testCompleted = false;
      this.testResults = {};
    },
    isAnswerCorrect(qIndex, aIndex) {
      if (aIndex === undefined) return false;
      return this.testForm.questions[qIndex].answers[aIndex].isCorrect;
    },
    getAnswerText(qIndex, aIndex) {
      if (aIndex === undefined) return 'No answer selected';
      return this.testForm.questions[qIndex].answers[aIndex].text;
    },
    enterEditMode() {
      // Prepare the form for editing
      this.testForm.questions.forEach(question => {
        // Find the correct answer index for radio buttons
        question.correctAnswer = question.answers.findIndex(a => a.isCorrect);
      });
      this.testEditingMode = true;
    },
    addQuestion() {
      this.testForm.questions.push({
        text: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: -1
      });
    },
    removeQuestion(index) {
      this.testForm.questions.splice(index, 1);
    },
    addAnswer(qIndex) {
      this.testForm.questions[qIndex].answers.push({
        text: '',
        isCorrect: false
      });
    },
    updateCorrectAnswers(question) {
      // Update all answers' isCorrect based on the correctAnswer index
      question.answers.forEach((answer, index) => {
        answer.isCorrect = index === question.correctAnswer;
      });
    },
    saveChanges() {
      // Validate the form
      if (!this.testForm.name.trim()) {
        alert('Please enter a test name');
        return;
      }

      for (const question of this.testForm.questions) {
        if (!question.text.trim()) {
          alert('All questions must have text');
          return;
        }

        for (const answer of question.answers) {
          if (!answer.text.trim()) {
            alert('All answers must have text');
            return;
          }
        }

        if (question.correctAnswer === undefined || question.correctAnswer === -1) {
          alert('Each question must have one correct answer');
          return;
        }
      }

      // Clean up the editing-specific data before saving
      const testToSave = JSON.parse(JSON.stringify(this.testForm));
      testToSave.questions.forEach(question => {
        delete question.correctAnswer;
      });

      this.$emit('test-updated', testToSave);
      this.testEditingMode = false;
      this.resetTest();
    },
    cancelEdit() {
      this.testForm = JSON.parse(JSON.stringify(this.initialTest));
      this.testEditingMode = false;
    }
  },
  watch: {
    initialTest: {
      handler(newVal) {
        this.testForm = JSON.parse(JSON.stringify(newVal));
        this.resetTest();
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h3 {
  color: #34495e;
  margin-top: 15px;
}

.question-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.answer-option {
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.answer-option:hover {
  background-color: #e0e0e0;
}

button {
  padding: 8px 15px;
  margin: 10px 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn {
  background-color: #27ae60;
  color: white;
}

.submit-btn:hover {
  background-color: #2ecc71;
}

.reset-btn {
  background-color: #3498db;
  color: white;
}

.reset-btn:hover {
  background-color: #2980b9;
}

.edit-btn {
  background-color: #f39c12;
  color: white;
}

.edit-btn:hover {
  background-color: #e67e22;
}

.results-container {
  padding: 20px;
  background-color: white;
  border-radius: 5px;
}

.result-item {
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.correct {
  color: #27ae60;
  font-weight: bold;
}

.incorrect {
  color: #e74c3c;
  font-weight: bold;
}

/* Edit Mode Styles */
.edit-mode {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}

.answer-input-group {
  display: flex;
  align-items: center;
}

.answer-text {
  flex-grow: 1;
  margin-right: 10px;
}

.add-answer-btn {
  background-color: #3498db;
  color: white;
  margin-right: 10px;
}

.add-question-btn {
  background-color: #2ecc71;
  color: white;
  margin-right: 10px;
}

.save-btn {
  background-color: #27ae60;
  color: white;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.remove-btn {
  background-color: #e74c3c;
  color: white;
  margin-left: 10px;
}

.question-edit {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}
</style>
