import { useNavigate } from "react-router";

export default function Connection() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div>
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
