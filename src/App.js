import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Converter from './pages/Converter';
import Home from './pages/Home';
import KanaMatch from './pages/KanaMatch';
import PlacesToGo from './pages/PlacesToGo';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/kanamatch" element={<KanaMatch />} />
        <Route exact path="/converter" element={<Converter />} />
        <Route exact path="/placestogo" element={<PlacesToGo />} />
      </Routes>
    </Router>
    )
}

export default App;
