import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import Input from "~/components/forms/Input";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const ingredients = await db.ingredient.findMany({
    orderBy: { name: "asc" },
  });

  return json({ ingredients });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name");
  const ingredientId = formData.get("ingredientId");
  if (
    typeof name !== "string" ||
    name === "" ||
    typeof Number(ingredientId) !== "number"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: { name, ingredientId },
      formError: "Invalid submission",
    });
  }

  const exists = await db.product.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (exists !== null) {
    return badRequest({
      fieldErrors: null,
      fields: { name, ingredientId },
      formError: "A product with this name already exists",
    });
  }
  try {
    await db.product.create({
      data: {
        name,
        ingredientId: Number(ingredientId),
        createdById: userId,
      },
    });
  } catch (error) {
    return badRequest({
      fieldErrors: null,
      fields: { name, ingredientId },
      formError: "something went wrong",
    });
  }

  return redirect("/products");
}

export default function ProductForm() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <Container className="mb-5">
      <div className="mb-3">
        <h2 className="text-xl">Create New Product</h2>
      </div>
      <Form method="post">
        <Input name="name" placeholder="Name" required className="mr-3" />
        <select
          className="select-bordered select w-full max-w-xs"
          id="ingredientId"
          name="ingredientId"
          defaultValue=""
          required>
          <option disabled value="">
            Select product type...
          </option>
          {data.ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          {actionData?.formError ? (
            <div className="alert alert-error">{actionData.formError}</div>
          ) : null}
          <span className="ml-auto flex-none">
            <Link to="/products" className="btn-gray-500 btn-outline btn mr-3">
              Cancel
            </Link>
            <button type="submit" className="btn-primary btn">
              Save Product
            </button>
          </span>
        </div>
      </Form>
    </Container>
  );
}
