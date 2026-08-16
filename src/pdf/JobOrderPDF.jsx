"use client";

import React from "react";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import Logo from "../images/tlmtinvlogo.png";
import { SHOP_NAME, SHORT_SHOP_NAME } from "../modules/constants";
import { formatDate } from "../modules/calculatefunctions";
/* ================================================================
   CONSTANTS
================================================================ */

const BORDER = "0.8 solid #111111";

const LOGO_PATH = "/images/tlmt.jpg";

/* ================================================================
   STYLES
================================================================ */

const styles = StyleSheet.create({
  /* ================================================================
     PAGE
  ================================================================ */

  page: {
    padding: 12,
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#111111",
    backgroundColor: "#ffffff",
  },

  outer: {
    width: "100%",
    height: "100%",
    border: BORDER,
    flexDirection: "column",
  },

  row: {
    flexDirection: "row",
    width: "100%",
  },

  bold: {
    fontFamily: "Helvetica-Bold",
  },

  center: {
    textAlign: "center",
  },

  /* ================================================================
     MAIN TITLE
  ================================================================ */

  titleRow: {
    height: 38,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  title: {
    fontSize: 25,
    fontFamily: "Helvetica-Bold",
  },

  /* ================================================================
     LEFT CUSTOMER SECTION
  ================================================================ */

  customerArea: {
    width: "44%",
    borderRight: BORDER,
    flexDirection: "column",
    minHeight: 0,
  },

  measurementArea: {
    width: "56%",
    flexDirection: "column",
    minHeight: 0,
  },

  /* ================================================================
     CUSTOMER HEADER
  ================================================================ */

  customerTop: {
    height: 92,
    flexDirection: "column",
    flexShrink: 0,
  },

  /* ------------------------------------------------
     Top information row
  ------------------------------------------------ */

  metaRow: {
    height: 21,
    flexDirection: "row",
    flexShrink: 0,
  },

  metaCell: {
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  metaJobLabel: {
    width: "24%",
  },

  metaJobValue: {
    width: "15%",
  },

  metaDeliveryLabel: {
    width: "35%",
  },

  metaBillValue: {
    width: "26%",
    borderRight: 0,
  },

  /* ------------------------------------------------
     Customer information
  ------------------------------------------------ */

  customerInfoBody: {
    flex: 1,
    flexDirection: "row",
  },

  logoBox: {
    width: "24%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },

  logo: {
    width: 62,
    height: 62,
    objectFit: "contain",
  },

  customerInfo: {
    width: "76%",
    flexDirection: "column",
  },

  customerInfoRow: {
    flexDirection: "row",
    height: 23.5,
  },

  customerInfoLabel: {
    width: "18%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  customerInfoValue: {
    width: "42%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  customerInfoLabelSmall: {
    width: "18%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  customerInfoValueSmall: {
    width: "22%",
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  /* ================================================================
     FITTINGS / LININGS
  ================================================================ */

  fittingHeader: {
    height: 18,
    flexDirection: "row",
    flexShrink: 0,
  },

  fittingTitle: {
    width: "50%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  liningTitle: {
    width: "50%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  fittingRow: {
    flexDirection: "row",
    height: 18,
    flexShrink: 0,
  },

  fittingLabel: {
    width: "28%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingLeft: 4,
    justifyContent: "center",
  },

  fittingValue: {
    width: "22%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  liningLabel: {
    width: "22%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingLeft: 4,
    justifyContent: "center",
  },

  liningValue: {
    width: "13%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  liningValueLast: {
    width: "15%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     BOTTOM DESIGN
  ================================================================ */

  bottomHeader: {
    height: 21,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    flexShrink: 0,
  },

  bottomSubHeader: {
    flexDirection: "row",
    height: 18,
    flexShrink: 0,
  },

  bottomGroup: {
    width: "33.3333%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomGroupLast: {
    width: "33.3333%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomOptions: {
    flexDirection: "row",
    height: 22,
    flexShrink: 0,
  },

  bottomOption: {
    flex: 1,
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomOptionLast: {
    flex: 1,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     SLEEVE TYPE
  ================================================================ */

  simpleRow: {
    flexDirection: "row",
    height: 22,
    flexShrink: 0,
  },

  simpleLabel: {
    width: "28%",
    borderRight: BORDER,
    borderBottom: BORDER,
    padding: 4,
    justifyContent: "center",
  },

  simpleValue: {
    width: "72%",
    borderBottom: BORDER,
    padding: 4,
    justifyContent: "center",
  },

  /* ================================================================
     DART / ZIP
  ================================================================ */

  dartRow: {
    flexDirection: "row",
    height: 22,
    flexShrink: 0,
  },

  dartLabel: {
    width: "20%",
    borderRight: BORDER,
    borderBottom: BORDER,
    padding: 4,
    justifyContent: "center",
  },

  dartOption: {
    width: "15%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     COMMENTS

     flex: 1 makes this area occupy the remaining height.
  ================================================================ */

  commentsRow: {
    flexDirection: "row",
    flex: 1,
    minHeight: 0,
  },

  commentsLabel: {
    width: "24%",
    borderRight: BORDER,
    padding: 5,
    paddingTop: 8,
    justifyContent: "flex-start",
  },

  commentsValue: {
    width: "76%",
    padding: 5,
  },

  /* ================================================================
     MEASUREMENTS HEADER
  ================================================================ */

  measurementsTitle: {
    height: 22,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  measurementsTitleText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  measurementHeader: {
    height: 20,
    flexDirection: "row",
    flexShrink: 0,
  },

  kurtaHeader: {
    width: "69%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
  },

  sleeveHeader: {
    width: "31%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
  },

  /* ================================================================
     MEASUREMENT ROW
  ================================================================ */

  measurementRow: {
    flexDirection: "row",
    height: 18,
    flexShrink: 0,
  },

  measurementLabel: {
    width: "22%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  measurementValue: {
    width: "9%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  measurementLabel2: {
    width: "27%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  measurementValue2: {
    width: "11%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  sleeveLabel: {
    width: "21%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  sleeveValue: {
    width: "10%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     SALWAR / CHUDI
  ================================================================ */

  salwarHeader: {
    height: 21,
    flexDirection: "row",
    flexShrink: 0,
  },

  salwarTitle: {
    width: "40%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  neckFrontTitle: {
    width: "60%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
  },

  salwarBody: {
    flexDirection: "row",
    flexShrink: 0,
  },

  salwarMeasurements: {
    width: "40%",
    borderRight: BORDER,
    flexDirection: "column",
  },

  neckFront: {
    width: "60%",
    height: 162,
    borderBottom: BORDER,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  salwarRow: {
    flexDirection: "row",
    height: 18,
    flexShrink: 0,
  },

  salwarLabel: {
    width: "75%",
    borderBottom: BORDER,
    paddingLeft: 4,
    justifyContent: "center",
  },

  salwarValue: {
    width: "25%",
    borderLeft: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     SPECIFICATION
  ================================================================ */

  specification: {
    height: 55,
    borderBottom: BORDER,
    padding: 5,
    flexShrink: 0,
  },

  specificationTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },

  /* ================================================================
     BACK NECK / SWATCH
  ================================================================ */

  bottomRightHeader: {
    height: 21,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
    flexShrink: 0,
  },

  bottomRightBody: {
    flexDirection: "row",
    height: 100,
    flexShrink: 0,
  },

  neckBack: {
    width: "70%",
    borderRight: BORDER,
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  swatch: {
    width: "30%",
    borderBottom: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  designImage: {
    maxWidth: "100%",
    maxHeight: 90,
    objectFit: "contain",
  },
});

/* ================================================================
   HELPERS
================================================================ */

function displayValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return "";
  }

  return String(value);
}

function CheckBox({ checked }) {
  return (
    <Text
      style={{
        fontSize: 8,
        fontFamily: "Helvetica",
      }}
    >
      {checked ? "☑" : "☐"}
    </Text>
  );
}

/* ================================================================
   MEASUREMENT ROW
================================================================ */

function MeasurementRow({
  label1 = "",
  value1 = "",
  label2 = "",
  value2 = "",
  sleeveLabel = "",
  sleeveValue = "",
}) {
  return (
    <View style={styles.measurementRow}>
      <View style={styles.measurementLabel}>
        <Text>{label1}</Text>
      </View>

      <View style={styles.measurementValue}>
        <Text>{displayValue(value1)}</Text>
      </View>

      <View style={styles.measurementLabel2}>
        <Text>{label2}</Text>
      </View>

      <View style={styles.measurementValue2}>
        <Text>{displayValue(value2)}</Text>
      </View>

      <View style={styles.sleeveLabel}>
        <Text>{sleeveLabel}</Text>
      </View>

      <View style={styles.sleeveValue}>
        <Text>{displayValue(sleeveValue)}</Text>
      </View>
    </View>
  );
}

/* ================================================================
   SALWAR ROW
================================================================ */

function SalwarRow({ label, value }) {
  return (
    <View style={styles.salwarRow}>
      <View style={styles.salwarLabel}>
        <Text>{label}</Text>
      </View>

      <View style={styles.salwarValue}>
        <Text>{displayValue(value)}</Text>
      </View>
    </View>
  );
}

/* ================================================================
   JOB ORDER PDF
================================================================ */

export function JobOrderPDF({ order = {} }) {
  const customer = order.customer || {};

  const measurements = order.measurements || {};

  const design = order.design || {};

  /*
   * Support both:
   *
   * measurements.kurta
   * measurements.kurti
   *
   * because your pieceType may be Blouse/Kurta/etc.
   */

  const kurta =
    measurements.kurta ||
    measurements.kurti ||
    measurements.blouse ||
    measurements.upper ||
    {};

  const sleeve = measurements.sleeve || {};

  const bottom =
    measurements.bottom || measurements.salwar || measurements.chudi || {};

  const body = measurements.body || {};

  /*
   * Design information
   */

  const fitting = design.fitting || "";

  const liningMaterial = design.liningMaterial || design.lining || "";

  const liningTop = design.liningTop === true || design.lining === "Top";

  const liningBottom =
    design.liningBottom === true || design.lining === "Bottom";

  const bottomType = bottom.type || design.bottomType || "";

  /*
   * Design sketch
   *
   * Your Firestore order already contains:
   *
   * order.designSketchUrl
   */

  const designSketch = order.designSketchUrl || "";

  return (
    <Document
      title={`Job Order ${order.orderNo || ""}`}
      author="The Little Mango Tree"
      subject="Job Order Measurement Sheet"
      creator="The Little Mango Tree"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outer}>
          {/* ============================================================
              TITLE
          ============================================================ */}

          <View style={styles.titleRow}>
            <Text style={styles.title}>Job Order</Text>
          </View>

          {/* ============================================================
              MAIN CONTENT
          ============================================================ */}

          <View style={styles.row}>
            {/* ==========================================================
                LEFT SIDE
            ========================================================== */}

            <View style={styles.customerArea}>
              {/* --------------------------------------------------------
                  CUSTOMER HEADER
              -------------------------------------------------------- */}

              <View style={styles.customerTop}>
                {/* ------------------------------------------------------
                    JOB ORDER / DELIVERY DATE
                ------------------------------------------------------ */}

                <View style={styles.metaRow}>
                  <View style={[styles.metaCell, styles.metaJobLabel]}>
                    <Text>Job Order No</Text>
                  </View>

                  <View style={[styles.metaCell, styles.metaJobValue]}>
                    <Text>{order.orderNo || ""}</Text>
                  </View>

                  <View style={[styles.metaCell, styles.metaDeliveryLabel]}>
                    <Text>Delivery Date</Text>
                  </View>

                  <View style={[styles.metaCell, styles.metaBillValue]}>
                    <Text>{formatDate(order.deliveryDate) || ""}</Text>
                  </View>
                </View>

                {/* ------------------------------------------------------
                    CUSTOMER DETAILS
                ------------------------------------------------------ */}

                <View style={styles.customerInfoBody}>
                  {/* LOGO */}

                  <View style={styles.logoBox}>
                    <Image src={Logo.src} style={styles.logo} />
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 8,
                        fontWeight: "bold",
                      }}
                    >
                      {SHOP_NAME}
                    </Text>
                  </View>

                  {/* CUSTOMER INFORMATION */}

                  <View style={styles.customerInfo}>
                    {/* NAME + PHONE */}

                    <View style={styles.customerInfoRow}>
                      <View style={styles.customerInfoLabel}>
                        <Text>Name</Text>
                      </View>

                      <View style={styles.customerInfoValue}>
                        <Text>{customer.name || ""}</Text>
                      </View>

                      <View style={styles.customerInfoLabelSmall}>
                        <Text>Phone{"\n"}Number</Text>
                      </View>

                      <View style={styles.customerInfoValueSmall}>
                        <Text>{customer.phone || ""}</Text>
                      </View>
                    </View>

                    {/* ADDRESS + CUSTOMER ID */}

                    <View style={styles.customerInfoRow}>
                      <View style={styles.customerInfoLabel}>
                        <Text>Address:</Text>
                      </View>

                      <View style={styles.customerInfoValue}>
                        <Text>{customer.address || ""}</Text>
                      </View>

                      <View style={styles.customerInfoLabelSmall}>
                        <Text>Customer Id</Text>
                      </View>

                      <View style={styles.customerInfoValueSmall}>
                        <Text>{customer.phone || ""}</Text>
                      </View>
                    </View>

                    {/* EMPTY ROW
                        Preserves original paper layout */}

                    <View style={styles.customerInfoRow}>
                      <View style={styles.customerInfoLabel} />

                      <View style={styles.customerInfoValue} />

                      <View style={styles.customerInfoLabelSmall} />

                      <View style={styles.customerInfoValueSmall} />
                    </View>
                  </View>
                </View>
              </View>

              {/* ========================================================
                  FITTINGS / LININGS
              ======================================================== */}

              <View style={styles.fittingHeader}>
                <View style={styles.fittingTitle}>
                  <Text>Fittings</Text>
                </View>

                <View style={styles.liningTitle}>
                  <Text>Linings</Text>
                </View>
              </View>

              {/* Tight / Top */}

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Tight</Text>
                </View>

                <View style={styles.fittingValue}>
                  <CheckBox checked={fitting === "Tight"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Top</Text>
                </View>

                <View style={styles.liningValue}>
                  <CheckBox checked={liningTop} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              {/* Loose / Crepe */}

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Loose</Text>
                </View>

                <View style={styles.fittingValue}>
                  <CheckBox checked={fitting === "Loose"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Crepe</Text>
                </View>

                <View style={styles.liningValue}>
                  <CheckBox checked={liningMaterial === "Crepe"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              {/* Normal / Cotton */}

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Normal</Text>
                </View>

                <View style={styles.fittingValue}>
                  <CheckBox checked={fitting === "Normal"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Cotton</Text>
                </View>

                <View style={styles.liningValue}>
                  <CheckBox checked={liningMaterial === "Cotton"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              {/* Others */}

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel} />

                <View style={styles.fittingValue} />

                <View style={styles.liningLabel}>
                  <Text>Others</Text>
                </View>

                <View style={styles.liningValue}>
                  <CheckBox checked={liningMaterial === "Others"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              {/* ========================================================
                  BOTTOM DESIGN
              ======================================================== */}

              <View style={styles.bottomHeader}>
                <Text>Bottom Design</Text>
              </View>

              <View style={styles.bottomSubHeader}>
                <View style={styles.bottomGroup}>
                  <Text>Salwar</Text>
                </View>

                <View style={styles.bottomGroup}>
                  <Text>Chudidhar</Text>
                </View>

                <View style={styles.bottomGroupLast}>
                  <Text>Patiala</Text>
                </View>
              </View>

              <View style={styles.bottomOptions}>
                <View style={styles.bottomOption}>
                  <CheckBox checked={bottomType === "Normal"} />

                  <Text>Normal</Text>
                </View>

                <View style={styles.bottomOption}>
                  <CheckBox checked={bottomType === "Max Flare"} />

                  <Text>Max Flare</Text>
                </View>

                <View style={styles.bottomOption}>
                  <CheckBox checked={bottomType === "Tight"} />

                  <Text>Tight</Text>
                </View>

                <View style={styles.bottomOption}>
                  <CheckBox checked={bottomType === "Normal Chudidhar"} />

                  <Text>Normal</Text>
                </View>

                <View style={styles.bottomOption}>
                  <CheckBox checked={bottomType === "Semi"} />

                  <Text>Semi</Text>
                </View>

                <View style={styles.bottomOptionLast}>
                  <CheckBox checked={bottomType === "Full"} />

                  <Text>Full</Text>
                </View>
              </View>

              {/* ========================================================
                  SLEEVE TYPE
              ======================================================== */}

              <View style={styles.simpleRow}>
                <View style={styles.simpleLabel}>
                  <Text>Sleeve Type</Text>
                </View>

                <View style={styles.simpleValue}>
                  <Text>{design.sleeveType || sleeve.type || ""}</Text>
                </View>
              </View>

              {/* ========================================================
                  DART
              ======================================================== */}

              <View style={styles.dartRow}>
                <View style={styles.dartLabel}>
                  <Text>Dart</Text>
                </View>

                <View style={styles.dartOption}>
                  <Text>Front</Text>
                </View>

                <View style={styles.dartOption}>
                  <CheckBox checked={design.dart === "Front"} />
                </View>

                <View style={styles.dartOption}>
                  <Text>Back</Text>
                </View>

                <View
                  style={[
                    styles.dartOption,
                    {
                      borderRight: 0,
                    },
                  ]}
                >
                  <CheckBox checked={design.dart === "Back"} />
                </View>
              </View>

              {/* ========================================================
                  ZIP
              ======================================================== */}

              <View style={styles.dartRow}>
                <View style={styles.dartLabel}>
                  <Text>Zip</Text>
                </View>

                <View style={styles.dartOption}>
                  <Text>Front</Text>
                </View>

                <View style={styles.dartOption}>
                  <CheckBox checked={design.zip === "Front"} />
                </View>

                <View style={styles.dartOption}>
                  <Text>Back</Text>
                </View>

                <View
                  style={[
                    styles.dartOption,
                    {
                      borderRight: 0,
                    },
                  ]}
                >
                  <CheckBox checked={design.zip === "Back"} />
                </View>
              </View>

              {/* ========================================================
                  COMMENTS
              ======================================================== */}

              <View style={styles.commentsRow}>
                <View style={styles.commentsLabel}>
                  <Text>Comments</Text>
                </View>

                <View style={styles.commentsValue}>
                  <Text>
                    {design.comments || design.remarks || order.remarks || ""}
                  </Text>
                </View>
              </View>
            </View>

            {/* ==========================================================
                RIGHT SIDE
            ========================================================== */}

            <View style={styles.measurementArea}>
              {/* --------------------------------------------------------
                  MEASUREMENTS TITLE
              -------------------------------------------------------- */}

              <View style={styles.measurementsTitle}>
                <Text style={styles.measurementsTitleText}>Measurements</Text>
              </View>

              {/* --------------------------------------------------------
                  KURTA / SLEEVE HEADER
              -------------------------------------------------------- */}

              <View style={styles.measurementHeader}>
                <View style={styles.kurtaHeader}>
                  <Text>Kurta / Blouse</Text>
                </View>

                <View style={styles.sleeveHeader}>
                  <Text>Sleeve</Text>
                </View>
              </View>

              {/* ========================================================
                  KURTA / BLOUSE MEASUREMENTS
              ======================================================== */}

              <MeasurementRow
                label1="Shoulder"
                value1={kurta.shoulder}
                label2="Full Length - Back"
                value2={kurta.fullLengthBack || kurta.backLength}
                sleeveLabel="Length"
                sleeveValue={sleeve.length}
              />

              <MeasurementRow
                label1="Upper Chest"
                value1={kurta.upperChest}
                label2="Full Length - Front"
                value2={kurta.fullLengthFront || kurta.frontLength}
                sleeveLabel="UAR"
                sleeveValue={sleeve.uar || sleeve.upperArm}
              />

              <MeasurementRow
                label1="Chest R"
                value1={kurta.chestR || kurta.chest}
                label2="AEL"
                value2={kurta.ael || body.ael}
                sleeveLabel="Round"
                sleeveValue={sleeve.round}
              />

              <MeasurementRow
                label1="Waist R"
                value1={kurta.waistR || kurta.waist}
                label2="Bust Point"
                value2={kurta.bustPoint || body.bustPoint}
                sleeveLabel="*Elbow - Length"
                sleeveValue={sleeve.elbowLength}
              />

              <MeasurementRow
                label1="*Slit R"
                value1={kurta.slitR}
                label2="Waist Length"
                value2={kurta.waistLength || body.waistLength}
                sleeveLabel="*Elbow - Round"
                sleeveValue={sleeve.elbowRound}
              />

              <MeasurementRow
                label1="Cross Front"
                value1={kurta.crossFront}
                label2="*Slit Length"
                value2={kurta.slitLength || body.slitLength}
                sleeveLabel=""
                sleeveValue=""
              />

              <MeasurementRow
                label1="Cross Back"
                value1={kurta.crossBack}
                label2="Front Neck"
                value2={kurta.frontNeck || body.frontNeck}
                sleeveLabel=""
                sleeveValue=""
              />

              <MeasurementRow
                label1="*Bust Width"
                value1={kurta.bustWidth}
                label2="Back Neck"
                value2={kurta.backNeck || body.backNeck}
                sleeveLabel=""
                sleeveValue=""
              />

              {/* ========================================================
                  SALWAR / CHUDI + FRONT NECK
              ======================================================== */}

              <View style={styles.salwarHeader}>
                <View style={styles.salwarTitle}>
                  <Text>Salwar / Chudi</Text>
                </View>

                <View style={styles.neckFrontTitle}>
                  <Text>Neck Design - Front</Text>
                </View>
              </View>

              <View style={styles.salwarBody}>
                {/* SALWAR MEASUREMENTS */}

                <View style={styles.salwarMeasurements}>
                  <SalwarRow
                    label="Full Length"
                    value={bottom.fullLength || bottom.length}
                  />

                  <SalwarRow label="Band Length" value={bottom.bandLength} />

                  <SalwarRow
                    label="Crotch Length"
                    value={bottom.crotchLength}
                  />

                  <SalwarRow label="Ankle Round" value={bottom.ankleRound} />

                  <SalwarRow
                    label="*Thigh R"
                    value={bottom.thighR || bottom.thigh}
                  />

                  <SalwarRow
                    label="*Knee L"
                    value={bottom.kneeL || bottom.kneeLength}
                  />

                  <SalwarRow
                    label="*Knee R"
                    value={bottom.kneeR || bottom.kneeRound}
                  />

                  <SalwarRow
                    label="*Calf L"
                    value={bottom.calfL || bottom.calfLength}
                  />

                  <SalwarRow
                    label="*Calf R"
                    value={bottom.calfR || bottom.calfRound}
                  />
                </View>

                {/* FRONT NECK DESIGN */}

                <View style={styles.neckFront}>
                  {designSketch ? (
                    <Image src={designSketch.src} style={styles.designImage} />
                  ) : design.neckFrontImage ? (
                    <Image
                      src={design.neckFrontImage.src}
                      style={styles.designImage}
                    />
                  ) : design.frontNeckImage ? (
                    <Image
                      src={design.frontNeckImage.src}
                      style={styles.designImage}
                    />
                  ) : (
                    <Text>{design.frontNeck || design.neckFront || ""}</Text>
                  )}
                </View>
              </View>

              {/* ========================================================
                  SPECIFICATION
              ======================================================== */}

              <View style={styles.specification}>
                <Text style={styles.specificationTitle}>Specification</Text>

                <Text>{design.specification || order.specification || ""}</Text>
              </View>

              {/* ========================================================
                  BACK NECK
              ======================================================== */}

              <View style={styles.bottomRightHeader}>
                <Text>Neck Design - Back</Text>
              </View>

              <View style={styles.bottomRightBody}>
                <View style={styles.neckBack}>
                  {design.backNeckImage ? (
                    <Image
                      src={design.backNeckImage.src}
                      style={styles.designImage}
                    />
                  ) : design.neckBackImage ? (
                    <Image
                      src={design.neckBackImage.src}
                      style={styles.designImage}
                    />
                  ) : (
                    <Text>{design.backNeck || design.neckBack || ""}</Text>
                  )}
                </View>

                {/* SWATCH */}

                <View style={styles.swatch}>
                  {design.swatchImage ? (
                    <Image
                      src={design.swatchImage.src}
                      style={styles.designImage.src}
                    />
                  ) : design.swatchUrl ? (
                    <Image
                      src={design.swatchUrl}
                      style={styles.designImage.src}
                    />
                  ) : (
                    <Text>Swatch</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ================================================================
   DOWNLOAD FUNCTION
================================================================ */

export async function downloadJobOrderPDF(order) {
  try {
    const blob = await pdf(<JobOrderPDF order={order} />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `Job Order ${order?.orderNo || "Job-Order"}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    /*
     * Give the browser a moment before
     * releasing the object URL.
     */

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("Job Order PDF generation failed:", error);

    throw error;
  }
}

/* ================================================================
   DOWNLOAD BUTTON
================================================================ */

export default function JobOrderPDFDownloadButton({
  order,
  className = "btn btn-success",
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    if (!order) {
      alert("Job Order data is not available.");

      return;
    }

    try {
      setLoading(true);

      await downloadJobOrderPDF(order);
    } catch (error) {
      console.error(error);

      alert("Unable to generate the Job Order PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          Generating PDF...
        </>
      ) : (
        <>
          <i className="bi bi-file-earmark-pdf me-2" />
          Download Job Order PDF
        </>
      )}
    </button>
  );
}
