import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Router,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store.js";
import App from "./App.jsx";
import { Home, 
  AuthPage, 
  Discussion, 
  Developers, 
  PostDetail, 
  WriteExperience, 
  Profile, 
  SavedPosts, 
  MyPosts,
  VerifyEmail,
  ForgotPassword,
  ResetPassword
} from "./pages/index.js"
import ProtectedRoute from "./components/common/ProtectedRoute.jsx"

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<AuthPage type="login" />} />
      <Route path="register" element={<AuthPage type="register" />} />
      <Route path="discussion" element={<Discussion />} />
      <Route path="developers" element={<Developers />} />
      <Route path="posts/:id" element={<PostDetail />} />
      <Route path="user/:userId" element={<Profile />} />
      <Route path="saved" element={<SavedPosts />} />
      <Route path="my-posts" element={<MyPosts />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="write"
        element={
          <ProtectedRoute>
            <WriteExperience />
          </ProtectedRoute>
        }
      />

      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
);
