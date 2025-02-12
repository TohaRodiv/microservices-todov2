<template>
	<div class="users-container">
		<h1>Список пользователей</h1>
		<el-button
			type="primary"
			@click="openCreateUserModal"
			style="margin-bottom: 20px;"
		>
			Создать пользователя
		</el-button>
		<el-table
			v-loading="loading"
			:data="users"
			style="width: 100%"
		>
			<el-table-column
				label="Действия"
				width="200"
			>
				<template #default="scope">
					<div class="action-buttons">
						<el-button
							type="primary"
							size="small"
							:icon="EditPen"
							@click="openEditUserModal(scope.row)"
						>
							Ред.
						</el-button>
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="deleteUser(scope.row._id)"
						>
							Удалить
						</el-button>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="_id"
				label="ID"
				width="220"
			/>
			<el-table-column
				prop="username"
				label="Имя пользователя"
			/>
			<el-table-column
				prop="email"
				label="Email"
			/>
			<el-table-column
				prop="createdAt"
				label="Дата регистрации"
				width="200"
			>
				<template #default="scope">
					{{ new Date(scope.row.createdAt).toLocaleString() }}
				</template>
			</el-table-column>
		</el-table>

		<!-- Модальное окно для создания пользователя -->
		<el-dialog
			v-model="createUserDialogVisible"
			title="Создать нового пользователя"
			width="50%"
		>
			<el-form
				:model="newUser"
				label-width="120px"
			>
				<el-form-item label="Имя">
					<el-input v-model="newUser.username"></el-input>
				</el-form-item>
				<el-form-item label="Email">
					<el-input v-model="newUser.email"></el-input>
				</el-form-item>
				<el-form-item label="Пароль">
					<el-input
						v-model="newUser.password"
						type="password"
					></el-input>
				</el-form-item>
			</el-form>
			<el-alert
				v-for="(error, index) in createUserErrors"
				:key="index"
				:title="error"
				type="error"
				:closable="false"
				show-icon
				style="margin-bottom: 10px;"
			/>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="createUserDialogVisible = false">Отмена</el-button>
					<el-button
						type="primary"
						@click="createUser"
					>Создать</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- Модальное окно для редактирования пользователя -->
		<el-dialog
			v-model="editUserDialogVisible"
			title="Редактировать пользователя"
			width="50%"
		>
			<el-form
				:model="editingUser"
				label-width="120px"
			>
				<el-form-item label="Имя">
					<el-input v-model="editingUser.username"></el-input>
				</el-form-item>
				<el-form-item label="Email">
					<el-input v-model="editingUser.email"></el-input>
				</el-form-item>
				<el-form-item label="Пароль">
					<el-input
						v-model="editingUser.password"
						type="password"
					/>
				</el-form-item>
			</el-form>
			<el-alert
				v-for="(error, index) in editUserErrors"
				:key="index"
				:title="error"
				type="error"
				:closable="false"
				show-icon
				style="margin-bottom: 10px;"
			/>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editUserDialogVisible = false">Отмена</el-button>
					<el-button
						type="primary"
						@click="updateUser"
					>Сохранить</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { Delete, EditPen } from '@element-plus/icons-vue'

const users = ref([])
const loading = ref(true)
const token = useLocalStorage('jwt_token', '')
const router = useRouter()

const createUserDialogVisible = ref(false)
const newUser = ref({
	username: '',
	email: '',
	password: ''
})

const editUserDialogVisible = ref(false)
const editingUser = ref({
	_id: null,
	username: '',
	email: ''
})

const createUserErrors = ref([])
const editUserErrors = ref([])

const openCreateUserModal = () => {
	createUserDialogVisible.value = true
}

const openEditUserModal = (user) => {
	editingUser.value = { ...user }
	editUserDialogVisible.value = true
}
const fetchUsers = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		const response = await axios.get('http://localhost/users', {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		users.value = response.data
	} catch (error) {
		console.error('Error fetching users:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else {
			ElMessage.error('Не удалось загрузить данные пользователей')
		}
	} finally {
		loading.value = false
	}
}

const createUser = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		await axios.post('http://localhost/users', newUser.value, {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Пользователь успешно создан')
		createUserDialogVisible.value = false
		createUserErrors.value = []
		await fetchUsers()
	} catch (error) {
		console.error('Error creating user:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else if (error.response && error.response.status === 400) {
			createUserErrors.value = error.response.data.message
		} else {
			ElMessage.error('Не удалось создать пользователя')
		}
	}
}

const updateUser = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		await axios.put(`http://localhost/users/${editingUser.value._id}`, editingUser.value, {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Пользователь успешно обновлен')
		editUserDialogVisible.value = false
		editUserErrors.value = []
		await fetchUsers()
	} catch (error) {
		console.error('Error updating user:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else if (error.response && error.response.status === 400) {
			editUserErrors.value = error.response.data.message
		} else {
			ElMessage.error('Не удалось обновить пользователя')
		}
	}
}

const deleteUser = async (userId) => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		await ElMessageBox.confirm(
			'Вы уверены, что хотите удалить этого пользователя?',
			'Подтверждение',
			{
				confirmButtonText: 'Да',
				cancelButtonText: 'Отмена',
				type: 'warning',
			}
		)

		await axios.delete(`http://localhost/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Пользователь успешно удален')
		await fetchUsers()
	} catch (error) {
		if (error === 'cancel') {
			return
		}
		console.error('Error deleting user:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else {
			ElMessage.error('Не удалось удалить пользователя')
		}
	}
}
onMounted(() => {
	fetchUsers()
})
</script>

<style scoped>
.users-container {
	padding: 20px;
}

h1 {
	margin-bottom: 20px;
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
}

.action-buttons {
	display: flex;
	gap: .25rem;
}
</style>
