import React from "react";
import { Button } from "react-bootstrap";
import jsPDF from "jspdf";

const PrintPDFButton = ({
  name,
  studentNumber,
  academicAdviser,
  clearanceOfficer,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Certificate", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("University of the Philippines Las Vegas", 105, 20, { align: "center" });
    doc.text("Date Generated: " + new Date().toLocaleDateString(), 105, 30, { align: "center" });
    doc.text(`This document certifies that ${name}, ${studentNumber} has satisfied`, 20, 50);
    doc.text("the clearance requirements of the institute.", 20, 60);
    doc.text("Verified:", 20, 80);
    doc.text("Academic Adviser: " + academicAdviser, 20, 90);
    doc.text("Clearance Officer: " + clearanceOfficer, 20, 100);
    doc.save("certificate.pdf");
  };

  return (
    <Button variant="primary" onClick={generatePDF}>
      Print PDF
    </Button>
  );
};

export default PrintPDFButton;