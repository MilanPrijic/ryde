import { Redirect } from "expo-router";
import ROUTES from "@/constants/route";

const Home = () => {
  return <Redirect href={ROUTES.HOME} />;
};

export default Home;
