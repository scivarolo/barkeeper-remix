import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import Input from "~/components/forms/Input";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const ingredientTypes = await db.ingredientType.findMany({
    orderBy: { name: "asc" },
  });
  return json({ ingredientTypes });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name");
  const ingredientTypeId = formData.get("ingredientTypeId");
  if (
    typeof name !== "string" ||
    name === "" ||
    typeof Number(ingredientTypeId) !== "number"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Invalid submission",
    });
  }

  const exists = await db.ingredient.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (exists !== null) {
    return badRequest({
      fieldErrors: null,
      fields: { name, ingredientTypeId },
      formError: "An ingredient with this name already exists",
    });
  }
  try {
    await db.ingredient.create({
      data: {
        name: name,
        ingredientTypeId: Number(ingredientTypeId),
        createdById: userId,
      },
    });
  } catch (error) {
    return badRequest({
      fieldErrors: null,
      fields: { name, ingredientTypeId },
      formError: "something when wrong",
    });
  }

  return redirect("/ingredients");
}

export default function CreateIngredient() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <div className="mb-3">
        <h2 className="text-xl">Create New Ingredient</h2>
      </div>
      <Form method="post">
        <Input name="name" placeholder="Name" required />
        <select
          className="select-bordered select w-full max-w-xs"
          id="ingredientTypeId"
          name="ingredientTypeId"
          defaultValue=""
          required>
          <option disabled value="">
            Ingredient type
          </option>
          {data.ingredientTypes.map((ingredientType) => (
            <option key={ingredientType.id} value={ingredientType.id}>
              {ingredientType.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          {actionData?.formError ? (
            <div className="alert alert-error">{actionData.formError}</div>
          ) : null}
          <span className="ml-auto flex-none">
            <Link
              to="/ingredients"
              className="btn-gray-500 btn-outline btn mr-3">
              Cancel
            </Link>
            <button type="submit" className="btn-primary btn">
              Save Ingredient
            </button>
          </span>
        </div>
      </Form>
    </Container>
  );
}
