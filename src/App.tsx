import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { DrawingProvider } from './context/DrawingContext';

import HomePage from './pages/HomePage';
import TargetDrawingPage from './pages/TargetDrawingPage';
import CountdownPage from './pages/CutDownPage';
import CollaborativeDrawingPage from './pages/CollaborativeDrawingPage';

const App = () => {
  return (
    <Router>
      <DrawingProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/target-drawing' element={<TargetDrawingPage />} />
          <Route path='/cutdown' element={<CountdownPage />} />
          <Route path='/collaborative-drawing' element={<CollaborativeDrawingPage />} />
        </Routes>
      </DrawingProvider>
    </Router>
  );
};

export default App;