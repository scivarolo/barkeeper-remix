import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return null;
};

export default function Landing() {
  return (
    <div className="container flex h-screen w-full items-center justify-center">
      <div className="card mx-auto w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="text-center text-3xl font-bold">Barkeeper</h1>
          <p>Welcome</p>
          <div className="card-actions">
            <Link to="/login" className="btn-primary btn ml-auto">
              Login
            </Link>
            <Link to="/register" className="btn-outline btn">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
