import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SuperAdminDashboard() {

  const { profile, logout } = useAuth();

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h1>Superadmin</h1>

          <p>
            Dobrodosao, {profile?.email}
          </p>
        </div>

        <button onClick={logout}>
          Odjavi se
        </button>

      </header>


      <main className="admin-content">

        <section className="admin-section">

          <h2>Upravljanje sistemom</h2>

          <p>
            Odavde mozes upravljati svim
            restoranima i korisnicima.
          </p>

        </section>


        <section className="admin-section">

          <h2>Restorani</h2>

          <Link
            to="/admin/restaurants"
            className="admin-button"
          >
            Upravljaj restoranima
          </Link>

        </section>


        <section className="admin-section">

          <h2>Meni</h2>

          <Link
            to="/admin/menu"
            className="admin-button"
          >
            Upravljaj menijem
          </Link>

        </section>

      </main>

    </div>
  );
}

export default SuperAdminDashboard;