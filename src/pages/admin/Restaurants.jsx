import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  getAllRestaurants,
  getRestaurantByOwnerId,
  createRestaurant,
  updateRestaurant,
  getAllUsers
} from "../../firebase/database";

function Restaurants() {
const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

 const [name, setName] = useState("");
const [restaurantId, setRestaurantId] = useState("");
const [ownerId, setOwnerId] = useState("");
const [description, setDescription] = useState("");
const [logo, setLogo] = useState("");

const [menuDesign, setMenuDesign] = useState("classic");

const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [email, setEmail] = useState("");
const [instagram, setInstagram] = useState("");

const [loading, setLoading] = useState(true);
const [creating, setCreating] = useState(false);

const [editingRestaurant, setEditingRestaurant] = useState(null);
const [editName, setEditName] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editLogo, setEditLogo] = useState("");
const [editPhone, setEditPhone] = useState("");
const [editAddress, setEditAddress] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editInstagram, setEditInstagram] = useState("");
const [savingEdit, setSavingEdit] = useState(false);

const [editMenuDesign, setEditMenuDesign] = useState("classic");
  
  
const {
  user,
  loading: authLoading,
  isSuperAdmin,
  isOwner
} = useAuth();
  


async function loadUsers() {
  try {
    const data = await getAllUsers();

    const owners = data.filter(
      user => user.role === "owner"
    );

    setUsers(owners);

  } catch (error) {
    console.error(error);
  }
}


