import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import News from './pages/News';
import TopNav from './layout/TopNav';
import Request from './pages/Request';
import Board from './pages/board/Board';
import Post from './pages/board/Post';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Admin from './pages/admin/Admin';
import ReportedPosts from './pages/admin/ReportedPosts';
import MyPage from './pages/user/MyPage';
import ProfileModify from './pages/user/ProfileModify';

function App() {
    return (
        <BrowserRouter>
            <TopNav />
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/news" Component={News} />
                <Route path="/pc/lol" Component={Board} />
                <Route path="/api/posts/:postId" Component={Post} />
                <Route path="/request" Component={Request} />
                <Route path='/admin' Component={Admin} />
                <Route path='/admin/reported_posts' Component={ReportedPosts} />
                <Route path='/*' element={'찾을 수 없는 페이지 입니다.'} />
                <Route path='/signup' Component={Signup} />
                <Route path='/login' Component={Login} />
                <Route path='/my_page' Component={MyPage} />
                <Route path='/profile_modify' Component={ProfileModify} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
