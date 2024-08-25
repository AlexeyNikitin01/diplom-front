<template>
    <div class="d-flex align-items-center justify-content-center">
        <form class="card p-5 w-50 bg-light" @submit.prevent="loginUser">
            <h2 class="display-4">Вход</h2>
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
            
            <button class="btn btn-success" type="submit">войти</button>
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
        };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:18080/user/auth', {
                    login: this.login,
                    password: this.password,
                });
                if (response.data.data.token) {
                    // Store the token in local storage
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('userUUID', response.data.data.userUUID);
                    // Redirect to dashboard
                    this.$router.push('/').then(() => {
                        window.location.reload();
                    });
                } else {
                    console.log('Invalid username or password.');
                }
            } catch (error) {
                console.error('Error auth user:', error);
            }
        }
    }
});
</script>
