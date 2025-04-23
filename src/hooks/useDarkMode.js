import { useEffect, useState, useCallback } from "react";

const useDarkMode = () => {
  let [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    if (theme === "light") {
      localStorage.setItem("chenx820-theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("chenx820-theme", "light");
      setTheme("light");
    }
  }, [theme]);

  useEffect(() => {
    const localTheme = localStorage.getItem("chenx820-theme");
    if (localTheme) {
      setTheme(localTheme);
    }
  }, []);

  return [theme, toggleTheme];
};

export default useDarkMode;
