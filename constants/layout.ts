import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const layout = {
  window: { width, height },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32 },
  breakpoints: { sm: 360, md: 768, lg: 1024 },
  safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
};

export default layout;
