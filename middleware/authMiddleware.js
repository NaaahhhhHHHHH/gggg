const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const authorizeService = (serviceId, requireReassignment = false) => {
    return (req, res, next) => {
        const userRoles = req.user.roles;

        const hasPermission = userRoles.some(role => {
            return role.serviceid === serviceId && (!requireReassignment || role.reassignment);
        });

        if (!hasPermission) {
          return res.status(403).json({ error: 'Permission denied' });
        }
        next();
    };
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }
      next();
  };
};

module.exports = {
    authenticateToken,
    authorizeService,
    authorizeRole
};

