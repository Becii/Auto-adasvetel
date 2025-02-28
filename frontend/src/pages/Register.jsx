import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "A név megadása kötelező";
    }

    if (!formData.email) {
      newErrors.email = "Az email cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím";
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező";
    } else if (formData.password.length < 8) {
      newErrors.password = "A jelszónak legalább 8 karakter hosszúnak kell lennie";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "A jelszavak nem egyeznek";
    }

    if (!formData.phone) {
      newErrors.phone = "A telefonszám megadása kötelező";
    } else if (!/^(\+?36|06)[ -]?(\d{1,2})[ -]?(\d{3})[ -]?(\d{3,4})$/.test(formData.phone)) {
      newErrors.phone = "Érvénytelen telefonszám formátum";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "El kell fogadnod a felhasználási feltételeket";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (success) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Sikeres regisztráció!</h1>
              <p>Köszönjük, hogy regisztráltál az oldalunkra.</p>
              <p>
                Küldtünk egy megerősítő emailt a megadott email címre. Kérjük, erősítsd meg a fiókod a benne található linkre kattintva.
              </p>
            </div>
            <div className="auth-footer">
              <p>Átirányítás a bejelentkezési oldalra...</p>
              <p>
                <Link to="/login" className="btn btn-primary">
                  Bejelentkezés most
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Regisztráció</h1>
            <p>Hozz létre fiókot a teljes funkciók használatához</p>
          </div>

          {authError && <div className="alert alert-danger">{authError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Név</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Teljes név"
                disabled={isSubmitting}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email cím</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="pelda@email.hu"
                disabled={isSubmitting}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonszám</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="+36 xx xxx xxxx"
                disabled={isSubmitting}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                disabled={isSubmitting}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Jelszó megerősítése</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className={`form-check-input ${errors.termsAccepted ? "is-invalid" : ""}`}
                  disabled={isSubmitting}
                />
                <label htmlFor="termsAccepted" className="form-check-label">
                  Elfogadom a felhasználási feltételeket
                </label>
                {errors.termsAccepted && <div className="invalid-feedback">{errors.termsAccepted}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Regisztráció folyamatban..." : "Regisztráció"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Már van fiókod? <Link to="/login">Bejelentkezés</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
