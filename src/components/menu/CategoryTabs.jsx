function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange
}) {
  return (
    <div className="category-tabs">

      {categories.map((category) => (
        <button
          key={category.id}
          className={
            activeCategory === category.id
              ? "active"
              : ""
          }
          onClick={() =>
            onCategoryChange(category.id)
          }
        >
          {category.name}
        </button>
      ))}

    </div>
  );
}

export default CategoryTabs;