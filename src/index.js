import express from "express";
import { json, urlencoded } from "body-parser";
import { homeRouter } from "./router/homeRouter";
import { routes } from "./utils/constants";
import { communityRouter } from "./router/communityRouter";

const app = express();

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.use("/src/styles", express.static("src/styles"));
app.use("/src/client", express.static("src/client"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use(routes.home, homeRouter);
app.use(routes.community, communityRouter);

app.listen(3001, () => {
  console.log(`🧨Server running on http://localhost:3001`);
});
