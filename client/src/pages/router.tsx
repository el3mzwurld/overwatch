import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { useUser } from "../context/user";
import Landing from "./landing";
import { Library } from "./library";
import { Search } from "./search";
import { Auth } from "./auth";
import { Profile } from "./profile";

// check if a user is logged in..if not, return them to the authentication screen

const ProtectedRoute = () => {
  const userContext = useUser();

  if (!userContext?.user) {
    return <Navigate to={"/auth"} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

//
export const Approuter = () => {
  return (
    <Routes>
      <Route path="auth" element={<Auth />} />
      <Route path="auth/register" element={<Auth />} />

      <Route path="/" element={<Home />}>
        <Route index element={<Landing />} />
        <Route path="search" element={<Search />} />
        <Route path="item/:category/:id" />
        {/* only authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="library" element={<Library />} />
          <Route path="library/:id" />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};
