import React from 'react';

const CarFeatures = ({ features = {} }) => {
  const featureGroups = {
    general: ['év', 'km', 'üzemanyag', 'teljesítmény', 'hengerűrtartalom'],
    comfort: ['klíma', 'elektromos_ablak', 'bőr_ülés', 'ülésfűtés', 'tempomat'],
    safety: ['abs', 'esp', 'légzsák', 'tolatóradar', 'tolatókamera']
  };

  return (
    <div className="car-features">
      <h3>Jármű jellemzői</h3>
      
      <div className="feature-groups">
        <div className="feature-group">
          <h4>Általános</h4>
          <ul>
            {featureGroups.general.map(key => (
              features[key] && (
                <li key={key}>
                  {key.replace('_', ' ')}: {features[key]}
                </li>
              )
            ))}
          </ul>
        </div>
        
        <div className="feature-group">
          <h4>Kényelem</h4>
          <ul>
            {featureGroups.comfort.map(key => (
              features[key] && (
                <li key={key}>
                  {key.replace('_', ' ')}: {features[key] === true ? 'Van' : features[key]}
                </li>
              )
            ))}
          </ul>
        </div>
        
        <div className="feature-group">
          <h4>Biztonság</h4>
          <ul>
            {featureGroups.safety.map(key => (
              features[key] && (
                <li key={key}>
                  {key.replace('_', ' ')}: {features[key] === true ? 'Van' : features[key]}
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarFeatures;