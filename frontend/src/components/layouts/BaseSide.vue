<script lang="ts" setup>
import {
	Document,
	Menu as IconMenu,
	User,
} from '@element-plus/icons-vue'
</script>

<template>
	<el-menu
		router
		class="el-menu-vertical-demo"
	>
		<el-menu-item index="/tasks" route="/tasks">
			<el-icon>
				<Document />
			</el-icon>
			Задачи
		</el-menu-item>
		<el-menu-item index="/users" route="/users">
			<el-icon>
				<User />
			</el-icon>
			Пользователи
		</el-menu-item>
	</el-menu>
</template>
