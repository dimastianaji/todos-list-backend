const Todo = require('../model/Todo');
const catchAsync = require('../util/catchAsync');

const getTodoStats = catchAsync(async (req, res) => {
    const [
        totalTodos,
        pendingTodos,
        inProgressTodos,
        completedTodos,
        lowPriorityTodos,
        mediumPriorityTodos,
        highPriorityTodos
    ] = await Promise.all([
        Todo.countDocuments(),
        Todo.countDocuments({ status: 'pending' }),
        Todo.countDocuments({ status: 'in_progress' }),
        Todo.countDocuments({ status: 'completed' }),
        Todo.countDocuments({ priority: 'low' }),
        Todo.countDocuments({ priority: 'medium' }),
        Todo.countDocuments({ priority: 'high' })
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            totalTodos,
            byStatus: {
                pending: pendingTodos,
                in_progress: inProgressTodos,
                completed: completedTodos
            },
            byPriority: {
                low: lowPriorityTodos,
                medium: mediumPriorityTodos,
                high: highPriorityTodos
            }
        }
    });
});

module.exports = {
    getTodoStats
};
