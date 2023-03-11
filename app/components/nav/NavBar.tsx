import { NavLink, useSubmit } from "@remix-run/react";
import { ThemeToggle } from "~/contexts/ThemeContext";

interface NavBarProps {
  username: string;
}

export default function NavBar({ username }: NavBarProps) {
  return (
    <div className="navbar w-full bg-primary">
      <div className="flex-1 text-white">
        <a className="btn-ghost btn text-xl normal-case" href="/">
          Barkeeper
        </a>
        <ul className="menu menu-horizontal">
          <NavButton to="/pantry">My Pantry</NavButton>
        </ul>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal text-white">
          <NavButton to="/cocktails">Cocktails</NavButton>
          <NavButton to="/ingredients">Ingredients</NavButton>
          <NavButton to="/products">Products</NavButton>
        </ul>
        <AuthMenu username={username} />
      </div>
    </div>
  );
}

interface AuthMenuProps {
  username: string;
}
function AuthMenu({ username }: AuthMenuProps) {
  const logout = useSubmit();
  return (
    <div className="dropdown-bottom dropdown-end dropdown">
      <label tabIndex={0} className="btn-primary btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
        <li>
          <p>Hi {username}</p>
        </li>
        <li>
          <ThemeToggle />
        </li>
        <li>
          <a
            href="/logout"
            onClick={() => logout(null, { method: "post", action: "/logout" })}>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

interface NavButtonProps {
  to: string;
}

function NavButton({ to, children }: React.PropsWithChildren<NavButtonProps>) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "btn-primary btn-active btn rounded-md"
            : "btn-ghost btn rounded-md"
        }>
        {children}
      </NavLink>
    </li>
  );
}
