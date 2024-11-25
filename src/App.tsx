import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TargetDrawingPage from './pages/TargetDrawingPage';
import CollaborativeDrawingPage from './pages/CollaborativeDrawingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/target-drawing' element={<TargetDrawingPage />} />
        <Route path='/collaborative-drawing' element={<CollaborativeDrawingPage />} />
      </Routes>
    </Router>
  );
};

export default App;