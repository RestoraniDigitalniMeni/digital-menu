import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getAllUsers,
  updateUser
} from "../../firebase/database";


function Users() {

  const {
    user,
    isSuperAdmin
  } = useAuth();


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);

  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("owner");

  const [savingEdit, setSavingEdit] = useState(false);


  /*
   * LOAD USERS
   */

  async function loadUsers() {

    try {

      setLoading(true);

      const data = await getAllUsers();

      setUsers(data);

    } catch (error) {

      console.error(
        "Greska pri ucitavanju korisnika:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    if (isSuperAdmin) {
      loadUsers();
    }

  }, [isSuperAdmin]);


  /*
   * OPEN EDIT
   */

  function openEditUser(selectedUser) {

    setEditingUser(selectedUser);

    setEditName(
      selectedUser.name || ""
    );

    setEditRole(
      selectedUser.role || "owner"
    );

  }


  /*
   * CLOSE EDIT
   */

  function closeEditUser() {

    setEditingUser(null);

    setEditName("");
    setEditRole("owner");

  }


  /*
   * UPDATE USER
   */

  async function handleUpdateUser(e) {

    e.preventDefault();

    if (
      !editingUser ||
      !editName.trim()
    ) {
      return;
    }


    try {

      setSavingEdit(true);


      await updateUser(
        editingUser.id,
        {
          name: editName.trim(),
          role: editRole
        }
      );


      closeEditUser();

      await loadUsers();


      alert(
        "Korisnik je uspjesno izmijenjen."
      );


    } catch (error) {

      console.error(error);

      alert(
        "Doslo je do greske prilikom izmjene korisnika."
      );

    } finally {

      setSavingEdit(false);

    }

  }


  /*
   * LOADING
   */

  if (loading) {

    return (

      <div className="restaurants-loading">

        Ucitavanje korisnika...

      </div>

    );

  }


  /*
   * SECURITY
   */

  if (!isSuperAdmin) {

    return (

      <div className="menu-admin-empty">

        <div className="empty-icon">
          🔒
        </div>

        <h1>
          Pristup odbijen
        </h1>

        <p>
          Samo superadmin moze upravljati korisnicima.
        </p>

        <Link
          to="/admin/dashboard"
          className="primary-button"
        >
          Nazad na dashboard
        </Link>

      </div>

    );

  }


  return (

    <div className="restaurants-page">


      {/* HEADER */}

      <header className="restaurants-header">

        <div>

          <Link
            to="/admin/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>


          <h1>
            Korisnici
          </h1>


          <p>
            Upravljajte korisnicima i njihovim ulogama.
          </p>

        </div>


      </header>



      <main className="restaurants-container">


        {/* USERS HEADER */}

        <section className="restaurants-list-section">


          <div className="section-title">

            <div>

              <h2>
                Svi korisnici
              </h2>

              <p>
                {users.length}{" "}
                {users.length === 1
                  ? "korisnik"
                  : "korisnika"}
              </p>

            </div>


            <button
              className="button-primary"
              onClick={() => {

                alert(
                  "Kreiranje Firebase korisnika cemo dodati kroz sigurnu server funkciju."
                );

              }}
            >
              + Dodaj korisnika
            </button>

          </div>



          {/* EMPTY */}

          {users.length === 0 ? (

            <div className="empty-restaurants">

              <div className="empty-icon">
                👤
              </div>

              <h3>
                Jos nema korisnika
              </h3>

              <p>
                Dodajte prvog korisnika sistema.
              </p>

            </div>

          ) : (


            /* USERS GRID */

            <div className="restaurants-grid">


              {users.map(
                currentUser => (

                  <div
                    key={currentUser.id}
                    className="restaurant-card"
                  >


                    {/* TOP */}

                    <div className="restaurant-card-top">


                      <div className="restaurant-avatar">

                        {currentUser.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          currentUser.email
                            ?.charAt(0)
                            .toUpperCase() ||
                          "?"}

                      </div>


                      <div>

                        <h3>

                          {currentUser.name ||
                            "Bez imena"}

                        </h3>


                        <span>

                          {currentUser.email ||
                            "Nema emaila"}

                        </span>

                      </div>


                    </div>



                    {/* INFO */}

                    <div className="restaurant-card-info">


                      <div>

                        <small>
                          Email
                        </small>

                        <p>
                          {currentUser.email ||
                            "-"}
                        </p>

                      </div>


                      <div>

                        <small>
                          Uloga
                        </small>

                        <p>

                          {currentUser.role ===
                          "superadmin"
                            ? "Superadmin"
                            : currentUser.role ===
                              "owner"
                              ? "Vlasnik"
                              : "Korisnik"}

                        </p>

                      </div>


                      <div>

                        <small>
                          Firebase UID
                        </small>

                        <p
                          style={{
                            wordBreak:
                              "break-all"
                          }}
                        >
                          {currentUser.id}
                        </p>

                      </div>


                    </div>



                    {/* ACTIONS */}

                    <div className="restaurant-card-actions">


                      <button
                        className="button-primary"
                        onClick={() =>
                          openEditUser(
                            currentUser
                          )
                        }
                      >
                        Uredi korisnika
                      </button>


                    </div>


                  </div>

                )
              )}

            </div>

          )}

        </section>


      </main>



      {/* EDIT MODAL */}

      {editingUser && (

        <div
          className="modal-overlay"
          onMouseDown={e => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeEditUser();

            }

          }}
        >


          <div className="modal-card">


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  Uredi korisnika
                </h2>

                <p>
                  Izmijeni podatke korisnika.
                </p>

              </div>


              <button
                className="modal-close"
                onClick={
                  closeEditUser
                }
              >
                ×
              </button>

            </div>



            {/* FORM */}

            <form
              onSubmit={
                handleUpdateUser
              }
            >


              <div className="form-grid">


                {/* NAME */}

                <div className="form-group form-full">

                  <label>
                    Ime korisnika
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={e =>
                      setEditName(
                        e.target.value
                      )
                    }
                    placeholder="Ime i prezime"
                    required
                  />

                </div>



                {/* EMAIL */}

                <div className="form-group form-full">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      editingUser.email ||
                      ""
                    }
                    disabled
                  />

                  <span>
                    Email se ne mijenja ovdje.
                  </span>

                </div>



                {/* ROLE */}

                <div className="form-group form-full">

                  <label>
                    Uloga
                  </label>

                  <select
                    value={editRole}
                    onChange={e =>
                      setEditRole(
                        e.target.value
                      )
                    }
                  >

                    <option value="owner">
                      Vlasnik
                    </option>

                    <option value="user">
                      Korisnik
                    </option>

                    <option value="superadmin">
                      Superadmin
                    </option>

                  </select>

                  <span>
                    Uloga određuje pristup sistemu.
                  </span>

                </div>



                {/* UID */}

                <div className="form-group form-full">

                  <label>
                    Firebase UID
                  </label>

                  <input
                    type="text"
                    value={
                      editingUser.id
                    }
                    disabled
                  />

                </div>


              </div>



              {/* ACTIONS */}

              <div className="modal-actions">


                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    closeEditUser
                  }
                >
                  Otkaži
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    savingEdit
                  }
                >

                  {savingEdit
                    ? "Čuvanje..."
                    : "Sačuvaj izmjene"}

                </button>


              </div>


            </form>


          </div>

        </div>

      )}


    </div>

  );

}


export default Users;