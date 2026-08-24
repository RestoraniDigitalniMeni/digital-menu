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

  <h3>Kontakt</h3>

  {restaurant.phone && (
    <p>
      📞 {restaurant.phone}
    </p>
  )}

  {restaurant.address && (
    <p>
      📍 {restaurant.address}
    </p>
  )}

  {restaurant.email && (
    <p>
      ✉️ {restaurant.email}
    </p>
  )}

  {restaurant.instagram && (
    <p>
      Instagram: {restaurant.instagram}
    </p>
  )}

</footer>

    </div>
  );
}

export default MenuPage;