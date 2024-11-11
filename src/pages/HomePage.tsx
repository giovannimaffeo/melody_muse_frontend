import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/homeBackground.png';

const Home = () => {
  const navigate = useNavigate();

  const goToDrawingPage = () => {
    navigate('/drawing'); 
  };

  return (
    <div
      className='flex flex-col h-screen w-screen bg-cover bg-center'
      style={{
        backgroundImage: `url(${backgroundImage})`, 
      }}   
    >
      <button
        onClick={goToDrawingPage}
        className='mt-[75vh] self-center bg-purple-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-800 transition duration-200'
      >
        Iniciar Desenho
      </button>
    </div>
  );
};

export default Home;