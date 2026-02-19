import { Navigation } from './routes/Navigation';
import { AppProviders } from './context/AppProviders';
import { SideMenu } from './components/SideMenu/SideMenu';
import { BrowserRouter } from 'react-router';

import './App.css';
import { Modal } from './components/Modal/Modal';
import Toast from './components/Toast/Toast';
import { HeaderComponent } from './components/Header/HeaderComponent';

function App() {
  return (    
    <AppProviders>
      <BrowserRouter basename={process.env.REACT_APP_BASE_NAME || ''}>
        <Modal/>    
        <Toast/>
        <div className="appContainer">
          <HeaderComponent />
          <main className="mainContent">
            <SideMenu />
            <Navigation />
          </main>
        </div>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
