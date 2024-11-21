import { PaletteOptions } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
  interface Palette {
    saved: PaletteColor;
    errors: PaletteColor;
  }

  interface PaletteOptions {
    saved?: PaletteColor;
    errors?: PaletteColor;
  }
}

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    saved: true;
    errors : true;
  }
}
