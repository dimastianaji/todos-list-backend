const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Todos-List Management API',
            version: '1.0.0',
            description:
                'Dokumentasi interaktif API Todos-List Management. ' +
                'API ini menyediakan autentikasi, manajemen Todo dan Category, ' +
                'serta statistik Todo.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'Masukkan JWT yang diperoleh dari endpoint login.'
                },

                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description:
                        'Masukkan API key yang dikonfigurasi pada server.'
                }
            },

            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail'
                        },
                        message: {
                            type: 'string',
                            example: 'Todo tidak ditemukan.'
                        }
                    }
                },

                Todo: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012'
                        },
                        title: {
                            type: 'string',
                            example: 'Belajar Swagger'
                        },
                        description: {
                            type: 'string',
                            example: 'Membuat dokumentasi API interaktif'
                        },
                        status: {
                            type: 'string',
                            enum: [
                                'pending',
                                'in_progress',
                                'completed'
                            ],
                            example: 'pending'
                        },
                        priority: {
                            type: 'string',
                            enum: [
                                'low',
                                'medium',
                                'high'
                            ],
                            example: 'high'
                        },
                        category: {
                            type: 'string',
                            nullable: true,
                            example: '507f1f77bcf86cd799439013'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            example: '2026-10-20T10:00:00.000Z'
                        },
                        completedAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true
                        }
                    }
                },

                TodoInput: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Belajar Swagger'
                        },
                        description: {
                            type: 'string',
                            example: 'Membuat dokumentasi API'
                        },
                        status: {
                            type: 'string',
                            enum: [
                                'pending',
                                'in_progress',
                                'completed'
                            ],
                            default: 'pending'
                        },
                        priority: {
                            type: 'string',
                            enum: [
                                'low',
                                'medium',
                                'high'
                            ],
                            default: 'medium'
                        },
                        category: {
                            type: 'string',
                            nullable: true,
                            example: '507f1f77bcf86cd799439013'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true
                        }
                    }
                },

                Category: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439013'
                        },
                        name: {
                            type: 'string',
                            example: 'Study'
                        }
                    }
                }
            }
        }
    },

    apis: [
        './route/*.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;