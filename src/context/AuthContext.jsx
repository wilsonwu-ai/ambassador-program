import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock staff credentials - in production, this would be handled by a backend
const STAFF_CREDENTIALS = [
  { email: "wilson.wu@gosnappy.io", password: "snappy2026", name: "Wilson Wu", role: "admin" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("snappy_staff_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const staffMember = STAFF_CREDENTIALS.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    if (staffMember) {
      const userData = {
        email: staffMember.email,
        name: staffMember.name,
        role: staffMember.role,
      };
      setUser(userData);
      localStorage.setItem("snappy_staff_user", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("snappy_staff_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
