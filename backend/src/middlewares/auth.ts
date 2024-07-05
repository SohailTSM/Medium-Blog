import { Context, Next } from 'hono';
import * as jwt from 'hono/jwt';

export async function authMiddleware(c: Context, next: Next) {
  const authorization = c.req.header('Authorization');
  const token = authorization?.split(' ')[1];
  if (!token) {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }
  try {
    const payload: any = await jwt.verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ message: 'Unauthorized' });
    }

    c.set('userId', payload.id);

    await next();
  } catch (error) {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }
}
