<template>
  <div class="course-container">
    <div class="course-layout">
      <!-- Сайдбар -->
      <SideBarComponent
          :editing="edit"
          :course="course"
          :modules="modules"
          :current-lecture="currentLecture"
          @set-current-lecture="setCurrentLecture"
          @add-module="addModule"
          @add-lecture="addLecture"
      />

      <!-- Основное содержимое -->
      <div class="course-main">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>Загрузка...</span>
        </div>

        <div v-else class="lecture-container">
          <!-- Описание курса -->
          <div v-if="currentLecture?.id === 'description'" class="lecture-content">
            <div class="lecture-header">
              <h2 class="lecture-title">
                <i class="bi bi-info-circle"></i>
                {{ currentLecture.title }}
              </h2>
              <button class="btn-edit" @click="isEditingDescription = !isEditingDescription">
                <i class="bi bi-pencil"></i> {{ isEditingDescription ? 'Отменить' : 'Редактировать' }}
              </button>
            </div>

            <form v-if="isEditingDescription" @submit.prevent="saveDescription" class="edit-form">
              <textarea v-model="editedDescription" class="form-textarea"></textarea>
              <div class="form-actions">
                <button type="submit" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel" @click="isEditingDescription = false">Отменить</button>
              </div>
            </form>

            <div v-else class="lecture-text">
              {{ currentLecture.lecture }}
            </div>
          </div>

          <!-- Контент лекции -->
          <div v-else-if="currentLecture" class="lecture-content">
            <div class="lecture-header">
              <h2 class="lecture-title">
                <i class="bi bi-file-earmark-text"></i>
                {{ currentLecture.name }}
              </h2>
              <div class="lecture-actions">
                <button class="btn-edit" @click="toggleLectureEdit">
                  <i class="bi bi-pencil"></i> {{ isEditingLecture ? 'Отменить' : 'Редактировать' }}
                </button>
                <button
                    class="btn-add-test"
                    @click="toggleTestForm"
                    v-if="!currentLecture.tests || isAddingTest">
                  <i class="bi bi-plus-circle"></i>
                  {{ isAddingTest ? 'Отменить' : currentLecture.tests ? 'Изменить тест' : 'Добавить тест' }}
                </button>
              </div>
            </div>

            <!-- Форма редактирования лекции -->
            <form v-if="isEditingLecture" @submit.prevent="saveLecture" class="edit-form">
              <textarea v-model="editedLectureText" class="form-textarea"></textarea>
              <div class="form-actions">
                <button type="submit" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel" @click="toggleLectureEdit">Отменить</button>
              </div>
            </form>

            <!-- Основной текст лекции -->
            <div v-else class="lecture-text">
              {{ currentLecture.text }}
            </div>

            <!-- Форма создания/редактирования теста -->
            <div v-if="isAddingTest" class="test-form-container">
              <h4 class="test-title">
                <i class="bi bi-question-circle"></i>
                {{ currentLecture.tests ? 'Редактирование теста' : 'Создание теста' }}
              </h4>

              <form @submit.prevent="saveTest" class="test-edit-form">
                <div v-for="(question, qIndex) in testForm.questions" :key="qIndex" class="question-form">
                  <div class="form-group">
                    <label>Вопрос {{ qIndex + 1 }}</label>
                    <input
                        type="text"
                        v-model="question.text"
                        placeholder="Текст вопроса"
                        required
                        class="form-input">
                  </div>

                  <div class="answers-list">
                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-form">
                      <div class="answer-input-group">
                        <input
                            type="checkbox"
                            v-model="answer.isCorrect"
                            class="answer-checkbox">
                        <input
                            type="text"
                            v-model="answer.text"
                            placeholder="Вариант ответа"
                            required
                            class="form-input answer-input">
                      </div>
                      <button
                          type="button"
                          @click="removeAnswerFromForm(qIndex, aIndex)"
                          class="btn-remove"
                          v-if="question.answers.length > 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>

                    <button
                        type="button"
                        @click="addAnswerToForm(qIndex)"
                        class="btn-add-answer">
                      <i class="bi bi-plus"></i> Добавить вариант ответа
                    </button>
                  </div>

                  <button
                      type="button"
                      @click="removeQuestionFromForm(qIndex)"
                      class="btn-remove-question"
                      v-if="testForm.questions.length > 1">
                    <i class="bi bi-trash"></i> Удалить вопрос
                  </button>
                </div>

                <button
                    type="button"
                    @click="addQuestionToForm"
                    class="btn-add-question">
                  <i class="bi bi-plus-lg"></i> Добавить вопрос
                </button>

                <div class="form-actions">
                  <button type="submit" class="btn-save">Сохранить тест</button>
                  <button type="button" class="btn-cancel" @click="toggleTestForm">Отменить</button>
                </div>
              </form>
            </div>

            <!-- Компонент теста -->
            <test-component
                v-if="currentLecture.tests && !isAddingTest"
                :initial-test="prepareTestData()"
                @test-completed="handleTestCompletion"
                @test-updated="handleTestUpdate"
            />
          </div>

          <!-- Пустое состояние -->
          <div v-else class="empty-state">
            <i class="bi bi-journal-text"></i>
            <p>Выберите лекцию из структуры курса</p>
          </div>
        </div>
      </div>
    </div>
    <div class="save-actions">
      <button v-if="edit" @click="saveCourse" class="btn-save-course">
        <i class="bi bi-save"></i> Сохранить курс
      </button>

      <button v-if="!edit" @click="editing" class="btn-save-course">
        <i class="bi bi-pencil"></i> Редактировать курс
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TestComponent from '@/components/TestComponent';
import SideBarComponent from '@/components/SideBarComponent';

