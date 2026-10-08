import { Route, Routes } from "react-router-dom";

// check if a user is logged in..if not, return them to the authentication screen

const ProtectedRoute = () => {
  return <></>;
};

//
export const Approuter = () => {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/search" />
      <Route path="/auth" />

      {/* only authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/playlists" />
        <Route path="/playlist/:id" />
      </Route>
    </Routes>
  );
};
