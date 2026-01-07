import { Navigation } from './routes/Navigation';
import { AppProviders } from './context/AppProviders';

import './App.css';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <div className="App">
      <AppProviders>
          <BrowserRouter>
            <Navigation/>
          </BrowserRouter>
      </AppProviders>
    </div>
  );
}

export default App;
