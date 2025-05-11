import LoginForm from "@/components/user/LoginForm.vue";
import RegisterForm from "@/components/user/RegisterForm.vue";
import AboutSite from "@/views/AboutSite.vue";
import AddCourse from "@/views/course/AddCourse.vue";
import CabinetVIew from "@/views/CabinetVIew.vue";
import CourseView from "@/views/course/CourseView.vue";
import CoursesView from "@/views/course/CoursesView.vue";
import IndexVue from "@/views/IndexVue.vue";
import LecturesView from "@/views/lectures/LecturesView.vue";
import LectureView from "@/views/lectures/LectureView.vue";
import ModelsView from "@/views/models/ModelsView.vue";
import ModelView from "@/views/models/ModelView.vue";
import AisView from "@/views/ais/AisView.vue";
import AiView from "@/views/ais/AiView.vue";
import { createRouter, createWebHistory } from "vue-router";
import ContactsView from "@/views/ContactsView.vue";
import MapView from "@/views/MapView.vue";
import LabsView from "@/views/labs/LabsView.vue";
import LabView from "@/views/labs/LabView.vue";

const routes = [
    { path: '/', component: IndexVue, meta: { requiresAuth: true } },
    { path: '/auth', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/about', component: AboutSite, meta: { requiresAuth: true } },
    { path: '/map', component: MapView, meta: { requiresAuth: true } },
    { path: '/labs', component: LabsView, meta: { requiresAuth: true } },
    { path: '/labs/:id', component: LabView, meta: { requiresAuth: true } },
    { path: '/courses', component: CoursesView, meta: { requiresAuth: true } },
    { path: '/contacts', component: ContactsView, meta: { requiresAuth: true } },
    { path: '/knowledge-base', component: LecturesView, meta: { requiresAuth: true } },
    { path: '/knowledge-base/lectures/:id', component: LectureView, meta: { requiresAuth: true } },
    { path: '/models', component: ModelsView, meta: { requiresAuth: true } },
    { path: '/models/:id', component: ModelView, meta: { requiresAuth: true } },
    { path: '/ais', component: AisView, meta: { requiresAuth: true } },
    { path: '/ais/:id', component: AiView, meta: { requiresAuth: true } },
    { path: '/cabinet', component: CabinetVIew, meta: { requiresAuth: true } },
    { path: '/course/create', component: AddCourse, meta: { requiresAuth: false } },
    { path: '/course/:id', component: CourseView, meta: { requiresAuth: false } },
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