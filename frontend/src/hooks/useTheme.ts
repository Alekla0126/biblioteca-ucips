import { useEffect, useState } from "react";

type Theme = "dark" | "light";
const KEY = "ucips_theme";

function init(): Theme {
  return (localStorage.getItem(KEY) as Theme) || "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(init);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, isDark: theme === "dark", toggle };
}
