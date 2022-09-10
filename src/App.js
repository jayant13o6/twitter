import logo from "./logo.svg";
import Home from "./components/home";
import { useRoutes, BrowserRouter } from "react-router-dom";
import "./App.css";

const AddRoute = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
  ]);
  return routes;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AddRoute />
      </BrowserRouter>
    </div>
  );
}
export default App;
