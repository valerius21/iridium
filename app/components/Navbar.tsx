import { Link, useSearchParams } from "@remix-run/react";
import { Menu } from "lucide-react";
import type { FC } from "react";

const Navbar: FC = () => {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("tic") || "";
  return (
    <div>
      <div className="rounded-box mb-2 bg-neutral text-neutral-content shadow-lg sm:navbar">
        <div className="mx-2 flex-none px-2">
          <span className="text-md hidden max-w-xs font-bold md:block md:text-lg lg:max-w-lg">
            Studie zur Privatsphäre-bewussten Bildklassifizierung
          </span>
        </div>
        <div className="mx-2 flex-1 px-2"></div>
        <div className="flex-none">
          <div className="menu menu-horizontal">
            <NavbarItems ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export function NavbarItems({ ticket }: { ticket: string }) {
  return (
    <>
      <Link to="/">
        <button className="btn btn-sm rounded-btn">Home</button>
      </Link>
      <Link to={`/datenschutz?tic=${ticket}`}>
        <button className="btn btn-ghost btn-sm rounded-btn">
          Datenschutz
        </button>
      </Link>
      <Link to={`/datenschutz?tic=${ticket}`}>
        <button className="btn btn-ghost btn-sm rounded-btn">Impressum</button>
      </Link>
    </>
  );
}

export default Navbar;
