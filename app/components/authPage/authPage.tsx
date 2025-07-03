"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineMail, AiOutlineLock, AiOutlineGoogle, AiFillFacebook, AiOutlineArrowLeft, } from "react-icons/ai";
import { auth, db, googleProvider, facebookProvider, } from "../../db/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, onAuthStateChanged, User, } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const isLogin = mode === "login";

  const handleUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          academicContext: "",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error creando perfil en Firestore:", error);
      alert("Error creando perfil, intenta de nuevo.");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await handleUserProfile(result.user);
          router.push("/chat");
          return;
        }
      } catch (error) {
        console.error("Error en redirect result:", error);
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        if (password !== confirm) {
          alert("Passwords do not match");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await handleUserProfile(userCredential.user);
        router.push("/chat");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        await handleUserProfile(userCredential.user);
        router.push("/chat");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleFacebookRedirect = async () => {
    try {
      await signInWithRedirect(auth, facebookProvider);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-300 hover:text-amber-300 transition"
        >
          <AiOutlineArrowLeft size={22} />
          <span className="ml-2">Back</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden relative z-10 min-h-[600px] shadow-xl">
        {/* Card dorada */}
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-300 via-amber-400 to-amber-200 bg-opacity-70 flex flex-col justify-center items-center p-8 md:p-12 min-h-[600px] text-white">
          <div className="z-10 w-full max-w-xs text-center md:text-right flex flex-col md:flex-row justify-center md:justify-end gap-6 md:gap-12">
            {!isLogin ? (
              <h2 className="text-3xl text-gray-900 cursor-default">Sign Up</h2>
            ) : (
              <Link
                href="/sign-up"
                className="text-3xl text-amber-100 hover:text-white hover:underline transition"
              >
                Sign Up
              </Link>
            )}
            {isLogin ? (
              <h2 className="text-3xl text-gray-900 cursor-default">Login</h2>
            ) : (
              <Link
                href="/log-in"
                className="text-3xl text-amber-100 hover:text-white hover:underline transition"
              >
                Login
              </Link>
            )}
          </div>
          <div className="absolute inset-0 z-0">
            <div className="absolute w-[150%] h-[150%] bg-amber-400 rounded-full blur-3xl top-[-30%] left-[-30%] opacity-15"></div>
            <div className="absolute w-[120%] h-[120%] bg-amber-300 rotate-45 blur-2xl bottom-[-20%] right-[-20%] opacity-10"></div>
          </div>
        </div>

        {/* Card transparente */}
        <div className="w-full md:w-1/2 p-8 md:p-12 min-h-[600px] flex flex-col justify-center bg-white/6 backdrop-blur-2xl border border-white/30 shadow-2xl text-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-amber-300">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              {isLogin
                ? "Please login to continue"
                : "Please sign up to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineMail size={20} />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineLock size={20} />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {!isLogin && (
              <div className="relative mb-6">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <AiOutlineLock size={20} />
                </span>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 py-3 border border-amber-400 rounded-md bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <div className="flex justify-end text-sm mt-4 mb-6">
              <button
                type="submit"
                className="bg-amber-400 text-gray-800 py-2 px-6 rounded-full shadow-lg hover:bg-amber-200 transition"
              >
                {isLogin ? "LOGIN" : "SIGN UP"}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Or continue with</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleGoogleRedirect}
                className="flex items-center gap-2 text-white hover:text-amber-200 transition"
                aria-label="Sign in with Google"
              >
                <AiOutlineGoogle size={24} className="text-red-400" />
                Google
              </button>
              <button
                onClick={handleFacebookRedirect}
                className="flex items-center gap-2 text-white hover:text-amber-200 transition"
                aria-label="Sign in with Facebook"
              >
                <AiFillFacebook size={24} className="text-blue-400" />
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
