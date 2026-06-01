import { jsPDF } from "jspdf";
import { PlayerData, CoachSettings } from "./types";

export function generateRegistrationPDF(players: PlayerData[], settings: CoachSettings, filename?: string) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const pageH = 297;
  const marginX = 15;
  const marginY = 15;
  let y = marginY;

  // Colors
  const gold = [251, 191, 36] as const;       // amber-400
  const red = [185, 28, 28] as const;          // red-700
  const dark = [15, 23, 42] as const;          // slate-900
  const slate600: [number, number, number] = [71, 85, 105];
  const slate400: [number, number, number] = [148, 163, 184];
  const gray400: [number, number, number] = [156, 163, 175];
  const gray800: [number, number, number] = [31, 41, 55];

  // ---- Draw Gold Border ----
  const border = 6; // mm inset
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(0.8);
  doc.rect(marginX - 2, marginY - 2, pageW - marginX * 2 + 4, pageH - marginY * 2 + 4);
  // Inner gold border
  doc.setLineWidth(0.3);
  doc.rect(marginX + border, marginY + border, pageW - (marginX + border) * 2, pageH - (marginY + border) * 2);

  // ---- Watermark (faint text using light gray) ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 230);
  doc.text("DIAMOND", pageW / 2, pageH / 2, { align: "center", angle: -45 });

  y = marginY + border + 12;

  // ---- Header ----
  // Left: Logo + DiamondForms text
  doc.setFontSize(16);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.text("DIAMOND", marginX + border + 4, y);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("FORMS", marginX + border + 4 + doc.getTextWidth("DIAMOND ") + 1, y);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("REGISTRATION RECEIPT", marginX + border + 4, y + 5);

  // Right: PAID badge
  const paidX = pageW - marginX - border - 4;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(red[0], red[1], red[2]);
  doc.text("PAID", paidX, y, { align: "right" });

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text(`#DF-${String(Date.now()).slice(-6)}`, paidX, y + 5, { align: "right" });

  y += 18;

  // ---- Divider ----
  doc.setDrawColor(200, 200, 210);
  doc.setLineWidth(0.3);
  doc.line(marginX + border + 4, y, pageW - marginX - border - 4, y);
  y += 8;

  // ---- Team / Org Info Row ----
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);

  const orgLine = [
    settings.orgName && `Organization: ${settings.orgName}`,
    settings.teamName && `Team: ${settings.teamName}`,
    settings.coachName && `Coach: ${settings.coachName}`,
    settings.coachEmail,
  ].filter(Boolean).join("  |  ");
  doc.text(orgLine, marginX + border + 4, y);
  y += 10;

  // ---- Player Roster ----
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("PLAYER ROSTER", marginX + border + 4, y);
  y += 5;

  // Table header
  const colDefs = [
    { label: "#", x: marginX + border + 4, w: 6 },
    { label: "NAME", x: marginX + border + 10, w: 40 },
    { label: "AGE", x: marginX + border + 50, w: 10 },
    { label: "POSITION", x: marginX + border + 60, w: 28 },
    { label: "JERSEY", x: marginX + border + 88, w: 14 },
    { label: "PARENT", x: marginX + border + 102, w: 32 },
    { label: "PHONE", x: marginX + border + 134, w: 28 },
    { label: "MEDICAL", x: marginX + border + 162, w: 26 },
  ];

  // Header background
  doc.setFillColor(dark[0], dark[1], dark[2]);
  doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  colDefs.forEach((c) => doc.text(c.label, c.x, y + 1));
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);

  players.forEach((p, i) => {
    if (y > 265) {
      doc.addPage();
      y = marginY + border + 12;
      // Re-draw gold border on new page
      doc.setDrawColor(gold[0], gold[1], gold[2]);
      doc.setLineWidth(0.8);
      doc.rect(marginX - 2, marginY - 2, pageW - marginX * 2 + 4, pageH - marginY * 2 + 4);
      doc.setLineWidth(0.3);
      doc.rect(marginX + border, marginY + border, pageW - (marginX + border) * 2, pageH - (marginY + border) * 2);

      doc.setFillColor(dark[0], dark[1], dark[2]);
      doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      colDefs.forEach((c) => doc.text(c.label, c.x, y + 1));
      y += 6;
      doc.setFont("helvetica", "normal");
    }

    const rowColor = i % 2 === 0 ? [248, 250, 252] : [241, 245, 249];
    doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
    doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    const vals = [String(i + 1), `${p.firstName} ${p.lastName}`, p.age, p.position, p.jerseyNumber || "—", p.parentName || "—", p.parentPhone || "—", p.medicalNotes || ""];
    colDefs.forEach((c, idx) => doc.text(vals[idx] || "", c.x, y + 1));
    y += 5.5;
  });

  y += 6;

  // ---- Signature Lines ----
  if (y > 250) { doc.addPage(); y = marginY + border + 12; }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // Coach Signature
  doc.line(marginX + border + 4, y, marginX + border + 70, y);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("COACH SIGNATURE", marginX + border + 4, y + 4);

  // Parent Signature
  doc.line(pageW - marginX - border - 70, y, pageW - marginX - border - 4, y);
  doc.text("PARENT/GUARDIAN SIGNATURE", pageW - marginX - border - 4, y + 4, { align: "right" });

  y += 16;

  // ---- Payment Summary (Bento-style) ----
  if (y > 260) { doc.addPage(); y = marginY + border + 12; }

  doc.setFillColor(249, 250, 251);
  doc.rect(marginX + border + 4, y, pageW - (marginX + border) * 2 - 8, 28, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("PAYMENT SUMMARY", marginX + border + 10, y + 5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`Registration Fee (${players.length} player${players.length !== 1 ? "s" : ""})`, marginX + border + 10, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(red[0], red[1], red[2]);
  // Right-align "PAID" status
  doc.text("PAID", pageW - marginX - border - 10, y + 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`Processing Fee`, marginX + border + 10, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text("$0.00", pageW - marginX - border - 10, y + 20, { align: "right" });

  y += 34;

  // ---- Program Includes (3-grid) ----
  if (y > 265) { doc.addPage(); y = marginY + border + 12; }

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("PROGRAM INCLUDES", marginX + border + 4, y);
  y += 5;

  const includes = ["Full Uniform", "Insurance", "Season Games"];
  const boxW = 36;
  const boxGap = 6;
  includes.forEach((item, idx) => {
    const bx = marginX + border + 4 + idx * (boxW + boxGap);
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.rect(bx, y, boxW, 10);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.text(item, bx + boxW / 2, y + 6, { align: "center" });
  });

  y += 18;

  // ---- Footer / Waiver ----
  if (y > 270) { doc.addPage(); y = marginY + border + 12; }

  doc.setDrawColor(200, 200, 210);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(marginX + border + 4, y, pageW - marginX - border - 4, y);
  doc.setLineDashPattern([], 0);
  y += 4;

  doc.setFontSize(6);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text(
    "This document serves as an official registration receipt. Processed via DiamondForms. For support, contact your team administrator or email support@diamondforms.com.",
    marginX + border + 4,
    y,
    { maxWidth: pageW - (marginX + border) * 2 - 8 }
  );

  // ---- Free-tier branding ----
  y = pageH - marginY - border - 6;
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text("DiamondForms · Free Tier", pageW - marginX - border - 4, y, { align: "right" });

  // Date
  doc.setFont("helvetica", "normal");
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, marginX + border + 4, y);

  // Save
  const fn = filename || `registration_${settings.orgName?.replace(/\s+/g, "_") || "team"}_${Date.now()}.pdf`;
  doc.save(fn);
}