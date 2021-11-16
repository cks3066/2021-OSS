import "regenerator-runtime";
import express from "express";
import { json, urlencoded } from "body-parser";
import { mainRouter } from "./router/mainRouter";
import { routes } from "./utils/constants";

const app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use("/src/styles", express.static("src/styles"));
app.use("/src/client", express.static("src/client"));
app.use("/assets", express.static("assets"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use(routes.home, mainRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log(`🧨Server running on http://localhost:3001`);
});
