import React, { Suspense } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import CommonLayout from "./layout/CommonLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import NavIndexContextProvider from "./context/NavIndexContext";
import MenuByIdPage from "./pages/MenuByIdPage";

function App() {
  const { pathname, hash, key } = useLocation();

  React.useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <Routes>
      <Route path="/" element={<LayoutWrapper />}>
        <Route index element={<HomePage />} />
        <Route path="menu">
          <Route index element={<MenuPage />} />
          <Route path=":id" element={<MenuByIdPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function LayoutWrapper() {
  return (
    <NavIndexContextProvider>
      <CommonLayout>
        <div
          style={{
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <Suspense fallback={<h1>Loading...</h1>}>
            <Outlet />
          </Suspense>
        </div>
      </CommonLayout>
    </NavIndexContextProvider>
  );
}

export default App;
