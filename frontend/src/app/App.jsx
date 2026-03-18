import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import useAuth from "./features/auth/hooks/useAuth";

const App = () => {
  const { handleGetme } = useAuth();

  useEffect(() => {
    handleGetme();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <RouterProvider router={router}></RouterProvider>;
    </div>
  );
};

export default App;
