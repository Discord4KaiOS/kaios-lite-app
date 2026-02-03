import { lazy } from "solid-js";

const Frame = lazy(() => import("./Frame"));
const Parent = lazy(() => import("./Parent"));

const App = () => {
  if (import.meta.env.IS_FRAME) return <Frame />;
  return <Parent />;
};

export default App;
