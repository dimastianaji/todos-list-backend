
const ActivityLog = require('../model/ActivityLog');

const logActivity = async ({
    user,
    action,
    resource,
    resourceId,
    description,
    metadata = {}
}) => {
    return ActivityLog.create({
        user,
        action,
        resource,
        resourceId,
        description,
        metadata
    });
};

module.exports = logActivity;
