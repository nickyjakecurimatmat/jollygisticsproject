import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import Trips from "./routes/Trips";
import Home from "./routes/Home";
import Finance from "./routes/Finance";
import Navbar from "./components/Navbar";
import './App.css';

const AppLayout = () => (
  <>
   <Navbar/>
   <Outlet/>
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout/>,
    children: [ {
      path: "/",
      element: <Home/>
    },
    {
      path: "trips",
      element: <Trips/>,
    },
    {
      path: "finance",
      element: <Finance/>,
    },]
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);