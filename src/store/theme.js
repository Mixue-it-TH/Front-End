import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref("default");
  const themes = ref({
    default: {
      primary: "#ffffff",
      secondary: "#00171f",
      accent: "#ffffff",
    },

    dark: {
      primary: "#222831",
      secondary: "#EEEEEE",
      accent: "#76ABAE",
    },
    forest: {
      primary: "#386641",
      secondary: "#f2e8cf",
      accent: "#a7c957",
    },
    ocean: {
      primary: "#4ea8de",
      secondary: "#80ffdb",
      accent: "#6930c3",
    },
    warmlove: {
      primary: "#f5ccd4",
      secondary: "#ff6f59",
      accent: "#b8a4c9",
    },
    warmlight: {
      primary: "#fefae0",
      secondary: "#d4a373",
      accent: "#faedcd",
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
