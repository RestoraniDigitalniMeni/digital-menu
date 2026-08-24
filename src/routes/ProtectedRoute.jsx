import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function ProtectedRoute({
  children,
  allowedRoles
}) {

  const {
    user,
    profile,
    loading
  } = useAuth();


  if (loading) {

    return (
      <div className="loading">
        Ucitavanje...
      </div>
    );

  }


  /*
   * Nije prijavljen
   */

  if (!user) {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );

  }


  /*
   * Firebase korisnik postoji,
   * ali profil jos nije ucitan
   */

  if (!profile) {

    return (
      <div className="loading">
        Ucitavanje profila...
      </div>
    );

  }


  /*
   * Provjera role
   */

  if (
    allowedRoles &&
    !allowedRoles.includes(
      profile.role
    )
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;

}


export default ProtectedRoute;