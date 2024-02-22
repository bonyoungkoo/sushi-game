import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100dvw', height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: `url('src/assets/bg.jpeg')`, backgroundSize: 'cover' }}>
      <img src={'./salmon.png'} style={{ width: 200, marginBottom: 100 }} />
      <button style={{ fontSize: 24, color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/main')}>Game Start</button>
    </div>
  );
};

export default Home;