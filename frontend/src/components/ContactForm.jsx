import React, { useState } from 'react';

const ContactForm = ({ carId, carTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Érdeklődöm a következő jármű iránt: ${carTitle}`
  });
  
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Itt küldened az adatokat a szervernek
    // Példa:
    /*
    axios.post('/api/inquiries', {
      ...formData,
      carId
    })
    .then(response => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `Érdeklődöm a következő jármű iránt: ${carTitle}`
      });
    })
    .catch(error => {
      setStatus('error');
    });
    */
    
    // Mivel nincs tényleges API hívás, csak szimuláljuk a sikert
    setStatus('success');
  };

  return (
    <div className="contact-form">
      <h3>Érdeklődés</h3>
      
      {status === 'success' && (
        <div className="alert alert-success">
          Köszönjük érdeklődését! Hamarosan felvesszük Önnel a kapcsolatot.
        </div>
      )}
      
      {status === 'error' && (
        <div className="alert alert-error">
          Hiba történt az üzenet küldése során. Kérjük, próbálja újra később.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Név</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Telefonszám</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Üzenet</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">Küldés</button>
      </form>
    </div>
  );
};

export default ContactForm;