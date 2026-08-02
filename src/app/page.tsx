"use client";
import Image from "next/image";
import logo from "@/images/tlmt.jpg";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  const handleBookAppointment = () => {
    router.push("/contact");
  };
  const handleExploreCollection = () => {
    router.push("/collection");
  };
  const handleBookNow = () => {
    router.push("/contact");
  };
  return (
    <>
      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #fff8f5 0%, #ffeef3 50%, #fff8f5 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-3">
                ✂️ Ladies Tailoring & Boutique
              </span>

              <h1
                className="display-3 fw-bold mb-3"
                style={{ color: "#b30059" }}
              >
                The Little
                <br />
                Mango Tree
              </h1>

              <p className="lead text-secondary mb-4">
                Elegant tailoring for women with perfect fitting, premium
                fabrics, designer blouses, kurtis, bridal wear, alterations and
                custom stitching.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button
                  className="btn btn-danger btn-lg rounded-pill px-4 shadow"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>

                <button
                  className="btn btn-outline-dark btn-lg rounded-pill px-4"
                  onClick={handleExploreCollection}
                >
                  Explore Collection
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div
                className="bg-white rounded-5 shadow-lg p-4 d-inline-block"
                style={{ maxWidth: 430 }}
              >
                <Image
                  src={logo}
                  alt="The Little Mango Tree"
                  className="img-fluid rounded-4"
                />

                <div className="mt-4">
                  <h4 className="fw-bold mb-2">
                    Where Every Stitch Tells Your Story
                  </h4>
                  <p className="text-muted mb-0">
                    Designed with love. Stitched with perfection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose Us?</h2>
            <p className="text-muted">
              Premium tailoring experience with exceptional craftsmanship.
            </p>
          </div>

          <div className="row g-4">
            {[
              ["✂️", "Custom Stitching"],
              ["👗", "Designer Blouses"],
              ["👰", "Bridal Collection"],
              ["📏", "Perfect Measurements"],
              ["🧵", "Alteration Service"],
              ["🚚", "Timely Delivery"],
            ].map(([icon, title], index) => (
              <div className="col-md-4" key={index}>
                <div className="card border-0 shadow h-100 rounded-4">
                  <div className="card-body text-center p-4">
                    <div
                      className="mx-auto rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: 70,
                        height: 70,
                        fontSize: 32,
                      }}
                    >
                      {icon}
                    </div>

                    <h5 className="fw-bold">{title}</h5>

                    <p className="text-muted mb-0">
                      Premium quality stitching with attention to every detail.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-5" style={{ background: "#fff6f8" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Services</h2>
          </div>

          <div className="row g-4">
            {[
              "Designer Blouse",
              "Kurti Stitching",
              "Salwar Suit",
              "Bridal Lehenga",
              "Designer Gown",
              "Kids Wear",
              "Alteration",
              "Saree Fall & Pico",
            ].map((service, i) => (
              <div className="col-md-3 col-sm-6" key={i}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body text-center py-5">
                    <div style={{ fontSize: 42 }}>🪡</div>

                    <h5 className="mt-3">{service}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Process</h2>
          </div>

          <div className="row text-center">
            {[
              "Consultation",
              "Measurements",
              "Design",
              "Stitching",
              "Trial",
              "Delivery",
            ].map((step, index) => (
              <div className="col" key={index}>
                <div
                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto fw-bold"
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  {index + 1}
                </div>

                <h6 className="mt-3">{step}</h6>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5" style={{ background: "#fff6f8" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Happy Customers</h2>
          </div>

          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div className="col-lg-4" key={item}>
                <div className="card border-0 shadow rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="mb-3 fs-4 text-warning">★★★★★</div>

                    <p className="text-muted">
                      Absolutely loved the fitting and finishing. The stitching
                      is elegant and exactly as I wanted.
                    </p>

                    <h6 className="fw-bold mb-0">Happy Customer</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-5 text-white"
        style={{
          background: "linear-gradient(135deg,#c2185b,#ff5c8d)",
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready for Your Dream Outfit?</h2>

          <p className="lead mb-4">
            Book your appointment today and experience premium tailoring.
          </p>

          <button
            className="btn btn-light btn-lg rounded-pill px-5"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </section>
    </>
  );
}
