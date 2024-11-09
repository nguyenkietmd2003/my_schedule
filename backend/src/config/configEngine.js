import path, { dirname } from "path";
import express from "express";

export const configEngine = (app) => {
  app.set("view", path.join("src"), "views");
  app.set("view engine", "ejs");

  /// config staic file
  app.use(express.static(path.join("..", "public")));
};
