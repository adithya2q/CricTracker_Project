module.exports ={
authRoles:(...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Access denied. You don't have permission for this action.",
      });
    }
    next();
  };
}
};
