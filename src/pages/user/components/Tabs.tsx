import { NavLink } from "react-router-dom";

export default function Tabs() {
  return (
    <>
      <nav className="fixed top-16 z-20 mb-8 flex w-full justify-center bg-white px-0 py-4 lg:relative lg:top-auto lg:left-auto lg:block lg:translate-x-0 lg:px-20">
        <ul className="flex w-full justify-center gap-8 lg:justify-start lg:px-40">
          <li>
            <NavLink to="profile" className={({ isActive }) => (isActive ? "text-primary font-bold" : "hover:text-primary")}>
              會員中心
            </NavLink>
          </li>
          <li>
            <NavLink to="history" className={({ isActive }) => (isActive ? "text-primary font-bold" : "hover:text-primary")}>
              演唱會及票券
            </NavLink>
          </li>
          <li>
            <NavLink to="password" className={({ isActive }) => (isActive ? "text-primary font-bold" : "hover:text-primary")}>
              修改密碼
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
