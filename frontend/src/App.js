import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";
import Comparison from "./pages/Comparison";
import SellCar from "./pages/SellCar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CarProvider } from "./context/CarContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/login.css";
import "./styles/cars.css";
import "./styles/footer.css";
import "./styles/profil.css";


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Szimulálunk egy inicializálási folyamatot
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Betöltés...</div>;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CarProvider>
          <Router>
            <Navbar />
            <main className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/compare" element={<Comparison />} />
                <Route path="/search" element={<Cars />} />
                
                {/* Védett útvonalak */}
                <Route element={<PrivateRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/sell-car" element={<SellCar />} />
                </Route>
                
                {/* Admin útvonalak */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/cars" element={<Admin />} />
                  <Route path="/admin/users" element={<Admin />} />
                </Route>
                
                {/* 404 oldal */}
                <Route path="*" element={<div>Az oldal nem található!</div>} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </CarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;