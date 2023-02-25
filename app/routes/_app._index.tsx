import type {
  ErrorBoundaryComponent,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "Counter | Barkeeper",
});

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return redirect("/landing");
  }
  return json({ user });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Dashboard</h1>
      {data.user ? (
        <div className="user-info">
          <span>{`Hi ${data.user.username}`}</span>
          <Form action="/logout" method="post">
            <button type="submit" className="btn-outline btn">
              Logout
            </button>
          </Form>
        </div>
      ) : null}
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBoundary error={error} />
);
