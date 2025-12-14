const roles = require('../policies/roles.json');

/**
 * Policy-Based Access Control Middleware
 * @param {string} resource - The resource being accessed (e.g., 'poll', 'vote')
 * @param {string} action - The action being performed (e.g., 'create', 'read')
 */
const checkPolicy = (resource, action) => {
    return (req, res, next) => {
        // 1. Identify User Role (Default to 'guest' if not authenticated)
        const userRole = req.user ? req.user.role : 'guest';

        // 2. Load Policy for Role
        const rolePolicy = roles[userRole];

        if (!rolePolicy) {
            console.warn(`[Policy] Role '${userRole}' not defined in policy.`);
            return res.status(403).json({ error: 'Access Denied: Role not recognized.' });
        }

        // 3. Check Resource Access
        const resourcePermissions = rolePolicy[resource];

        if (!resourcePermissions) {
            // No permissions for this resource
            return res.status(403).json({ error: `Access Denied: You cannot acccess ${resource}s.` });
        }

        // 4. Check Action
        // Wildcard '*' allows everything for that resource
        if (resourcePermissions.includes('*') || resourcePermissions.includes(action)) {
            return next();
        }

        // Deny
        return res.status(403).json({
            error: `Access Denied: You cannot '${action}' ${resource}.`
        });
    };
};

module.exports = { checkPolicy };
