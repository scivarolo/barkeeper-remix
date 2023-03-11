import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import ProductCard from "~/components/products/ProductCard";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  const products = await db.product.findMany({
    take: 10,
    include: {
      ingredient: { select: { name: true } },
    },
  });

  return json({ products });
}

export default function Products() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mb-4 flex">
        <h1 className="text-3xl font-bold">Products</h1>
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
            Product
          </Link>
        </div>
      </div>
      <Outlet />
      <Container>
        {data.products.length > 0 ? (
          <ul>
            {data.products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <h1>No products yet!</h1>
        )}
      </Container>
    </>
  );
}
