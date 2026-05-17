import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRiskLevel } from './threatEngine';

const BRAND = {
  primary: [0, 15, 30],
  accent: [0, 180, 200],
  critical: [255, 51, 102],
  high: [249, 115, 22],
  medium: [251, 191, 36],
  low: [0, 255, 136],
  muted: [100, 116, 139],
  white: [255, 255, 255],
};

function formatReportDate() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function addSectionHeader(doc, title, y) {
  doc.setFillColor(...BRAND.primary);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 18, y + 7);
  doc.setTextColor(30, 41, 59);
  return y + 14;
}

function addFooter(doc, pageNum, totalPages) {
  const h = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.setFont('helvetica', 'normal');
  doc.text('ThreatIntel — Confidential Security Report', 14, h - 10);
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, h - 10, { align: 'right' });
}

function buildRecommendations(threatData) {
  const recs = [];
  const { riskScore, severityCounts, correlations, vulnerabilities, topVulnerableAssets } =
    threatData;

  const { level } = getRiskLevel(riskScore);
  recs.push({
    priority: 'P1',
    item: `Platform risk is ${level} (${riskScore}/100). Review critical alerts within 4 hours.`,
  });

  if (severityCounts.critical > 0) {
    recs.push({
      priority: 'P1',
      item: `Address ${severityCounts.critical} critical-severity events immediately.`,
    });
  }

  correlations.slice(0, 3).forEach((c) => {
    recs.push({
      priority: 'P1',
      item: `${c.name}: ${c.action}`,
    });
  });

  vulnerabilities
    .filter((v) => v.status === 'open' && (v.cvss || 0) >= 9)
    .slice(0, 5)
    .forEach((v) => {
      recs.push({
        priority: 'P1',
        item: `Patch ${v.cve} on ${v.assetName} (CVSS ${v.cvss})`,
      });
    });

  vulnerabilities
    .filter((v) => v.status === 'open' && (v.cvss || 0) >= 7 && (v.cvss || 0) < 9)
    .slice(0, 3)
    .forEach((v) => {
      recs.push({
        priority: 'P2',
        item: `Schedule patch for ${v.cve} — ${v.title}`,
      });
    });

  topVulnerableAssets
    .filter((a) => (a.riskScore || 0) >= 70)
    .slice(0, 3)
    .forEach((a) => {
      recs.push({
        priority: 'P1',
        item: `Isolate or harden ${a.name} (risk score ${a.riskScore})`,
      });
    });

  recs.push({
    priority: 'P2',
    item: 'Enable MFA on all externally exposed assets and admin accounts.',
  });
  recs.push({
    priority: 'P3',
    item: 'Run full vulnerability scan and validate SIEM correlation rules weekly.',
  });

  return recs.slice(0, 12);
}

