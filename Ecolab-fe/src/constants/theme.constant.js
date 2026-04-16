import iconCarmine from "@/assets/icons/carmine.svg";
import iconContrast from "@/assets/icons/contrast.svg";
import iconDark from "@/assets/icons/dark.svg";
import iconDarkMoon from "@/assets/icons/darkmoon.svg";
import iconDarkViolet from "@/assets/icons/darkviolet.svg";
import iconGreenMist from "@/assets/icons/greenmist.svg";
import iconLight from "@/assets/icons/light.svg";
import iconSoftBlue from "@/assets/icons/softblue.svg";

export const THEME = {
  LIGHT: "generic.light",
  DARK: "generic.dark",
  CARMINE: "generic.carmine",
  SOFTBLUE: "generic.softblue",
  DARKMOON: "generic.darkmoon",
  DARKVIOLET: "generic.darkviolet",
  GREENMIST: "generic.greenmist",
  CONTRAST: "generic.contrast",
};

export const THEME_OPTIONS = [
  {
    value: THEME.LIGHT,
    label: "라이트",
    icon: iconLight,
  },
  {
    value: THEME.DARK,
    label: "다크",
    icon: iconDark,
  },
  {
    value: THEME.CARMINE,
    label: "카민",
    icon: iconCarmine,
  },
  {
    value: THEME.SOFTBLUE,
    label: "소프트 블루",
    icon: iconSoftBlue,
  },
  {
    value: THEME.DARKMOON,
    label: "다크 문",
    icon: iconDarkMoon,
  },
  {
    value: THEME.DARKVIOLET,
    label: "다크 바이올렛",
    icon: iconDarkViolet,
  },
  {
    value: THEME.GREENMIST,
    label: "그린 미스트",
    icon: iconGreenMist,
  },
  {
    value: THEME.CONTRAST,
    label: "콘트라스트",
    icon: iconContrast,
  },
];
