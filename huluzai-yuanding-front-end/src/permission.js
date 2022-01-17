import router, { teacherEndRoutes, kindergartenEndRoutes } from "./router";
import store from "./store";
import { getUserInfo, showMsgbox } from "./utils";
import de from "element-ui/src/locale/lang/de";

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  next();
});
