import { useEffect, useState, useCallback, useRef } from "react";

const useDarkMode = () => {
  // Match the server render before applying browser preferences. Otherwise
  // hydration can retain light-theme class names on a dark-theme page.
  const [theme, setTheme] = useState("light");

  const toggleRef = useRef(null);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("chenx820-theme", newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const localTheme = localStorage.getItem("chenx820-theme");
    setTheme(localTheme || (mediaQuery.matches ? "dark" : "light"));
    const handleChange = (e) => {
      if (!localStorage.getItem("chenx820-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return [theme, toggleTheme, toggleRef];
};

export default useDarkMode;
