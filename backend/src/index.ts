import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as jwt from 'hono/jwt';
import { hashPassword } from './utils';
import z from 'zod';

const authSchema = z.object({
  email: z.string().email({ message: 'Enter a valid Email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be 6 characters long' }),
});

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use('/api/v1/blog/*', async (c, next) => {
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
});

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const parsed = authSchema.safeParse({
    email: body?.email || '',
    password: body?.password || '',
  });

  if (!parsed.success) {
    return c.json({ message: JSON.parse(parsed.error.message)[0].message });
  }

  try {
    const hashedPassword = await hashPassword(body?.password || '');

    const user = await prisma.user.create({
      data: {
        name: body.name || '',
        email: body.email || '',
        password: hashedPassword,
      },
    });

    const token = await jwt.sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    c.status(403);
    return c.json({ error: 'error while signing up', message: error });
  }
});

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const parsed = authSchema.safeParse({
    email: body?.email || '',
    password: body?.password || '',
  });

  if (!parsed.success) {
    return c.json({ message: 'Invalid email/password' });
  }

  try {
    const hashedPassword = await hashPassword(body?.password);
    const user = await prisma.user.findUnique({
      where: {
        email: body.email || '',
      },
    });

    if (!user || hashedPassword != user.password) {
      c.status(403);
      return c.json({ message: 'Invalid email/password' });
    }

    const token = await jwt.sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    c.status(403);
    return c.json({ error: 'error while signing up', message: error });
  }
});

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id');
  console.log(id);
  return c.text('get blog route');
});

app.post('/api/v1/blog', (c) => {
  console.log(c.get('userId'));
  return c.text('blog route');
});

app.put('/api/v1/blog', (c) => {
  return c.text('blog route');
});

export default app;
