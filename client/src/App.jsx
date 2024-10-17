import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/registration/Login.jsx";
import Signup from "./components/registration/Signup.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { ChoosePage } from "./components/registration/Choose.jsx";
import { Layout } from "./components/Layout.jsx";
import { Welcome } from "./components/Welcome.jsx";
import { Profile } from "./components/profile/Profile.jsx";
import { ChatRoom } from "./components/chats/ChatRoom.jsx";
import { RoomProvider } from "./contexts/RoomContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path=":roomId" element={<ChatRoom />} />
              </Route>
              <Route path="/choose" element={<ChoosePage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
