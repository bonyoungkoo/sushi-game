import Main from './pages/Main'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter basename='/sushi-game'>
        <Routes>
          <Route path="/" element={<Main />} />
          {/* <Route path="/main" element={<Main />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
