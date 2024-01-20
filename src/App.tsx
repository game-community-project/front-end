import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import TopNav from './layout/TopNav';
import Board from './pages/board/Board';
import Post from './pages/board/Post';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Admin from './pages/admin/Admin';
import ReportedPosts from './pages/admin/ReportedPosts';
import MyPage from './pages/user/MyPage';
import ProfileModify from './pages/user/ProfileModify';
import CreatePost from './pages/board/CreatePost';
import UpdatePost from './pages/board/UpdatePost';
import Logout from './pages/Logout';

function App() {
    return (
        <BrowserRouter>
            <TopNav />
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/pc/lol" element={<Board gameType="PC_GAME" gameName="LEAGUE_OF_LEGEND" />} />
                <Route path="/pc/val" element={<Board gameType="PC_GAME" gameName="VALORANT" />} />
                <Route path="/console/zelda" element={<Board gameType="CONSOLE_GAME" gameName="THE_LEGEND_OF_ZELDA_TEARS_OF_THE_KINGDOM" />} />
                <Route path="/mobile/brawl_stars" element={<Board gameType="MOBILE_GAME" gameName="BRAWL_STARS" />} />
                <Route path="/request" element={<Board gameType="EMPTY_TYPE" gameName="EMPTY_NAME" />} />
                <Route path="/team_promotion" element={<Board gameType="EMPTY_TYPE" gameName="EMPTY_NAME" />} />
                <Route path="/:gameType/:gameName/:postId" Component={Post} />
                <Route path="/write_post" Component={CreatePost} />
                <Route path="/modify_post/:postId" Component={UpdatePost} />
                <Route path='/admin' Component={Admin} />
                <Route path='/admin/reported_posts' Component={ReportedPosts} />
                <Route path='/*' element={'찾을 수 없는 페이지 입니다.'} />
                <Route path='/signup' Component={Signup} />
                <Route path='/login' Component={Login} />
                <Route path='/logout' Component={Logout} />
                <Route path='/my_page' Component={MyPage} />
                <Route path='/profile_modify' Component={ProfileModify} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
