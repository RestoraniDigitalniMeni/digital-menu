import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllRestaurants,
  createRestaurant
} from "../../firebase/database";

function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);

  const [name, setName] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadRestaurants() {

    try {

      const data =
        await getAllRestaurants();

      setRestaurants(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    loadRestaurants();

  }, []);

  async function handleCreate(e) {

    e.preventDefault();

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
          ownerId: ownerId.trim()
        }
      );

      setName("");
      setRestaurantId("");
      setOwnerId("");
      setDescription("");

      await loadRestaurants();

      alert("Restoran je uspjesno kreiran.");

    } catch (error) {

      console.error(error);

      alert(
        "Greska prilikom kreiranja restorana."
      );

    } finally {

      setCreating(false);

    }
  }

  if (loading) {

    return (
      <div className="loading">
        Ucitavanje restorana...
      </div>
    );

  }

  return (

    <div className="admin-page">

      <header className="admin-header">

        <div>

          <Link to="/admin/dashboard">
            ← Dashboard
          </Link>

          <h1>
            Restorani
          </h1>

        </div>

      </header>

      <main className="admin-content">

        {/* CREATE RESTAURANT */}

        <section className="admin-section">

          <h2>
            Dodaj restoran
          </h2>

          <form
            className="admin-form"
            onSubmit={handleCreate}
          >

            <input
              type="text"
              placeholder="Naziv restorana"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="ID restorana, npr. cafe-monaco"
              value={restaurantId}
              onChange={e =>
                setRestaurantId(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                )
              }
              required
            />

            <input
              type="text"
              placeholder="Firebase UID vlasnika"
              value={ownerId}
              onChange={e =>
                setOwnerId(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Opis restorana"
              value={description}
              onChange={e =>
                setDescription(e.target.value)
              }
            />

            <button
              type="submit"
              disabled={creating}
            >
              {creating
                ? "Kreiranje..."
                : "Dodaj restoran"}
            </button>

          </form>

        </section>


        {/* RESTAURANTS */}

        <section className="admin-section">

          <h2>
            Svi restorani
          </h2>

          <div className="admin-items">

            {restaurants.map(
              restaurant => (

                <div
                  key={restaurant.id}
                  className="admin-item"
                >

                  <div className="admin-item-info">

                    <h3>
                      {restaurant.name}
                    </h3>

                    <p>
                      ID: {restaurant.id}
                    </p>

                    <p>
                      Vlasnik:{" "}
                      {restaurant.ownerId}
                    </p>

                    <p>
                      {restaurant.description}
                    </p>

                  </div>

                  <div className="admin-item-actions">

                    <Link
                      to={`/menu/${restaurant.id}`}
                    >
                      Pogledaj meni
                    </Link>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      </main>

    </div>

  );
}

export default Restaurants;