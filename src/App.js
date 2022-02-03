import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Converter from "./pages/Converter";
import Home from "./pages/Home";
import KanaCheck from "./pages/KanaCheck";
import PlacesToGo from "./pages/PlacesToGo";
import Error from "./pages/Error";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/kanacheck" element={<KanaCheck />} />
            <Route exact path="/converter" element={<Converter />} />
            <Route exact path="/placestogo" element={<PlacesToGo />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
