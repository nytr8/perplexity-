import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
