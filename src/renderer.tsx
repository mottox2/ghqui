// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as child_process from "child_process";
import * as React from "react";
import * as launchEditor from "react-dev-utils/launchEditor.js";
import * as ReactDom from "react-dom";

interface IState {
  root: string;
  repos: string[];
}

class App extends React.Component<{}, IState> {
  public state = {
    repos: [""],
    root: "",
  };

  public async componentDidMount() {
    const root: string = (await executeCommand("ghq", ["root"])).replace("\n", "");
    const result: string = await executeCommand("ghq", ["list"]);
    const repos = result.split("\n");
    this.setState({ root, repos });
  }

  public render() {
    console.log(this.state);
    return (
      <div>
        <h1>Your Repos</h1>
        {this.state.repos.map((repo) => {
          return (
            <li
              onClick={() => {
                // HACK: Avoid errors of TypeScript.
                const launch: any = launchEditor;
                const fileName = `${this.state.root}/${repo}`;
                launch(fileName, 1, 1);
              }}
            >
              {repo}
            </li>
          );
        })}
      </div>
    );
  }
}

const executeCommand = (cmd: string, args: string[], opts = {}): Promise<string> => {
  const proc = child_process.spawn(cmd, args);
  return new Promise((resolve, reject) => {
    console.log("child:" + proc.pid);
    let result: string = "";
    proc.stdout.on("data", (data) => {
      result += data.toString();
    });
    proc.on("close", (code) => {
      if (code !== 0) {
        reject();
      } else {
        resolve(result);
      }
    });
  });
};

ReactDom.render(<App />, document.getElementById("app"));
