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
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,

    fontFamily: "Helvetica",
    fontSize: 8,

    color: "#111111",
    backgroundColor: "#ffffff",
  },

  invoice: {
    width: "100%",
    borderTop: BORDER,
    borderLeft: BORDER,
    flexDirection: "column",
  },

  row: {
    flexDirection: "row",
  },

  bold: {
    fontFamily: "Helvetica-Bold",
  },

  center: {
    textAlign: "center",
  },

  /* ================================================================
     HEADER
  ================================================================ */

  header: {
    height: 78,
    flexDirection: "row",
  },

  /* ------------------------------------------------
     LOGO
  ------------------------------------------------ */

  logoCell: {
    width: "15%",
    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",

    padding: 4,
  },

  logo: {
    width: 62,
    height: 68,
    objectFit: "contain",
  },

  /* ------------------------------------------------
     HEADER MIDDLE
  ------------------------------------------------ */

  headerMiddle: {
    width: "62%",
  },

  addressRow: {
    height: 31,

    borderRight: BORDER,
    borderBottom: BORDER,

    paddingHorizontal: 5,

    justifyContent: "center",
  },

  addressText: {
    fontSize: 7.5,
    lineHeight: 1.3,
  },

  /* ------------------------------------------------
     BILL INFORMATION
  ------------------------------------------------ */

  billInfo: {
    height: 47,
    flexDirection: "row",
  },

  billColumn: {
    width: "32%",
    borderRight: BORDER,
  },

  dateColumn: {
    width: "32%",
    borderRight: BORDER,
  },

  mobileColumn: {
    width: "36%",
  },

  infoLabel: {
    height: 22,

    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",
  },

  infoValue: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 3,
  },

  mobileRow: {
    height: "50%",

    flexDirection: "row",

    borderRight: BORDER,
    borderBottom: BORDER,
  },

  mobileLabel: {
    width: "56%",

    paddingHorizontal: 4,

    justifyContent: "center",
  },

  mobileValue: {
    width: "44%",

    paddingHorizontal: 2,

    justifyContent: "center",
  },

  /* ------------------------------------------------
     JOB ORDER NUMBER
  ------------------------------------------------ */

  headerRight: {
    width: "23%",

    borderRight: BORDER,
    borderBottom: BORDER,
  },

  headerJobTitle: {
    height: 24,

    borderBottom: BORDER,

    paddingHorizontal: 4,

    justifyContent: "center",
  },

  headerJobValue: {
    flex: 1,

    padding: 5,

    justifyContent: "center",
  },

  /* ================================================================
     CUSTOMER
  ================================================================ */

  customerRow: {
    flexDirection: "row",
    height: 20,
    borderTop: BORDER,
  },

  customerLabel: {
    width: "15%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  customerValue: {
    width: "39%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  phoneLabel: {
    width: "23%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  phoneValue: {
    width: "23%",
    borderRight: BORDER,
    borderBottom: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  /* ================================================================
     TABLE HEADER
  ================================================================ */

  tableHeader: {
    height: 21,

    flexDirection: "row",
  },

  serialCell: {
    width: "15%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 3,
  },

  descriptionCell: {
    width: "24%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",

    paddingHorizontal: 5,
  },

  qtyCell: {
    width: "15%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 3,
  },

  rateCell: {
    width: "23%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,
  },

  amountCell: {
    width: "23%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,
  },

  tableHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  /* ================================================================
     TABLE ROW
  ================================================================ */

  tableRow: {
    height: 20,

    flexDirection: "row",
  },

  /* ================================================================
     SUBTOTAL
  ================================================================ */

  subtotalRow: {
    height: 20,

    flexDirection: "row",
  },

  subtotalBlank: {
    width: "54%",

    borderRight: BORDER,
    borderBottom: BORDER,
  },

  subtotalLabel: {
    width: "23%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",
  },

  subtotalValue: {
    width: "23%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",
  },

  /* ================================================================
     BOTTOM / TOTALS
  ================================================================ */

  bottomSection: {
    minHeight: 86,

    flexDirection: "row",
  },

  thankYou: {
    width: "54%",

    borderRight: BORDER,
    borderBottom: BORDER,

    padding: 5,

    justifyContent: "space-between",
  },

  thankText: {
    fontSize: 8,
  },

  goodsText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
  },

  totals: {
    width: "46%",
  },

  totalRow: {
    height: 21.5,

    flexDirection: "row",
  },

  totalLabel: {
    width: "50%",

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",
  },

  totalValue: {
    width: "50%",

    borderRight: BORDER,
    borderBottom: BORDER,

    paddingHorizontal: 5,

    justifyContent: "center",
    alignItems: "flex-end",
  },

  totalLabelText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },

  /* ================================================================
     SHOP TIME
  ================================================================ */

  shopTime: {
    height: 23,

    borderRight: BORDER,
    borderBottom: BORDER,

    justifyContent: "center",
    alignItems: "center",
  },

  shopTimeText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },

  /* ================================================================
     TERMS
  ================================================================ */

  terms: {
    minHeight: 31,

    borderRight: BORDER,
    borderBottom: BORDER,

    paddingHorizontal: 4,
    paddingVertical: 3,

    justifyContent: "center",
  },

  termText: {
    fontSize: 6.2,
    marginBottom: 2,
  },
});

