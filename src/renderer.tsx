// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as React from "react";
import * as ReactDom from "react-dom";

const App = () => {
  return <div>Hello React</div>;
};

ReactDom.render(<App />, document.getElementById("app"));