export function generateSecurityReport(user, threatData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 0;

  const activeAlerts = threatData.alerts.filter(
    (a) => a.status === 'open' || !a.status
  ).length;

  doc.setFillColor(...BRAND.primary);
  doc.rect(0, 0, pageWidth, 42, 'F');
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ThreatIntel', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Enterprise Security Intelligence Report', 14, 26);
  doc.setFontSize(9);
  doc.text(`Generated: ${formatReportDate()}`, 14, 34);
  doc.setDrawColor(...BRAND.accent);
  doc.setLineWidth(0.8);
  doc.line(14, 38, pageWidth - 14, 38);

  y = 50;

  y = addSectionHeader(doc, 'SECTION 1 — User Information', y);
  autoTable(doc, {
    startY: y,
    head: [['Field', 'Value']],
    body: [
      ['Name', user?.displayName || 'N/A'],
      ['Email', user?.email || 'N/A'],
      ['Login Method', 'Google OAuth 2.0 (Firebase Authentication)'],
      ['Session Status', 'Active / Authenticated'],
      ['Report Generated', formatReportDate()],
      ['Platform', 'ThreatIntel SOC Dashboard'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: BRAND.primary,
      textColor: BRAND.white,
      fontStyle: 'bold',
    },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = addSectionHeader(doc, 'SECTION 2 — Threat Summary', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Threats Detected', String(threatData.threats.length)],
      ['Active Alerts', String(activeAlerts)],
      ['Overall Risk Score', `${threatData.riskScore}/100 (${getRiskLevel(threatData.riskScore).level})`],
      ['Monitored Assets', String(threatData.assets.length)],
      ['Open Vulnerabilities', String(threatData.vulnerabilities.filter((v) => v.status === 'open').length)],
    ],
    theme: 'striped',
    headStyles: { fillColor: BRAND.primary, textColor: BRAND.white },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Severity Breakdown', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['Severity', 'Count']],
    body: [
      ['Critical', String(threatData.severityCounts.critical || 0)],
      ['High', String(threatData.severityCounts.high || 0)],
      ['Medium', String(threatData.severityCounts.medium || 0)],
      ['Low', String(threatData.severityCounts.low || 0)],
    ],
    theme: 'grid',
    headStyles: { fillColor: BRAND.accent, textColor: BRAND.primary },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 8;

  if (threatData.threatTypeDistribution.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Attack Categories', 14, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [['Category', 'Incidents']],
      body: threatData.threatTypeDistribution.map((t) => [
        t.name,
        String(t.value),
      ]),
      theme: 'striped',
      headStyles: { fillColor: BRAND.primary, textColor: BRAND.white },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  y = addSectionHeader(doc, 'SECTION 3 — Threat Intelligence', y);

  const vulnRows = threatData.vulnerabilities.slice(0, 10).map((v) => [
    v.cve || '—',
    (v.title || '').slice(0, 40),
    v.assetName || '—',
    String(v.cvss ?? '—'),
    v.severity || '—',
    v.status || '—',
  ]);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Detected Vulnerabilities', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['CVE', 'Title', 'Asset', 'CVSS', 'Severity', 'Status']],
    body: vulnRows.length ? vulnRows : [['—', 'No vulnerabilities recorded', '—', '—', '—', '—']],
    theme: 'grid',
    headStyles: { fillColor: BRAND.primary, textColor: BRAND.white, fontSize: 8 },
    styles: { fontSize: 7, cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 8;

  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Suspicious / High-Risk Assets', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [['Asset', 'Type', 'Exposure', 'Risk Score', 'Status']],
    body: threatData.topVulnerableAssets.map((a) => [
      a.name,
      a.type || '—',
      a.exposure || '—',
      String(a.riskScore ?? '—'),
      a.status || '—',
    ]),
    theme: 'striped',
    headStyles: { fillColor: BRAND.accent, textColor: BRAND.primary },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 8;

  if (threatData.correlations.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Correlated Attack Patterns', 14, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [['Pattern', 'Confidence', 'Recommended Action']],
      body: threatData.correlations.map((c) => [
        c.name,
        `${c.confidence}%`,
        c.action,
      ]),
      theme: 'grid',
      headStyles: { fillColor: BRAND.critical, textColor: BRAND.white },
      styles: { fontSize: 8 },
      columnStyles: { 2: { cellWidth: 70 } },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Timeline Summary (Last 12h)', 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [['Period', 'Threats', 'Alerts']],
    body: threatData.timelineData.map((t) => [
      t.time,
      String(t.threats),
      String(t.alerts),
    ]),
    theme: 'striped',
    headStyles: { fillColor: BRAND.primary, textColor: BRAND.white },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 10;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  y = addSectionHeader(doc, 'SECTION 4 — Recommended Actions', y);

  const recommendations = buildRecommendations(threatData);
  autoTable(doc, {
    startY: y,
    head: [['Priority', 'Recommendation']],
    body: recommendations.map((r) => [r.priority, r.item]),
    theme: 'grid',
    headStyles: { fillColor: BRAND.primary, textColor: BRAND.white },
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 150 } },
    margin: { left: 14, right: 14 },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 0) {
        const pri = data.cell.raw;
        if (pri === 'P1') data.cell.styles.textColor = BRAND.critical;
        else if (pri === 'P2') data.cell.styles.textColor = BRAND.high;
        else data.cell.styles.textColor = BRAND.muted;
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  const filename = `ThreatIntel-Security-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
}
