import { Outlet } from "@remix-run/react";
import NavBar from "~/components/nav/NavBar";

export default function App() {
  return (
    <>
      <NavBar />
      <div className="p-8">
        <Outlet />
      </div>
    </>
  );
}
