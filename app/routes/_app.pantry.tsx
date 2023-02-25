import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "Pantry | Barkeeper",
});

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const ingredients = await db.userIngredient.findMany({
    where: {
      userId,
    },
    include: { ingredient: true },
  });
  const products = await db.userProduct.findMany({
    where: { userId },
    include: { product: true },
  });
  return json({ ingredients, products });
}

export default function Pantry() {
  const { ingredients, products } = useLoaderData<typeof loader>();
  return (
    <div className="columns-2 gap-8">
      <Container>
        <h1>Ingredients</h1>
        {ingredients.length ? (
          ingredients.map((ingredient) => (
            <p key={ingredient.id}>{ingredient.ingredient.name}</p>
          ))
        ) : (
          <p>There are no ingredients in your pantry.</p>
        )}
      </Container>
      <Container>
        <h1>Products</h1>
        {products.length ? (
          products.map((product) => (
            <p key={product.id}>{product.product.name}</p>
          ))
        ) : (
          <p>There are no products in your pantry.</p>
        )}
      </Container>
    </div>
  );
}
