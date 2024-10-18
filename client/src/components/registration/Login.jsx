import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../../utils/firebase";
import { signIn, signInWithGoogle } from "../../utils/authentication";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const { saveUserInfo } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("email is necessary");
      return;
    }
    if (!password.trim()) {
      setpasswordError("password is necessary");
      return;
    } else {
      const { message, data, success } = await signIn({
        email: email,
        password: password,
      });

      if (success) {
        saveUserInfo(data, (role) => {
          if (!role || role === "NO_ROLE") {
            navigate("/choose");
          } else {
            navigate("/");
          }
        });
      } else {
        setLoginError(message);
      }

      setEmail("");
      setPassword("");
      setEmailError("");
      setpasswordError("");
    }
  };

  // incomplete
  const handleGoogleSignin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const res = await signInWithPopup(auth, provider);
    const reqBody = {
      name: res.user.displayName,
      email: res.user.email,
      profilePicture: res.user.photoURL,
    };

    const { message, data, success } = signInWithGoogle(reqBody);

    if (success) {
      saveUserInfo(data, (newRole) => {
        if (!newRole || newRole === "NO_ROLE") {
          navigate("/choose");
        } else {
          navigate("/");
        }
      });
    } else {
      setLoginError(message);
    }

    setEmail("");
    setPassword("");
    setEmailError("");
    setpasswordError("");
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          <img src="sideVector.svg" />
        </div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Sign in to PeerPod
          </h1>
          <div>
            <div className="w-full mb-2 lg:mb-0">
              <button
                onClick={handleGoogleSignin}
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <img className="" src="google.svg" alt="google" /> Sign Up with
                Google{" "}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>or with email</p>
          </div>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                name="email"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              {emailError && (
                <p className="text-xs mt-1 text-red-600">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              {passwordError && (
                <p className="text-xs mt-1 text-red-600">{passwordError}</p>
              )}
            </div>
            <div>
              <button
                onClick={handleEmailLogin}
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none transition-colors duration-300"
              >
                Sign In
              </button>
              {loginError && (
                <p className="text-xs mt-1 text-red-600">{loginError}</p>
              )}
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-black hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
