function MenuHeader({ restaurant }) {
  return (
    <header className="menu-header">

      <div className="menu-header-content">

        <h1>
          {restaurant?.name || "Digitalni meni"}
        </h1>

        {restaurant?.description && (
          <p>
            {restaurant.description}
          </p>
        )}

      </div>

    </header>
  );
}

export default MenuHeader;