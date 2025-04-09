<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Редактирование курса</h1>

    <div v-for="(module, moduleIndex) in modules" :key="moduleIndex" class="card mb-4">
      <div class="card-body">
        <h2 class="card-title">Модуль {{ moduleIndex + 1 }}</h2>

        <div class="mb-3">
          <label for="moduleName" class="form-label">Название модуля:</label>
          <input type="text" v-model="module.name" id="moduleName" class="form-control" />
        </div>

        <div v-for="(lecture, lectureIndex) in module.lectures" :key="lectureIndex" class="mb-4">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Лекция {{ lectureIndex + 1 }}</h3>

              <div class="mb-3">
                <label for="lectureName" class="form-label">Название лекции:</label>
                <input type="text" v-model="lecture.name" id="lectureName" class="form-control" />
              </div>

            </div>
          </div>
        </div>

        <button @click="addLectureToModule(moduleIndex)" class="btn btn-info">Добавить лекцию</button>
      </div>
    </div>

    <button @click="addModule" class="btn btn-success">Добавить модуль</button>
    <button @click="submitCourse" class="btn btn-primary mt-3">Сохранить курс</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      courseId: this.$route.params.id,  // Получаем ID курса из URL
      modules: [
        {
          name: "",
          lectures: [
            {
              name: "",
            }
          ]
        }
      ]
    };
  },
  methods: {
    addModule() {
      this.modules.push({
        name: "",
        lectures: []
      });
    },
    addLectureToModule(moduleIndex) {
      this.modules[moduleIndex].lectures.push({
        name: "",
        text: "",
        tests: []
      });
    },

    submitCourse() {
      const courseData = {
        modules: this.modules.map(module => ({
          name: module.name,
          lectures: module.lectures.map(lecture => ({
            name: lecture.name,
          }))
        }))
      };

      axios.post(`http://localhost:1818/course/update-course/${this.courseId}`, courseData)
        .then(response => {
          console.log("Курс обновлен:", response);
        })
        .catch(error => {
          console.error("Ошибка при обновлении курса:", error);
        });
    }
  }
};
</script>

<style scoped>
/* Стилизация контейнера */
.container {
  max-width: 1200px;
}

.card {
  margin-bottom: 20px;
}

button {
  margin-top: 15px;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

textarea.form-control {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-check-label {
  font-size: 14px;
}
</style>
