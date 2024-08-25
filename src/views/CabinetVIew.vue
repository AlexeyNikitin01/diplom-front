<template>
    <h1 class="display-1 text-center">
        Редактирование профиля
    </h1>
    <div class="w-50 mx-auto">
        <form class="card p-5 bg-light" @submit.prevent="updateUser">
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
                <label>Дожность:</label>
                <input class="form-control" type="text" v-model="customer.position">
            </div>
            <button class="btn btn-success" type="submit">сохранить</button>
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
    customer: {
        uuid: string
        login: string
        name: string
        surname: string
        email: string
        phone: string
        place_work: string
        position: string
    }
}

export default defineComponent({
    data(): State {
        return {
            tokenExist: !localStorage.getItem("token"),
            userUUID: localStorage.getItem("userUUID"),
            username: "",
            customer: {
                uuid: '',
                login: '',
                name: '',
                surname: '',
                email: '',
                phone: '',
                place_work: '',
                position: '',
            }
        };
    },
    async mounted() {
        try {
            const response = await axios.post('http://localhost:18080/user/get-user', {
                userUUID: this.userUUID
            }, {
                headers: {
                    authorization: 'bearer ' + localStorage.getItem("token"),
                },
            });
            this.username = response.data.user.login
            this.customer = response.data.user
        } catch (error) {
            console.error('Error registering user:', error);
        }
    },
    methods: {
        async updateUser() {
            const response = await axios.post('http://localhost:18080/user/update-user', {
                userUUID: this.userUUID,
                login: this.customer.login,
                name: this.customer.name,
                surname: this.customer.surname,
                email: this.customer.email,
                phone: this.customer.phone,
                place_work: this.customer.place_work,
                position: this.customer.position,
            }, {
                headers: {
                    authorization: 'bearer ' + localStorage.getItem("token"),
                },
            });
            console.log(response)
            this.$router.push({
                path: `/cabinet`
            })
        }
    }
});
</script>