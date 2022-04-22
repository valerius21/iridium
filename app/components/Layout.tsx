import { useSearchParams } from "@remix-run/react";
import type { FC } from "react";
import Navbar, { NavbarItems } from "./Navbar";

const Layout: FC = ({ children }) => {
  const [searchParams] = useSearchParams();
  return (
    <>
      <div className="mx-auto p-5">
        <Navbar />
      </div>
      <div className="container mx-auto p-5 pb-14">{children}</div>
    </>
  );
};

export default Layout;
