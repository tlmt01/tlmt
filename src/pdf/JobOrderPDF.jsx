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
  PDFViewer,
} from "@react-pdf/renderer";
import Logo from "../images/tlmtinvlogo.png";
import { SHOP_NAME, SHORT_SHOP_NAME } from "../modules/constants";
const width = 2480;
const height = 3508;
/*
|--------------------------------------------------------------------------
| Job Order PDF
|--------------------------------------------------------------------------
| A4 Landscape
| Designed to closely reproduce the supplied paper Job Order format.
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  page: {
    size: "A4",
    padding: 14,
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#111",
  },

  outer: {
    border: "1 solid #111",
    width: "100%",
    height: "100%",
  },

  /* ---------------------------------------------------------------------- */
  /* Header                                                                  */
  /* ---------------------------------------------------------------------- */

  titleRow: {
    height: 38,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
  },

  /* ---------------------------------------------------------------------- */
  /* General                                                                 */
  /* ---------------------------------------------------------------------- */

  row: {
    flexDirection: "row",
    width: "100%",
  },

  cell: {
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  cellLast: {
    borderBottom: "1 solid #111",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  center: {
    textAlign: "center",
  },

  bold: {
    fontWeight: "bold",
  },

  small: {
    fontSize: 6.5,
  },

  /* ---------------------------------------------------------------------- */
  /* Top Customer Area                                                       */
  /* ---------------------------------------------------------------------- */

  customerArea: {
    width: "44%",
    borderRight: "1 solid #111",
  },

  measurementArea: {
    width: "56%",
  },

  customerTop: {
    height: 92,
    flexDirection: "row",
  },

  logoBox: {
    width: "27%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  logo: {
    width: 65,
    height: 65,
    objectFit: "contain",
  },

  customerInfo: {
    width: "73%",
  },

  infoRow: {
    flexDirection: "row",
    minHeight: 22,
  },

  infoLabel: {
    width: "30%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    padding: 4,
    justifyContent: "center",
  },

  infoValue: {
    width: "70%",
    borderBottom: "1 solid #111",
    padding: 4,
    justifyContent: "center",
  },

  addressLabel: {
    width: "30%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    padding: 4,
  },

  addressValue: {
    width: "70%",
    borderBottom: "1 solid #111",
    padding: 4,
    minHeight: 44,
  },

  /* ---------------------------------------------------------------------- */
  /* Measurements                                                            */
  /* ---------------------------------------------------------------------- */

  measurementsTitle: {
    height: 22,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  measurementsTitleText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  measurementHeader: {
    height: 20,
    flexDirection: "row",
  },

  kurtaHeader: {
    width: "69%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  sleeveHeader: {
    width: "31%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  measurementRow: {
    flexDirection: "row",
    height: 18,
  },

  measurementLabel: {
    width: "22%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  measurementValue: {
    width: "9%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  measurementLabel2: {
    width: "27%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  measurementValue2: {
    width: "11%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  sleeveLabel: {
    width: "21%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    paddingHorizontal: 3,
    justifyContent: "center",
  },

  sleeveValue: {
    width: "10%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* Left lower section                                                      */
  /* ---------------------------------------------------------------------- */

  lowerArea: {
    flexDirection: "row",
    width: "100%",
  },

  leftColumn: {
    width: "44%",
    borderRight: "1 solid #111",
  },

  rightColumn: {
    width: "56%",
  },

  sectionTitle: {
    height: 21,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 9,
  },

  /* ---------------------------------------------------------------------- */
  /* Fittings / Linings                                                       */
  /* ---------------------------------------------------------------------- */

  fittingHeader: {
    height: 18,
    flexDirection: "row",
  },

  fittingTitle: {
    width: "50%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  liningTitle: {
    width: "50%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  fittingRow: {
    flexDirection: "row",
    height: 18,
  },

  fittingLabel: {
    width: "28%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    paddingLeft: 4,
    justifyContent: "center",
  },

  fittingValue: {
    width: "22%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  liningLabel: {
    width: "22%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    paddingLeft: 4,
    justifyContent: "center",
  },

  liningValue: {
    width: "13%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  liningValueLast: {
    width: "15%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* Bottom Design                                                           */
  /* ---------------------------------------------------------------------- */

  bottomHeader: {
    height: 21,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 9,
  },

  bottomSubHeader: {
    flexDirection: "row",
    height: 18,
  },

  bottomGroup: {
    width: "33.33%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomGroupLast: {
    width: "33.33%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomOptions: {
    flexDirection: "row",
    height: 22,
  },

  bottomOption: {
    flex: 1,
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomOptionLast: {
    flex: 1,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* Sleeve Type / Dart / Zip / Comments                                     */
  /* ---------------------------------------------------------------------- */

  simpleRow: {
    flexDirection: "row",
    minHeight: 21,
  },

  simpleLabel: {
    width: "28%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    padding: 4,
    justifyContent: "center",
  },

  simpleValue: {
    width: "72%",
    borderBottom: "1 solid #111",
    padding: 4,
    justifyContent: "center",
  },

  dartRow: {
    flexDirection: "row",
    height: 22,
  },

  dartLabel: {
    width: "20%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    padding: 4,
    justifyContent: "center",
  },

  dartOption: {
    width: "15%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  dartValue: {
    width: "50%",
    borderBottom: "1 solid #111",
    padding: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* Salwar                                                                  */
  /* ---------------------------------------------------------------------- */

  salwarHeader: {
    height: 21,
    flexDirection: "row",
  },

  salwarTitle: {
    width: "40%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 9,
  },

  neckFrontTitle: {
    width: "60%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
  },

  salwarBody: {
    flexDirection: "row",
  },

  salwarMeasurements: {
    width: "40%",
    borderRight: "1 solid #111",
  },

  neckFront: {
    width: "60%",
    minHeight: 100,
    borderBottom: "1 solid #111",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  salwarRow: {
    flexDirection: "row",
    height: 18,
  },

  salwarLabel: {
    width: "75%",
    borderBottom: "1 solid #111",
    paddingLeft: 4,
    justifyContent: "center",
  },

  salwarValue: {
    width: "25%",
    borderLeft: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* Bottom right                                                             */
  /* ---------------------------------------------------------------------- */

  bottomRightHeader: {
    height: 21,
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
  },

  bottomRightBody: {
    flexDirection: "row",
    height: 100,
  },

  neckBack: {
    width: "70%",
    borderRight: "1 solid #111",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  swatch: {
    width: "30%",
    borderBottom: "1 solid #111",
    justifyContent: "center",
    alignItems: "center",
  },

  designImage: {
    maxWidth: "100%",
    maxHeight: 90,
    objectFit: "contain",
  },

  /* ---------------------------------------------------------------------- */
  /* Specification                                                           */
  /* ---------------------------------------------------------------------- */

  specification: {
    minHeight: 55,
    borderBottom: "1 solid #111",
    padding: 5,
  },

  /* ---------------------------------------------------------------------- */
  /* Comments                                                                */
  /* ---------------------------------------------------------------------- */

  commentsRow: {
    flexDirection: "row",
    minHeight: 75,
  },

  commentsLabel: {
    width: "20%",
    borderRight: "1 solid #111",
    padding: 5,
    justifyContent: "center",
  },

  commentsValue: {
    width: "80%",
    padding: 5,
  },
});

/* ==========================================================================
   Small reusable components
========================================================================== */

function Value({ value }) {
  return <Text>{value ?? ""}</Text>;
}

function Check({ checked }) {
  return <Text style={{ fontSize: 8 }}>{checked ? "☑" : "☐"}</Text>;
}

/* ==========================================================================
   Job Order PDF Document
========================================================================== */

export function JobOrderPDF({ order }) {
  const customer = order?.customer || {};
  const m = order?.measurements || {};
  const d = order?.design || {};

  const k = m.kurta || m.kurti || {};
  const s = m.sleeve || {};
  const b = m.bottom || m.salwar || {};
  const body = m.body || {};

  return (
    // <PDFViewer
    //   style={{
    //     width: width / 3,
    //     height: height / 3,
    //   }}
    // >
    <Document
      title={`Job Order ${order?.orderNo || ""}`}
      author="The Little Mango Tree"
      subject="Tailoring Job Order"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outer}>
          {/* ================================================================
              TITLE
          ================================================================ */}

          <View style={styles.titleRow}>
            <Text style={styles.title}>Job Order</Text>
          </View>

          {/* ================================================================
              TOP AREA
          ================================================================ */}

          <View style={styles.row}>
            {/* --------------------------------------------------------------
                LEFT CUSTOMER AREA
            -------------------------------------------------------------- */}

            <View style={styles.customerArea}>
              <View style={styles.customerTop}>
                <View style={styles.logoBox}>
                  <Image src={Logo.src} style={styles.logo} />

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 9,
                      fontWeight: "bold",
                    }}
                  >
                    {SHOP_NAME}
                  </Text>
                </View>

                <View style={styles.customerInfo}>
                  {/* Job Order / Delivery / Bill */}

                  <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                      <Text>Job Order No</Text>
                    </View>

                    <View style={styles.infoValue}>
                      <Text>{order?.orderNo || ""}</Text>
                    </View>

                    <View style={styles.infoLabel}>
                      <Text>Delivery Date</Text>
                    </View>

                    <View
                      style={[
                        styles.infoValue,
                        {
                          width: "40%",
                        },
                      ]}
                    >
                      <Text>{order?.deliveryDate || ""}</Text>
                    </View>
                  </View>

                  {/* Name / Phone */}

                  <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                      <Text>Name</Text>
                    </View>

                    <View style={styles.infoValue}>
                      <Text>{customer?.name || order?.customerName || ""}</Text>
                    </View>

                    <View style={styles.infoLabel}>
                      <Text>Phone Number</Text>
                    </View>

                    <View
                      style={[
                        styles.infoValue,
                        {
                          width: "40%",
                        },
                      ]}
                    >
                      <Text>
                        {customer?.phone || order?.customerPhone || ""}
                      </Text>
                    </View>
                  </View>

                  {/* Address */}

                  <View style={styles.infoRow}>
                    <View style={styles.addressLabel}>
                      <Text>Address:</Text>
                    </View>

                    <View style={styles.addressValue}>
                      <Text>
                        {customer?.address || order?.customerAddress || ""}
                      </Text>
                    </View>
                  </View>

                  {/* Customer ID */}

                  <View style={styles.infoRow}>
                    <View style={styles.infoLabel}>
                      <Text>Customer Id</Text>
                    </View>

                    <View style={styles.infoValue}>
                      <Text>{order?.customerId || customer?.phone || ""}</Text>
                    </View>

                    <View style={styles.infoLabel}>
                      <Text>B.No.</Text>
                    </View>

                    <View
                      style={[
                        styles.infoValue,
                        {
                          width: "40%",
                        },
                      ]}
                    >
                      <Text>{order?.billNo || ""}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  FITTINGS / LININGS
              ------------------------------------------------------------ */}

              <View style={styles.fittingHeader}>
                <View style={styles.fittingTitle}>
                  <Text>Fittings</Text>
                </View>

                <View style={styles.liningTitle}>
                  <Text>Linings</Text>
                </View>
              </View>

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Tight</Text>
                </View>

                <View style={styles.fittingValue}>
                  <Check checked={d.fitting === "Tight"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Top</Text>
                </View>

                <View style={styles.liningValue}>
                  <Check checked={d.liningTop === true || d.lining === "Top"} />
                </View>

                <View style={styles.liningValueLast}>
                  <Check
                    checked={d.liningBottom === true || d.lining === "Bottom"}
                  />
                </View>
              </View>

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Loose</Text>
                </View>

                <View style={styles.fittingValue}>
                  <Check checked={d.fitting === "Loose"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Crepe</Text>
                </View>

                <View style={styles.liningValue}>
                  <Check checked={d.liningMaterial === "Crepe"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel}>
                  <Text>Normal</Text>
                </View>

                <View style={styles.fittingValue}>
                  <Check checked={d.fitting === "Normal"} />
                </View>

                <View style={styles.liningLabel}>
                  <Text>Cotton</Text>
                </View>

                <View style={styles.liningValue}>
                  <Check checked={d.liningMaterial === "Cotton"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              <View style={styles.fittingRow}>
                <View style={styles.fittingLabel} />

                <View style={styles.fittingValue} />

                <View style={styles.liningLabel}>
                  <Text>Others</Text>
                </View>

                <View style={styles.liningValue}>
                  <Check checked={d.liningMaterial === "Others"} />
                </View>

                <View style={styles.liningValueLast} />
              </View>

              {/* ------------------------------------------------------------
                  BOTTOM DESIGN
              ------------------------------------------------------------ */}

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
                  <Check checked={b.type === "Normal"} />
                  <Text>Normal</Text>
                </View>

                <View style={styles.bottomOption}>
                  <Check checked={b.type === "Max Flare"} />
                  <Text>Max Flare</Text>
                </View>

                <View style={styles.bottomOption}>
                  <Check checked={b.type === "Tight"} />
                  <Text>Tight</Text>
                </View>

                <View style={styles.bottomOption}>
                  <Check checked={b.type === "Normal Chudidhar"} />
                  <Text>Normal</Text>
                </View>

                <View style={styles.bottomOption}>
                  <Check checked={b.type === "Semi"} />
                  <Text>Semi</Text>
                </View>

                <View style={styles.bottomOptionLast}>
                  <Check checked={b.type === "Full"} />
                  <Text>Full</Text>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  SLEEVE TYPE
              ------------------------------------------------------------ */}

              <View style={styles.simpleRow}>
                <View style={styles.simpleLabel}>
                  <Text>Sleeve Type</Text>
                </View>

                <View style={styles.simpleValue}>
                  <Text>{d.sleeveType || ""}</Text>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  DART
              ------------------------------------------------------------ */}

              <View style={styles.dartRow}>
                <View style={styles.dartLabel}>
                  <Text>Dart</Text>
                </View>

                <View style={styles.dartOption}>
                  <Text>Front</Text>
                </View>

                <View style={styles.dartOption}>
                  <Check checked={d.dart === "Front"} />
                </View>

                <View style={styles.dartOption}>
                  <Text>Back</Text>
                </View>

                <View style={styles.dartOption}>
                  <Check checked={d.dart === "Back"} />
                </View>
              </View>

              {/* ------------------------------------------------------------
                  ZIP
              ------------------------------------------------------------ */}

              <View style={styles.dartRow}>
                <View style={styles.dartLabel}>
                  <Text>Zip</Text>
                </View>

                <View style={styles.dartOption}>
                  <Text>Front</Text>
                </View>

                <View style={styles.dartOption}>
                  <Check checked={d.zip === "Front"} />
                </View>

                <View style={styles.dartOption}>
                  <Text>Back</Text>
                </View>

                <View style={styles.dartOption}>
                  <Check checked={d.zip === "Back"} />
                </View>
              </View>

              {/* ------------------------------------------------------------
                  COMMENTS
              ------------------------------------------------------------ */}

              <View style={styles.commentsRow}>
                <View style={styles.commentsLabel}>
                  <Text>Comments</Text>
                </View>

                <View style={styles.commentsValue}>
                  <Text>{d.comments || d.remarks || order?.remarks || ""}</Text>
                </View>
              </View>
            </View>

            {/* ==============================================================
                RIGHT SIDE - MEASUREMENTS
            ============================================================== */}

            <View style={styles.measurementArea}>
              <View style={styles.measurementsTitle}>
                <Text style={styles.measurementsTitleText}>Measurements</Text>
              </View>

              <View style={styles.measurementHeader}>
                <View style={styles.kurtaHeader}>
                  <Text>Kurta / Blouse</Text>
                </View>

                <View style={styles.sleeveHeader}>
                  <Text>Sleeve</Text>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  Measurement rows
              ------------------------------------------------------------ */}

              <MeasurementRow
                label1="Shoulder"
                value1={k.shoulder}
                label2="Full Length - Back"
                value2={k.fullLengthBack || k.backLength}
                sleeveLabel="Length"
                sleeveValue={s.length}
              />

              <MeasurementRow
                label1="Upper Chest"
                value1={k.upperChest}
                label2="Full Length - Front"
                value2={k.fullLengthFront || k.frontLength}
                sleeveLabel="UAR"
                sleeveValue={s.uar || s.upperArm}
              />

              <MeasurementRow
                label1="Chest R"
                value1={k.chestR || k.chest}
                label2="AEL"
                value2={k.ael || body.ael}
                sleeveLabel="Round"
                sleeveValue={s.round}
              />

              <MeasurementRow
                label1="Waist R"
                value1={k.waistR || k.waist}
                label2="Bust Point"
                value2={k.bustPoint || body.bustPoint}
                sleeveLabel="*Elbow - Length"
                sleeveValue={s.elbowLength}
              />

              <MeasurementRow
                label1="*Slit R"
                value1={k.slitR}
                label2="Waist Length"
                value2={k.waistLength || body.waistLength}
                sleeveLabel="*Elbow - Round"
                sleeveValue={s.elbowRound}
              />

              <MeasurementRow
                label1="Cross Front"
                value1={k.crossFront}
                label2="*Slit Length"
                value2={k.slitLength || body.slitLength}
                sleeveLabel=""
                sleeveValue=""
              />

              <MeasurementRow
                label1="Cross Back"
                value1={k.crossBack}
                label2="Front Neck"
                value2={k.frontNeck || body.frontNeck}
                sleeveLabel=""
                sleeveValue=""
              />

              <MeasurementRow
                label1="*Bust Width"
                value1={k.bustWidth}
                label2="Back Neck"
                value2={k.backNeck || body.backNeck}
                sleeveLabel=""
                sleeveValue=""
              />

              {/* ============================================================
                  SALWAR + FRONT NECK
              ============================================================ */}

              <View style={styles.salwarHeader}>
                <View style={styles.salwarTitle}>
                  <Text>Salwar / Chudi</Text>
                </View>

                <View style={styles.neckFrontTitle}>
                  <Text>Neck Design - Front</Text>
                </View>
              </View>

              <View style={styles.salwarBody}>
                <View style={styles.salwarMeasurements}>
                  <SalwarRow
                    label="Full Length"
                    value={b.fullLength || b.length}
                  />

                  <SalwarRow label="Band Length" value={b.bandLength} />

                  <SalwarRow label="Crotch Length" value={b.crotchLength} />

                  <SalwarRow label="Ankle Round" value={b.ankleRound} />

                  <SalwarRow label="*Thigh R" value={b.thighR || b.thigh} />

                  <SalwarRow label="*Knee L" value={b.kneeL || b.kneeLength} />

                  <SalwarRow label="*Knee R" value={b.kneeR || b.kneeRound} />

                  <SalwarRow label="*Calf L" value={b.calfL || b.calfLength} />

                  <SalwarRow label="*Calf R" value={b.calfR || b.calfRound} />
                </View>

                <View style={styles.neckFront}>
                  {d.frontNeckImage ? (
                    <Image src={d.frontNeckImage} style={styles.designImage} />
                  ) : d.neckFrontImage ? (
                    <Image src={d.neckFrontImage} style={styles.designImage} />
                  ) : (
                    <Text>{d.frontNeck || ""}</Text>
                  )}
                </View>
              </View>

              {/* ============================================================
                  SPECIFICATION
              ============================================================ */}

              <View style={styles.specification}>
                <Text style={styles.bold}>Specification</Text>

                <Text>{d.specification || order?.specification || ""}</Text>
              </View>

              {/* ============================================================
                  NECK BACK
              ============================================================ */}

              <View style={styles.bottomRightHeader}>
                <Text>Neck Design - Back</Text>
              </View>

              <View style={styles.bottomRightBody}>
                <View style={styles.neckBack}>
                  {d.backNeckImage ? (
                    <Image src={d.backNeckImage} style={styles.designImage} />
                  ) : d.neckBackImage ? (
                    <Image src={d.neckBackImage} style={styles.designImage} />
                  ) : (
                    <Text>{d.backNeck || ""}</Text>
                  )}
                </View>

                <View style={styles.swatch}>
                  {d.swatchImage ? (
                    <Image src={d.swatchImage} style={styles.designImage} />
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
    // </PDFViewer>
  );
}

/* ==========================================================================
   Measurement Row
========================================================================== */

function MeasurementRow({
  label1,
  value1,
  label2,
  value2,
  sleeveLabel,
  sleeveValue,
}) {
  return (
    <View style={styles.measurementRow}>
      <View style={styles.measurementLabel}>
        <Text>{label1}</Text>
      </View>

      <View style={styles.measurementValue}>
        <Value value={value1} />
      </View>

      <View style={styles.measurementLabel2}>
        <Text>{label2}</Text>
      </View>

      <View style={styles.measurementValue2}>
        <Value value={value2} />
      </View>

      <View style={styles.sleeveLabel}>
        <Text>{sleeveLabel}</Text>
      </View>

      <View style={styles.sleeveValue}>
        <Value value={sleeveValue} />
      </View>
    </View>
  );
}

/* ==========================================================================
   Salwar Row
========================================================================== */

function SalwarRow({ label, value }) {
  return (
    <View style={styles.salwarRow}>
      <View style={styles.salwarLabel}>
        <Text>{label}</Text>
      </View>

      <View style={styles.salwarValue}>
        <Value value={value} />
      </View>
    </View>
  );
}

/* ==========================================================================
   DOWNLOAD BUTTON
========================================================================== */

export async function downloadJobOrderPDF(order) {
  try {
    const blob = await pdf(<JobOrderPDF order={order} />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${order?.orderNo || "job-order"}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Job Order PDF generation failed:", error);

    throw error;
  }
}

/* ==========================================================================
   DOWNLOAD BUTTON COMPONENT
========================================================================== */

export default function JobOrderPDFDownloadButton({
  order,
  className = "btn btn-danger",
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      await downloadJobOrderPDF(order);
    } catch (error) {
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
          <span className="spinner-border spinner-border-sm me-2" />
          Generating PDF...
        </>
      ) : (
        <>
          <i className="bi bi-file-earmark-pdf me-2" />
          Download PDF
        </>
      )}
    </button>
  );
}
