export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') && authHeader.slice(7);
  if (!token || token !== process.env.SHARED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
