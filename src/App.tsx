import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from './TopNav';
import Home from './pages/Home';
import News from './pages/News';
import Admin from './pages/admin/Admin';
import ReportedPosts from './pages/admin/ReportedPosts';

function App() {
    return (
        <BrowserRouter>
            <TopNav/>
            <Routes>
                <Route path='/' Component={Home} />
                <Route path='/news' Component={News} />
                <Route path='/admin' Component={Admin} />
                <Route path='/admin/reported_posts' Component={ReportedPosts} />
                <Route path='/*' element={'찾을 수 없는 페이지 입니다.'} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
