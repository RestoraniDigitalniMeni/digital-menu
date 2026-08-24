import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Home() {

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
   * Niko nije prijavljen
   */

  if (!user) {

    return (

      <div className="home-page">

        <div className="home-card">

          <h1>
            Digitalni meni
          </h1>

          <p>
            Sistem za upravljanje
            digitalnim menijima.
          </p>

          <a
            href="/admin"
            className="home-button"
          >
            Administracija
          </a>

        </div>

      </div>

    );

  }


  /*
   * SUPERADMIN
   */

 if (
  profile?.role === "superadmin" ||
  profile?.role === "owner" ||
  profile?.role === "admin"
) {

  return (
    <Navigate
      to="/admin/dashboard"
      replace
    />
  );

}


  /*
   * OWNER
   */

  if (
    profile?.role ===
    "owner"
  ) {

    return (
      <Navigate
        to="/admin/menu"
        replace
      />
    );

  }


  /*
   * ADMIN
   */

  if (
    profile?.role ===
    "admin"
  ) {

    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );

  }


  /*
   * USER
   */

  return (

    <div className="home-page">

      <div className="home-card">

        <h1>
          Digitalni meni
        </h1>

        <p>
          Dobrodosli.
        </p>

      </div>

    </div>

  );

}


export default Home;