function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  design = "classic"
}) {
  const isGridDesign =
    design === "cafe";

  return (
    <section
      className={
        isGridDesign
          ? "category-section category-grid-design"
          : "category-section"
      }
    >

      <div className="category-tabs">

        {categories.map(category => (

          <button
            key={category.id}
            className={
              activeCategory === category.id
                ? "category active"
                : "category"
            }
            onClick={() =>
              onCategoryChange(category.id)
            }
          >

            {isGridDesign && category.image ? (

              <div className="category-image-wrapper">

                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />

              </div>

            ) : null}

            <span>
              {category.name}
            </span>

          </button>

        ))}

      </div>

    </section>
  );
}

export default CategoryTabs;