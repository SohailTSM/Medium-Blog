import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from "../middlewares/auth";
import { generateHonoApp } from "../utils/utils";
import z from "zod";

export const blogRouter = generateHonoApp();

const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is a required field" }),
  content: z.string().min(1, { message: "Content is a required field" }),
});

blogRouter.use("/*", authMiddleware);

blogRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json({ blogs });
  } catch (error) {
    c.status(500);
    return c.json({ error: "error while getting blogs", message: error });
  }
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const parsed = blogSchema.safeParse({
    title: body?.title || "",
    content: body?.content || "",
  });

  if (!parsed.success) {
    return c.json({ message: JSON.parse(parsed.error.message)[0].message });
  }

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        published: body?.published || false,
      },
    });
    return c.json({ blogId: blog.id });
  } catch (error) {
    c.status(500);
    return c.json({ error: "error while creating blog", message: error });
  }
});

blogRouter.get("/myblogs", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return c.json({ blogs });
  } catch (error) {
    c.status(500);
    return c.json({ error: "error while getting blogs", message: error });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!blog) {
      return c.json({ message: "404" }, 404);
    }

    return c.json({ blog });
  } catch (error) {
    return c.json({ error: "error while getting blog", message: error });
  }
});

blogRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const parsed = blogSchema.safeParse({
    title: body?.title || "",
    content: body?.content || "",
  });

  if (!parsed.success) {
    return c.json({ message: JSON.parse(parsed.error.message)[0].message });
  }

  try {
    const blog = await prisma.post.update({
      where: { id, authorId: userId },
      data: {
        title: body.title,
        content: body.content,
        published: body?.published || false,
      },
    });
    return c.json({ blogId: blog.id, message: "Blog updated" });
  } catch (error) {
    c.status(500);
    return c.json({ error: "error while updating blog", message: error });
  }
});
