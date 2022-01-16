import './App.css';
import Header from './components/header/header'
import VideoCall from './video-call/video-call';
import Auth from './components/authentication/auth.jsx';

const profile = localStorage.getItem('profile');



function App() {
  return (
    <div className="App">
      <Header />
      {profile ? <VideoCall /> :  <Auth />}
    </div>
  );
}

export default App;
