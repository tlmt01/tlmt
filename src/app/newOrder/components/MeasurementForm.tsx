"use client";

interface Props {
  pieceType: string;
  measurements: Record<string, string>;
  setMeasurements: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const kurtiFields = [
  "Shoulder",
  "Upper Chest",
  "Chest",
  "Waist",
  "Hip",
  "Slit Length",
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
  pieceType,
  measurements,
  setMeasurements,
}: Props) {
  const measurementTitle =
    pieceType === "Blouse" ? "Blouse Measurements" : "Kurti Measurements";

  const renderFields = (title: string, fields: string[]) => (
    <div className="card shadow-sm border-0 h-100 mb-4">
      <div className="card-header bg-success text-white fw-bold">{title}</div>

      <div className="card-body">
        <div className="row g-2">
          {fields.map((field) => (
            <div
              key={field}
              className="d-flex flex-row col-xl-3 col-lg-4 col-md-6 justify-content-between align-items-center gap-2"
            >
              <label className="form-label fw-semibold small">{field}</label>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Inch"
                style={{ maxWidth: "120px" }}
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
      <div className="row g-2">
        <div className="col-md-6 col-12">
          {renderFields(measurementTitle, kurtiFields)}
        </div>
        <div className="col-md-6 col-12">
          {renderFields("Body Measurements", bodyFields)}
        </div>
      </div>

      <div className="row g-2">
        <div className="col-md-6 col-12">
          {renderFields("Sleeve Measurements", sleeveFields)}
        </div>
        <div className="col-md-6 col-12">
          {renderFields("Salwar Measurements", salwarFields)}
        </div>
      </div>
    </>
  );
}
