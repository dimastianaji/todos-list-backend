require('dotenv').config();

jest.mock('../model/Todo', () => ({
    countDocuments: jest.fn()
}));

const request = require('supertest');
const app = require('../app');
const Todo = require('../model/Todo');

describe('GET /api/stats/todos', () => {
    const originalApiKey = process.env.API_KEY;

    afterAll(() => {
        process.env.API_KEY = originalApiKey;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        Todo.countDocuments
            .mockResolvedValueOnce(10)
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(3)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(3);
    });

    test('harus menolak request tanpa API Key', async () => {
        const response = await request(app)
            .get('/api/stats/todos');

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe(
            'API Key tidak valid atau tidak tersedia.'
        );
    });

    test('harus menolak request dengan API Key salah', async () => {
        const response = await request(app)
            .get('/api/stats/todos')
            .set('x-api-key', 'api-key-salah');

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('fail');
    });

    test('harus mengembalikan statistik dengan API Key benar', async () => {
        const response = await request(app)
            .get('/api/stats/todos')
            .set('x-api-key', process.env.API_KEY);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');

        expect(response.body.data).toEqual({
            totalTodos: 10,
            byStatus: {
                pending: 5,
                in_progress: 3,
                completed: 2
            },
            byPriority: {
                low: 2,
                medium: 5,
                high: 3
            }
        });

        expect(Todo.countDocuments).toHaveBeenCalledTimes(7);
    });
});
