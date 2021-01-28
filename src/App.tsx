import { Typography } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import "./App.css";
import { Todo } from "./components/Todo/Todo";

function App() {
  return (
    <div className="App">
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "bold", color: "grey" }}
      >
        Serverless CRUD
      </Typography>
      <Todo />
    </div>
  );
}

export default App;
