import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as jwt from 'hono/jwt';
import { generateHonoApp, hashPassword } from '../utils/utils';
import z from 'zod';

const authSchema = z.object({
  email: z.string().email({ message: 'Enter a valid Email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be 6 characters long' }),
});

export const userRouter = generateHonoApp();

userRouter.post('/signup', async (c) => {
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
    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return c.json({ message: 'User already exists' }, 403);
    }

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

userRouter.post('/signin', async (c) => {
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
