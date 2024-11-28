import React from 'react';
import { useNavigate } from 'react-router-dom';

const RulesScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/target-drawing');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Regras do Jogo</h1>
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-purple-600 mb-4 text-center">Artista</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
						<li>Cria um desenho livre, utilizando sua criatividade.</li>
            <li>Define os sons que o desenho produzirá, levando em consideração a ordem dos traços (cada traço está vinculado a uma cor e um som específico).</li>
            <li>Aguarda os Imitadores tentarem replicar tanto o desenho quanto os sons escolhidos.</li>
            <li>Avalia os resultados produzidos pelos Imitadores, considerando o desenho e a sequência sonora.</li>
          </ul>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-purple-600 mb-4 text-center">Mestres da Imitação (4)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
						<li>Observam atentamente o desenho e o som do Artista para captar todos os detalhes.</li>
            <li>A tela é dividida em 4 partes e colaboram para recriar o desenho, cada um trabalhando em seu próprio quadrante. O tempo é limitado!</li>
            <li>Escolhem a mesma sequência de sons definida pelo Artista para o desenho. Memorizem a ordem com cuidado!</li>
            <li>Aguardam a avaliação final do Artista...</li>
          </ul>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        className="mt-6 bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
      >
        Confirmar
      </button>
    </div>
  );
};

export default RulesScreen;
