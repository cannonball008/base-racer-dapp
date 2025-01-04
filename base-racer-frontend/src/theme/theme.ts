import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: 'dark', // 'dark' | 'light'
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors: {
    brand: {
      100: "#1ABCFC",
      200: "#6C8296",
      300: "#1C7293",
    },
  },
  config,
});

export default theme;
