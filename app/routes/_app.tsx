import { User } from "@prisma/client";
import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import NavBar from "~/components/nav/NavBar";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return redirect("/landing");
  }
  return json({ user });
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <NavBar username={data.user.username} />
      <div className="p-8">
        <Outlet context={{ user: data.user }} />
      </div>
    </>
  );
}

interface UserContext {
  user: User;
}

export function useUser() {
  return useOutletContext<UserContext>();
}
