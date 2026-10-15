require('dotenv').config();

jest.mock('../model/User', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn()
}));

const request = require('supertest');
const app = require('../app');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('POST /api/auth/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('harus berhasil mendaftarkan pengguna dengan data valid', async () => {
        User.findOne.mockResolvedValue(null);

        User.create.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.token).toBeDefined();
        expect(response.body.data.user).toMatchObject({
            id: '507f1f77bcf86cd799439011',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@example.com'
        });

        expect(User.create).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!'
        });

        const decoded = jwt.verify(
            response.body.token,
            process.env.JWT_SECRET
        );

        expect(decoded.id).toBe('507f1f77bcf86cd799439011');
    });

    test('harus menolak email yang sudah terdaftar', async () => {
        User.findOne.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com'
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe('Email sudah terdaftar');
        expect(User.create).not.toHaveBeenCalled();
    });

    test('harus menolak input registrasi yang tidak valid', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: '',
                email: 'email-tidak-valid',
                password: ''
            });

        expect(response.statusCode).toBe(400);
        expect(User.create).not.toHaveBeenCalled();
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('harus berhasil login dengan kredensial benar', async () => {
        User.findOne.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed-password',
            role: 'user'
        });

        bcrypt.compare.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.token).toBeDefined();
        expect(response.body.data.user).toMatchObject({
            id: '507f1f77bcf86cd799439011',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });

        expect(bcrypt.compare).toHaveBeenCalledWith(
            'Password123!',
            'hashed-password'
        );
    });

    test('harus menolak email yang tidak terdaftar', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@example.com',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
            'Email atau password salah'
        );

        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('harus menolak password yang salah', async () => {
        User.findOne.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed-password',
            role: 'user'
        });

        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'PasswordSalah123!'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
            'Email atau password salah'
        );
    });

    test('harus menolak input login yang tidak valid', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'email-tidak-valid',
                password: ''
            });

        expect(response.statusCode).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled();
    });
});