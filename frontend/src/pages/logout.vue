<template>
	<el-card class="logout-card">
		<h1>Выход из системы</h1>
		<p>Вы уверены, что хотите выйти?</p>
		<el-button
			type="primary"
			@click="handleLogout"
			:loading="loading"
		>
			Выйти
		</el-button>
	</el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const token = useLocalStorage('jwt_token', '')

const handleLogout = () => {
	loading.value = true
	try {
		// Очищаем токен
		token.value = ''
		ElMessage.success('Вы успешно вышли из системы')
		// Перенаправляем на страницу входа
		router.push('/login')
	} catch (error) {
		ElMessage.error('Произошла ошибка при выходе из системы')
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.logout-card {
	max-width: 400px;
	margin: 50px auto;
	text-align: center;
}

.logout-card h1 {
	margin-bottom: 20px;
}

.logout-card p {
	margin-bottom: 20px;
}
</style>