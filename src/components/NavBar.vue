<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header ">
                <a class="navbar-brand" href="/"><img height="100" alt="Vue logo" src="../assets/logo.png">diplom</a>
            </div>
            
            <ul class="nav me-auto mb-2 mb-lg-0 list-inline">
                <li class="list-inline-item">
                    <a class="btn nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li class="list-inline-item">
                    <a class="btn nav-link active" aria-current="page" href="/about">About</a>
                </li>
                <li class="list-inline-item">
                    <a class="btn nav-link active" aria-current="page" href="/courses">Courses</a>
                </li>
                <li class="list-inline-item">
                    <a class="btn nav-link active" aria-current="page" href="/lectures">Lectures</a>
                </li>
                <li class="list-inline-item">
                    <a class="btn nav-link active" aria-current="page" href="/models">Models</a>
                </li>
            </ul>
            
            <ul class="nav navbar-right list-inline" v-if="tokenExist">
                <li class="list-inline-item"><a href="auth" class="btn btn-info">Войти</a></li>
                <li class="list-inline-item"><a href="register" class="btn btn-info">Регистрация</a></li>
            </ul>
            
            <ul class="nav navbar-right list-inline" v-if="!tokenExist">
                <li class="list-inline-item"><a href="cabinet" class="btn btn-info">{{ username }}</a></li>
                <button class="list-inline-item btn btn-success" type="submit" @click="exitFun">Выйти</button>
            </ul>
            
        </div>
    </nav>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

interface State {
    tokenExist: boolean,
    userUUID: string | null,
    username: string,
}

export default defineComponent({
    data(): State {
        return {
            tokenExist: !localStorage.getItem("token"),
            userUUID: localStorage.getItem("userUUID"),
            username: ""
        };
    },
    async mounted() {
        try {
            const response = await axios.post('http://localhost:18080/user/get-user', {
                user_uuid: this.userUUID
            }, {
                headers: {
                    authorization: 'bearer ' + localStorage.getItem("token"),
                },
            });
            this.username = response.data.user.login
        } catch (error) {
            console.error('Error get user navbar:', error);
            this.exitFun();
        }
    },
    methods: {
        exitFun() {
            localStorage.removeItem("token");
            localStorage.removeItem("userUUID");
            this.tokenExist = !localStorage.getItem("token");
            this.userUUID = localStorage.getItem("userUUID");
            this.username = "";
            if (window.location.href !== 'http://localhost:8080/register') {
                console.log("imhere", window.location.href);
                this.$router.push('/auth');
            }
        }
    }
});
</script>
