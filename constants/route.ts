const ROUTES = {
  WELCOME: "/(auth)/welcome",
  SIGN_UP: "/(auth)/sign-up",
  SIGN_IN: "/(auth)/sign-in",
  HOME: "/(root)/(tabs)/home",
  RIDES: "/(root)/(tabs)/rides",
  CHAT: "/(root)/(tabs)/chat",
  PROFILE: "/(root)/(tabs)/profile",
  FIND_RIDE: "/(root)/find-ride",
  CONFIRM_RIDE: "/(root)/confirm-ride",
  BOOK_RIDE: "/(root)/book-ride",
} as const;

export default ROUTES;
