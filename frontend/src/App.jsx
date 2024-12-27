import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import ICPPage from "./pages/ICPPage";
import Layout from "./components/layout";
import Dashboard from "./pages/Dashboard";
import ICPPageDesign from "./pages/ICPPage2";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Layout />}>
            <Route path="chat" element={<ChatPage />} />
            <Route path="icp" element={<ICPPage />} />
            <Route path="icp2" element={<ICPPageDesign />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
