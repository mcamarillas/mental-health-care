import React, { useState, useEffect } from 'react';

const REFRESH_DATA = true;
const DEV = false;
export default function CSVDataLoader({storageKey, onDataLoaded}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!storageKey || !onDataLoaded) return;

    loadJSON(storageKey, setData, onDataLoaded)
  }, [storageKey, onDataLoaded]);

  return null;
}

function loadJSON(storageKey, setData, onDataLoaded) {
  const storedData = localStorage.getItem(storageKey);

  if (storedData && !REFRESH_DATA) {
    const parsedData = JSON.parse(storedData);
    setData(parsedData);
    onDataLoaded(parsedData);
  } else {
    let jsonPath;
    switch (storageKey) {
      case 'bookingData':
        jsonPath = (DEV ? '' : '/mental-health-care') + '/data/mental-health-data.json';
        break;
      default:
        console.error(`Error: No hi ha fitxer per a la clau: ${storageKey}`);
        return;
    }

    fetch(jsonPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        onDataLoaded(jsonData);
        localStorage.setItem(storageKey, JSON.stringify(jsonData));
      })
      .catch((error) => {
        console.error('Error carregant JSON:', error);
      });
  }
}