/* ================================================================
   HELPERS
================================================================ */

function money(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toFixed(2);
}

function safeText(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

/* ================================================================
   TABLE HEADER
================================================================ */

function InvoiceTableHeader({ title }) {
  return (
    <View style={styles.tableHeader}>
      <View style={styles.serialCell}>
        <Text style={styles.tableHeading}>S/No</Text>
      </View>

      <View style={styles.descriptionCell}>
        <Text style={styles.tableHeading}>{title}</Text>
      </View>

      <View style={styles.qtyCell}>
        <Text style={styles.tableHeading}>Qty</Text>
      </View>

      <View style={styles.rateCell}>
        <Text style={styles.tableHeading}>Rate</Text>
      </View>

      <View style={styles.amountCell}>
        <Text style={styles.tableHeading}>Amount</Text>
      </View>
    </View>
  );
}

/* ================================================================
   TABLE ROW
================================================================ */

function InvoiceItemRow({
  index,
  description = "",
  qty = "",
  rate = "",
  amount = "",
}) {
  return (
    <View style={styles.tableRow}>
      <View style={styles.serialCell}>
        <Text>{index}</Text>
      </View>

      <View style={styles.descriptionCell}>
        <Text>{description}</Text>
      </View>

      <View style={styles.qtyCell}>
        <Text>{safeText(qty)}</Text>
      </View>

      <View style={styles.rateCell}>
        <Text>{money(rate)}</Text>
      </View>

      <View style={styles.amountCell}>
        <Text>{money(amount)}</Text>
      </View>
    </View>
  );
}

/* ================================================================
   INVOICE PDF
================================================================ */

export function InvoicePDF({ order = {} }) {
  const customer = order.customer || {};

  /*
   * Your current Firestore structure does not
   * contain individual sale/job line items.
   *
   * Therefore we show the pieceType as the
   * first job description and leave Qty/Rate
   * blank.
   */

  const pieceType = order.pieceType || "";

  const totalAmount = Number(order.totalAmount || 0);

  const advance = Number(order.advance || 0);

  const balance =
    order.balance !== undefined && order.balance !== null
      ? Number(order.balance)
      : totalAmount - advance;

  return (
    <Document
      title={`Invoice ${order.orderNo || ""}`}
      author="The Little Mango Tree"
      subject="Customer Invoice"
      creator="The Little Mango Tree"
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.invoice}>
          {/* ==========================================================
              HEADER
          ========================================================== */}

          <View style={styles.header}>
            {/* --------------------------------------------------------
                LOGO
            -------------------------------------------------------- */}

            <View style={styles.logoCell}>
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

            {/* --------------------------------------------------------
                SHOP DETAILS
            -------------------------------------------------------- */}

            <View style={styles.headerMiddle}>
              <View style={styles.addressRow}>
                <Text style={styles.addressText}>
                  Near Frescia Super Market, Near Sompura Gate,
                  {"\n"}
                  Sarjapura Road, Bangalore - 562125
                </Text>
              </View>

              <View style={styles.billInfo}>
                {/* BILL NO */}

                <View style={styles.billColumn}>
                  <View style={styles.infoLabel}>
                    <Text>Bill No.</Text>
                  </View>

                  <View style={styles.infoValue}>
                    <Text>{order.billNo || ""}</Text>
                  </View>
                </View>

                {/* BILL DATE */}

                <View style={styles.dateColumn}>
                  <View style={styles.infoLabel}>
                    <Text>Bill Date</Text>
                  </View>

                  <View style={styles.infoValue}>
                    <Text>{formatDate(order.bookingDate) || ""}</Text>
                  </View>
                </View>

                {/* MOBILE + DELIVERY */}

                <View style={styles.mobileColumn}>
                  <View style={styles.mobileRow}>
                    <View style={styles.mobileLabel}>
                      <Text>Mobile Number :</Text>
                    </View>

                    <View style={styles.mobileValue}>
                      <Text style={styles.bold}>8105621013 / 7411067470</Text>
                    </View>
                  </View>

                  <View style={styles.mobileRow}>
                    <View style={styles.mobileLabel}>
                      <Text>Delivery Date :</Text>
                    </View>

                    <View style={styles.mobileValue}>
                      <Text>{formatDate(order.deliveryDate) || ""}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* --------------------------------------------------------
                JOB ORDER NUMBER
            -------------------------------------------------------- */}

            <View style={styles.headerRight}>
              <View style={styles.headerJobTitle}>
                <Text style={styles.bold}>Job Order No</Text>
              </View>

              <View style={styles.headerJobValue}>
                <Text style={styles.bold}>{order.orderNo || ""}</Text>
              </View>
            </View>
          </View>

          {/* ==========================================================
              CUSTOMER
          ========================================================== */}

          {/* ==========================================================
    CUSTOMER
========================================================== */}

          <View style={styles.customerRow}>
            <View style={styles.customerLabel}>
              <Text>Name</Text>
            </View>

            <View style={styles.customerValue}>
              <Text>{customer.name || ""}</Text>
            </View>

            <View style={styles.phoneLabel}>
              <Text>Ph No :</Text>
            </View>

            <View style={styles.phoneValue}>
              <Text>{customer.phone || ""}</Text>
            </View>
          </View>

          {/* ==========================================================
              SALE ITEMS
          ========================================================== */}

          <InvoiceTableHeader title="Sale Items" />

          <InvoiceItemRow index={1} description="" />

          <InvoiceItemRow index={2} description="" />

          <InvoiceItemRow index={3} description="" />

          <InvoiceItemRow index={4} description="" />

          <InvoiceItemRow index={5} description="" />

          <InvoiceItemRow index={6} description="" />

          {/* SALE SUBTOTAL */}

          <View style={styles.subtotalRow}>
            <View style={styles.subtotalBlank} />

            <View style={styles.subtotalLabel}>
              <Text style={styles.bold}>Sub Total</Text>
            </View>

            <View style={styles.subtotalValue}>
              <Text>0.00</Text>
            </View>
          </View>

          {/* ==========================================================
              JOB DESCRIPTION
          ========================================================== */}

          <InvoiceTableHeader title="Job Description" />

          {/* First row contains actual piece type */}

          <InvoiceItemRow index={1} description={pieceType} />

          {/* Remaining rows */}

          <InvoiceItemRow index={2} description="" />

          <InvoiceItemRow index={3} description="" />

          <InvoiceItemRow index={4} description="" />

          <InvoiceItemRow index={5} description="" />

          <InvoiceItemRow index={6} description="" />

          <InvoiceItemRow index={7} description="" />

          <InvoiceItemRow index={8} description="" />

          <InvoiceItemRow index={9} description="" />

          {/* Extra blank row as in supplied invoice */}

          <InvoiceItemRow index="" description="" />

          {/* ==========================================================
              TOTAL / ADVANCE / BALANCE
          ========================================================== */}

          <View style={styles.bottomSection}>
            {/* --------------------------------------------------------
                THANK YOU / GOODS
            -------------------------------------------------------- */}

            <View style={styles.thankYou}>
              <Text style={styles.thankText}>Tank You:</Text>

              <Text style={styles.goodsText}>
                Goods once sold will not be taken back
              </Text>
            </View>

            {/* --------------------------------------------------------
                TOTALS
            -------------------------------------------------------- */}

            <View style={styles.totals}>
              {/* JOB SUB TOTAL */}

              <View style={styles.totalRow}>
                <View style={styles.totalLabel}>
                  <Text style={styles.totalLabelText}>Sub Total</Text>
                </View>

                <View style={styles.totalValue}>
                  <Text>{money(totalAmount)}</Text>
                </View>
              </View>

              {/* TOTAL */}

              <View style={styles.totalRow}>
                <View style={styles.totalLabel}>
                  <Text style={styles.totalLabelText}>Total</Text>
                </View>

                <View style={styles.totalValue}>
                  <Text>{money(totalAmount)}</Text>
                </View>
              </View>

              {/* ADVANCE */}

              <View style={styles.totalRow}>
                <View style={styles.totalLabel}>
                  <Text style={styles.totalLabelText}>Advance</Text>
                </View>

                <View style={styles.totalValue}>
                  <Text>{money(advance)}</Text>
                </View>
              </View>

              {/* BALANCE */}

              <View style={styles.totalRow}>
                <View style={styles.totalLabel}>
                  <Text style={styles.totalLabelText}>Balance</Text>
                </View>

                <View style={styles.totalValue}>
                  <Text>{money(balance)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ==========================================================
              SHOP TIME
          ========================================================== */}

          <View style={styles.shopTime}>
            <Text style={styles.shopTimeText}>
              SHOP TIME: 10.30 AM TO 7.30 PM
            </Text>
          </View>

          {/* ==========================================================
              TERMS
          ========================================================== */}

          <View style={styles.terms}>
            <Text style={styles.termText}>
              1. Alterations will be undertaken within 1 month of delivery
            </Text>

            <Text style={styles.termText}>
              2. We will be responsible for the stitched material only for one
              month from date of delivery. Hence request you to collect within
              one month of date.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ================================================================
   DOWNLOAD FUNCTION
================================================================ */

export async function downloadInvoicePDF(order) {
  try {
    const blob = await pdf(<InvoicePDF order={order} />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${order?.orderNo || "Invoice"}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("Invoice PDF generation failed:", error);

    throw error;
  }
}

/* ================================================================
   DOWNLOAD BUTTON
================================================================ */

export default function InvoicePDFDownloadButton({
  order,

  className = "btn btn-danger",
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    if (!order) {
      alert("Job Order data is not available.");

      return;
    }

    try {
      setLoading(true);

      await downloadInvoicePDF(order);
    } catch (error) {
      console.error(error);

      alert("Unable to generate the Invoice PDF.");
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
          Generating Invoice...
        </>
      ) : (
        <>
          <i className="bi bi-file-earmark-pdf me-2" />
          Download Invoice
        </>
      )}
    </button>
  );
}
