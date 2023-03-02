import { json, LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import IngredientCard from "~/components/ingredients/Ingredient";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  const ingredients = await db.ingredient.findMany({
    take: 10,
    include: {
      type: true,
      _count: { select: { products: true, cocktails: true } },
    },
  });

  return json({ ingredients });
};

export default function Ingredients() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="mb-4 flex">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <div className="ml-auto">
          <Link to="create" className="btn-primary btn gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Ingredient
          </Link>
        </div>
      </div>
      <Outlet />
      <Container>
        {data.ingredients.length > 0 ? (
          <ul>
            {data.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <IngredientCard ingredient={ingredient} />
              </li>
            ))}
          </ul>
        ) : (
          <h1>No ingredients yet!</h1>
        )}
      </Container>
    </>
  );
}
