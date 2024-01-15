import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import News from './pages/News';
import TopNav from './layout/TopNav';
import Request from './pages/Request';
import Board from './pages/board/Board';

function App() {
    return (
        <BrowserRouter>
            <TopNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<News />} />
                <Route path="/pc/lol" element={<Board />} />
                <Route path="/request" element={<Request />} />
                <Route path="/*" element={<div>찾을 수 없는 페이지 입니다.</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
