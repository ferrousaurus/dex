import { Card, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Card: Card.extend({
      defaultProps: {
        withBorder: true,
        p: "sm",
      },
    }),
  },
});

export default theme;
