import type { RouteObject } from "react-router-dom";
import Home from "../components/pages/Home";
import ProductDetail from "../components/pages/ProductDetail";
import Cart from "../components/pages/Cart";
import MainLayout from "../components/layout/MainLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
];
export default routes;
