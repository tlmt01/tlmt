"use client";

interface Props {
  measurements: Record<string, string>;
  setMeasurements: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const kurtiFields = [
  "Shoulder",
  "Upper Chest",
  "Chest",
  "Waist",
  "Hip",
  "Slit",
  "Cross Front",
  "Cross Back",
  "Bust Width",
  "Front Length",
  "Back Length",
];

const sleeveFields = [
  "Sleeve Length",
  "Upper Arm",
  "Sleeve Round",
  "Elbow Length",
  "Elbow Round",
];

const salwarFields = [
  "Salwar Length",
  "Band Length",
  "Crotch Length",
  "Thigh Round",
  "Knee Length",
  "Knee Round",
  "Calf Length",
  "Calf Round",
  "Ankle Round",
];

const bodyFields = [
  "AEL",
  "Bust Point",
  "Waist Length",
  "Slit Length",
  "Front Neck",
  "Back Neck",
];

export default function MeasurementForm({
  measurements,
  setMeasurements,
}: Props) {
  const renderFields = (title: string, fields: string[]) => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-success text-white fw-bold">{title}</div>

      <div className="card-body">
        <div className="row">
          {fields.map((field) => (
            <div key={field} className="col-lg-4 col-md-6 mb-3">
              <label className="form-label fw-semibold">{field}</label>

              <input
                type="text"
                className="form-control"
                placeholder="Inch"
                value={measurements[field] || ""}
                onChange={(e) =>
                  setMeasurements((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderFields("Kurti / Blouse Measurements", kurtiFields)}

      {renderFields("Sleeve Measurements", sleeveFields)}

      {renderFields("Salwar Measurements", salwarFields)}

      {renderFields("Body Measurements", bodyFields)}
    </>
  );
}
