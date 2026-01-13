import { Navigation } from './routes/Navigation';
import { AppProviders } from './context/AppProviders';
import { SideMenu } from './components/SideMenu/SideMenu';
import { BrowserRouter } from 'react-router';

import './App.css';
import { Modal } from './components/Modal/Modal';
import Toast from './components/Toast/Toast';

function App() {
  return (    
    <AppProviders>
      <BrowserRouter>
        <Modal/>    
        <Toast/>
        <div className="appContainer">
          <SideMenu />
          <main className="mainContent">
            <Navigation />
          </main>
        </div>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
