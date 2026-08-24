import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {

  const {
    user,
    logout,
    isSuperAdmin
  } = useAuth();

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
        >
          Odjavi se
        </button>

      </header>


      <main className="dashboard-content">
 


        {/* RESTORANI */}

        <div className="dashboard-card">

       

        {isSuperAdmin ? (
  <>
    <h2>Restorani</h2>
    <p>
      Upravljajte svim restoranima,
      podacima i vlasnicima.
    </p>
  </>
) : (
  <>
    <h2>Moj restoran</h2>
    <p>
      Upravljajte podacima svog restorana
      i digitalnim menijem.
    </p>
  </>
)}

          <Link to="/admin/restaurants">
  {isSuperAdmin
    ? "Upravljaj svim restoranima"
    : "Upravljaj svojim restoranom"}
</Link>

        </div>


        {/* KORISNICI - SAMO SUPERADMIN */}

        {isSuperAdmin && (

          <div className="dashboard-card">

            <h2>
              Korisnici
            </h2>

            <p>
              Dodajte i uređujte korisnike
              sistema.
            </p>

            <Link to="/admin/users">
              Upravljaj korisnicima
            </Link>

          </div>

        )}

      </main>

    </div>
  );
}

export default Dashboard;