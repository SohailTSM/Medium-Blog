import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/blog/:id",
    element: <Blog />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
