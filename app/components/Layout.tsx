import type { FC } from "react";
import Navbar from "./Navbar";

const Layout: FC = ({ children }) => {
  return (
    <div>
      <div className="mx-auto p-5">
        <Navbar />
      </div>
      <div className="container mx-auto p-5 pb-14">{children}</div>
    </div>
  );
};

export default Layout;
