import { createCookieSessionStorage } from "@remix-run/node";
import { isTheme, Theme } from "~/contexts/ThemeContext";
import { getRequiredServerEnvVar } from "./misc";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "my_barkeeper_theme",
    secure: true,
    secrets: [getRequiredServerEnvVar("SESSION_SECRET")],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () =>
      themeStorage.commitSession(session, { expires: new Date("2099-12-31") }),
  };
}

export { getThemeSession };
