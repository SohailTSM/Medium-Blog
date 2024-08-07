import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { generateHonoApp } from "./utils/utils";
import { cors } from "hono/cors";

// Create the main Hono app
const app = generateHonoApp();

app.use("*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.get("*", (c) => {
  return c.json({ message: "404" }, 404);
});

export default app;
