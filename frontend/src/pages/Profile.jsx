import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import axios from 'axios';

// Általános Modal komponens
function Modal({ message, onClose, onConfirm, showConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {showConfirm ? (
            <>
              <button className="modal-confirm-btn" onClick={onConfirm}>
                Igen
              </button>
              <button className="modal-close-btn" onClick={onClose}>
                Nem
              </button>
            </>
          ) : (
            <button className="modal-close-btn" onClick={onClose}>
              Bezárás
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState(null); // Siker/hiba üzenetekhez
  const [confirmModal, setConfirmModal] = useState({ show: false, carId: null }); // Törlés megerősítéséhez
  const [userCars, setUserCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Autók lekérése
  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/cars', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cars = response.data.filter(car => car.owner_email === user.email);
        setUserCars(cars);
      } catch (err) {
        console.error('Hiba az autók lekérésekor:', err);
        setError('Nem sikerült betölteni az autókat.');
      } finally {
        setLoadingCars(false);
      }
    };
    if (user) fetchUserCars();
  }, [user]);

  // Kijelentkezés kezelése
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Modal bezárása (siker/hiba üzenetekhez)
  const closeModal = () => {
    setModalMessage(null);
  };

  // Profil szerkesztés mentése
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const updatedUser = { ...user, ...formData };
      const response = await axios.put(
        `http://localhost:8000/users/${user.id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      const newToken = btoa(JSON.stringify({ id: response.data.id, email: response.data.email }));
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setEditMode(false);
      setModalMessage('Profil sikeresen frissítve!');
    } catch (err) {
      setError('Hiba történt a profil frissítésekor.');
      console.error(err);
    }
  };

  // Jelszó változtatás kezelése
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (currentPassword !== user.password) {
      setError('A jelenlegi jelszó hibás!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updatedUser = { ...user, password: newPassword };
      const response = await axios.put(
        `http://localhost:8000/users/${user.id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setModalMessage('Jelszó sikeresen megváltoztatva!');
    } catch (err) {
      setError('Hiba történt a jelszó változtatásakor.');
      console.error(err);
    }
  };

  // Autó törlés kezdeményezése (megerősítő modal megnyitása)
  const handleDeleteCar = (carId) => {
    setConfirmModal({ show: true, carId });
  };

  // Törlés megerősítése
  const confirmDeleteCar = async () => {
    const { carId } = confirmModal;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCars(userCars.filter(car => car.id !== carId));
      setModalMessage('Autó sikeresen törölve!');
    } catch (err) {
      setError('Hiba történt az autó törlésekor.');
      console.error(err);
    } finally {
      setConfirmModal({ show: false, carId: null });
    }
  };

  // Megerősítő modal bezárása (elutasítás)
  const closeConfirmModal = () => {
    setConfirmModal({ show: false, carId: null });
  };

  // Űrlap adatainak frissítése
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-page text-center p-10 bg-[#1a1a1a] min-h-screen text-white">
      <div className="page-container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profil</h1>

        {error && (
          <div className="text-[#ff4d4d] mb-4">{error}</div>
        )}

        {/* Felhasználói adatok */}
        <div className="profile-section bg-[#2a2a2a] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Felhasználói adatok</h2>
          {editMode ? (
            <form onSubmit={handleSaveProfile}>
              <div className="mb-4">
                <label className="block text-left mb-1 text-[#aaaaaa]">Név</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileInputChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                  placeholder="Add meg az új neved"
                />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-1 text-[#aaaaaa]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileInputChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                  placeholder="Add meg az új email címed"
                />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-1 text-[#aaaaaa]">Telefonszám</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileInputChange}
                  className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                  placeholder="Add meg az új telefonszámod"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition"
                >
                  Mentés
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-[#ff4d4d] text-white py-2 px-4 rounded hover:bg-[#cc3d3d] transition"
                >
                  Mégse
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-2">
                <span className="font-semibold text-[#2dd36f]">Név:</span> {user?.name || 'Nincs megadva'}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-[#2dd36f]">Email:</span> {user?.email || 'Nincs megadva'}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-[#2dd36f]">Telefonszám:</span> {user?.phone || 'Nincs megadva'}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition"
              >
                Profil szerkesztése
              </button>
            </div>
          )}
        </div>

        {/* Jelszó változtatás */}
        <div className="profile-section bg-[#2a2a2a] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Jelszó változtatás</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-left mb-1 text-[#aaaaaa]">Jelenlegi jelszó</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                placeholder="Add meg a jelenlegi jelszavad"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1 text-[#aaaaaa]">Új jelszó</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                placeholder="Add meg az új jelszavad"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1 text-[#aaaaaa]">Új jelszó megerősítése</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#444] focus:border-[#2dd36f] focus:outline-none"
                placeholder="Erősítsd meg az új jelszavad"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition"
            >
              Jelszó megváltoztatása
            </button>
          </form>
        </div>

        {/* Autóim szekció */}
        <div className="profile-section bg-[#2a2a2a] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Autóim</h2>
          {loadingCars ? (
            <p>Autók betöltése...</p>
          ) : userCars.length === 0 ? (
            <p>Még nem hirdettél fel autót.</p>
          ) : (
            <div className="cars-list">
              {userCars.map(car => (
                <div key={car.id} className="car-item">
                  <div className="car-info">
                    <p><strong>{car.brand} {car.model}</strong> ({car.year})</p>
                    <p>Ár: {car.price} Ft</p>
                    <p>Kilométer: {car.mileage} km</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-[#ff4d4d] text-white py-1 px-3 rounded hover:bg-[#cc3d3d] transition"
                  >
                    Törlés
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* További lehetőségek */}
        <div className="profile-section bg-[#2a2a2a] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">További lehetőségek</h2>
          <div className="flex flex-col gap-4 items-center">
            <Link
              to="/favorites"
              className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition w-full max-w-xs text-center"
            >
              Kedvencek megtekintése
            </Link>
            <Link
              to="/sell-car"
              className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition w-full max-w-xs text-center"
            >
              Autó hirdetése
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-[#2dd36f] text-white py-2 px-4 rounded hover:bg-[#28b15e] transition w-full max-w-xs text-center"
              >
                Adminisztráció
              </Link>
            )}
          </div>
        </div>

        {/* Kijelentkezés */}
        <button
          onClick={handleLogout}
          className="bg-[#ff4d4d] text-white py-2 px-6 rounded hover:bg-[#cc3d3d] transition"
        >
          Kijelentkezés
        </button>

        {/* Siker/hiba Modal */}
        {modalMessage && (
          <Modal
            message={modalMessage}
            onClose={closeModal}
            showConfirm={false}
          />
        )}

        {/* Törlés megerősítő Modal */}
        {confirmModal.show && (
          <Modal
            message="Biztosan törölni szeretnéd ezt az autót?"
            onClose={closeConfirmModal}
            onConfirm={confirmDeleteCar}
            showConfirm={true}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;