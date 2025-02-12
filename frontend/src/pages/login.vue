<template>
	<el-card class="login-card">
		<h1>Авторизация</h1>
		<el-form
			:model="loginForm"
			@submit.prevent="handleLogin"
			label-width="80"
		>
			<el-form-item
				label="Email"
				prop="email"
			>
				<el-input
					v-model="loginForm.email"
					type="email"
					placeholder="Введите email"
				></el-input>
			</el-form-item>
			<el-form-item
				label="Пароль"
				prop="password"
			>
				<el-input
					v-model="loginForm.password"
					type="password"
					placeholder="Введите пароль"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					native-type="submit"
					:loading="loading"
				>Войти</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const token = useLocalStorage('jwt_token', '')

const loginForm = reactive({
	email: '',
	password: ''
})

// Создаем экземпляр axios с базовым URL и настройками CORS
const api = axios.create({
	baseURL: 'http://localhost', // Убедитесь, что это правильный URL вашего API
	withCredentials: false, // Это важно для отправки куки при кросс-доменных запросах
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
})
const handleLogin = async () => {
	loading.value = true
	try {
		const response = await api.post('/auth/login', loginForm)
		token.value = response.data.access_token;
		ElMessage.success('Авторизация успешна')
		router.push('/') // Перенаправление на главную страницу после успешной авторизации
	} catch (error) {
		console.error('Login error:', error)
		ElMessage.error(error.response?.data?.message || 'Ошибка авторизации')
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.login-card {
	max-width: 400px;
	margin: 50px auto;
}
</style>