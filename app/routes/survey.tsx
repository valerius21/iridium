import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  return !!user;
};

const Survey = () => {
  const user = useLoaderData<boolean>();

  return (
    <>
      <div className="prose mx-auto max-w-2xl">
        <h1>Umfrage</h1>
        {user ? (
          <Outlet />
        ) : (
          <>
            Session-Cookie wurde nicht gefunden.{" "}
            <Link to="/">
              <p className="link-primary">
                Bitte wiederholen Sie den Vorgang, oder starten Sie den Prozenn
                seitens Respondi/Mingle neu.
              </p>
              <button className="btn btn-secondary">Wiederholen</button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Survey;
