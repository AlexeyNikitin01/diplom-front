<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-4">Создание курса</h3>

    <div class="form-group mb-3">
      <label for="courseName">Название курса</label>
      <input id="courseName" type="text" v-model="course.name" class="form-control"
        placeholder="Введите название курса" />
    </div>

    <div class="form-group mb-3">
      <label for="courseDescription">Описание курса</label>
      <textarea id="courseDescription" v-model="course.description" class="form-control"
        placeholder="Введите описание курса" rows="5"></textarea>
    </div>

    <div class="form-group mb-3">
      <label for="courseImage">Загрузить изображение</label>
      <input id="courseImage" type="file" @change="onFileChange" class="form-control" />
    </div>

    <button @click="createCourse" class="btn btn-primary" :disabled="loading">
      {{ loading ? "Создание..." : "Создать курс" }}
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const course = reactive({
      name: "",
      description: "",
    });
    const selectedFile = ref(null); // Хранение выбранного файла
    const loading = ref(false);
    const router = useRouter();

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
      }
    };

    const createCourse = async () => {
      if (!course.name || !course.description || !selectedFile.value) {
        alert("Пожалуйста, заполните все поля и загрузите изображение!");
        return;
      }

      try {
        loading.value = true;

        const formData = new FormData();
        formData.append("name", course.name);
        formData.append("description", course.description);
        formData.append("file", selectedFile.value); // Отправка файла

        const response = await axios.post("http://localhost:1818/course/add-course", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const courseId = response.data.course.id; // Предполагаем, что сервер возвращает ID курса
        router.push(`/course-builder/${courseId}`);
      } catch (error) {
        console.error("Ошибка при создании курса:", error);
        alert("Произошла ошибка при создании курса. Попробуйте снова.");
      } finally {
        loading.value = false;
      }
    };

    return {
      course,
      selectedFile,
      loading,
      onFileChange,
      createCourse,
    };
  },
};
</script>


<style>
.container {
  max-width: 800px;
}

button {
  margin-right: 10px;
}
</style>
