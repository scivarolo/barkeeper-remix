import { NavLink } from "@remix-run/react";

export default function NavBar() {
  return (
    <div className="navbar w-full bg-primary text-white">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case" href="/">
          Barkeeper
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <NavButton to="/cocktails">Cocktails</NavButton>
          <NavButton to="/pantry">Pantry</NavButton>
        </ul>
      </div>
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
