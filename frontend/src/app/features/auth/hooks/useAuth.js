import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api.js";
import { clearAuthState, setUser, setError, setLoading } from "../auth.slice.js";
import { resetChatState } from "../../chat/chat.slice.js";
import { disconnectSocketConnection } from "../../chat/services/chat.socket.js";
const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      await register({ email, username, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "failed to login"));
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetme() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "failed to fetch user"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await logout();
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "failed to logout"));
    } finally {
      disconnectSocketConnection();
      dispatch(clearAuthState());
      dispatch(resetChatState());
    }
  }

  return { handleGetme, handleLogin, handleRegister, handleLogout };
};

export default useAuth;
