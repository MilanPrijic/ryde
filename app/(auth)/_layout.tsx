import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import ROUTES from "@/constants/route";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
