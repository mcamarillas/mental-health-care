import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DataLoader from './services/DataLoaderService';
import OverviewPage from './pages/overview_page';
import ExplorationPage from './pages/exploration_page';
import DropdownMenu from './components/dropdown_component';

function App() {
  const [data, setData] = useState(null);

  if (!data) {
    return (
      <>
        <div>Carregant dades...</div>
        <DataLoader storageKey="bookingData" onDataLoaded={setData} />
      </>
    );
  }

  return (
    <Router>
      <DropdownMenu />
      <Routes>
        <Route path="/mental-health-care/overview" element={<OverviewPage data={data} />} />
        <Route path="/mental-health-care/healthy-habits" element={<ExplorationPage data={data} />} />
        <Route path="*" element={<Navigate to="/mental-health-care/overview" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
