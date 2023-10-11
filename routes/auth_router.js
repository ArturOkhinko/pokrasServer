const Router = require("express").Router;
const adminController = require("../controllers/admin-controller");
const clientController = require("../controllers/client-controller");
const userController = require("../controllers/user-controllers");

const route = new Router();
route.post("/registration", userController.registration);
route.post("/login", userController.login);
route.get("/logout", userController.logout);
route.get("/refresh", userController.refresh);
route.get("/activated/:link", userController.active);

route.post("/mainDescription", adminController.mainDescription);
route.delete("/deleteMainDescription", adminController.deleteMainDescription);
route.post("/descriptionPost", adminController.descriptionPost);
route.delete("/removeDescriptionPost", adminController.removeDescriptionPost);
route.put("/updateTruckInfo", adminController.updateInfoTruckWheel);
route.put("/wheelInfo", adminController.wheelInfo);
route.put("/updateSupportsInfo", adminController.updateInfoSupports);
route.post("/updateInfoSandblast", adminController.updateInfoSandblast);
route.delete("/deleteInfoSandblast", adminController.deleteInfoSandblast);
route.post("/insertPowderPoint", adminController.insertPowderPoint);
route.delete("/deletePowderPoint", adminController.deletePowderPoint);
route.get("/getInfoAboutUser", adminController.getInfoAboutUser);

route.get("/getInfo", clientController.getInfo);

module.exports = route;
