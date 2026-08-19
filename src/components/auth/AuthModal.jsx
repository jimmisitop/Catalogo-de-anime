import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-container rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.5)] w-full max-w-md border border-outline-variant/30 animate-fade-in overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-variant/30"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Form */}
        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => setIsLogin(false)}
            onSuccess={onClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setIsLogin(true)}
            onSuccess={onClose}
          />
        )}
      </div>
    </div>
  );
}
