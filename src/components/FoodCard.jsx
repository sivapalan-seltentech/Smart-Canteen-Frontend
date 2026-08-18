function FoodCard({ item }) {
  return (
    <div className="food-card">

      <div className="food-image">
        <span>{item.emoji}</span>
      </div>

      <div className="food-content">

        <span className="food-category">
          {item.category}
        </span>

        <h3>{item.name}</h3>

        <p>{item.description}</p>

        <div className="food-bottom">

          <strong>
            ₹{item.price}
          </strong>

          <button className="add-btn">
            + Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;