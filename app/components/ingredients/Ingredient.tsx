import type { Ingredient, Prisma, Product } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

interface IngredientProps {
  ingredient: SerializeFrom<
    Prisma.IngredientGetPayload<{
      include: {
        type: true;
        _count: { select: { products: true; cocktails: true } };
      };
    }>
  >;
}
export default function IngredientCard({ ingredient }: IngredientProps) {
  return (
    <div className="card mb-3 border border-gray-700 p-3">
      <div className="flex justify-between align-baseline">
        <h2 className="text-lg font-bold">{ingredient.name}</h2>
        <span className="badge-accent badge badge-md">
          {ingredient.type?.name}
        </span>
      </div>
      <div>
        <span className="badge-primary badge mr-2">
          {ingredient._count.products} Products
        </span>
        <span className="badge-info badge mr-2">
          {ingredient._count.cocktails} Cocktails
        </span>
      </div>
    </div>
  );
}
