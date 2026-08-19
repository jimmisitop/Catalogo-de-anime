import MainSections from "./pages/MainSections";
import AnimeDetails from "./components/AnimeDetails";
import AnimeLikes from "./pages/AnimeLikes";
import ProximosEstrenos from "./pages/ProximosEstrenos";
import NotFound from "./pages/NotFound";
import TopAppBar from "./components/TopAppBar";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background text-on-background font-body">
              {/* Fixed Top App Bar */}
              <TopAppBar />

              {/* Slide-out Drawer */}
              <Drawer />

              {/* Main Content */}
              <main className="pt-16 pb-20">
                <Routes>
                  <Route path="/" element={<MainSections />} />
                  <Route path="/anime/:id" element={<AnimeDetails />} />
                  <Route path="/Proximos Estrenos" element={<ProximosEstrenos />} />
                  <Route path="/Me gusta" element={<AnimeLikes />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
