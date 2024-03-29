import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from './layout/TopNav';
import Board from './pages/board/Board';
import Post from './pages/board/Post';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserInfo from './pages/admin/UserInfo';
import ReportedPosts from './pages/admin/ReportedPosts';
import MyPage from './pages/user/MyPage';
import ProfileModify from './pages/user/ProfileModify';
import CreatePost from './pages/board/CreatePost';
import UpdatePost from './pages/board/UpdatePost';
import Logout from './pages/Logout';
import CreateTeam from "./pages/team/CreateTeam";
import TeamPage from "./pages/team/TeamPage";
import AddUserToTeam from "./pages/team/AddUserToTeam";
import DeleteUserFromTeam from "./pages/team/DeleteUserFromTeam";
import UpdateTeam from "./pages/team/UpdateTeam";
import Guestbook from './pages/guestbook/Guestbook';
import UserList from './pages/admin/UserList';
import OAuth from './pages/OAuth';
import ChatRoom from './pages/chat/ChatRoom';
import Chat from './pages/chat/Chat';

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <TopNav />
            <Routes>
                <Route path="/" Component={Board} />
                <Route path="/post/:postId" Component={Post} />
                <Route path="/write_post" Component={CreatePost} /> 
                <Route path="/create_team" Component={CreateTeam} />
                <Route path="/teams/:teamId" Component={TeamPage} />
                <Route path="/teams/:teamId/add_user" Component={AddUserToTeam} />
                <Route path="/teams/:teamId/kick_user" Component={DeleteUserFromTeam} />
                <Route path="/teams/:teamId/update" Component={UpdateTeam}/>
                <Route path="/modify_post/:postId" Component={UpdatePost} />
                <Route path='/admin/:param_nick' Component={UserInfo} />
                <Route path='/admin/user_list' Component={UserList} />
                <Route path='/admin/reported_posts' Component={ReportedPosts} />
                <Route path='/*' element={'찾을 수 없는 페이지 입니다.'} />
                <Route path='/signup' Component={Signup} />
                <Route path='/login' Component={Login} />
                <Route path='/logout' Component={Logout} />
                <Route path='/my_page' Component={MyPage} />
                <Route path='/profile_modify' Component={ProfileModify} />
                <Route path='/guestbooks/:userId' Component={Guestbook} /> 
                <Route path='/oauth' Component={OAuth} />
                <Route path='/chatroom_list' Component={ChatRoom} /> 
                <Route path='/chat/:userId' Component={Chat} /> 
            </Routes>
        </BrowserRouter>
    );
}

export default App;
