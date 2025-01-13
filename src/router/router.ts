import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import AboutSite from "@/views/AboutSite.vue";
import AddCourse from "@/views/course/AddCourse.vue";
import CabinetVIew from "@/views/CabinetVIew.vue";
import CourseBuilder from "@/views/course/CourseBuilder.vue";
import CoursesView from "@/views/course/CoursesView.vue";
import IndexVue from "@/views/IndexVue.vue";
import LecturesView from "@/views/LecturesView.vue";
import ModelView from "@/views/ModelView.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/auth', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/', component: IndexVue, meta: { requiresAuth: true } },
    { path: '/about', component: AboutSite, meta: { requiresAuth: true } },
    { path: '/courses', component: CoursesView, meta: { requiresAuth: true } },
    { path: '/lectures', component: LecturesView, meta: { requiresAuth: true } },
    { path: '/models', component: ModelView, meta: { requiresAuth: true } },
    { path: '/cabinet', component: CabinetVIew, meta: { requiresAuth: true } },
    { path: '/add-course', component: AddCourse, meta: { requiresAuth: false } },
    { path: '/course-builder/:id', component: CourseBuilder, meta: { requiresAuth: false } },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (token) {
            // User is authenticated
            next();
        } else {
            // User is not authenticated; redirect to login
            console.log('No token');
            next('/auth');
        }
    } else {
        // Allow access to non-protected routes
        next();
    }
});

export default router;