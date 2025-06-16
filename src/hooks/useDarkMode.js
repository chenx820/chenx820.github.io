import { useEffect, useState, useCallback, useRef } from "react";

const useDarkMode = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.getItem("chenx820-theme");
      if (localTheme) {
        return localTheme;
      }
      // 检查系统主题偏好
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
        .matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  });

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
