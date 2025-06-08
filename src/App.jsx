import React, { useState } from 'react';
import DataLoader from './services/DataLoaderService';
import OverviewPage from './pages/overview_page';
function App() {
  const [data, setData] = useState(null);

  return (
    <>
      {!data && (
        <>
          <div>Carregant dades...</div>
          <DataLoader storageKey="bookingData" onDataLoaded={setData} />
        </>
      )}
      {data && <OverviewPage data={data} />}
    </>
  );
}

export default App;