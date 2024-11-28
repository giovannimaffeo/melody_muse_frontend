import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { DrawingProvider } from './context/DrawingContext';

import HomePage from './pages/HomePage';
import RulesPage from './pages/RulesPage';
import TargetDrawingPage from './pages/TargetDrawingPage';
import TargetSoundPage from './pages/TargetSoundPage';
import CountdownPage from './pages/CountDownPage';
import CollaborativeDrawingPage from './pages/CollaborativeDrawingPage';
import CollaborativeSoundPage from './pages/CollaborativeSoundPage';
import EvaluationPage from './pages/EvaluationPage';

const App = () => {
  return (
    <Router>
      <DrawingProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/rules' element={<RulesPage />} />
          <Route path='/target-drawing' element={<TargetDrawingPage />} />
          <Route path='/target-sound' element={<TargetSoundPage />} />
          <Route path='/countdown' element={<CountdownPage />} />
          <Route path='/collaborative-drawing' element={<CollaborativeDrawingPage />} />
          <Route path='/collaborative-sound' element={<CollaborativeSoundPage />} />
          <Route path='/evaluation' element={<EvaluationPage />} />
        </Routes>
      </DrawingProvider>
    </Router>
  );
};

export default App;