"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  setStoredUser,
  isOnboardingDone,
  getProfile,
  setProfile,
  setOnboardingDone as setOnboardingDoneStorage,
  type StoredUser,
  type UserProfile,
} from "@/lib/user-store";

type AuthState = {
  user: StoredUser | null;
  profile: UserProfile | null;
  onboardingDone: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string, name: string) => void;
  signup: (email: string, password: string, name: string) => void;
  logout: () => void;
  setProfileData: (profile: UserProfile) => void;
  setOnboardingDone: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    onboardingDone: false,
    isLoading: true,
  });

  function refresh() {
    setState({
      user: getStoredUser(),
      profile: getProfile(),
      onboardingDone: isOnboardingDone(),
      isLoading: false,
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  function login(email: string, _password: string, name: string) {
    const user: StoredUser = {
      id: "u-" + Date.now(),
      email,
      name: name || email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);
    refresh();
  }

  function signup(email: string, _password: string, name: string) {
    login(email, "", name);
  }

  function logout() {
    setStoredUser(null);
    refresh();
  }

  function setProfileData(profile: UserProfile) {
    setProfile(profile);
    refresh();
  }

  function setOnboardingDoneFlag() {
    setOnboardingDoneStorage();
    refresh();
  }

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    setProfileData,
    setOnboardingDone: setOnboardingDoneFlag,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
