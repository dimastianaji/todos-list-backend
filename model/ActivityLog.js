const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        action: {
            type: String,
            enum: [
                'create',
                'update',
                'delete',
                'complete',
                'login',
                'logout'
            ],
            required: true
        },

        resource: {
            type: String,
            enum: ['User', 'Todo', 'Category'],
            required: true
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);