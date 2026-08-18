function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🍔",
      title: "Choose Your Food",
      description:
        "Browse the available food items and select your favorite dishes.",
    },
    {
      number: "02",
      icon: "🛒",
      title: "Place Your Order",
      description:
        "Add your food to the cart and confirm your order quickly.",
    },
    {
      number: "03",
      icon: "👨‍🍳",
      title: "We Prepare It",
      description:
        "Our canteen team receives your order and starts preparing it.",
    },
    {
      number: "04",
      icon: "🏃",
      title: "Pick It Up",
      description:
        "Reach the canteen and collect your ready-to-pick-up order.",
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-container">

        <div className="section-heading">
          <span className="section-badge">Simple Process</span>

          <h2>
            How <span>Smart Canteen</span> Works
          </h2>

          <p>
            Four simple steps to enjoy your food without standing in a queue.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>

              <div className="step-number">
                {step.number}
              </div>

              <div className="step-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;