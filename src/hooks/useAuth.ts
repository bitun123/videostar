import { registerUser, loginUser } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useAuthStore();
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await registerUser(name, email, password);
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginUser(email, password);

      setUser(response);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    register,
    login,
  };
};
