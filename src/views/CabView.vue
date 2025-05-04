<template>
  <h1 class="display-1 text-center">
    Редактирование профиля
  </h1>
  <div class="w-50 mx-auto">
    <form class="card p-5 bg-light" @submit.prevent="updateUser">
      <div class="mb-3 text-center">
        <!-- Показать фотографию, если загружен URL, иначе использовать photo_64 -->
        <img v-if="photoUrl || customer.photo_64"
             :src="photoUrl || `data:image/png;base64,${customer.photo_64}`" alt="Фото профиля"
             class="img-fluid rounded mb-3" style="max-height: 200px;">
      </div>

      <div class="mb-3">
        <label>Загрузить фото:</label>
        <input class="form-control" type="file" @change="onFileChange" accept="image/*">
      </div>

      <div class="mb-3">
        <label>Логин:</label>
        <input class="form-control" type="text" id="login" v-model="customer.login" required>
      </div>
      <div class="mb-3">
        <label>Имя:</label>
        <input class="form-control" type="text" id="name" v-model="customer.name">
      </div>
      <div class="mb-3">
        <label>Фамилия:</label>
        <input class="form-control" type="text" v-model="customer.surname">
      </div>
      <div class="mb-3">
        <label>Почта:</label>
        <input class="form-control" type="text" v-model="customer.email">
      </div>
      <div class="mb-3">
        <label>Телефон:</label>
        <input class="form-control" type="text" v-model="customer.phone">
      </div>
      <div class="mb-3">
        <label>Работа:</label>
        <input class="form-control" type="text" v-model="customer.place_work">
      </div>
      <div class="mb-3">
        <label>Должность:</label>
        <input class="form-control" type="text" v-model="customer.position">
      </div>

      <button class="btn btn-success" type="submit">Сохранить</button>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

interface State {
  tokenExist: boolean,
      userUUID: string | null,
      username: string,
      photoUrl: string,
      photo_64: string
  selectedFile: File | null,
      customer: {
    uuid: string
    login: string
    name: string
    surname: string
    email: string
    phone: string
    place_work: string
    position: string
    photo: string
    photo_64: string
  }
}

export default defineComponent({
  data(): State {
    return {
      tokenExist: !localStorage.getItem("token"),
      userUUID: localStorage.getItem("userUUID"),
      username: "",
      photoUrl: '', // Поле для загрузки фото
      selectedFile: null,
      customer: {
        uuid: '',
        login: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        place_work: '',
        position: '',
        photo: '',
        photo_64: '',
      },
      photo_64: ''
    };
  },
  async mounted() {
    try {
      const response = await axios.post('http://localhost:18080/user/get-user', {
        user_uuid: this.userUUID
      }, {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      });
      this.username = response.data.user.login
      this.customer = response.data.user
      this.customer.photo = response.data.user.url
      this.customer.photo_64 = response.data.avatar
    } catch (error) {
      console.error('Error registering user:', error);
    }

    if (this.customer.photo) {
      this.photoUrl = this.customer.photo;
    }
  },
  methods: {
    // Обработка изменения файла
    onFileChange(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        this.selectedFile = fileInput.files[0];
        this.previewImage(this.selectedFile);
      }
    },

    // Отправка обновленного профиля
    async updateUser() {
      try {
        // Обновляем данные пользователя
        const userResponse = await axios.post('http://localhost:18080/user/update-user', {
          user_uuid: this.userUUID,
          login: this.customer.login,
          name: this.customer.name,
          surname: this.customer.surname,
          email: this.customer.email,
          phone: this.customer.phone,
          place_work: this.customer.place_work,
          position: this.customer.position,
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token"),
          },
        });

        // Если выбран файл, загружаем его
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('user_uuid', this.userUUID!);

          // Отправляем файл на сервер
          const uploadResponse = await axios.post('http://localhost:18080/user/upload-avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: 'Bearer ' + localStorage.getItem("token"),
            },
          });

          if (uploadResponse.data.url !== "") {
            // Обновляем URL фото на странице
            this.photoUrl = uploadResponse.data.url;
          }

          if (uploadResponse.data.img !== "") {
            // Обновляем локальное фото на странице
            this.photo_64 = uploadResponse.data.img;
          }
        }

        // Переход в личный кабинет после обновления
        this.$router.push('/cabinet').then(() => {
          window.location.reload();
        })
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },

    // Предпросмотр загруженного изображения
    previewImage(file: File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  }
});
</script>
