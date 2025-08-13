"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cookieUtils } from "@/app/utils/cookies";
import CookieBanner from "../CookieBanner";



import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineGoogle,
  AiFillFacebook,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
} from "../../db/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const router = useRouter();

  const isLogin = mode === "login";

  const handleUserProfile = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        username: user.displayName || "",
        email: user.email || "",
        photoBase64: "",
        academicContext: "",
        createdAt: serverTimestamp(),
      });
    }
  };

  // FUNCIÓN PARA GUARDAR DATOS EN COOKIES DESPUÉS DEL LOGIN
  const saveUserToCookies = async (user: User, idToken: string) => {
    // Solo guardar en cookies si el usuario las aceptó
    if (cookieUtils.areCookiesAccepted()) {
      // Guardar token de autenticación
      cookieUtils.setAuthToken(idToken, rememberMe);
      
      // Guardar datos de sesión del usuario
      cookieUtils.setUserSession({
        userId: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'Usuario',
        email: user.email || undefined
      });

      console.log('✅ Datos de usuario guardados en cookies');
    } else {
      console.log('ℹ️ Cookies no aceptadas, usando solo Firebase Auth');
    }
  };

  useEffect(() => {
    // Verificar autenticación tanto en Firebase como en cookies
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/chat");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLogin && password !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
      }

      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleUserProfile(userCredential.user);
      }

      // OBTENER TOKEN Y GUARDAR EN COOKIES
      const idToken = await userCredential.user.getIdToken();
      await saveUserToCookies(userCredential.user, idToken);

      router.push("/chat");
    } catch (error: unknown) {
      console.error('Error de autenticación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(errorMessage);
    }
  };

  const handleGooglePopup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserProfile(result.user);
      
      // GUARDAR EN COOKIES
      const idToken = await result.user.getIdToken();
      await saveUserToCookies(result.user, idToken);
      
      router.push("/chat");
    } catch (error: unknown) {
      console.error('Error con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(errorMessage);
    }
  };

  const handleFacebookPopup = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleUserProfile(result.user);
      
      // GUARDAR EN COOKIES
      const idToken = await result.user.getIdToken();
      await saveUserToCookies(result.user, idToken);
      
      router.push("/chat");
    } catch (error: unknown) {
      console.error('Error con Facebook:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(errorMessage);
    }
  };

  // MANEJAR ACEPTACIÓN DE COOKIES
  const handleCookiesAccepted = () => {
    console.log('🍪 Usuario aceptó las cookies desde AuthPage');
  };

  const handleCookiesRejected = () => {
    console.log('❌ Usuario rechazó las cookies');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/*BANNER DE COOKIES */}
      <CookieBanner 
        onAccept={handleCookiesAccepted}
        onReject={handleCookiesRejected}
      />

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-300 hover:text-amber-300 transition text-sm sm:text-base"
        >
          <AiOutlineArrowLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
          <span className="ml-1 sm:ml-2">Back</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-xl sm:rounded-2xl overflow-hidden relative z-10 min-h-[500px] sm:min-h-[600px] shadow-xl mx-4">
        {/* Card dorada */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-300 via-amber-400 to-amber-200 flex flex-col justify-center items-center p-3 sm:p-4 lg:p-6 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] text-white">
          <div className="z-10 w-full text-center flex flex-row justify-center gap-6 lg:gap-12">
            {!isLogin ? (
              <h2 className="text-3xl text-gray-900">Sign Up</h2>
            ) : (
              <Link
                href="/sign-up"
                className="text-3xl text-amber-100 hover:text-white hover:underline transition"
              >
                Sign Up
              </Link>
            )}
            {isLogin ? (
              <h2 className="text-3xl text-gray-900">Login</h2>
            ) : (
              <Link
                href="/log-in"
                className="text-3xl text-amber-100 hover:text-white hover:underline transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Card transparente */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 min-h-[500px] sm:min-h-[600px] flex flex-col justify-center bg-white/6 backdrop-blur-2xl border border-white/30 shadow-2xl text-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl text-amber-300">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              {isLogin
                ? "Please login to continue"
                : "Please sign up to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4 sm:mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineMail size={18} className="sm:w-5 sm:h-5" />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 py-2.5 sm:py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative mb-4 sm:mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineLock size={18} className="sm:w-5 sm:h-5" />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 py-2.5 sm:py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="relative mb-4 sm:mb-6">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <AiOutlineLock size={18} className="sm:w-5 sm:h-5" />
                </span>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 py-2.5 sm:py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm sm:text-base"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            )}

            {/* ✅ CHECKBOX PARA RECORDAR SESIÓN */}
            {isLogin && (
              <div className="flex items-center mb-4 sm:mb-6">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 text-amber-500 bg-black/30 border-amber-400 rounded focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="rememberMe" className="text-xs sm:text-sm text-gray-400">
                  Recordar mi sesión (30 días)
                </label>
              </div>
            )}

            <div className="flex justify-center sm:justify-end text-sm mt-4 mb-4 sm:mb-6">
              <button
                type="submit"
                className="bg-amber-400 text-black py-2.5 sm:py-2 px-8 sm:px-6 rounded-full shadow-lg hover:bg-amber-300 transition font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                {isLogin ? "LOGIN" : "SIGN UP"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">Or continue with</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
              <button
                onClick={handleGooglePopup}
                className="flex items-center justify-center gap-2 text-white hover:text-amber-200 transition py-2 px-4 rounded-lg border border-gray-600 hover:border-amber-400 bg-black/20 text-sm sm:text-base"
              >
                <AiOutlineGoogle size={20} className="sm:w-6 sm:h-6 text-red-400" />
                Google
              </button>
              <button
                onClick={handleFacebookPopup}
                className="flex items-center justify-center gap-2 text-white hover:text-amber-200 transition py-2 px-4 rounded-lg border border-gray-600 hover:border-amber-400 bg-black/20 text-sm sm:text-base"
              >
                <AiFillFacebook size={20} className="sm:w-6 sm:h-6 text-blue-400" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;