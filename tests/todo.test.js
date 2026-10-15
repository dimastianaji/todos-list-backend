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

// Helper untuk meniru query Mongoose pada getTodos
const mockTodoFind = (todos) => {
    const query = {
        populate: jest.fn(),
        sort: jest.fn(),
        skip: jest.fn(),
        limit: jest.fn()
    };

    query.populate.mockReturnValue(query);
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockResolvedValue(todos);

    Todo.find.mockReturnValue(query);

    return query;
};

// Helper untuk meniru query Mongoose pada getTodo
const mockTodoFindOne = (todo) => {
    const query = {
        populate: jest.fn()
    };

    query.populate.mockResolvedValue(todo);

    Todo.findOne.mockReturnValue(query);

    return query;
};

// Helper untuk meniru dokumen Todo yang bisa disimpan
const createMockTodoDocument = (overrides = {}) => {
    return {
        _id: TODO_ID,
        user: USER_ID,
        title: 'Todo lama',
        description: 'Deskripsi lama',
        status: 'pending',
        priority: 'medium',
        category: undefined,
        dueDate: undefined,
        completedAt: null,
        save: jest.fn().mockImplementation(async function () {
            return this;
        }),
        ...overrides
    };
};

// Helper untuk menyiapkan user yang sudah terautentikasi
const mockUser = () => {
    User.findById.mockResolvedValue({
        _id: USER_ID,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
    });
};


// ==================================================
// TODO API - AUTHENTICATION DAN CREATE
// ==================================================

describe('Todo API - Authentication dan Create', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        logActivity.mockResolvedValue(undefined);
        mockUser();
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


// ==================================================
// TODO API - GET TODOS
// ==================================================

describe('Todo API - Get Todos', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        logActivity.mockResolvedValue(undefined);
        mockUser();
    });

    test('harus berhasil menampilkan daftar Todo', async () => {
        const todos = [
            {
                _id: TODO_ID,
                title: 'Belajar Jest',
                status: 'pending',
                priority: 'high'
            },
            {
                _id: '507f1f77bcf86cd799439013',
                title: 'Mengerjakan tugas',
                status: 'in_progress',
                priority: 'medium'
            }
        ];

        mockTodoFind(todos);
        Todo.countDocuments.mockResolvedValue(2);

        const response = await request(app)
            .get('/api/todos')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.results).toBe(2);
        expect(response.body.data.todos).toHaveLength(2);

        expect(Todo.find).toHaveBeenCalledWith({
            user: USER_ID
        });

        expect(Todo.countDocuments).toHaveBeenCalledWith({
            user: USER_ID
        });
    });

    test('harus menerapkan pagination berdasarkan page dan limit', async () => {
        const todos = [
            {
                _id: TODO_ID,
                title: 'Todo halaman kedua',
                status: 'pending',
                priority: 'high'
            }
        ];

        const query = mockTodoFind(todos);
        Todo.countDocuments.mockResolvedValue(5);

        const response = await request(app)
            .get('/api/todos?page=2&limit=2')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.pagination).toEqual({
            currentPage: 2,
            limit: 2,
            totalItems: 5,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true
        });

        expect(query.skip).toHaveBeenCalledWith(2);
        expect(query.limit).toHaveBeenCalledWith(2);
    });

    test('harus memfilter Todo berdasarkan status dan priority', async () => {
        mockTodoFind([]);
        Todo.countDocuments.mockResolvedValue(0);

        const response = await request(app)
            .get('/api/todos?status=pending&priority=high')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(200);

        expect(Todo.find).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                status: 'pending',
                priority: 'high'
            })
        );

        expect(Todo.countDocuments).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                status: 'pending',
                priority: 'high'
            })
        );
    });

    test('harus melakukan pencarian Todo berdasarkan kata kunci', async () => {
        mockTodoFind([]);
        Todo.countDocuments.mockResolvedValue(0);

        const response = await request(app)
            .get('/api/todos?search=jest')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(200);

        expect(Todo.find).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                $or: [
                    {
                        title: {
                            $regex: 'jest',
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: 'jest',
                            $options: 'i'
                        }
                    }
                ]
            })
        );
    });

    test('harus menolak status filter yang tidak valid', async () => {
        const response = await request(app)
            .get('/api/todos?status=belum_mulai')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');

        expect(Todo.find).not.toHaveBeenCalled();
        expect(Todo.countDocuments).not.toHaveBeenCalled();
    });

    test('harus menolak priority filter yang tidak valid', async () => {
        const response = await request(app)
            .get('/api/todos?priority=urgent')
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('fail');

        expect(Todo.find).not.toHaveBeenCalled();
        expect(Todo.countDocuments).not.toHaveBeenCalled();
    });
});


