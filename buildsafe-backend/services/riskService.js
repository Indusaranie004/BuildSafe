// services/riskService.js
const RiskScore = require('../models/RiskScore');
const Assessment = require('../models/Assessment');
const ComplianceResult = require('../models/ComplianceResult');
const weatherService = require('./weatherService');
const path = require('path'); // ✅ for PDF
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Calculate weather risk (0–100)
const calculateWeatherRisk = (weather) => {
  let score = 0;
  if (weather.windSpeed > 14) score += 30; // >50 km/h
  if (weather.precipitation > 20) score += 25;
  if (weather.temperature < 0 || weather.temperature > 40) score += 15;
  if (['Thunderstorm', 'Tornado'].includes(weather.conditions)) score += 30;
  return Math.min(100, score);
};

// Generate PDF
const generateRiskPdf = async (risk, assessment, compliance, weather) => {
  const doc = new PDFDocument();
  const filename = `risk_report_${assessment._id}.pdf`;
  const filePath = path.join(__dirname, '../public/reports', filename);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.fontSize(20).text('BuildSafe Risk Assessment Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Infrastructure: ${assessment.infrastructureName} (${assessment.type})`);
  doc.text(`Location: ${assessment.gpsCoordinates.latitude}, ${assessment.gpsCoordinates.longitude}`);
  doc.moveDown();

  doc.fontSize(16).text(`Final Risk Score: ${risk.finalRiskScore}%`, { underline: true });
  doc.moveDown();

  const compPct = (risk.weights.compliance * 100).toFixed(0);
  const weatherPct = (risk.weights.weather * 100).toFixed(0);
  doc.text(`Compliance Contribution (${compPct}%): ${risk.complianceScore}%`);
  doc.text(`Weather Impact (${weatherPct}%): ${risk.weatherRiskScore}%`);
  doc.moveDown();

  doc.text('Weather Conditions:', { underline: true });
  doc.text(`- Temperature: ${weather.temperature}°C`);
  doc.text(`- Wind Speed: ${weather.windSpeed} m/s`);
  doc.text(`- Precipitation: ${weather.precipitation} mm/h`);
  doc.text(`- Conditions: ${weather.conditions}`);
  doc.moveDown();

  if (compliance.violations.length > 0) {
    doc.text('Compliance Violations:', { underline: true });
    compliance.violations.forEach(v => {
      doc.text(`• ${v.expectedValue} [${v.severity.toUpperCase()}]`);
    });
  } else {
    doc.text('No compliance violations.');
  }

  doc.end();

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    stream.on('finish', () => resolve(`/reports/${filename}`));
    stream.on('error', reject);
  });
};

// Main risk calculation
// Main risk calculation
exports.calculateRiskScore = async (assessmentId) => {
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) throw new Error('Assessment not found');

  const compliance = await ComplianceResult.findOne({ assessmentId });
  if (!compliance) throw new Error('Compliance result not found');

  const weather = await weatherService.getWeatherByCoordinates(
    assessment.gpsCoordinates.latitude,
    assessment.gpsCoordinates.longitude
  );

  const weatherRiskScore = calculateWeatherRisk(weather);
  const complianceRiskScore = 100 - compliance.complianceScore; // 🔁 Invert: low compliance = high risk

  // Base risk: e.g., 70% compliance risk + 30% weather risk
  const baseRisk = (complianceRiskScore * 0.8) + (weatherRiskScore * 0.2);

  // Add 15-point penalty (e.g., for critical violations or system override)
  let finalRiskScore = baseRisk + 30;

  // Cap at 100
  finalRiskScore = Math.min(100, Math.round(finalRiskScore));

  const risk = new RiskScore({
    assessmentId,
    finalRiskScore,
    complianceScore: compliance.complianceScore, // store original for reference
    weatherRiskScore,
    weights: { complianceRisk: 0.8, weather: 0.2 }, // updated key name for clarity
    calculatedAt: new Date()
  });

  await risk.save();
  return risk;
};

// CRUD
exports.getRiskById = async (id) => {
  const risk = await RiskScore.findById(id).populate('assessmentId');
  if (!risk) throw new Error('Risk score not found');
  return risk;
};

exports.getAllRisks = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const risks = await RiskScore.find()
    .populate('assessmentId', 'type infrastructureName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await RiskScore.countDocuments();
  return { risks, total, page, pages: Math.ceil(total / limit) };
};

exports.deleteRisk = async (id) => {
  const risk = await RiskScore.findByIdAndDelete(id);
  if (!risk) throw new Error('Risk score not found');
  return { message: 'Risk score deleted' };
};

// PDF endpoint helper
exports.getRiskPdfData = async (id) => {
  const risk = await RiskScore.findById(id).populate('assessmentId');
  if (!risk) throw new Error('Risk not found');

  const assessment = await Assessment.findById(risk.assessmentId);
  const compliance = await ComplianceResult.findOne({ assessmentId: assessment._id });
  const weather = await weatherService.getWeatherByCoordinates(
    assessment.gpsCoordinates.latitude,
    assessment.gpsCoordinates.longitude
  );

  const pdfPath = await generateRiskPdf(risk, assessment, compliance, weather);
  return { filePath: path.join(__dirname, '../public', pdfPath) };
};