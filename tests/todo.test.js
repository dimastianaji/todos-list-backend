require('dotenv').config();

jest.mock('../model/Todo', () => ({
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

jest.mock('../model/User', () => ({
    findById: jest.fn()
}));

jest.mock('../service/activityLogService', () => jest.fn());

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const Todo = require('../model/Todo');
const User = require('../model/User');
const logActivity = require('../service/activityLogService');

const USER_ID = '507f1f77bcf86cd799439011';
const TODO_ID = '507f1f77bcf86cd799439012';

const createToken = () => {
    return jwt.sign(
        { id: USER_ID },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

describe('Todo API - Authentication dan Create', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        logActivity.mockResolvedValue(undefined);

        User.findById.mockResolvedValue({
            _id: USER_ID,
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });
    });

    test('harus menolak akses tanpa JWT', async () => {
        const response = await request(app)
            .get('/api/todos');

        expect(response.statusCode).toBe(401);
    });

    test('harus menolak akses dengan JWT tidak valid', async () => {
        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', 'Bearer token-tidak-valid');

        expect(response.statusCode).toBe(401);
        expect(User.findById).not.toHaveBeenCalled();
    });

    test('harus berhasil membuat Todo dengan data valid', async () => {
        const todoData = {
            _id: TODO_ID,
            user: USER_ID,
            title: 'Belajar Jest',
            description: 'Membuat automated test',
            status: 'pending',
            priority: 'high'
        };

        Todo.create.mockResolvedValue(todoData);

        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                title: 'Belajar Jest',
                description: 'Membuat automated test',
                status: 'pending',
                priority: 'high'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.todo.title).toBe('Belajar Jest');

        expect(User.findById).toHaveBeenCalledWith(USER_ID);

        expect(Todo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                title: 'Belajar Jest',
                description: 'Membuat automated test',
                status: 'pending',
                priority: 'high'
            })
        );

        expect(logActivity).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                action: 'create',
                resource: 'Todo',
                resourceId: TODO_ID
            })
        );
    });

    test('harus menolak pembuatan Todo tanpa judul', async () => {
        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                description: 'Todo tanpa judul'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe('Validasi input gagal.');

        expect(Todo.create).not.toHaveBeenCalled();
        expect(logActivity).not.toHaveBeenCalled();
    });

    test('harus menolak status Todo yang tidak valid', async () => {
        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                title: 'Belajar Jest',
                status: 'belum_mulai'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');

        expect(Todo.create).not.toHaveBeenCalled();
        expect(logActivity).not.toHaveBeenCalled();
    });

    test('harus menolak priority Todo yang tidak valid', async () => {
        const response = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                title: 'Belajar Jest',
                priority: 'urgent'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');

        expect(Todo.create).not.toHaveBeenCalled();
        expect(logActivity).not.toHaveBeenCalled();
    });
});