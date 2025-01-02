import { createBrowserRouter, RouteObject } from "react-router-dom";
import { HomePage } from "@/pages";
import { RouteTree } from "@/shared";

export const createRouter = () => {
  const routes: RouteTree<Omit<RouteObject, "index" | "children" | "path">> = [
    {
      path: "/",
      element: <HomePage />,
      children: [
        { index: true },
        { path: "courses", children: [{ index: true }, { path: ":id" }] },
      ],
    },
  ];

  return createBrowserRouter(routes);
};
