import { Link, useSearchParams } from "@remix-run/react";
import type { FC } from "react";

const Navbar: FC = () => {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("tic") || "";
  return (
    <div>
      <div className="navbar rounded-box mb-2 bg-neutral text-neutral-content shadow-lg">
        <div className="mx-2 flex-none px-2">
          <span className="text-lg font-bold">
            Studie zur Privatsphäre-bewussten Bildklassifizierung
          </span>
        </div>
        <div className="mx-2 flex-1 px-2"></div>
        <div className="flex-none">
          <Link to={`/datenschutz?tic=${ticket}`}>
            <button className="btn btn-ghost btn-sm rounded-btn">
              Datenschutz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
