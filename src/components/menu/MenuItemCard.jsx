function MenuItemCard({ item }) {
  return (
    <article className="menu-item-card">

      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="menu-item-image"
        />
      )}

      <div className="menu-item-content">

        <div className="menu-item-top">

          <h3>{item.name}</h3>

          <strong>
            {Number(item.price).toFixed(2)} €
          </strong>

        </div>

        {item.description && (
          <p>{item.description}</p>
        )}

      </div>

    </article>
  );
}

export default MenuItemCard;