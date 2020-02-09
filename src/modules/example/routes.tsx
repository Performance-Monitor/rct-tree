import * as React from "react";
import { withRouter } from "react-router-dom";

const Tree = withRouter(React.lazy(() => import("./pages/index")));

export default [
  {
    path: "/",
    component: () => <Tree />
  }
];
