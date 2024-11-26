import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { DrawingProvider } from './context/DrawingContext';

import HomePage from './pages/HomePage';
import TargetDrawingPage from './pages/TargetDrawingPage';
import CountdownPage from './pages/CountDownPage';
import CollaborativeDrawingPage from './pages/CollaborativeDrawingPage';
import EvaluationPage from './pages/EvaluationPage';

const App = () => {
  return (
    <Router>
      <DrawingProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/target-drawing' element={<TargetDrawingPage />} />
          <Route path='/countdown' element={<CountdownPage />} />
          <Route path='/collaborative-drawing' element={<CollaborativeDrawingPage />} />
          <Route path='/evaluation' element={<EvaluationPage />} />
        </Routes>
      </DrawingProvider>
    </Router>
  );
};

export default App;