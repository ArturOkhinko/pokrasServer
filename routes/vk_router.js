const Router = require("express").Router;
const vkAppController = require("../controllers/vkApp-controller");
const vkMiniAppsController = require("../controllers/vkApp-controller");
const route = new Router();
route.post("/getInfoAboutUserVkApp", vkMiniAppsController.getInfoAboutUser);
route.post(
  "/writeInfoAboutUserVkApp",
  vkMiniAppsController.writeDownInfoAboutNewUser
);
route.get("/getInfoFromDatabase", vkAppController.getInfoFromDatabase);
module.exports = route;
