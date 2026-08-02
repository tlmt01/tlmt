import { ADDRESS, EMAIL, MAP_URL, MOBILE } from "@/modules/constants";

const cleanedMobile = MOBILE.replace(/\D/g, "");
const whatsappUrl = `https://wa.me/${cleanedMobile}`;
const callUrl = `tel:${MOBILE}`;
const emailUrl = `mailto:${EMAIL}`;
const mapEmbedUrl =
  "https://www.google.com/maps?q=12.863911,77.7711394&z=15&output=embed";

const contactCards = [
  {
    title: "WhatsApp",
    value: MOBILE,
    description: "Chat with the shop instantly for orders and fittings.",
    href: whatsappUrl,
    icon: "💬",
    accent: "#25D366",
  },
  {
    title: "Call",
    value: MOBILE,
    description: "Speak directly with the boutique for appointments.",
    href: callUrl,
    icon: "📞",
    accent: "#b30059",
  },
  {
    title: "Email",
    value: EMAIL,
    description: "Send your queries or requests to the shop inbox.",
    href: emailUrl,
    icon: "✉️",
    accent: "#0d6efd",
  },
];

export default function ContactPage() {
  return (
    <section className="py-5" style={{ background: "#fff8fb" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-3">
                Contact Us
              </span>
              <h1 className="fw-bold mb-3" style={{ color: "#b30059" }}>
                Reach The Little Mango Tree
              </h1>
              <p className="text-muted mb-0">
                Connect with the boutique through WhatsApp, a direct call, or
                email for stitching, fittings, and custom orders.
              </p>
            </div>

            <div className="row g-4">
              {contactCards.map((item) => (
                <div className="col-md-4" key={item.title}>
                  <a
                    href={item.href}
                    target={item.title === "WhatsApp" ? "_blank" : undefined}
                    rel={item.title === "WhatsApp" ? "noreferrer" : undefined}
                    className="text-decoration-none"
                  >
                    <div className="card border-0 shadow rounded-4 h-100 hover-shadow">
                      <div className="card-body p-4 text-center">
                        <div
                          className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: 70,
                            height: 70,
                            backgroundColor: `${item.accent}20`,
                            color: item.accent,
                            fontSize: 30,
                          }}
                        >
                          {item.icon}
                        </div>
                        <h5 className="fw-bold mb-2">{item.title}</h5>
                        <p className="fw-semibold text-dark mb-2">
                          {item.value}
                        </p>
                        <p className="text-muted small mb-0">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            <div className="card border-0 shadow rounded-4 mt-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                  <div>
                    <h5 className="fw-bold mb-2">Visit Our Shop</h5>
                    <p className="text-muted mb-0">{ADDRESS}</p>
                  </div>
                  <a
                    href={MAP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-danger rounded-pill px-4"
                  >
                    Open in Google Maps
                  </a>
                </div>

                <div className="rounded-4 overflow-hidden border">
                  <iframe
                    src={mapEmbedUrl}
                    title="The Little Mango Tree location"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
