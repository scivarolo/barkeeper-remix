import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { Link, Form, useActionData, useSearchParams } from "@remix-run/react";
import Alert from "~/components/Alert";
import FormControl from "~/components/forms/FormControl";
import Input from "~/components/forms/Input";
import Label from "~/components/forms/Label";
import { db } from "~/utils/db.server";
import { validateUsername, validatePassword } from "~/utils/login";
import { badRequest } from "~/utils/request.server";
import { createUserSession, register } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return {
    description: "Create an account to start making cocktails",
    title: "Barkeeper | Create an Account",
  };
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }
  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null });
  }

  const userExists = await db.user.findFirst({ where: { username } });
  if (userExists) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `User with username ${username} already exists.`,
    });
  }

  const user = await register({ username, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: "Something went wrong. Try again.",
    });
  }
  return await createUserSession(user.id, redirectTo);
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="container flex h-screen w-full items-center justify-center">
        <div className="card-bordered card mx-auto max-w-md bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="text-center text-3xl font-bold">
              Create a Barkeeper Account
            </h1>
            <p className="text-center text-sm opacity-60">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:text-primary">
                Login
              </Link>
            </p>
            <Form method="post" className="w-full">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get("redirectTo") ?? "/dashboard"}
              />
              <FormControl>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  defaultValue={actionData?.fields?.username}
                  error={actionData?.fieldErrors?.username}
                />
              </FormControl>
              <FormControl>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  error={actionData?.fieldErrors?.password}
                  defaultValue={actionData?.fields?.password}
                />
              </FormControl>
              {actionData?.formError ? (
                <Alert
                  className="mt-5"
                  icon={<ExclamationTriangleIcon className="w-10" />}>
                  {actionData.formError}
                </Alert>
              ) : null}
              <div className="card-actions mt-5">
                <button type="submit" className="btn-primary btn w-full">
                  Create Account
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