export default {
  components: {
    TestComponent,
    SideBarComponent
  },
  data() {
    return {
      edit: false,
      course: {},
      modules: [],
      loading: true,
      currentLecture: null,
      isEditingDescription: false,
      editedDescription: '',
      isEditingLecture: false,
      editedLectureText: '',
      isAddingTest: false,
      testForm: {
        questions: [
          {
            text: '',
            answers: [
              {text: '', isCorrect: false},
              {text: '', isCorrect: false}
            ]
          }
        ]
      }
    };
  },

  created() {
    const courseId = this.$route.params.id;
    this.getCourseData(courseId);
  },

  methods: {
    prepareTestData() {
      if (!this.currentLecture.tests || this.currentLecture.tests.length === 0) {
        return {
          name: 'Тест',
          questions: []
        };
      }

      const testData = this.currentLecture.tests[0].test;
      return {
        name: testData.name,
        questions: testData.questions.map(question => ({
          id: question.id,
          text: question.text,
          answers: question.answers.map(answer => ({
            id: answer.id,
            text: answer.text,
            isCorrect: answer.isCorrect
          }))
        }))
      };
    },

    handleTestCompletion(results) {
      console.log('Test completed with results:', results);
    },

    handleTestUpdate(updatedTest) {
      const tests = [{
        test: {
          test_id: this.currentLecture.tests?.[0]?.test?.test_id || null,
          name: updatedTest.name,
          questions: updatedTest.questions.map(question => ({
            question_id: question.id || null,
            text: question.text,
            answers: question.answers.map(answer => ({
              answer_id: answer.id || null,
              text: answer.text,
              is_correct: answer.isCorrect
            }))
          }))
        }
      }];
      if (!this.currentLecture.tests) {
        this.currentLecture.tests = [];
      }
      this.currentLecture.tests = tests;
    },

    toggleLectureEdit() {
      this.isEditingLecture = !this.isEditingLecture;
      if (this.isEditingLecture) {
        this.editedLectureText = this.currentLecture.text;
      }
    },

    saveLecture() {
      this.currentLecture.text = this.editedLectureText;
      this.isEditingLecture = false;
    },

    toggleTestForm() {
      this.isAddingTest = !this.isAddingTest;
      if (this.isAddingTest && this.currentLecture.tests) {
        this.testForm.questions = this.currentLecture.tests.flatMap(test =>
            test.test.questions.map(question => ({
              text: question.text,
              answers: question.answers.map(answer => ({
                text: answer.text,
                isCorrect: answer.isCorrect
              }))
            }))
        );
      } else if (this.isAddingTest) {
        this.testForm = {
          questions: [
            {
              text: '',
              answers: [
                {text: '', isCorrect: false},
                {text: '', isCorrect: false}
              ]
            }
          ]
        };
      }
    },

    addQuestionToForm() {
      this.testForm.questions.push({
        text: '',
        answers: [
          {text: '', isCorrect: false},
          {text: '', isCorrect: false}
        ]
      });
    },

    removeQuestionFromForm(index) {
      this.testForm.questions.splice(index, 1);
    },

    addAnswerToForm(qIndex) {
      this.testForm.questions[qIndex].answers.push({
        text: '',
        isCorrect: false
      });
    },

    removeAnswerFromForm(qIndex, aIndex) {
      this.testForm.questions[qIndex].answers.splice(aIndex, 1);
    },

    saveTest() {
      const tests = [{
        test: {
          test_id: this.currentLecture.tests?.[0]?.test?.test_id || null,
          name: 'Тест',
          questions: this.testForm.questions.map(question => ({
            question_id: null,
            text: question.text,
            answers: question.answers.map(answer => ({
              answer_id: null,
              text: answer.text,
              is_correct: answer.isCorrect
            }))
          }))
        }
      }];

      if (!this.currentLecture.tests) {
        this.currentLecture.tests = [];
      }
      this.currentLecture.tests = tests;
      this.isAddingTest = false;
    },

    async getCourseData(courseId) {
      try {
        const response = await axios.post(
            `http://localhost:1818/course/get-course/${courseId}`
        );
        const data = response.data;

        this.course = data.course;

        this.modules = data.modules.map(module => ({
          module: {
            module_id: module.module.module_id,
            name_module: module.module.name_module,
            lectures: module.module.lectures.map(lecture => ({
              lecture: {
                lecture_id: lecture.lecture.lecture_id,
                name: lecture.lecture.name,
                text: lecture.lecture.text,
                tests: lecture.lecture.tests.map(test => ({
                  test: {
                    test_id: test.test.test_id,
                    name: test.test.name,
                    questions: test.test.questions.map(question => ({
                      id: question.question.question_id,
                      text: question.question.text,
                      answers: question.question.answers.map(answer => ({
                        id: answer.answer.answer_id,
                        text: answer.answer.text,
                        isCorrect: answer.answer.is_correct
                      }))
                    }))
                  }
                }))
              }
            }))
          }
        }));

        if (this.currentLecture && this.currentLecture.id !== 'description') {
          const foundLecture = this.findLectureById(this.currentLecture.id);
          if (foundLecture) {
            this.currentLecture = foundLecture;
          }
        }
      } catch (error) {
        console.error("Ошибка при получении данных курса:", error);
      } finally {
        this.loading = false;
      }
    },

    findLectureById(lectureId) {
      for (const module of this.modules) {
        for (const lecture of module.module.lectures) {
          if (lecture.lecture.lecture_id === lectureId) {
            return lecture.lecture;
          }
        }
      }
      return null;
    },

    setCurrentLecture(lecture) {
      this.currentLecture = lecture;
      this.isEditingLecture = false;
      this.isAddingTest = false;
    },

    addModule() {
      const moduleName = prompt("Введите название модуля:");
      if (moduleName) {
        this.modules.push({
          module: {
            module_id: null,
            name_module: moduleName,
            lectures: []
          }
        });
      }
    },

    addLecture(module) {
      const lectureName = prompt("Введите название лекции:");
      if (lectureName) {
        const newLecture = {
          lecture: {
            lecture_id: null,
            name: lectureName,
            text: "",
            tests: []
          }
        };
        module.lectures.push(newLecture);
        this.setCurrentLecture(newLecture.lecture);
      }
    },

    prepareCourseData() {
      return {
        modules: this.modules.map(module => ({
          module_id: module.module.module_id,
          name: module.module.name_module,
          lectures: module.module.lectures.map(lecture => ({
            lecture_id: lecture.lecture.lecture_id,
            name: lecture.lecture.name,
            text: lecture.lecture.text,
            tests: (lecture.lecture.tests || []).map(test => ({
              test_id: test.test.test_id,
              name: test.test.name,
              questions: test.test.questions.map(question => ({
                question_id: question.question_id,
                text: question.text,
                answers: question.answers.map(answer => ({
                  answer_id: answer.answer_id,
                  text: answer.text,
                  is_correct: answer.is_correct
                }))
              }))
            }))
          }))
        }))
      };
    },

    saveCourse() {
      const courseData = this.prepareCourseData();
      this.edit = !this.edit;
      axios.post(`http://localhost:1818/course/update-course/${this.$route.params.id}`, courseData)
          .then(response => {
            console.log("Курс обновлен:", response);
            this.getCourseData(this.$route.params.id);
          })
          .catch(error => {
            console.error("Ошибка при обновлении курса:", error);
            alert("Произошла ошибка при сохранении курса. Пожалуйста, попробуйте снова.");
          });
    },

    editing() {
      this.edit = !this.edit;
    },

    saveDescription() {
      this.course.description = this.editedDescription;
      this.isEditingDescription = false;
    }
  }
};
</script>

