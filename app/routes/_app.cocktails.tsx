import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "Cocktails | Barkeeper",
});

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const cocktails = await db.cocktail.findMany({ take: 10 });
  return json({ cocktails });
};

export default function Cocktails() {
  const { cocktails } = useLoaderData<typeof loader>();
  return (
    <Container>
      <h1>Cocktails</h1>
      {cocktails.length ? (
        cocktails.map((cocktail) => <p key={cocktail.id}>{cocktail.name}</p>)
      ) : (
        <p>No cocktails yet.</p>
      )}
    </Container>
  );
}
