import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref("default");
  const themes = ref({
    default: {
      primary: "#ffffff",
      secondary: "#00171f",
      accent: "#ffffff",
      icon: "https://res.cloudinary.com/dyhavbbzf/image/upload/v1733932105/qy0vnrc2dx3o0uachlmb.svg",
    },

    dark: {
      primary: "#222831",
      secondary: "#EEEEEE",
      accent: "#76ABAE",
      icon: "https://res.cloudinary.com/dyhavbbzf/image/upload/v1733932138/apqknw79g0acn6os0bjq.svg",
    },
    forest: {
      primary: "#386641",
      secondary: "#f2e8cf",
      accent: "#a7c957",
      icon: "https://res.cloudinary.com/dyhavbbzf/image/upload/v1733932148/b9h8ohhzjklhuq4oonho.svg",
    },
    ocean: {
      primary: "#4ea8de",
      secondary: "#80ffdb",
      accent: "#6930c3",
      icon: "https://res.cloudinary.com/dyhavbbzf/image/upload/v1733932158/xujotposjoo0wgr5c7sr.svg",
    },
    warmlight: {
      primary: "#fefae0",
      secondary: "#d4a373",
      accent: "#faedcd",
      icon: "https://res.cloudinary.com/dyhavbbzf/image/upload/v1733932163/jmtkaznoofzgme8eatbg.svg",
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
