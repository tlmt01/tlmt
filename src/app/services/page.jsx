"use client";

import { useRouter } from "next/navigation";

const serviceHighlights = [
  {
    title: "Custom Fitting",
    description:
      "Accurate measurements and personalized tailoring for a smooth, flattering fit.",
    icon: "📏",
  },
  {
    title: "Designer Finishing",
    description:
      "Elegant hemming, detailing, and premium finishing with a boutique touch.",
    icon: "✨",
  },
  {
    title: "On-Time Delivery",
    description:
      "Carefully managed stitch timelines so your perfect outfit is ready when promised.",
    icon: "⏱️",
  },
];

const serviceCards = [
  {
    name: "Designer Blouse",
    description:
      "Custom-fit blouses with refined cuts, elegant sleeves, and perfect finishing.",
    icon: "👗",
  },
  {
    name: "Kurti Stitching",
    description:
      "Daily wear and festive kurtis designed for comfort, structure, and style.",
    icon: "🧵",
  },
  {
    name: "Salwar Suit",
    description:
      "Classic or contemporary suit sets stitched to fit your personality and occasion.",
    icon: "🪡",
  },
  {
    name: "Bridal Lehenga",
    description:
      "Statement bridal designs crafted with precise detailing and graceful silhouettes.",
    icon: "👰",
  },
  {
    name: "Designer Gown",
    description:
      "Formal silhouettes for special occasions with luxe drape and polished drape lines.",
    icon: "🎀",
  },
  {
    name: "Kids Wear",
    description:
      "Comfort-first tailoring for little ones with practical, adorable styles.",
    icon: "🧸",
  },
  {
    name: "Alteration",
    description:
      "Smart updates to existing outfits so they feel new, polished, and perfectly fitted.",
    icon: "🩹",
  },
  {
    name: "Saree Fall & Pico",
    description:
      "Finishing details that elevate your saree drape with a crisp, professional look.",
    icon: "🌸",
  },
];

const processSteps = [
  "Consultation",
  "Measurements",
  "Fabric & Design",
  "Stitching",
  "Final Fitting",
  "Delivery",
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <section className="services-page">
      <div className="services-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="services-eyebrow">Premium tailoring studio</span>
              <h1 className="services-title">
                Tailoring that feels custom-made for your story.
              </h1>
              <p className="services-copy">
                From chic daily wear to elegant occasion looks, every piece is
                cut, stitched, and finished with care to reflect your individual
                taste.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <button
                  className="btn btn-danger btn-lg rounded-pill px-4 shadow-sm"
                  onClick={() => router.push("/contact")}
                >
                  Book an Appointment
                </button>
                <button
                  className="btn btn-outline-dark btn-lg rounded-pill px-4"
                  onClick={() => router.push("/")}
                >
                  Explore Boutique
                </button>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="services-hero-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <p className="mb-1 text-uppercase small fw-semibold text-danger">
                      Signature Studio
                    </p>
                    <h3 className="mb-0 fw-bold">The Little Mango Tree</h3>
                  </div>
                  <span className="services-pill">Boutique Quality</span>
                </div>

                <div className="row g-3">
                  {serviceHighlights.map((item) => (
                    <div className="col-md-4" key={item.title}>
                      <div className="services-highlight-card">
                        <div className="services-icon-circle">{item.icon}</div>
                        <h6 className="fw-bold mt-3 mb-2">{item.title}</h6>
                        <p className="small text-muted mb-0">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="services-eyebrow">Our specialties</span>
          <h2 className="fw-bold mb-3">Services crafted for every occasion.</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
            Explore the boutique services designed to bring confidence, comfort,
            and elegance to your wardrobe.
          </p>
        </div>

        <div className="row g-4">
          {serviceCards.map((service) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={service.name}>
              <article className="service-card h-100">
                <div className="service-card-icon">{service.icon}</div>
                <h5 className="fw-bold mb-2">{service.name}</h5>
                <p className="text-muted mb-0">{service.description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="services-process-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="services-eyebrow">How it works</span>
            <h2 className="fw-bold">
              A seamless journey from idea to finished outfit.
            </h2>
          </div>

          <div className="row g-4">
            {processSteps.map((step, index) => (
              <div className="col-lg-2 col-md-4 col-sm-6" key={step}>
                <div className="services-step-card text-center h-100">
                  <div className="services-step-badge">{index + 1}</div>
                  <h6 className="fw-bold mt-3 mb-0">{step}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="services-cta-card text-center">
          <span className="services-eyebrow">Ready to begin?</span>
          <h2 className="fw-bold mb-3">
            Let’s design your next perfect outfit.
          </h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: 640 }}>
            Book a consultation with our tailoring team and bring your fabric,
            fashion vision, and confidence.
          </p>
          <button
            className="btn btn-danger btn-lg rounded-pill px-5 shadow-sm"
            onClick={() => router.push("/contact")}
          >
            Contact the Boutique
          </button>
        </div>
      </div>
    </section>
  );
}
