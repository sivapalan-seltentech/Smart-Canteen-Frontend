function FeaturesSection() {
  const features = [
    {
      icon: "⚡",
      title: "Quick Ordering",
      description:
        "Order your favorite food in just a few clicks without waiting in a long queue.",
    },
    {
      icon: "🕒",
      title: "Save Your Time",
      description:
        "Place your order before reaching the canteen and collect it when it is ready.",
    },
    {
      icon: "📱",
      title: "Easy to Use",
      description:
        "Simple and user-friendly interface makes ordering food fast and convenient.",
    },
    {
      icon: "🔔",
      title: "Order Updates",
      description:
        "Stay updated with your order status from preparation to pickup.",
    },
  ];

  return (
    <section className="features-section">
      <div className="section-container">

        <div className="section-heading">
          <span className="section-badge">Why Smart Canteen?</span>

          <h2>
            Everything You Need for
            <span> Smarter Food Ordering</span>
          </h2>

          <p>
            Smart Canteen makes your everyday food ordering experience
            faster, easier and more convenient.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;