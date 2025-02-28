import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Visszaküldés az előző oldalra bejelentkezés után
  const from = location.state?.from || "/";

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Az email cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím";
    }
    
    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Hiba törlése, ha a mező módosult
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate(from);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Bejelentkezés</h1>
            <p>Jelentkezz be a fiókodba a hirdetések böngészéséhez és kezeléséhez</p>
          </div>
          
          {authError && (
            <div className="alert alert-danger">{authError}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email cím</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="pelda@email.hu"
                disabled={isSubmitting}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="form-group form-check">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-check-input"
                disabled={isSubmitting}
              />
              <label htmlFor="rememberMe" className="form-check-label">
                Emlékezz rám
              </label>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bejelentkezés...' : 'Bejelentkezés'}
            </button>
          </form>
          
          <div className="auth-footer">
            <Link to="/forgot-password" className="forgot-password-link">
              Elfelejtetted a jelszavad?
            </Link>
            <p className="register-prompt">
              Még nincs fiókod? <Link to="/register">Regisztrálj most</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
