import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import LoanPage from "../components/loan_page";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>

        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<LoanPage />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
    </App>
  );
};
export default Layout;
