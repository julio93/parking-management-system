import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EstablishmentProvider } from './contexts/EstablishmentContext';
import { LayoutProvider } from './contexts/LayoutContext';
import Navbar from './components/Navbar';
import MapView from './pages/MapView';
import MaintenanceView from './pages/MaintenanceView';
import LayoutManagementView from './pages/LayoutManagementView';

function App() {
  return (
    <EstablishmentProvider>
      <LayoutProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<MapView />} />
              <Route path="/maintenance" element={<MaintenanceView />} />
              <Route path="/layout-management" element={<LayoutManagementView />} />
            </Routes>
          </div>
        </Router>
      </LayoutProvider>
    </EstablishmentProvider>
  );
}

export default App;