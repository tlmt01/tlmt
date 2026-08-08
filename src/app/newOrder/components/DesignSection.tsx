"use client";

interface Props {
  pieceType: string;
  design: Record<string, string>;
  setDesign: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const sleeveTypes = [
  "Normal",
  "Puff",
  "Bell",
  "Sleeveless",
  "3/4 Sleeve",
  "Full Sleeve",
];

const bottomStyles = ["Normal", "Churidar", "Patiala", "Palazzo", "Pant"];

const fittingOptions = ["Normal", "Tight", "Loose"];

const liningOptions = ["No", "Top Only", "Bottom Only", "Full"];

const zipOptions = ["None", "Front", "Back", "Side"];

function RadioGroup({
  title,
  field,
  options,
  design,
  setDesign,
}: {
  title: string;
  field: string;
  options: string[];
  design: Record<string, string>;
  setDesign: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="mb-4">
      <label className="fw-bold d-block mb-2">{title}</label>

      <div className="d-flex flex-wrap gap-3">
        {options.map((item) => (
          <div key={item} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={field}
              id={`${field}-${item}`}
              checked={design[field] === item}
              onChange={() =>
                setDesign((prev) => ({
                  ...prev,
                  [field]: item,
                }))
              }
            />

            <label htmlFor={`${field}-${item}`} className="form-check-label">
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignSection({ pieceType, design, setDesign }: Props) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-warning fw-bold">
        {pieceType === "Blouse"
          ? "Blouse Design Details"
          : "Kurti Design Details"}
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Front Neck</label>

            <input
              className="form-control"
              value={design.frontNeck || ""}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  frontNeck: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Back Neck</label>

            <input
              className="form-control"
              value={design.backNeck || ""}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  backNeck: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <RadioGroup
          title="Sleeve Type"
          field="sleeveType"
          options={sleeveTypes}
          design={design}
          setDesign={setDesign}
        />

        <RadioGroup
          title="Bottom Style"
          field="bottomStyle"
          options={bottomStyles}
          design={design}
          setDesign={setDesign}
        />

        <RadioGroup
          title="Fitting"
          field="fitting"
          options={fittingOptions}
          design={design}
          setDesign={setDesign}
        />

        <RadioGroup
          title="Lining"
          field="lining"
          options={liningOptions}
          design={design}
          setDesign={setDesign}
        />

        <RadioGroup
          title="Zip"
          field="zip"
          options={zipOptions}
          design={design}
          setDesign={setDesign}
        />

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Darts</label>

            <input
              className="form-control"
              value={design.dart || ""}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  dart: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Special Work</label>

            <input
              className="form-control"
              value={design.work || ""}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  work: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Remarks</label>

          <textarea
            rows={4}
            className="form-control"
            value={design.remarks || ""}
            onChange={(e) =>
              setDesign((prev) => ({
                ...prev,
                remarks: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
