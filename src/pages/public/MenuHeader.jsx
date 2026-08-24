function MenuHeader({ restaurant }) {

  return (
    <header className="menu-header">

      {restaurant.logo && (
        <img
          src={restaurant.logo}
          alt={restaurant.name}
          className="restaurant-logo"
        />
      )}

      <h1>{restaurant.name}</h1>

      {restaurant.description && (
        <p>
          {restaurant.description}
        </p>
      )}

    </header>
  );
}

export default MenuHeader;