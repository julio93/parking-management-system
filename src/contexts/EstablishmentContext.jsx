// src/contexts/EstablishmentContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchEstablishments } from '../services/api';

const EstablishmentContext = createContext();

export const useEstablishments = () => useContext(EstablishmentContext);

export const EstablishmentProvider = ({ children }) => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        const data = await fetchEstablishments();
        setEstablishments(data);
        console.log('Establishments loaded:', data);
      } catch (error) {
        console.error('Failed to load establishments', error);
      } finally {
        setLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  const refreshEstablishments = async () => {
    setLoading(true);
    try {
      const data = await fetchEstablishments();
      setEstablishments(data);
    } catch (error) {
      console.error('Failed to refresh establishments', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EstablishmentContext.Provider
      value={{
        establishments,
        loading,
        selectedEstablishment,
        setSelectedEstablishment,
        refreshEstablishments
      }}
    >
      {children}
    </EstablishmentContext.Provider>
  );
};