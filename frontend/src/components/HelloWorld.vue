<template>
	<el-container class="main-container">
		<el-header class="main-header">
			<h1>
				<el-icon>
					<ElementPlus />
				</el-icon>
				Проект распределенных систем
			</h1>
		</el-header>
		<el-main>
			<el-row :gutter="20">
				<el-col
					:xs="24"
					:sm="24"
					:md="8"
					:lg="8"
					:xl="8"
				>
					<el-card class="info-card">
						<template #header>
							<div class="card-header">
								<el-icon>
									<Service />
								</el-icon>
								<span>Микросервисы</span>
							</div>
						</template>
						<el-descriptions
							direction="vertical"
							:column="1"
							border
						>
							<el-descriptions-item label="Auth Service">
								<el-tag type="success">Работает</el-tag>
								<p class="service-description">Отвечает за аутентификацию и авторизацию пользователей
								</p>
							</el-descriptions-item>
							<el-descriptions-item label="Todo Service">
								<el-tag type="success">Работает</el-tag>
								<p class="service-description">Управляет задачами пользователей, их созданием,
									обновлением и удалением</p>
							</el-descriptions-item>
							<el-descriptions-item label="User Service">
								<el-tag type="success">Работает</el-tag>
								<p class="service-description">Обрабатывает информацию о пользователях, их профили и
									настройки</p>
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</el-col>
				<el-col
					:xs="24"
					:sm="24"
					:md="8"
					:lg="8"
					:xl="8"
				>
					<el-card class="info-card">
						<template #header>
							<div class="card-header">
								<el-icon>
									<Connection />
								</el-icon>
								<span>API Gateway</span>
							</div>
						</template>
						<p>Наш API Gateway обеспечивает единую точку входа для всех микросервисов.</p>
						<el-divider content-position="left">Основные функции</el-divider>
						<el-collapse>
							<el-collapse-item
								title="Маршрутизация"
								name="1"
							>
								<p>Направляет запросы к соответствующим микросервисам</p>
							</el-collapse-item>
							<el-collapse-item
								title="Аутентификация"
								name="2"
							>
								<p>Проверяет токены и управляет доступом к сервисам</p>
							</el-collapse-item>
							<el-collapse-item
								title="Балансировка нагрузки"
								name="3"
							>
								<p>Распределяет запросы между экземплярами сервисов</p>
							</el-collapse-item>
						</el-collapse>
						<el-divider content-position="left">Статус</el-divider>
						<el-row :gutter="20">
							<el-col :span="12">
								<el-statistic
									title="Доступность"
									value="99.9%"
								/>
							</el-col>
							<el-col :span="12">
								<el-statistic
									title="Среднее время ответа"
									value="50ms"
								/>
							</el-col>
						</el-row>
						<el-divider content-position="left">Производительность</el-divider>
						<el-progress
							:percentage="100"
							status="success"
							:format="() => 'Отличная'"
						/>
					</el-card>
				</el-col>
				<el-col
					:xs="24"
					:sm="24"
					:md="8"
					:lg="8"
					:xl="8"
				>
					<el-card class="info-card">
						<template #header>
							<div class="card-header">
								<el-icon>
									<DataLine />
								</el-icon>
								<span>Базы данных</span>
							</div>
						</template>
						<el-timeline>
							<el-timeline-item
								timestamp="MongoDB"
								placement="top"
							>
								<el-card>
									<h4>User Service Database</h4>
									<p>Хранит данные пользователей</p>
								</el-card>
							</el-timeline-item>
							<el-timeline-item
								timestamp="PostgreSQL"
								placement="top"
							>
								<el-card>
									<h4>Todo Service Database</h4>
									<p>Хранит задачи пользователей</p>
								</el-card>
							</el-timeline-item>
						</el-timeline>
					</el-card>
				</el-col>
			</el-row>
			<el-divider />
			<el-row>
				<el-col :span="24">
					<el-card class="project-status-card">
						<div class="status-content">
							<el-icon class="status-icon">
								<Loading />
							</el-icon>
							<div class="status-text">
								<h3>Проект находится в активной разработке</h3>
								<p>Мы постоянно работаем над улучшением и расширением функциональности нашей системы.
								</p>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<el-divider />
			<el-row>
				<el-col :span="24">
					<el-card class="tech-stack-card">
						<template #header>
							<div class="card-header">
								<el-icon>
									<Cpu />
								</el-icon>
								<span>Используемые технологии</span>
							</div>
						</template>
						<el-tabs type="border-card">
							<el-tab-pane label="Frontend">
								<el-row :gutter="20">
									<el-col
										:xs="24"
										:sm="12"
										:md="8"
										:lg="6"
										v-for="tech in frontendTech"
										:key="tech.name"
									>
										<el-card
											shadow="hover"
											class="tech-card"
										>
											<el-icon :size="40">
												<component :is="tech.icon" />
											</el-icon>
											<span>{{ tech.name }}</span>
										</el-card>
									</el-col>
								</el-row>
							</el-tab-pane>
							<el-tab-pane label="Backend">
								<el-row :gutter="20">
									<el-col
										:xs="24"
										:sm="12"
										:md="8"
										:lg="6"
										v-for="tech in backendTech"
										:key="tech.name"
									>
										<el-card
											shadow="hover"
											class="tech-card"
										>
											<el-icon :size="40">
												<component :is="tech.icon" />
											</el-icon>
											<span>{{ tech.name }}</span>
										</el-card>
									</el-col>
								</el-row>
							</el-tab-pane>
						</el-tabs>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-card class="ai-info">
						<template #header>
							<div class="card-header">
								<el-icon>
									<InfoFilled />
								</el-icon>
								<span>Информация о генерации кода</span>
							</div>
						</template>
						<el-text tag="p">
							Приблизительно <el-tag type="success">90%</el-tag> кода этой страницы было сгенерировано с
							помощью
							нейросети GPT (Generative Pre-trained Transformer).
						</el-text>
						<el-divider content-position="left">Дополнительная информация</el-divider>
						<el-descriptions
							:column="1"
							border
						>
							<el-descriptions-item label="Используемая модель">GPT-4</el-descriptions-item>
							<el-descriptions-item label="Время генерации">Около 5 минут</el-descriptions-item>
							<el-descriptions-item label="Ручные правки">Минимальные стилистические
								изменения</el-descriptions-item>
						</el-descriptions>
						<el-alert
							class="custom-alert"
							title="Важно отметить"
							type="info"
							:closable="false"
							style="margin-top: 20px;"
						>
							<template #icon>
								<el-icon>
									<InfoFilled />
								</el-icon>
							</template>
							<template #default>
								<span>Хотя AI значительно ускорил процесс разработки, финальная проверка и интеграция
									кода были выполнены человеком-разработчиком.</span>
							</template>
						</el-alert>
					</el-card>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script setup>
