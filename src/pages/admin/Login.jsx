import {
  useEffect,
  useState
} from "react";
import {
  getRestaurantByOwnerId
} from "../../firebase/database";
import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";


function Login() {

  const navigate = useNavigate();

  const {
  login,
  user,
  profile,
  loading: authLoading
} = useAuth();


  const [
    email,
    setEmail
  ] = useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);







useEffect(() => {

  async function redirectUser() {

    if (
      authLoading ||
      !user ||
      !profile
    ) {
      return;
    }


 if (
  profile.role === "superadmin" ||
  profile.role === "owner" ||
  profile.role === "admin"
) {

  navigate(
    "/admin/dashboard",
    { replace: true }
  );

  return;
}


if (profile.role === "owner") {

  navigate(
    "/admin/dashboard",
    { replace: true }
  );

  return;
}

    setError(
      "Ovaj nalog nema pristup administraciji."
    );

  }


  redirectUser();

}, [
  authLoading,
  user,
  profile,
  navigate
]);


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      await login(
        email,
        password
      );

    } catch (error) {

      console.error(error);

      setError(
        "Pogresan email ili lozinka."
      );

    } finally {

      setLoading(false);

    }

  }


  if (
    authLoading ||
    (user && profile)
  ) {

    return (
      <div className="admin-login">

        <div className="login-card">

          <p>
            Ucitavanje...
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="admin-login">

      <form
        className="login-card"
        onSubmit={handleSubmit}
      >

        <h1>
          Digitalni meni
        </h1>

        <p>
          Prijavite se u administraciju
        </p>


        {error && (

          <div className="error">
            {error}
          </div>

        )}


        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={
            e => setEmail(e.target.value)
          }
          required
        />


        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={
            e => setPassword(e.target.value)
          }
          required
        />


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Prijava..."
            : "Prijavi se"}

        </button>

      </form>

    </div>

  );

}


export default Login;