# 🅿️ Parking Management System

Sistema de gestión de parqueos con mapa interactivo desarrollado en React.

## 🚀 Características

- 🗺️ Mapa interactivo con OpenStreetMap
- 🅿️ Íconos de parking personalizados
- 📊 Vista detallada de ocupación por pisos
- 🔍 Información en tiempo real de espacios disponibles
- 📱 Diseño responsivo

## 🛠️ Tecnologías Utilizadas

- **React** - Framework de JavaScript
- **Leaflet** - Librería de mapas interactivos
- **React-Leaflet** - Componentes de React para Leaflet
- **Font Awesome** - Íconos
- **CSS3** - Estilos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/julio93/parking-management-system.git

2. Navega al directorio del proyecto:
cd parking-management-system

3. Instala las dependencias:
npm install

4. Inicia el servidor de desarrollo:
npm start

5. Abre http://localhost:3000 en tu navegador.

## 🏗️ Estructura del Proyecto
src/
├── components/
│   ├── EstablishmentDetails.jsx          
│   ├── EstablishmentForm.jsx             
│   ├── Map.jsx                           
│   ├── Navbar.jsx                        
│   ├── ParkingSpots.jsx                  
│   ├── ParkingLayoutViewer.jsx           
│   ├── ParkingLayoutEditor.jsx           
│   ├── LayoutElementToolbar.jsx          
│   └── SpotDetailsModal.jsx             
├── contexts/
│   ├── EstablishmentContext.jsx          
│   └── LayoutContext.jsx                 
├── pages/
│   ├── MaintenanceView.jsx               
│   ├── MapView.jsx                       
│   └── LayoutManagementView.jsx          
├── services/
│   ├── api.js                            
│   ├── layoutService.js                  
│   └── parkingService.js                 
├── types/
│   ├── parking-layout.js                 
│   └── establishment.js                  
├── utils/
│   ├── layoutUtils.js                  
│   └── coordinateUtils.js               
├── styles/
│   ├── ParkingLayoutViewer.css          
│   ├── ParkingLayoutEditor.css          
│   ├── SpotDetailsModal.css          
│   └── LayoutManagement.css              
├── data/
│   └── db.json                           
├── App.jsx                               
├── index.js                             
└── index.css     