import { ref } from 'vue'
import { ElementPlus, Service, Connection, DataLine, View, InfoFilled, Cpu, Monitor, Histogram, Promotion, Coin } from '@element-plus/icons-vue'

const frontendTech = ref([
	{ name: 'Vue.js', icon: Monitor },
	{ name: 'Element Plus', icon: ElementPlus },
	{ name: 'Axios', icon: Connection },
	{ name: 'Vite', icon: Histogram }
])

const backendTech = ref([
	{ name: 'NestJS', icon: Service },
	{ name: 'TypeORM', icon: DataLine },
	{ name: 'MongoDB', icon: Coin },
	{ name: 'PostgreSQL', icon: Promotion }
])
</script>

<style scoped>
.main-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
}

.main-header {
	background-color: #409EFF;
	color: white;
	text-align: center;
	padding: 20px 0;
	margin-bottom: 20px;
	border-radius: 4px;
	flex: 1;
}

.main-header h1 {
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: .25rem;
}

.main-header .el-icon {
	margin-right: 10px;
}

.el-main {
	padding: 0;
	overflow-y: auto;
	flex-grow: 1;
}

.card-header {
	display: flex;
	align-items: center;
	gap: .25rem;
}

.card-header .el-icon {
	margin-right: 10px;
}

.info-card {
	height: 100%;
	margin-bottom: 20px;
}

.ai-info {
	margin-top: 20px;
}

.el-timeline-item {
	padding-bottom: 20px;
}

.el-timeline-item:last-child {
	padding-bottom: 0;
}

.el-timeline-item .el-card {
	margin-top: 10px;
}

.custom-alert {
	display: flex;
	align-items: flex-start;
}

.custom-alert .el-alert__icon {
	font-size: 16px;
	margin-top: 2px;
}

.custom-alert .el-alert__content {
	display: flex;
	flex-direction: column;
}

.custom-alert .el-alert__title {
	font-size: 16px;
	line-height: 1.5;
	margin-bottom: 5px;
}

.custom-alert .el-alert__description {
	font-size: 14px;
	line-height: 1.5;
}

.project-status-alert {
	margin-bottom: 20px;
}

.project-status-alert .el-alert__title {
	font-size: 16px;
	font-weight: bold;
}

.project-status-alert .el-alert__description {
	margin-top: 8px;
	font-size: 14px;
	line-height: 1.5;
}

.status-content {
	display: flex;
	align-items: center;
}

.status-icon {
	font-size: 24px;
	color: #409EFF;
	margin-right: 16px;
}

.status-text {
	flex: 1;
}

.status-text h3 {
	margin: 0 0 8px;
	font-size: 18px;
	color: #409EFF;
}

.status-text p {
	margin: 0;
	font-size: 14px;
	color: #606266;
}

.service-description {
	margin-top: 8px;
	font-size: 14px;
	color: #606266;
}


.el-collapse {
	margin-bottom: 20px;
}

.el-statistic {
	margin-bottom: 20px;
}

.tech-stack-card {
	margin-bottom: 20px;
}

.tech-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	text-align: center;
	height: 100%;
}

.tech-logo {
	width: 50px;
	height: 50px;
	object-fit: contain;
	margin-bottom: 10px;
}

@media (max-width: 768px) {
	.el-tabs__content {
		padding: 10px;
	}
}

@media (max-width: 768px) {
	.el-row {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}

	.el-col {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
}

@media (max-width: 768px) {
	.el-col {
		margin-bottom: 20px;
	}

	.main-container {
		padding: 10px;
	}

	.main-header {
		padding: 15px 0;
	}
}

.tech-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 120px;
	text-align: center;
}

.tech-card .el-icon {
	margin-bottom: 10px;
}

.tech-card span {
	font-size: 14px;
}
</style>