<style scoped>
/* Основные переменные цветов */
:root {
  --primary: #4361ee;
  --primary-light: #e0e7ff;
  --secondary: #3f37c9;
  --success: #4cc9f0;
  --danger: #f72585;
  --warning: #f8961e;
  --info: #4895ef;
  --dark: #212529;
  --light: #f8f9fa;
  --gray: #6c757d;
  --border-radius: 12px;
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Общие стили */
.course-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--dark);
  line-height: 1.6;
}

.course-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  background: #f5f7ff;
}

/* Основное содержимое */
.course-main {
  flex-grow: 1;
  padding: 2rem 3rem;
  background: white;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  box-shadow: var(--box-shadow);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--gray);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--primary-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lecture-container {
  background: white;
  border-radius: var(--border-radius);
}

.lecture-content {
  max-width: 800px;
  margin: 0 auto;
}

.lecture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.lecture-title {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lecture-title i {
  color: var(--primary);
}

.lecture-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-add-test {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-edit {
  background: var(--primary-light);
  color: var(--primary);
}

.btn-edit:hover {
  background: #d6e0ff;
}

.btn-add-test {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-add-test:hover {
  background: #c8e6c9;
}

/* Формы редактирования */
.edit-form, .test-form-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
}

.form-textarea, .form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s;
  margin-bottom: 1rem;
  background: white;
}

.form-textarea {
  min-height: 200px;
  resize: vertical;
}

.form-textarea:focus, .form-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-save, .btn-cancel, .submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save, .submit-btn {
  background: var(--primary);
  color: #000000;
}

.btn-save:hover, .submit-btn:hover {
  background: var(--secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(67, 97, 238, 0.3);
}

.btn-cancel {
  background: #e9ecef;
  color: var(--dark);
}

.btn-cancel:hover {
  background: #dee2e6;
}

/* Стили для тестов */
.test-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.test-title {
  color: var(--dark);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.test-title i {
  color: var(--info);
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--gray);
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  color: #e9ecef;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* Кнопка сохранения курса */
.save-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-save-course {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save-course:hover {
  background: #3e8e41;
}

/* Адаптивность */
@media (max-width: 992px) {
  .course-layout {
    flex-direction: column;
  }

  .course-main {
    padding: 1.5rem;
  }

  .lecture-header, .test-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .lecture-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn-save, .btn-cancel, .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .test-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>