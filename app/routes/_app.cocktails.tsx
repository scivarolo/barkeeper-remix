import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const cocktails = await db.cocktail.findMany({ take: 10 });
  return json({ cocktails });
};

export default function Cocktails() {
  const { cocktails } = useLoaderData<typeof loader>();
  return (
    <div className="rounded border-slate-100 bg-white p-6">
      <h1>Cocktails</h1>
      {cocktails.length ? (
        cocktails.map((cocktail) => <p key={cocktail.id}>{cocktail.name}</p>)
      ) : (
        <p>No cocktails yet.</p>
      )}
    </div>
  );
}
