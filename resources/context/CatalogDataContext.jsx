import React, { createContext, useState, useContext } from 'react';

const CatalogDataContext = createContext();

export const CatalogDataProvider = ({ children }) => {
  const [lastUpdatedMap, setLastUpdatedMap] = useState({});
  const [translationsLastUpdatedMap, setTranslationsLastUpdatedMap] = useState({});

  const updateLastUpdated = (type, value) => {
    setLastUpdatedMap((prev) => ({ ...prev, [type]: value }));
  };

  const updateTranslationsLastUpdated = (type, value) => {
    setTranslationsLastUpdatedMap((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <CatalogDataContext.Provider
      value={{
        lastUpdatedMap,
        translationsLastUpdatedMap,
        updateLastUpdated,
        updateTranslationsLastUpdated,
      }}
    >
      {children}
    </CatalogDataContext.Provider>
  );
};

export const useCatalogDataContext = () => useContext(CatalogDataContext);