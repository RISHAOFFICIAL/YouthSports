import { jsPDF } from "jspdf";
import { PlayerData, CoachSettings } from "./types";

export function generateRegistrationPDF(players: PlayerData[], settings: CoachSettings, filename?: string) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const pageH = 297;
  const marginX = 15;
  const marginY = 15;
  let y = marginY;

  // Parse dynamic primary color
  const parseHex = (hex: string): [number, number, number] => {
    const c = hex.replace("#", "");
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  };
  const primary = parseHex(settings.primaryColor || "#b91c1c");
  const gold = [251, 191, 36] as const;
  const dark: [number, number, number] = [15, 23, 42];
  const slate600: [number, number, number] = [71, 85, 105];
  const slate400: [number, number, number] = [148, 163, 184];
  const gray400: [number, number, number] = [156, 163, 175];
  const gray800: [number, number, number] = [31, 41, 55];
  const white: [number, number, number] = [255, 255, 255];

  // ---- Draw Gold Border ----
  const border = 6;
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(0.8);
  doc.rect(marginX - 2, marginY - 2, pageW - marginX * 2 + 4, pageH - marginY * 2 + 4);
  doc.setLineWidth(0.3);
  doc.rect(marginX + border, marginY + border, pageW - (marginX + border) * 2, pageH - (marginY + border) * 2);

  // ---- Watermark ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 230);
  doc.text("DIAMOND", pageW / 2, pageH / 2, { align: "center", angle: -45 });

  y = marginY + border + 12;

  // ---- Header Section ----
  // Left: Logo diamond icon + DiamondForms
  doc.setFontSize(14);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.text("DIAMOND", marginX + border + 4, y);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("FORMS", marginX + border + 4 + doc.getTextWidth("DIAMOND ") + 1, y);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("REGISTRATION RECEIPT", marginX + border + 4, y + 5);

  // Right: PAID badge in primary color
  const paidX = pageW - marginX - border - 4;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("PAID", paidX, y, { align: "right" });

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text(`#DF-${String(Date.now()).slice(-6)}`, paidX, y + 5, { align: "right" });

  // Logo image if present (top-right)
  if (settings.logoDataUrl) {
    try {
      doc.addImage(settings.logoDataUrl, "PNG", paidX - 20, y - 8, 16, 16);
    } catch {
      // ignore
    }
  }

  y += 20;

  // ---- Organization Info Row ----
  doc.setDrawColor(200, 200, 210);
  doc.setLineWidth(0.3);
  doc.line(marginX + border + 4, y, pageW - marginX - border - 4, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  const orgLine = [
    settings.orgName && `Organization: ${settings.orgName}`,
    settings.teamName && `Team: ${settings.teamName}`,
    settings.programName && `Program: ${settings.programName}${settings.programYear ? ` (${settings.programYear})` : ""}`,
    settings.coachName && `Coach: ${settings.coachName}`,
    settings.coachEmail,
  ].filter(Boolean).join("  |  ");
  doc.text(orgLine, marginX + border + 4, y);
  y += 10;

  // ---- Player Roster Section ----
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("PLAYER ROSTER", marginX + border + 4, y);
  y += 5;

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

  // Header bg
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(white[0], white[1], white[2]);
  colDefs.forEach((c) => doc.text(c.label, c.x, y + 1));
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(gray800[0], gray800[1], gray800[2]);

  let pageNum = 1;
  players.forEach((p, i) => {
    if (y > 265) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(slate400[0], slate400[1], slate400[2]);
      doc.text(`Page ${pageNum}`, pageW / 2, pageH - marginY - border - 2, { align: "center" });
      pageNum++;
      doc.addPage();
      y = marginY + border + 12;
      // Redraw border
      doc.setDrawColor(gold[0], gold[1], gold[2]);
      doc.setLineWidth(0.8);
      doc.rect(marginX - 2, marginY - 2, pageW - marginX * 2 + 4, pageH - marginY * 2 + 4);
      doc.setLineWidth(0.3);
      doc.rect(marginX + border, marginY + border, pageW - (marginX + border) * 2, pageH - (marginY + border) * 2);

      doc.setFillColor(primary[0], primary[1], primary[2]);
      doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(white[0], white[1], white[2]);
      colDefs.forEach((c) => doc.text(c.label, c.x, y + 1));
      y += 6;
      doc.setFont("helvetica", "normal");
    }

    const rowColor = i % 2 === 0 ? [248, 250, 252] : [241, 245, 249];
    doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
    doc.rect(marginX + border + 2, y - 2, pageW - (marginX + border) * 2 - 4, 5, "F");

    const vals = [
      String(i + 1),
      `${p.firstName} ${p.lastName}`,
      p.age,
      p.position,
      p.jerseyNumber || "—",
      p.parentName || "—",
      p.parentPhone || "—",
      p.medicalNotes || "—",
    ];
    colDefs.forEach((c, idx) => doc.text(vals[idx] || "", c.x, y + 1));
    y += 5.5;
  });

  y += 8;

  // ---- Status Badge ----
  if (y > 255) { doc.addPage(); y = marginY + border + 12; }

  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(0.5);
  doc.rect(marginX + border + 4, y, pageW - (marginX + border) * 2 - 8, 10);
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(marginX + border + 4, y, pageW - (marginX + border) * 2 - 8, 10, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(
    "Player spot officially secured upon deposit confirmation",
    pageW / 2,
    y + 6.5,
    { align: "center" }
  );
  y += 16;

  // ---- Program Includes ----
  if (y > 260) { doc.addPage(); y = marginY + border + 12; }

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("PROGRAM INCLUDES", marginX + border + 4, y);
  y += 5;

  const includes = [
    "Strength & Conditioning",
    "Throwing Development",
    "Skill Work",
    "Competitive Games",
    "Player Development",
    "Practice & Training Sessions",
  ];
  const boxW = 45;
  const boxGap = 5;
  const perRow = 3;
  let origY = y;
  includes.forEach((item, idx) => {
    const col = idx % perRow;
    const row = Math.floor(idx / perRow);
    const bx = marginX + border + 4 + col * (boxW + boxGap);
    const by = y + row * 12;
    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.3);
    doc.rect(bx, by, boxW, 9);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.text(item, bx + boxW / 2, by + 5.5, { align: "center" });
  });
  y += Math.ceil(includes.length / perRow) * 12 + 6;

  // ---- Parent/Guardian Agreement ----
  if (y > 260) { doc.addPage(); y = marginY + border + 12; }

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("PARENT/GUARDIAN AGREEMENT", marginX + border + 4, y);
  y += 6;

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  const agreementText =
    "I acknowledge that I am the parent or legal guardian of the player listed above and that I have read and agree to all terms, conditions, and policies of the organization, including but not limited to: code of conduct, medical release, liability waiver, and payment terms. I understand that participation in sports activities carries inherent risks and I voluntarily assume all such risks.";
  const agreementLines = doc.splitTextToSize(agreementText, pageW - (marginX + border) * 2 - 8);
  agreementLines.forEach((line: string) => {
    if (y > 278) { doc.addPage(); y = marginY + border + 12; }
    doc.text(line, marginX + border + 4, y);
    y += 4;
  });
  y += 6;

  // Signature fields
  if (y > 260) { doc.addPage(); y = marginY + border + 12; }

  // Parent/Guardian Signature
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(marginX + border + 4, y, marginX + border + 70, y);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("PARENT/GUARDIAN SIGNATURE", marginX + border + 4, y + 4);

  // Printed Name
  const nameX = pageW - marginX - border - 4;
  doc.line(nameX - 66, y, nameX, y);
  doc.text("PRINTED NAME", nameX, y + 4, { align: "right" });
  y += 12;

  // Date + Emergency Contact
  if (y > 270) { doc.addPage(); y = marginY + border + 12; }

  doc.line(marginX + border + 4, y, marginX + border + 70, y);
  doc.text("DATE", marginX + border + 4, y + 4);

  doc.line(nameX - 66, y, nameX, y);
  doc.text("EMERGENCY CONTACT PHONE", nameX, y + 4, { align: "right" });
  y += 12;

  // Coach Signature
  if (y > 270) { doc.addPage(); y = marginY + border + 12; }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(marginX + border + 4, y, marginX + border + 70, y);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray400[0], gray400[1], gray400[2]);
  doc.text("COACH SIGNATURE", marginX + border + 4, y + 4);

  doc.line(nameX - 66, y, nameX, y);
  doc.text("DATE", nameX, y + 4, { align: "right" });
  y += 18;

  // ---- Waiver Footer ----
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
    "This document serves as an official registration receipt for " +
      (settings.orgName || "your organization") +
      ". Payment was processed via DiamondForms. For support or questions, contact your team administrator or email support@diamondforms.com.",
    marginX + border + 4,
    y,
    { maxWidth: pageW - (marginX + border) * 2 - 8 }
  );

  // ---- Page Number & Free-tier branding ----
  y = pageH - marginY - border - 6;
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text("DiamondForms · Free Tier", pageW - marginX - border - 4, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    marginX + border + 4,
    y
  );

  // Save or open
  const fn = filename || `registration_${settings.orgName?.replace(/\s+/g, "_") || "team"}_${Date.now()}.pdf`;
  doc.save(fn);
}