const colorList = {
  1: {
    bg_color: "bg-gradient-to-r from-red-500 to-red-700",
    PUBLIC: "bg-gradient-to-r from-red-900 to-red-700",
    PRIVATE: "bg-gradient-to-r from-red-900 to-red-700",
  },
  2: {
    bg_color: "bg-gradient-to-r from-blue-500 to-blue-700",
    PUBLIC: "bg-gradient-to-r from-blue-900 to-blue-700",
    PRIVATE: "bg-gradient-to-r from-blue-900 to-blue-700",
  },
  3: {
    bg_color: "bg-gradient-to-r from-green-500 to-green-700",
    PUBLIC: "bg-gradient-to-r from-green-900 to-green-700",
    PRIVATE: "bg-gradient-to-r from-green-900 to-green-700",
  },
  4: {
    bg_color: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    PUBLIC: "bg-gradient-to-r from-yellow-900 to-yellow-700",
    PRIVATE: "bg-gradient-to-r from-yellow-900 to-yellow-700",
  },
  5: {
    bg_color: "bg-gradient-to-r from-purple-500 to-purple-700",
    PUBLIC: "bg-gradient-to-r from-purple-900 to-purple-700",
    PRIVATE: "bg-gradient-to-r from-purple-900 to-purple-700",
  },
  6: {
    bg_color: "bg-gradient-to-r from-pink-500 to-pink-700",
    PUBLIC: "bg-gradient-to-r from-pink-900 to-pink-700",
    PRIVATE: "bg-gradient-to-r from-pink-900 to-pink-700",
  },
  7: {
    bg_color: "bg-gradient-to-r from-orange-500 to-orange-700",
    PUBLIC: "bg-gradient-to-r from-orange-900 to-orange-700",
    PRIVATE: "bg-gradient-to-r from-orange-900 to-orange-700",
  },
  8: {
    bg_color: "bg-gradient-to-r from-teal-500 to-teal-700",
    PUBLIC: "bg-gradient-to-r from-teal-900 to-teal-700",
    PRIVATE: "bg-gradient-to-r from-teal-900 to-teal-700",
  },
  9: {
    bg_color: "bg-gradient-to-r from-indigo-500 to-indigo-700",
    PUBLIC: "bg-gradient-to-r from-indigo-900 to-indigo-700",
    PRIVATE: "bg-gradient-to-r from-indigo-900 to-indigo-700",
  },
  10: {
    bg_color: "bg-gradient-to-r from-gray-500 to-gray-700",
    PUBLIC: "bg-gradient-to-r from-gray-900 to-gray-700",
    PRIVATE: "bg-gradient-to-r from-gray-900 to-gray-700",
  },
  11: {
    bg_color: "bg-gradient-to-r from-lime-500 to-lime-700",
    PUBLIC: "bg-gradient-to-r from-lime-900 to-lime-700",
    PRIVATE: "bg-gradient-to-r from-lime-900 to-lime-700",
  },
  12: {
    bg_color: "bg-gradient-to-r from-emerald-500 to-emerald-700",
    PUBLIC: "bg-gradient-to-r from-emerald-900 to-emerald-700",
    PRIVATE: "bg-gradient-to-r from-emerald-900 to-emerald-700",
  },
  13: {
    bg_color: "bg-gradient-to-r from-cyan-500 to-cyan-700",
    PUBLIC: "bg-gradient-to-r from-cyan-900 to-cyan-700",
    PRIVATE: "bg-gradient-to-r from-cyan-900 to-cyan-700",
  },
  14: {
    bg_color: "bg-gradient-to-r from-rose-500 to-rose-700",
    PUBLIC: "bg-gradient-to-r from-rose-900 to-rose-700",
    PRIVATE: "bg-gradient-to-r from-rose-900 to-rose-700",
  },
  15: {
    bg_color: "bg-gradient-to-r from-violet-500 to-violet-700",
    PUBLIC: "bg-gradient-to-r from-violet-900 to-violet-700",
    PRIVATE: "bg-gradient-to-r from-violet-900 to-violet-700",
  },
  16: {
    bg_color: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-700",
    PUBLIC: "bg-gradient-to-r from-fuchsia-900 to-fuchsia-700",
    PRIVATE: "bg-gradient-to-r from-fuchsia-900 to-fuchsia-700",
  },
  17: {
    bg_color: "bg-gradient-to-r from-amber-500 to-amber-700",
    PUBLIC: "bg-gradient-to-r from-amber-900 to-amber-700",
    PRIVATE: "bg-gradient-to-r from-amber-900 to-amber-700",
  },
  18: {
    bg_color: "bg-gradient-to-r from-sky-500 to-sky-700",
    PUBLIC: "bg-gradient-to-r from-sky-900 to-sky-700",
    PRIVATE: "bg-gradient-to-r from-sky-900 to-sky-700",
  },
  19: {
    bg_color: "bg-gradient-to-r from-slate-500 to-slate-700",
    PUBLIC: "bg-gradient-to-r from-slate-900 to-slate-700",
    PRIVATE: "bg-gradient-to-r from-slate-900 to-slate-700",
  },
  20: {
    bg_color: "bg-gradient-to-r from-stone-500 to-stone-700",
    PUBLIC: "bg-gradient-to-r from-stone-900 to-stone-700",
    PRIVATE: "bg-gradient-to-r from-stone-900 to-stone-700",
  },
};

export default function randomColor() {
  const number = Math.floor(Math.random() * 20) + 1;
  return colorList[number];
}
