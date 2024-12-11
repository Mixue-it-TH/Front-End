import { defineStore } from "pinia";
import { ref, computed } from "vue";
import WarmLight from "../../public/image/warmlight.svg";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref("default");
  const themes = ref({
    default: {
      primary: "#ffffff",
      secondary: "#00171f",
      accent: "#ffffff",
      icon: "/image/default.svg",
    },

    dark: {
      primary: "#222831",
      secondary: "#EEEEEE",
      accent: "#76ABAE",
      icon: "/image/dark.svg",
    },
    forest: {
      primary: "#386641",
      secondary: "#f2e8cf",
      accent: "#a7c957",
      icon: "/image/forest.svg",
    },
    ocean: {
      primary: "#4ea8de",
      secondary: "#80ffdb",
      accent: "#6930c3",
      icon: "/image/ocean.svg",
    },
    warmlight: {
      primary: "#fefae0",
      secondary: "#d4a373",
      accent: "#faedcd",
      icon: "/image/warmlight.svg",
    },
  });

  function getAllTheme() {
    return themes.value;
  }

  function setTheme(themeName) {
    const selectedTheme = themes.value[themeName];
    if (selectedTheme) {
      document.documentElement.style.setProperty("--color-primary", selectedTheme.primary);
      document.documentElement.style.setProperty("--color-secondary", selectedTheme.secondary);
      document.documentElement.style.setProperty("--color-accent", selectedTheme.accent);
    }
  }

  return {
    currentTheme,

    getAllTheme,
    setTheme,
  };
});