async function loadRestaurants() {

  try {

    let data = [];

    if (isSuperAdmin) {

      data = await getAllRestaurants();

    } else if (isOwner && user?.uid) {

      const restaurant =
        await getRestaurantByOwnerId(user.uid);

      data = restaurant
        ? [restaurant]
        : [];

    }

    setRestaurants(data);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
}

useEffect(() => {

  if (!authLoading) {

    loadRestaurants();

    if (isSuperAdmin) {
      loadUsers();
    }

  }

}, [
  authLoading,
  user,
  isSuperAdmin,
  isOwner
]);


 async function handleCreate(e) {

  e.preventDefault();

  if (!isSuperAdmin) {
    return;
  }

  if (
    !name.trim() ||
    !restaurantId.trim() ||
    !ownerId.trim()
  ) {
    return;
  }

    try {

      setCreating(true);

await createRestaurant(
  restaurantId.trim(),
  {
    name: name.trim(),
    description: description.trim(),
    logo: logo.trim(),
    phone: phone.trim(),
    address: address.trim(),
    email: email.trim(),
    instagram: instagram.trim(),
    ownerId: ownerId.trim(),
	menuDesign: menuDesign
  }
);

      setName("");
      setRestaurantId("");
      setOwnerId("");
      setDescription("");
	  setLogo("");
	  setPhone("");
setAddress("");
setEmail("");
setInstagram("");
setMenuDesign("classic");

      await loadRestaurants();

      alert("Restoran je uspjesno kreiran.");

    } catch (error) {

      console.error(error);

      alert(
        "Doslo je do greske prilikom kreiranja restorana."
      );

    } finally {

      setCreating(false);

    }
  }
  
  
  
  function openEditRestaurant(restaurant) {



  setEditingRestaurant(restaurant);

  setEditName(
    restaurant.name || ""
  );

  setEditDescription(
    restaurant.description || ""
  );

  setEditLogo(
    restaurant.logo || ""
  );
  
  setEditPhone(
  restaurant.phone || ""
);

setEditAddress(
  restaurant.address || ""
);

setEditEmail(
  restaurant.email || ""
);

setEditInstagram(
  restaurant.instagram || ""
);

setEditMenuDesign(
  restaurant.menuDesign || "classic"
);

}


function closeEditRestaurant() {

  setEditingRestaurant(null);

  setEditName("");
  setEditDescription("");
  setEditLogo("");
  
  setEditPhone("");
setEditAddress("");
setEditEmail("");
setEditInstagram("");
setEditMenuDesign("classic");

}

async function handleUpdateRestaurant(e) {

  e.preventDefault();

  if (
    !editingRestaurant ||
    !editName.trim()
  ) {
    return;
  }

  try {

    setSavingEdit(true);

   await updateRestaurant(
  editingRestaurant.id,
  {
    name: editName.trim(),
    description: editDescription.trim(),
    logo: editLogo.trim(),
    phone: editPhone.trim(),
    address: editAddress.trim(),
    email: editEmail.trim(),
    instagram: editInstagram.trim(),
	menuDesign: editMenuDesign
	
  }
);

    closeEditRestaurant();

    await loadRestaurants();

    alert(
      "Podaci restorana su uspjesno izmijenjeni."
    );

  } catch (error) {

    console.error(error);

    alert(
      "Doslo je do greske prilikom izmjene restorana."
    );

  } finally {

    setSavingEdit(false);

  }

}


  if (loading) {

    return (
      <div className="restaurants-loading">
        Ucitavanje...
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
            Restorani
          </h1>

          <p>
            Upravljajte restoranima i njihovim
            vlasnicima.
          </p>

        </div>

      </header>


      <main className="restaurants-container">


        {/* ADD RESTAURANT */}
{isSuperAdmin && (
  <section className="restaurant-create-card">

          <div className="restaurant-card-header">

            <div className="restaurant-icon">
              +
            </div>

            <div>

              <h2>
                Dodaj novi restoran
              </h2>

              <p>
                Kreirajte novi restoran i povežite
                ga sa vlasnikom.
              </p>

            </div>

          </div>


          <form
            className="restaurant-form"
            onSubmit={handleCreate}
          >

            <div className="form-grid">
 

              {/* NAME */}

              <div className="form-group">

                <label>
                  Naziv restorana
                </label>

                <input
                  type="text"
                  placeholder="npr. Caffe Monaco"
                  value={name}
                  onChange={e =>
                    setName(e.target.value)
                  }
                  required
                />

                <span>
                  Naziv koji ce biti prikazan
                  korisnicima.
                </span>

              </div>


              {/* ID */}

              <div className="form-group">

                <label>
                  ID restorana
                </label>

                <input
                  type="text"
                  placeholder="npr. caffe-monaco"
                  value={restaurantId}
                  onChange={e =>
                    setRestaurantId(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(
                          /[^a-z0-9-]/g,
                          ""
                        )
                    )
                  }
                  required
                />

                <span>
                  Jedinstveni ID restorana.
                </span>

              </div>


            {/* OWNER */}

<div className="form-group form-full">

  <label>
    Vlasnik restorana
  </label>

  <select
    value={ownerId}
    onChange={e =>
      setOwnerId(e.target.value)
    }
    required
  >

    <option value="">
      Izaberi vlasnika
    </option>

    {users.map(owner => (
      <option
        key={owner.id}
        value={owner.id}
      >
        {owner.name || owner.email}
      </option>
    ))}

  </select>

  <span>
    Izaberite vlasnika kojem restoran pripada.
  </span>

  {ownerId && (
    <small
      style={{
        display: "block",
        marginTop: "8px",
        color: "#777"
      }}
    >
      Firebase UID: {ownerId}
    </small>
  )}

</div>


              {/* DESCRIPTION */}

              <div className="form-group form-full">

                <label>
                  Opis restorana
                </label>

                <textarea
                  placeholder="Dobrodosli u nas restoran..."
                  value={description}
                  onChange={e =>
                    setDescription(e.target.value)
                  }
                  rows="4"
                />

                <span>
                  Kratak opis koji moze biti
                  prikazan na digitalnom meniju.
                </span>

              </div>

{/* LOGO */}

<div className="form-group form-full">

  <label>
    Logo restorana
  </label>

  <input
    type="url"
    placeholder="https://..."
    value={logo}
    onChange={e =>
      setLogo(e.target.value)
    }
  />

  <span>
    Unesi internet adresu slike loga restorana.
  </span>

  {logo && (
    <div style={{ marginTop: "12px" }}>
      <img
        src={logo}
        alt="Pregled loga"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "50%",
          border: "1px solid #ddd"
        }}
        onError={e => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  )}

</div>

{/* MENU DESIGN */}

<div className="form-group form-full">

  <label>
    Dizajn menija
  </label>

  <select
  value={menuDesign}
onChange={e =>
  setMenuDesign(e.target.value)
}
  >

    <option value="classic">
      Classic — trenutni dizajn
    </option>

    <option value="modern">
      Modern
    </option>

    <option value="elegant">
      Elegant
    </option>

    <option value="dark">
      Dark
    </option>

    <option value="cafe">
      Cafe
    </option>

    <option value="minimal">
      Minimal
    </option>

  </select>

  <span>
    Izaberite izgled digitalnog menija.
  </span>

</div>




            </div>


            {/* ACTIONS */}

            <div className="restaurant-form-actions">

              <Link
                to="/admin/dashboard"
                className="button-secondary"
              >
                Odustani
              </Link>

              <button
                type="submit"
                className="button-primary"
                disabled={creating}
              >

                {creating ? (
                  <>
                    <span className="spinner"></span>
                    Kreiranje...
                  </>
                ) : (
                  <>
                    + Kreiraj restoran
                  </>
                )}

              </button>

            </div>

          </form>

        </section>

)}

        {/* RESTAURANT LIST */}

        <section className="restaurants-list-section">

          <div className="section-title">

            <div>

             <h2>
  {isSuperAdmin
    ? "Svi restorani"
    : "Moji restorani"}
</h2>

         <p>
  {restaurants.length}{" "}
  {restaurants.length === 1
    ? "restoran"
    : "restorana"}
</p>

            </div>

          </div>


          {restaurants.length === 0 ? (

            <div className="empty-restaurants">

              <div className="empty-icon">
                🏪
              </div>

              <h3>
                Jos nema restorana
              </h3>

              <p>
                Dodajte prvi restoran koristeci
                formu iznad.
              </p>

            </div>

          ) : (

            <div className="restaurants-grid">

              {restaurants.map(
                restaurant => (

                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                  >

                   
				   
				   
				   <div className="restaurant-card-top">

  <div className="restaurant-avatar">

    {restaurant.logo ? (
      <img
        src={restaurant.logo}
        alt={restaurant.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "inherit"
        }}
      />
    ) : (
      restaurant.name
        ?.charAt(0)
        .toUpperCase()
    )}

  </div>

                      <div>

                        <h3>
                          {restaurant.name}
                        </h3>

                        <span>
                          /{restaurant.id}
                        </span>

                      </div>

                    </div>


                    <div className="restaurant-card-info">

                      <div>

                        <small>
                          Vlasnik
                        </small>

                        <p>
                          {restaurant.ownerId}
                        </p>

                      </div>


                      {restaurant.description && (

                        <div>

                          <small>
                            Opis
                          </small>

                          <p>
                            {restaurant.description}
                          </p>

                        </div>

                      )}

                    </div>

 <div className="restaurant-card-actions">

  {(isOwner || isSuperAdmin) && (
    <>
      <button
        className="button-primary"
        onClick={() =>
          openEditRestaurant(restaurant)
        }
      >
        Uredi restoran
      </button>

      <Link
        to={`/admin/menu/${restaurant.id}`}
        className="button-secondary"
      >
        Uredi meni
      </Link>
    </>
  )}

  <Link
    to={`/menu/${restaurant.id}`}
    target="_blank"
    className="button-secondary"
  >
    Pogledaj meni
  </Link>

</div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>



{editingRestaurant && (

  <div
    className="modal-overlay"
    onMouseDown={e => {

      if (
        e.target === e.currentTarget
      ) {
        closeEditRestaurant();
      }

    }}
  >

    <div className="modal-card">

      <div className="modal-header">

        <div>

          <h2>
            Uredi restoran
          </h2>

          <p>
            Izmijeni podatke restorana.
          </p>

        </div>

        <button
          className="modal-close"
          onClick={closeEditRestaurant}
        >
          ×
        </button>

      </div>


      <form
        onSubmit={handleUpdateRestaurant}
      >

        <div className="form-grid">


          {/* NAME */}

          <div className="form-group form-full">

            <label>
              Naziv restorana
            </label>

            <input
              type="text"
              value={editName}
              onChange={e =>
                setEditName(e.target.value)
              }
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group form-full">

            <label>
              Opis restorana
            </label>

            <textarea
              value={editDescription}
              onChange={e =>
                setEditDescription(
                  e.target.value
                )
              }
              rows="4"
            />

          </div>





          {/* LOGO */}

          <div className="form-group form-full">

            <label>
              Logo restorana
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={editLogo}
              onChange={e =>
                setEditLogo(
                  e.target.value
                )
              }
            />

            <span>
              Unesi internet adresu slike loga.
            </span>


            {editLogo && (

              <div
                style={{
                  marginTop: "12px"
                }}
              >

                <img
                  src={editLogo}
                  alt="Pregled loga"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "1px solid #ddd"
                  }}
                  onError={e => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>

            )}

          </div>
		  
		  
		  {/* MENU DESIGN */}

<div className="form-group form-full">

  <label>
    Dizajn menija
  </label>

 <select
  value={editMenuDesign}
  onChange={e =>
    setEditMenuDesign(e.target.value)
  }
>

    <option value="classic">
      Classic — trenutni dizajn
    </option>

    <option value="modern">
      Modern
    </option>

    <option value="elegant">
      Elegant
    </option>

    <option value="dark">
      Dark
    </option>

    <option value="cafe">
      Cafe
    </option>

    <option value="minimal">
      Minimal
    </option>

  </select>

  <span>
    Izaberite izgled digitalnog menija restorana.
  </span>

</div>
		 
		  
		  
		  
		  
		  
		  {/* PHONE */}

<div className="form-group">

  <label>
    Telefon
  </label>

  <input
    type="tel"
    placeholder="+382 67 123 456"
    value={editPhone}
    onChange={e =>
      setEditPhone(e.target.value)
    }
  />

</div>


{/* ADDRESS */}

<div className="form-group">

  <label>
    Adresa
  </label>

  <input
    type="text"
    placeholder="npr. Njegoševa 12, Plav"
    value={editAddress}
    onChange={e =>
      setEditAddress(e.target.value)
    }
  />

</div>


{/* EMAIL */}

<div className="form-group">

  <label>
    Email
  </label>

  <input
    type="email"
    placeholder="restoran@email.com"
    value={editEmail}
    onChange={e =>
      setEditEmail(e.target.value)
    }
  />

</div>


{/* INSTAGRAM */}

<div className="form-group">

  <label>
    Instagram
  </label>

  <input
    type="text"
    placeholder="@restoran"
    value={editInstagram}
    onChange={e =>
      setEditInstagram(e.target.value)
    }
  />

 

 
  
		 

</div>
		  
		  
		  
		  


        </div>


        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={closeEditRestaurant}
          >
            Otkazi
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={savingEdit}
          >

            {savingEdit
              ? "Cuvanje..."
              : "Sacuvaj izmjene"}

          </button>

        </div>

      </form>

    </div>

  </div>

)}



    </div>

  );
}

export default Restaurants;