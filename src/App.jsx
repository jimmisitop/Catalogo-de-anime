import Navbar from "./components/Navbar";
import Aside from "./components/Aside";
import MainSections from "./pages/MainSections";
import SearchBar from "./components/SearchBar";
import AnimeDetails from "./components/AnimeDetails";
import AnimeLikes from "./pages/AnimeLikes";
import ProximosEstrenos from "./pages/ProximosEstrenos";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <div style={{ flex: 1 }} className="overflow-y-auto no-scrollbar">
          <SearchBar />
          <Routes>
            <Route path="*" element={<div>404 Not Found</div>} />
            <Route path="/" element={<MainSections />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/Proximos Estrenos" element={<ProximosEstrenos />} />
            <Route path="/Me gusta" element={<AnimeLikes />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
