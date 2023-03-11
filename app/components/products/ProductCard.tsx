import type { Prisma } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

interface ProductProps {
  product: SerializeFrom<
    Prisma.ProductGetPayload<{
      include: { ingredient: { select: { name: true } } };
    }>
  >;
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="card mb-3 border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex justify-between align-baseline">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <span className="badge-accent badge badge-md">
          {product.ingredient.name}
        </span>
      </div>
    </div>
  );
}
