import React, { use } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>loading....</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default Protected;
