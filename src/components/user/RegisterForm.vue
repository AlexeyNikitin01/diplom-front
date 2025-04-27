<template>
    <div class="d-flex align-items-center justify-content-center">
        <form  class="card p-5 w-50 bg-light" @submit.prevent="registerUser">
            <h2 class="display-4">Регистрация</h2>
            <div class="mb-3 row">
                <label for="email" class="col-sm-2 col-form-label">Почта:</label>
                <div class="col-sm-10">
                    <input type="text" id="email" class="form-control" v-model="email" required>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="login" class="col-sm-2 col-form-label">Логин:</label>
                <div class="col-sm-10">
                    <input type="text" id="login" class="form-control" v-model="login" required>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="password" class="col-sm-2 col-form-label">Пароль:</label>
                <div class="col-sm-10">
                    <input type="password" id="password" class="form-control" v-model="password" required>
                </div>
            </div>

            <button class="btn btn-success" type="submit">Зарегистрироваться</button>
        </form>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            login: '',
            password: '',
            email: '',
        };
    },
    methods: {
        async registerUser() {
            try {
                const response = await axios.post('http://localhost:18080/user/register', {
                    login: this.login,
                    password: this.password,
                    email: this.email
                });
                console.log('User registered successfully!', response.data);
                this.$router.push('/auth').then(() => {
                    window.location.reload();
                })
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }
    }
});
</script>