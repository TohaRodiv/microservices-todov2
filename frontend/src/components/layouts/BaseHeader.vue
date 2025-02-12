<script lang="ts" setup>
import { toggleDark } from '~/composables'
</script>

<template>
	<el-menu
		class="el-menu-demo"
		mode="horizontal"
		:ellipsis="false"
		router
	>
		<el-menu-item index="/">
			<div class="flex items-center justify-center gap-2">
				<div
					class="text-xl"
					i-ep-element-plus
				/>
				<span>Главная</span>
			</div>
		</el-menu-item>
		<el-menu-item index="/login">
			Войти
		</el-menu-item>
		<el-menu-item index="/logout">
			Выйти
		</el-menu-item>

		<el-menu-item
			h="full"
			@click="toggleDark()"
		>
			<button
				class="w-full cursor-pointer border-none bg-transparent"
				style="height: var(--ep-menu-item-height)"
			>
				<i
					inline-flex
					i="dark:ep-moon ep-sunny"
				/>
			</button>
		</el-menu-item>
	</el-menu>
</template>

<style lang="scss">
.el-menu-demo {
	&.ep-menu--horizontal>.ep-menu-item:nth-child(1) {
		margin-right: auto;
	}
}
</style>
