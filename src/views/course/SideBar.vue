<template>
  <div class="sidebar">
    <h4>Структура курса</h4>
    <ul>
      <li v-for="module in modules" :key="module.module.id">
        <strong>{{ module.module.name }}</strong>
        <ul>
          <li v-for="lecture in module.lectures" :key="lecture.lecture.id"
            :class="{ 'active': currentLectureId === lecture.lecture.id }" @click="setCurrentLecture(lecture.lecture)"
            class="lecture-item">
            {{ lecture.lecture.title }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    modules: Array,
    currentLectureId: Number
  },
  methods: {
    setCurrentLecture(lecture) {
      // Отправляем событие в родительский компонент
      this.$emit('set-lecture', lecture);
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 20px;
  left: 0;
  height: 100%;
  width: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.sidebar h4 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.sidebar ul {
  list-style-type: none;
  padding-left: 0;
}

.sidebar li {
  margin-bottom: 8px;
}

.sidebar li strong {
  font-size: 1.1rem;
}

.lecture-item {
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.lecture-item:hover {
  background-color: #f0f8ff;
}

.lecture-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>
