import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import classNames from "classnames";
import type { Theme } from "./contexts/ThemeContext";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "./contexts/ThemeContext";

import styles from "./styles/app.css";
import { getThemeSession } from "./utils/theme.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Barkeeper",
  viewport: "width=device-width,initial-scale=1",
});

export type LoaderData = { theme: Theme | null };

export async function loader({ request }: LoaderArgs) {
  const themeSession = await getThemeSession(request);
  const data: LoaderData = {
    theme: themeSession.getTheme(),
  };
  console.log(data);
  return data;
}

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html
      lang="en"
      className={classNames(theme, "bg-gray-100", "dark:bg-gray-900")}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <div className="p-12">
          <div className="alert alert-error text-red-900 shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 flex-shrink-0 stroke-red-800">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-bold">
                  Spilled drinks! Looks like something went wrong with the app.
                </h3>
                <div className="text-xs">{error.message}</div>
              </div>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
