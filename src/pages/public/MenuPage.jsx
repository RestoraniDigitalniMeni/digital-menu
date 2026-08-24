import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";

import { db } from "../../firebase/config";

import MenuHeader from "../../components/menu/MenuHeader";
import CategoryTabs from "../../components/menu/CategoryTabs";
import MenuItemCard from "../../components/menu/MenuItemCard";
import "./index.css";

function MenuPage() {
  const { restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurantId) {
      setError("Nije pronadjen restoran.");
      setLoading(false);
      return;
    }

    const restaurantRef = ref(
      db,
      `restaurants/${restaurantId}`
    );

    const unsubscribe = onValue(
      restaurantRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Restoran nije pronadjen.");
          setRestaurant(null);
          setLoading(false);
          return;
        }

        setRestaurant(snapshot.val());
        setError("");
        setLoading(false);
      },
      (firebaseError) => {
        console.error(firebaseError);
        setError("Doslo je do greske pri ucitavanju menija.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [restaurantId]);

  const categories = useMemo(() => {
    if (!restaurant?.categories) {
      return [];
    }

    return Object.entries(restaurant.categories)
      .map(([id, category]) => ({
        id,
        ...category
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [restaurant]);

  const items = useMemo(() => {
    if (!restaurant?.items) {
      return [];
    }

    return Object.entries(restaurant.items)
      .map(([id, item]) => ({
        id,
        ...item
      }))
      .filter((item) => item.available !== false);
  }, [restaurant]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) {
      return [];
    }

    return items.filter(
      (item) => item.categoryId === activeCategory
    );
  }, [items, activeCategory]);

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>Ucitavanje menija...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="menu-error">
        <div className="error-icon">!</div>

        <h1>Ups!</h1>

        <p>
          {error || "Meni nije moguce ucitati."}
        </p>
      </div>
    );
  }

 


  return (
   <div
  className={`menu-page design-${
    restaurant.menuDesign || "classic"
  }`}
>

      <MenuHeader restaurant={restaurant} />

      <main className="menu-main">

        {categories.length > 0 && (
        <CategoryTabs
  categories={categories}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
  design={restaurant.menuDesign || "classic"}
/>
        )}

        <section className="menu-items">

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
              />
            ))
          ) : (
            <div className="empty-category">
              <span>☕</span>

              <p>
                Nema artikala u ovoj kategoriji.
              </p>
            </div>
          )}

        </section>

      </main>

<footer className="menu-footer">

  <div className="menu-footer-content">

    <h3>Kontakt</h3>

    <div className="menu-contact-list">

      {restaurant.phone && (
        <a
          href={`tel:${restaurant.phone}`}
          className="menu-contact-item"
        >
          <span className="contact-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2
                19.79 19.79 0 0 1-8.63-3.07
                19.5 19.5 0 0 1-6-6
                19.79 19.79 0 0 1-3.07-8.67
                A2 2 0 0 1 4.11 2h3
                a2 2 0 0 1 2 1.72
                12.84 12.84 0 0 0 .7 2.81
                2 2 0 0 1-.45 2.11L8.09 9.91
                a16 16 0 0 0 6 6l1.27-1.27
                a2 2 0 0 1 2.11-.45
                12.84 12.84 0 0 0 2.81.7
                A2 2 0 0 1 22 16.92z"
              />
            </svg>
          </span>

          <span>{restaurant.phone}</span>
        </a>
      )}

      {restaurant.address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            restaurant.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-contact-item"
        >
          <span className="contact-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20 10c0 5-8 12-8 12S4 15 4 10
                a8 8 0 1 1 16 0z"
              />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>

          <span>{restaurant.address}</span>
        </a>
      )}

      {restaurant.email && (
        <a
          href={`mailto:${restaurant.email}`}
          className="menu-contact-item"
        >
          <span className="contact-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>

          <span>{restaurant.email}</span>
        </a>
      )}

    </div>

    {restaurant.instagram && (
      <a
        href={
          restaurant.instagram.startsWith("http")
            ? restaurant.instagram
            : `https://instagram.com/${restaurant.instagram.replace("@", "")}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="menu-instagram"
        aria-label="Instagram"
      >
        <span className="instagram-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
            />

            <circle
              cx="12"
              cy="12"
              r="4"
            />

            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              className="instagram-dot"
            />
          </svg>
        </span>

        <span>Instagram</span>
      </a>
    )}

  </div>

  <div className="menu-footer-bottom">
    © {new Date().getFullYear()} {restaurant.name}
  </div>

</footer>
    </div>
  );
}

export default MenuPage;