// ==================================================
// TODO API - DETAIL, UPDATE, DAN DELETE
// ==================================================

describe('Todo API - Detail, Update, dan Delete', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        logActivity.mockResolvedValue(undefined);
        mockUser();
    });

    // GET /api/todos/:id
    test('harus berhasil menampilkan detail Todo', async () => {
        const todo = {
            _id: TODO_ID,
            title: 'Belajar Jest',
            status: 'pending',
            priority: 'high'
        };

        mockTodoFindOne(todo);

        const response = await request(app)
            .get(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.todo.title).toBe('Belajar Jest');

        expect(Todo.findOne).toHaveBeenCalledWith({
            _id: TODO_ID,
            user: USER_ID
        });
    });

    test('harus mengembalikan 404 jika detail Todo tidak ditemukan', async () => {
        mockTodoFindOne(null);

        const response = await request(app)
            .get(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('fail');
    });

    // PATCH /api/todos/:id
    test('harus berhasil memperbarui Todo dan mencatat Activity Log', async () => {
        const todo = createMockTodoDocument();

        Todo.findOne.mockResolvedValue(todo);

        const response = await request(app)
            .patch(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                title: 'Todo baru',
                status: 'completed',
                priority: 'high'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.todo.title).toBe('Todo baru');
        expect(response.body.data.todo.status).toBe('completed');
        expect(response.body.data.todo.priority).toBe('high');

        expect(todo.save).toHaveBeenCalledTimes(1);

        expect(logActivity).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                action: 'update',
                resource: 'Todo',
                resourceId: TODO_ID,
                metadata: expect.objectContaining({
                    before: expect.objectContaining({
                        title: 'Todo lama',
                        status: 'pending',
                        priority: 'medium'
                    }),
                    after: expect.objectContaining({
                        title: 'Todo baru',
                        status: 'completed',
                        priority: 'high'
                    })
                })
            })
        );
    });

    test('harus mengembalikan 404 jika Todo yang diperbarui tidak ditemukan', async () => {
        Todo.findOne.mockResolvedValue(null);

        const response = await request(app)
            .patch(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`)
            .send({
                title: 'Judul baru'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('fail');

        expect(logActivity).not.toHaveBeenCalled();
    });

    // DELETE /api/todos/:id
    test('harus berhasil menghapus Todo dan mencatat Activity Log', async () => {
        const todo = {
            _id: TODO_ID,
            title: 'Todo yang dihapus',
            status: 'pending',
            priority: 'high'
        };

        Todo.findOne.mockResolvedValue(todo);
        Todo.findByIdAndDelete.mockResolvedValue(todo);

        const response = await request(app)
            .delete(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(204);
        expect(response.text).toBe('');

        expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(TODO_ID);

        expect(logActivity).toHaveBeenCalledWith(
            expect.objectContaining({
                user: USER_ID,
                action: 'delete',
                resource: 'Todo',
                resourceId: TODO_ID,
                description: 'Menghapus Todo: Todo yang dihapus'
            })
        );
    });

    test('harus mengembalikan 404 jika Todo yang dihapus tidak ditemukan', async () => {
        Todo.findOne.mockResolvedValue(null);

        const response = await request(app)
            .delete(`/api/todos/${TODO_ID}`)
            .set('Authorization', `Bearer ${createToken()}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('fail');

        expect(Todo.findByIdAndDelete).not.toHaveBeenCalled();
        expect(logActivity).not.toHaveBeenCalled();
    });
});