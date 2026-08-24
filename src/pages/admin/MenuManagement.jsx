import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  getRestaurant,
  getRestaurantByOwnerId,
  addCategory,
  deleteCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "../../firebase/database";



import { useAuth } from "../../context/AuthContext";
 

const emptyItem = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
  available: true
};


function MenuManagement() {
	
	const {
  user,
  loading: authLoading,
  isOwner,
  isSuperAdmin
} = useAuth();

const { restaurantId } = useParams();
	

  



  const [restaurant, setRestaurant] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [categoryName, setCategoryName] =
    useState("");

  const [item, setItem] =
    useState(emptyItem);

  const [showItemModal, setShowItemModal] =
    useState(false);

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);



console.log("RESTAURANT ID:", restaurantId);


async function loadRestaurant() {

  try {

    let data = null;

    // SUPERADMIN MOŽE BILO KOJI RESTORAN
    if (isSuperAdmin && restaurantId) {

      data = await getRestaurant(
        restaurantId
      );

    }

    // OWNER MOŽE SAMO SVOJ RESTORAN
    else if (isOwner && user?.uid) {

      const ownerRestaurant =
        await getRestaurantByOwnerId(
          user.uid
        );

      // Provjera da URL restoran zaista pripada owneru
      if (
        ownerRestaurant &&
        ownerRestaurant.id === restaurantId
      ) {
        data = ownerRestaurant;
      }

    }

    setRestaurant(data);

  } catch (error) {

    console.error(
      "Greska pri ucitavanju restorana:",
      error
    );

    setRestaurant(null);

  } finally {

    setLoading(false);

  }
}


  useEffect(() => {

  if (
    !authLoading &&
    restaurantId &&
    user
  ) {
    loadRestaurant();
  }

}, [
  authLoading,
  user,
  isOwner,
  isSuperAdmin,
  restaurantId
]);


  /*
   * CATEGORIES
   */

  async function handleAddCategory(e) {

    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    try {

      await addCategory(
        restaurantId,
        {
          name: categoryName.trim(),
          order:
            Object.keys(
              restaurant?.categories || {}
            ).length
        }
      );

      setCategoryName("");
      setShowCategoryModal(false);

      await loadRestaurant();

    } catch (error) {

      console.error(error);

    }

  }


  async function handleDeleteCategory(
    categoryId
  ) {

    const confirmed =
      window.confirm(
        "Da li sigurno zelis obrisati ovu kategoriju?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteCategory(
        restaurantId,
        categoryId
      );

      if (
        selectedCategory ===
        categoryId
      ) {
        setSelectedCategory("all");
      }

      await loadRestaurant();

    } catch (error) {

      console.error(error);

    }

  }


  /*
   * ITEMS
   */

  function openAddItem() {

    setEditingItem(null);

    setItem({
      ...emptyItem,
      categoryId:
        selectedCategory !== "all"
          ? selectedCategory
          : ""
    });

    setShowItemModal(true);

  }


  function openEditItem(menuItem) {

    setEditingItem(menuItem);

    setItem({
      name: menuItem.name || "",
      description:
        menuItem.description || "",
      price:
        menuItem.price || "",
      categoryId:
        menuItem.categoryId || "",
      image:
        menuItem.image || "",
      available:
        menuItem.available !== false
    });

    setShowItemModal(true);

  }


  function closeItemModal() {

    setShowItemModal(false);
    setEditingItem(null);
    setItem(emptyItem);

  }


  async function handleSaveItem(e) {

    e.preventDefault();

    if (
      !item.name.trim() ||
      !item.categoryId
    ) {
      return;
    }

    try {

      if (editingItem) {

        await updateMenuItem(
          restaurantId,
          editingItem.id,
          {
            name: item.name.trim(),
            description:
              item.description || "",
            price:
              Number(item.price) || 0,
            categoryId:
              item.categoryId,
            image:
              item.image || "",
            available:
              item.available
          }
        );

      } else {

        await addMenuItem(
          restaurantId,
          item
        );

      }

      closeItemModal();

      await loadRestaurant();

    } catch (error) {

      console.error(error);

    }

  }


  async function handleDeleteItem(
    itemId
  ) {

    const confirmed =
      window.confirm(
        "Da li sigurno zelis obrisati ovaj artikl?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteMenuItem(
        restaurantId,
        itemId
      );

      await loadRestaurant();

    } catch (error) {

      console.error(error);

    }

  }


  async function toggleAvailability(
    itemId,
    currentValue
  ) {

    try {

      await updateMenuItem(
        restaurantId,
        itemId,
        {
          available: !currentValue
        }
      );

      await loadRestaurant();

    } catch (error) {

      console.error(error);

    }

  }


  /*
   * LOADING
   */

  if (loading) {

    return (
      <div className="menu-admin-loading">
        <div className="loading-spinner"></div>
        <p>Ucitavanje menija...</p>
      </div>
    );

  }


  /*
   * NO RESTAURANT
   */

  if (!restaurant) {

    return (

      <div className="menu-admin-empty">

        <div className="empty-icon">
          🍽️
        </div>

        <h1>
          Lokal nije pronadjen
        </h1>

        <p>
          Za ovaj korisnicki nalog
          jos nije kreiran lokal.
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


  /*
   * DATA
   */

  const categories =
    Object.entries(
      restaurant.categories || {}
    )
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort(
        (a, b) =>
          (a.order || 0) -
          (b.order || 0)
      );


  const items =
    Object.entries(
      restaurant.items || {}
    )
      .map(([id, data]) => ({
        id,
        ...data
      }));


  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter(
          item =>
            item.categoryId ===
            selectedCategory
        );


  const selectedCategoryName =
    selectedCategory === "all"
      ? "Svi artikli"
      : categories.find(
          category =>
            category.id ===
            selectedCategory
        )?.name || "Kategorija";


  return (

    <div className="menu-admin-layout">


      {/* SIDEBAR */}

      <aside className="menu-admin-sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            ☕
          </div>

          <div>
            <strong>
              Digitalni meni
            </strong>

            <span>
              Administracija
            </span>
          </div>

        </div>


        <nav className="sidebar-nav">

          <Link
            to="/admin/dashboard"
            className="sidebar-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>


       <Link
  to={`/admin/menu/${restaurantId}`}
  className="sidebar-link active"
>
            <span>☰</span>
            Meni
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <Link
            to={`/menu/${restaurantId}`}
            target="_blank"
            className="preview-link"
          >
            <span>↗</span>
            Pregled menija
          </Link>


        <Link 
  to="/admin/dashboard" 
  className="sidebar-link" 
>
  <span>←</span>
  Dashboard
</Link>

        </div>

      </aside>


      {/* MAIN */}

      <main className="menu-admin-main">


        {/* HEADER */}

        <header className="menu-admin-header">

          <div>

            <div className="breadcrumb">
              Administracija / Meni
            </div>

            <h1>
              {restaurant.name}
            </h1>

            <p>
              Upravljaj kategorijama i
              artiklima svog menija.
            </p>

          </div>


          <div className="header-actions">

            <button
              className="secondary-button"
              onClick={() =>
                setShowCategoryModal(true)
              }
            >
              + Kategorija
            </button>


            <button
              className="primary-button"
              onClick={openAddItem}
            >
              + Dodaj artikl
            </button>

          </div>

        </header>


        {/* CATEGORY BAR */}

        <section className="category-section">

          <div className="section-title-row">

            <div>

              <h2>
                Kategorije
              </h2>

              <span>
                {categories.length} kategorija
              </span>

            </div>

          </div>


          <div className="category-tabs">

            <button
              className={
                selectedCategory === "all"
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() =>
                setSelectedCategory("all")
              }
            >
              Svi artikli
              <small>
                {items.length}
              </small>
            </button>


            {categories.map(
              category => {

                const count =
                  items.filter(
                    item =>
                      item.categoryId ===
                      category.id
                  ).length;

                return (

                  <div
                    className="category-tab-wrapper"
                    key={category.id}
                  >

                    <button
                      className={
                        selectedCategory ===
                        category.id
                          ? "category-tab active"
                          : "category-tab"
                      }
                      onClick={() =>
                        setSelectedCategory(
                          category.id
                        )
                      }
                    >

                      {category.name}

                      <small>
                        {count}
                      </small>

                    </button>


                    <button
                      className="category-delete"
                      onClick={() =>
                        handleDeleteCategory(
                          category.id
                        )
                      }
                      title="Obrisi kategoriju"
                    >
                      ×
                    </button>

                  </div>

                );

              }
            )}


            <button
              className="category-add"
              onClick={() =>
                setShowCategoryModal(true)
              }
            >
              + Nova
            </button>

          </div>

        </section>


        {/* ITEMS */}

        <section className="items-section">

          <div className="section-title-row">

            <div>

              <h2>
                {selectedCategoryName}
              </h2>

              <span>
                {filteredItems.length} artikala
              </span>

            </div>


            <button
              className="mobile-add-button primary-button"
              onClick={openAddItem}
            >
              + Dodaj artikl
            </button>

          </div>


          {filteredItems.length === 0 ? (

            <div className="items-empty">

              <div className="empty-food-icon">
                🍽️
              </div>

              <h3>
                Nema artikala
              </h3>

              <p>
                Dodaj prvi artikl u ovu
                kategoriju.
              </p>

              <button
                className="primary-button"
                onClick={openAddItem}
              >
                + Dodaj artikl
              </button>

            </div>

          ) : (

            <div className="menu-items-grid">

              {filteredItems.map(
                menuItem => (

                  <article
                    key={menuItem.id}
                    className={
                      menuItem.available === false
                        ? "menu-product-card unavailable"
                        : "menu-product-card"
                    }
                  >

                    {/* IMAGE */}

                    <div className="product-image">

                      {menuItem.image ? (

                        <img
                          src={menuItem.image}
                          alt={menuItem.name}
                        />

                      ) : (

                        <div className="no-image">
                          🍽️
                        </div>

                      )}


                      <span
                        className={
                          menuItem.available === false
                            ? "status-badge hidden"
                            : "status-badge"
                        }
                      >
                        {menuItem.available === false
                          ? "Skriven"
                          : "Aktivan"}
                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="product-content">

                      <div className="product-top">

                        <h3>
                          {menuItem.name}
                        </h3>

                        <strong>
                          {Number(
                            menuItem.price
                          ).toFixed(2)} €
                        </strong>

                      </div>


                      <p className="product-description">

                        {menuItem.description ||
                          "Bez opisa"}

                      </p>


                      <div className="product-category">

                        {
                          categories.find(
                            category =>
                              category.id ===
                              menuItem.categoryId
                          )?.name ||
                          "Bez kategorije"
                        }

                      </div>


                      <div className="product-actions">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEditItem(
                              menuItem
                            )
                          }
                        >
                          Uredi
                        </button>


                        <button
                          className={
                            menuItem.available
                              ? "visibility-button"
                              : "visibility-button inactive"
                          }
                          onClick={() =>
                            toggleAvailability(
                              menuItem.id,
                              menuItem.available
                            )
                          }
                        >
                          {menuItem.available
                            ? "Sakrij"
                            : "Aktiviraj"}
                        </button>


                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteItem(
                              menuItem.id
                            )
                          }
                        >
                          Obrisi
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* CATEGORY MODAL */}

      {showCategoryModal && (

        <div
          className="modal-overlay"
          onMouseDown={e => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setShowCategoryModal(false);
            }

          }}
        >

          <div className="modal-card">

            <div className="modal-header">

              <div>

                <h2>
                  Nova kategorija
                </h2>

                <p>
                  Dodaj novu kategoriju menija.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowCategoryModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAddCategory}
            >

              <label>
                Naziv kategorije
              </label>

              <input
                type="text"
                placeholder="npr. Kafa"
                value={categoryName}
                onChange={e =>
                  setCategoryName(
                    e.target.value
                  )
                }
                autoFocus
              />


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowCategoryModal(false)
                  }
                >
                  Otkazi
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Dodaj kategoriju
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ITEM MODAL */}

      {showItemModal && (

        <div
          className="modal-overlay"
          onMouseDown={e => {

            if (
              e.target ===
              e.currentTarget
            ) {
              closeItemModal();
            }

          }}
        >

          <div className="modal-card item-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingItem
                    ? "Uredi artikl"
                    : "Novi artikl"}
                </h2>

                <p>
                  Unesi podatke o artiklu.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeItemModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSaveItem}
            >

              <div className="form-grid">

                <div className="form-field full">

                  <label>
                    Naziv artikla
                  </label>

                  <input
                    type="text"
                    placeholder="npr. Espresso"
                    value={item.name}
                    onChange={e =>
                      setItem({
                        ...item,
                        name: e.target.value
                      })
                    }
                    required
                  />

                </div>


                <div className="form-field">

                  <label>
                    Cijena (€)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.50"
                    value={item.price}
                    onChange={e =>
                      setItem({
                        ...item,
                        price:
                          e.target.value
                      })
                    }
                    required
                  />

                </div>


                <div className="form-field">

                  <label>
                    Kategorija
                  </label>

                  <select
                    value={item.categoryId}
                    onChange={e =>
                      setItem({
                        ...item,
                        categoryId:
                          e.target.value
                      })
                    }
                    required
                  >

                    <option value="">
                      Izaberi kategoriju
                    </option>

                    {categories.map(
                      category => (

                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {category.name}
                        </option>

                      )
                    )}

                  </select>

                </div>


                <div className="form-field full">

                  <label>
                    Opis
                  </label>

                  <textarea
                    placeholder="Kratak opis artikla..."
                    value={
                      item.description
                    }
                    onChange={e =>
                      setItem({
                        ...item,
                        description:
                          e.target.value
                      })
                    }
                    rows="3"
                  />

                </div>


                <div className="form-field full">

                  <label>
                    URL slike
                  </label>

                  <input
                    type="url"
                    placeholder="https://..."
                    value={item.image}
                    onChange={e =>
                      setItem({
                        ...item,
                        image:
                          e.target.value
                      })
                    }
                  />

                </div>


                <div className="availability-field full">

                  <div>

                    <strong>
                      Dostupnost artikla
                    </strong>

                    <span>
                      Artikli koji nisu dostupni
                      nece biti prikazani gostima.
                    </span>

                  </div>


                  <button
                    type="button"
                    className={
                      item.available
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      setItem({
                        ...item,
                        available:
                          !item.available
                      })
                    }
                  >

                    <span></span>

                  </button>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeItemModal}
                >
                  Otkazi
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingItem
                    ? "Sacuvaj izmjene"
                    : "Dodaj artikl"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


export default MenuManagement;