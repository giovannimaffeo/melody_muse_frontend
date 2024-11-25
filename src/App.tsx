import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TargetDrawingPage from './pages/TargetDrawingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/target-drawing' element={<TargetDrawingPage />} />
      </Routes>
    </Router>
  );
};

export default App;