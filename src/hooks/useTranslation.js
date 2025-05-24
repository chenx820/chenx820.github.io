import { useLocation } from "@reach/router";
import enTranslations from "../../locales/en/translation.json";
import zhTranslations from "../../locales/zh/translation.json";

export const useTranslation = () => {
  const location = useLocation();
  const isEnglish = !location.pathname.startsWith("/zh");
  const translations = isEnglish ? enTranslations : zhTranslations;

  const t = (key) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  };

  return {
    t,
    language: isEnglish ? "en" : "zh",
  };
};

export default useTranslation;
