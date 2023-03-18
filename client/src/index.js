import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";

import Home from "./components/home";
import Feed from "./components/feed";
import Library from "./components/library";
import Upload from "./components/upload";
import Profile from "./components/profile";
import Document from "./components/document";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter basename="/">
    <Switch>
      <Route path="/home" render={(props) => <Home {...props} />} />
      <Route path="/feed" render={(props) => <Feed {...props} />} />
      <Route path="/library" render={(props) => <Library {...props} />} />
      <Route path="/upload" render={(props) => <Upload {...props} />} />
      <Route path="/profile/:user" render={(props) => <Profile {...props} />} />
      <Route path="/doc/:id/:title" render={(props) => <Document {...props} />} />

      <Redirect to="/home" />
    </Switch>
  </HashRouter>
);