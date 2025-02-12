<template>
	<div class="tasks-container">
		<h1>Список задач</h1>
		<el-button
			type="primary"
			@click="openCreateTaskModal"
			style="margin-bottom: 20px;"
		>
			Создать задачу
		</el-button>
		<el-table
			v-loading="loading"
			:data="tasks"
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
							@click="openEditTaskModal(scope.row)"
						>
							Ред.
						</el-button>
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="deleteTask(scope.row.id)"
						>
							Удалить
						</el-button>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="id"
				label="ID"
				width="80"
			/>
			<el-table-column
				prop="title"
				label="Заголовок"
			/>
			<el-table-column
				prop="description"
				label="Описание"
			/>
			<el-table-column
				prop="createdAt"
				label="Дата создания"
				width="200"
			>
				<template #default="scope">
					{{ new Date(scope.row.createdAt).toLocaleString() }}
				</template>
			</el-table-column>
			<el-table-column
				prop="updatedAt"
				label="Дата обновления"
				width="200"
			>
				<template #default="scope">
					{{ new Date(scope.row.updatedAt).toLocaleString() }}
				</template>
			</el-table-column>
			<el-table-column
				prop="status"
				label="Статус"
				width="120"
			>
				<template #default="scope">
					<el-tag :type="getStatusType(scope.row.status.id)">
						{{ scope.row.status.title }}
					</el-tag>
				</template>
			</el-table-column>
		</el-table>

		<!-- Модальное окно для создания задачи -->
		<el-dialog
			v-model="createTaskDialogVisible"
			title="Создать новую задачу"
			width="50%"
		>
			<el-form
				:model="newTask"
				label-width="120px"
			>
				<el-form-item label="Заголовок">
					<el-input v-model="newTask.title"></el-input>
				</el-form-item>
				<el-form-item label="Описание">
					<el-input
						v-model="newTask.description"
						type="textarea"
					></el-input>
				</el-form-item>
				<el-form-item label="Статус">
					<el-select v-model="newTask.status">
						<el-option
							v-for="option in getStatusOptions()"
							:key="option.value"
							:label="option.label"
							:value="option.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ID пользователя">
					<el-input v-model="newTask.userId"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="createTaskDialogVisible = false">Отмена</el-button>
					<el-button
						type="primary"
						@click="createTask"
					>Создать</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- Модальное окно для редактирования задачи -->
		<el-dialog
			v-model="editTaskDialogVisible"
			title="Редактировать задачу"
			width="50%"
		>
			<el-form
				:model="editingTask"
				label-width="120px"
			>
				<el-form-item label="Заголовок">
					<el-input v-model="editingTask.title"></el-input>
				</el-form-item>
				<el-form-item label="Описание">
					<el-input
						v-model="editingTask.description"
						type="textarea"
					></el-input>
				</el-form-item>
				<el-form-item label="Статус">
					<el-select v-model="editingTask.status">
						<el-option
							v-for="option in getStatusOptions()"
							:key="option.value"
							:label="option.label"
							:value="option.value"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editTaskDialogVisible = false">Отмена</el-button>
					<el-button
						type="primary"
						@click="updateTask"
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

const StatusEnum = {
	TODO: 1,
	IN_PROGRESS: 2,
	DONE: 3,
	ON_HOLD: 4,
	CANCELLED: 5,
}

const StatusTitles = {
	[StatusEnum.TODO]: 'К выполнению',
	[StatusEnum.IN_PROGRESS]: 'В процессе',
	[StatusEnum.DONE]: 'Выполнено',
	[StatusEnum.ON_HOLD]: 'На паузе',
	[StatusEnum.CANCELLED]: 'Отменено',
}
const tasks = ref([])
const loading = ref(true)
const token = useLocalStorage('jwt_token', '')
const router = useRouter()

const createTaskDialogVisible = ref(false)
const newTask = ref({
	title: '',
	description: '',
	status: StatusEnum.TODO,
	userId: ''
})

const openCreateTaskModal = () => {
	createTaskDialogVisible.value = true
}

const getStatusOptions = () => {
	return Object.entries(StatusEnum).map(([key, value]) => ({
		label: StatusTitles[value],
		value: value
	}))
}

const getStatusType = (statusId) => {
	switch (statusId) {
		case StatusEnum.TODO:
			return 'info'
		case StatusEnum.IN_PROGRESS:
			return 'warning'
		case StatusEnum.DONE:
			return 'success'
		case StatusEnum.ON_HOLD:
			return 'info'
		case StatusEnum.CANCELLED:
			return 'danger'
		default:
			return ''
	}
}

const editTaskDialogVisible = ref(false)

const editingTask = ref({
	id: null,
	title: '',
	description: '',
	status: StatusEnum.TODO,
})

const openEditTaskModal = (task) => {
	editingTask.value = {
		...task,
		status: task.status.id // Сохраняем только id статуса
	}
	editTaskDialogVisible.value = true
}

const updateTask = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		const updatedTask = {
			...editingTask.value,
			status: editingTask.value.status // status уже является id
		}

		await axios.put(`http://localhost/todos/${editingTask.value.id}`, updatedTask, {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Задача успешно обновлена')
		editTaskDialogVisible.value = false
		await fetchTasks() // Обновляем список задач
	} catch (error) {
		console.error('Error updating task:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else {
			ElMessage.error('Не удалось обновить задачу')
		}
	}
}

const createTask = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		const response = await axios.post('http://localhost/todos/', newTask.value, {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Задача успешно создана')
		createTaskDialogVisible.value = false
		await fetchTasks() // Обновляем список задач
	} catch (error) {
		console.error('Error creating task:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else {
			ElMessage.error('Не удалось создать задачу')
		}
	}
}

const fetchTasks = async () => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		const response = await axios.get('http://localhost/todos/', {
			headers: {
				Authorization: `Bearer ${token.value}`
			}
		})
		tasks.value = response.data
	} catch (error) {
		console.error('Error fetching tasks:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = '' // Очищаем невалидный токен
			router.push('/login')
		} else {
			ElMessage.error('Не удалось загрузить список задач')
		}
	} finally {
		loading.value = false
	}
}

const deleteTask = async (taskId) => {
	if (!token.value) {
		ElMessage.warning('Вы не авторизованы')
		router.push('/login')
		return
	}

	try {
		await ElMessageBox.confirm(
			'Вы уверены, что хотите удалить эту задачу?',
			'Подтверждение',
			{
				confirmButtonText: 'Да',
				cancelButtonText: 'Отмена',
				type: 'warning',
			}
		)

		await axios.delete(`http://localhost/todos/${taskId}`, {
			headers: {
				authorization: `Bearer ${token.value}`
			}
		})
		ElMessage.success('Задача успешно удалена')
		await fetchTasks() // Обновляем список задач после удаления
	} catch (error) {
		if (error === 'cancel') {
			return // Пользователь отменил удаление
		}
		console.error('Error deleting task:', error)
		if (error.response && error.response.status === 401) {
			ElMessage.error('Сессия истекла. Пожалуйста, войдите снова')
			token.value = ''
			router.push('/login')
		} else {
			ElMessage.error('Не удалось удалить задачу')
		}
	}
}


onMounted(() => {
	fetchTasks()
})
</script>

<style scoped>
.tasks-container {
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