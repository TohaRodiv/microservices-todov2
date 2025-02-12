import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';

const server = Fastify({ logger: true });

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';
const TODO_SERVICE_URL = process.env.TODO_SERVICE_URL || 'http://todo-service:3000';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3000';

server.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	allowedHeaders: '*',
});

server.get('/healthcheck', async (req, res) => {
	return {
		message: 'ok',
	};
});

server.register(proxy, {
	prefix: '/auth',
	upstream: AUTH_SERVICE_URL,
});

server.register(proxy, {
	prefix: '/todos',
	upstream: TODO_SERVICE_URL,
});

server.register(proxy, {
	prefix: '/users',
	upstream: USER_SERVICE_URL,
});

try {
	await server.listen({ port: 3000, host: '0.0.0.0' });
	console.log(`Server running.`);
} catch (err) {
	server.log.error(err);
	process.exit(1);
}