import * as AuthSession from "expo-auth-session";
import { fetchAPI } from "@/lib/fetch";
import ROUTES from "@/constants/route";

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    // Start the authentication process by calling `startSSOFlow()`
    const { createdSessionId, setActive, signIn, signUp } =
      await startOAuthFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "uberclone",
          path: ROUTES.HOME,
        }),
      });

    // If sign in was successful, set the active session
    if (createdSessionId) {
      if (setActive) {
        await setActive!({ session: createdSessionId });

        if (signUp?.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        return {
          success: true,
          code: "success",
          message: "You have successfully authenticated.",
        };
      }
    }
    return {
      success: false,
      code: "error",
      message: "Authentication failed. Please try again.",
    };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return {
      success: false,
      code: error.code,
      message: error?.errors[0].longMessage,
    };
  }
};
