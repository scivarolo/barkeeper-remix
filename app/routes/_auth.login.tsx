import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import Alert from "~/components/Alert";
import FormControl from "~/components/forms/FormControl";
import Input from "~/components/forms/Input";
import Label from "~/components/forms/Label";
import { validatePassword, validateUsername } from "~/utils/login";
import { badRequest } from "~/utils/request.server";
import { createUserSession, login } from "~/utils/session.server";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction = () => {
  return {
    description: "Login to start making cocktails",
    title: "Barkeeper | Login",
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
      formError: "Form not submitted correctly",
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

  const user = await login({ username, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: "Login failed. Username or password is incorrect.",
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="container flex h-screen w-full items-center justify-center">
        <div className="card-bordered card mx-auto max-w-md bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="text-center text-3xl font-bold">
              Login to Barkeeper
            </h1>
            <p className="text-center text-sm opacity-60">
              Don't have an account?{" "}
              <Link to="/register" className="underline hover:text-primary">
                Register
              </Link>
            </p>
            <Form method="post">
              <input
                type="hidden"
                name="redirectTo"
                id="redirectTo"
                value={searchParams.get("redirectTo") ?? "/"}
              />
              <FormControl>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
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
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
