import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createIsomorphicFn, createClientOnlyFn } from "@tanstack/react-start";
import { ScriptOnce } from "@tanstack/react-router";
import { z } from "zod";

const themeStorageKey = "ui-theme";

const UserThemeSchema = z.enum(["light", "dark", "system"]).catch("system");
const AppThemeSchema = z.enum(["light", "dark"]).catch("light");

export type UserTheme = z.infer<typeof UserThemeSchema>;
export type AppTheme = z.infer<typeof AppThemeSchema>;

const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => "system")
  .client((): UserTheme => {
    try {
      const stored = localStorage.getItem(themeStorageKey);
      return UserThemeSchema.parse(stored);
    } catch {
      return "system";
    }
  });

const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
  try {
    const validatedTheme = UserThemeSchema.parse(theme);
    localStorage.setItem(themeStorageKey, validatedTheme);
  } catch {}
});

function getSystemTheme(): AppTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setupPreferredListener() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => handleThemeChange("system");
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

function handleThemeChange(userTheme: UserTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "system");
  const newTheme = userTheme === "system" ? getSystemTheme() : userTheme;
  root.classList.add(newTheme);

  if (userTheme === "system") {
    root.classList.add("system");
  }
}

const themeScript: string = (function () {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem("ui-theme") || "system";
      const validTheme = ["light", "dark", "system"].includes(storedTheme) ? storedTheme : "system";

      if (validTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        document.documentElement.classList.add(systemTheme, "system");
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(systemTheme, "system");
    }
  }
  return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
  userTheme: UserTheme;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

  useEffect(() => {
    if (userTheme !== "system") return;
    return setupPreferredListener();
  }, [userTheme]);

  const appTheme = userTheme === "system" ? getSystemTheme() : userTheme;

  const setTheme = (newUserTheme: UserTheme) => {
    setUserTheme(newUserTheme);
    setStoredTheme(newUserTheme);
    handleThemeChange(newUserTheme);
  };

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      <ScriptOnce children={themeScript} />
      {children}
    </ThemeContext>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
