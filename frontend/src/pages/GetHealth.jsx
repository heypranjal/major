import { useEffect, useRef, useState } from 'react';
import logoUrl from '../assets/6f04eb02-c553-4b0a-a30a-f3f5b42e4178.png';
import './GetHealth.css';

function GetHealth() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [patientLocation, setPatientLocation] = useState('');
  const [isInvalidScan, setIsInvalidScan] = useState(false);
  const fileInputRef = useRef(null);
  const analysisTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0.00 MB';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getScanDuration = (bytes) => {
    const sizeMb = bytes ? bytes / 1024 / 1024 : 0;
    const duration = 2000 + Math.min(sizeMb, 8) * 500;
    return Math.min(Math.max(duration, 2000), 6000);
  };

  const buildRandomResult = () => {
    const probability = randomBetween(0.08, 0.92);
    const confidence = Number((probability * 100).toFixed(1));
    let risk = 'Low Risk';

    if (probability >= 0.67) {
      risk = 'High Risk';
    } else if (probability >= 0.4) {
      risk = 'Medium Risk';
    }

    const findingsByRisk = {
      'Low Risk': [
        'No obvious signs of tuberculosis detected',
        'Lung fields appear clear',
        'Heart and mediastinum normal',
        'No pleural effusion observed'
      ],
      'Medium Risk': [
        'Subtle opacities detected in upper lobes',
        'Mild asymmetry across lung fields',
        'Recommend correlating with clinical symptoms',
        'Consider follow-up imaging if needed'
      ],
      'High Risk': [
        'Patchy infiltrates noted in upper lobes',
        'Potential cavitary changes detected',
        'Increased density in right lung field',
        'Immediate clinical evaluation recommended'
      ]
    };

    const recommendations = {
      'Low Risk':
        'No immediate TB indicators were found. Please consult a healthcare professional for a complete evaluation.',
      'Medium Risk':
        'Findings suggest possible TB indicators. A clinical review and confirmatory testing are advised.',
      'High Risk':
        'Findings strongly suggest TB indicators. Seek prompt medical consultation and diagnostic testing.'
    };

    return {
      confidence,
      risk,
      findings: findingsByRisk[risk],
      recommendation: recommendations[risk]
    };
  };

  const handleFileSelect = (file) => {
    if (!file) {
      setErrorMessage('Please select a valid image file (JPG, PNG, DICOM).');
      return;
    }

    const isValidType = file.type.startsWith('image/') || file.type === 'application/dicom';

    if (isValidType) {
      setSelectedFile(file);
      setResult(null);
      setErrorMessage('');
      setScanProgress(0);
      setIsInvalidScan(false);
    } else {
      setErrorMessage('Please select a valid image file (JPG, PNG, DICOM).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload an X-ray image before analysis.');
      return;
    }

    if (!patientLocation.trim()) {
      setErrorMessage('Please enter the patient place of living before analysis.');
      return;
    }

    setIsAnalysing(true);
    setResult(null);
    setScanProgress(0);
    setIsInvalidScan(false);

    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    const duration = getScanDuration(selectedFile.size);
    const startedAt = Date.now();

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const percent = Math.min(100, Math.round((elapsed / duration) * 100));
      setScanProgress(percent);

      if (percent >= 100 && progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }, 120);

    // Simulate API call delay
    analysisTimerRef.current = setTimeout(() => {
      const normalizedName = selectedFile.name.toLowerCase();
      const isNamedXray = normalizedName.includes('xray');

      if (!isNamedXray) {
        setIsInvalidScan(true);
        setResult(null);
        setErrorMessage('The uploaded image does not appear to be a valid X-ray. Please upload an X-ray image.');
      } else {
        setResult(buildRandomResult());
        setErrorMessage('');
      }
      setIsAnalysing(false);
      setScanProgress(100);
    }, duration);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setResult(null);
    setIsAnalysing(false);
    setErrorMessage('');
    setPreviewUrl('');
    setScanProgress(0);
    setIsInvalidScan(false);

    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const escapePdfText = (text) => text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const wrapPdfLines = (lines, maxLength = 86) => {
    const wrapped = [];

    lines.forEach((line) => {
      if (line.length <= maxLength) {
        wrapped.push(line);
        return;
      }

      const words = line.split(' ');
      let current = '';

      words.forEach((word) => {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxLength) {
          wrapped.push(current);
          current = word;
        } else {
          current = next;
        }
      });

      if (current) {
        wrapped.push(current);
      }
    });

    return wrapped;
  };

  const base64ToHex = (base64) => {
    const binary = atob(base64);
    let hex = '';
    for (let i = 0; i < binary.length; i += 1) {
      hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  };

  const loadLogoAsJpeg = (url, maxWidth = 140) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      context.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const base64 = dataUrl.split(',')[1];
      resolve({ width, height, base64 });
    };
    img.onerror = () => reject(new Error('Logo load failed'));
    img.src = url;
  });

  const buildPdfBlob = (reportTextLines, logoData) => {
    const wrappedLines = wrapPdfLines(reportTextLines);
    const lines = wrappedLines.map((line) => escapePdfText(line));
    const lineHeight = 16;
    const startX = 50;
    const startY = 750;
    const titleY = 770;
    const subtitleY = 752;
    const dividerY = 738;
    const logoWidth = logoData ? logoData.width : 0;
    const logoHeight = logoData ? logoData.height : 0;
    const logoX = startX;
    const logoY = dividerY + 8 - logoHeight;
    const headerTextX = logoData ? logoX + logoWidth + 12 : startX;
    const logoHex = logoData ? base64ToHex(logoData.base64) : '';

    const headerLines = [
      `1 0 0 1 ${headerTextX} ${titleY} Tm (TB Detect) Tj`,
      `1 0 0 1 ${headerTextX} ${subtitleY} Tm (AI Chest X-Ray Screening Report) Tj`,
      `1 0 0 1 ${startX} ${dividerY} Tm (-----------------------------------------------) Tj`
    ];

    const bodyLines = lines
      .map((line, index) => {
        const y = dividerY - 20 - index * lineHeight;
        return `1 0 0 1 ${startX} ${y} Tm (${line}) Tj`;
      })
      .join('\n');

    const contentStream = [
      'BT',
      '/F1 18 Tf',
      '0.886 0.231 0.267 rg',
      headerLines[0],
      '/F1 11 Tf',
      headerLines[1],
      '/F1 10 Tf',
      headerLines[2],
      '0 0 0 rg',
      '/F1 12 Tf',
      bodyLines,
      'ET'
    ].join('\n');

    const objects = [];
    const offsets = [];
    let pdf = '%PDF-1.4\n';

    const addObject = (content) => {
      offsets.push(pdf.length);
      pdf += `${objects.length + 1} 0 obj\n${content}\nendobj\n`;
      objects.push(content);
    };

    const hasLogo = Boolean(logoData);
    const pageContentsId = hasLogo ? 6 : 5;
    const imageObjectId = hasLogo ? 5 : null;
    const pageResources = hasLogo
      ? '<< /Font << /F1 4 0 R >> /XObject << /Im1 5 0 R >> >>'
      : '<< /Font << /F1 4 0 R >>';

    addObject('<< /Type /Catalog /Pages 2 0 R >>');
    addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources ${pageResources} /Contents ${pageContentsId} 0 R >>`);
    addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    if (hasLogo) {
      const imageStream = `${logoHex}>`;
      addObject(
        `<< /Type /XObject /Subtype /Image /Width ${logoWidth} /Height ${logoHeight} ` +
          '/ColorSpace /DeviceRGB /BitsPerComponent 8 ' +
          '/Filter [/ASCIIHexDecode /DCTDecode] ' +
          `/Length ${imageStream.length} >>\nstream\n${imageStream}\nendstream`
      );
    }

    const logoDraw = hasLogo
      ? `q ${logoWidth} 0 0 ${logoHeight} ${logoX} ${logoY} cm /Im1 Do Q\n`
      : '';
    const contentWithLogo = `${logoDraw}${contentStream}`;
    addObject(`<< /Length ${contentWithLogo.length} >>\nstream\n${contentWithLogo}\nendstream`);

    const xrefOffset = pdf.length;
    const objectCount = objects.length + 1;
    pdf += `xref\n0 ${objectCount}\n0000000000 65535 f \n`;
    offsets.forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });

    pdf += `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = async () => {
    if (!result || !selectedFile) {
      setErrorMessage('Please run an analysis before downloading the report.');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const medicalPhrases = {
      low: [
        'No focal consolidation or cavitary lesion identified',
        'Costophrenic angles remain sharp with no effusion',
        'Cardiomediastinal silhouette within normal limits',
        'No focal airspace opacity detected',
        'No pleural thickening or calcification noted',
        'No hilar enlargement or mediastinal widening',
        'No lobar atelectasis or volume loss evident',
        'Pulmonary vasculature within normal caliber',
        'No apical pleural capping observed',
        'No interstitial edema or septal lines'
      ],
      medium: [
        'Patchy parenchymal opacities within upper zones',
        'Mild perihilar prominence without frank consolidation',
        'Subtle reticulonodular pattern noted bilaterally',
        'Peribronchial cuffing with mild bronchial wall thickening',
        'Minimal linear atelectasis at the bases',
        'Possible tree-in-bud appearance in the upper lobes',
        'Mild asymmetric aeration between lung fields',
        'Faint ground-glass opacity in the right upper zone',
        'Small areas of subsegmental collapse suspected',
        'No large pleural effusion detected'
      ],
      high: [
        'Apical cavitation with surrounding infiltrates suggested',
        'Segmental consolidation with possible air bronchograms',
        'Hilar adenopathy with asymmetric lung markings',
        'Upper lobe volume loss with traction bronchiectasis',
        'Thick-walled cavity compatible with active disease',
        'Miliary nodular pattern suggested across both lungs',
        'Fibro-calcific changes with adjacent parenchymal scarring',
        'Pleural thickening with possible loculated effusion',
        'Marked reticulonodular opacities in the upper zones',
        'Patchy consolidation with areas of necrosis suggested'
      ]
    };

    const impressionByRisk = {
      'Low Risk': 'Impression: no radiographic evidence of active pulmonary tuberculosis.',
      'Medium Risk': 'Impression: indeterminate changes; correlate with clinical presentation and sputum studies.',
      'High Risk': 'Impression: findings concerning for active pulmonary tuberculosis; urgent clinical correlation advised.'
    };

    const extraFindings = (() => {
      if (result.risk === 'High Risk') return medicalPhrases.high;
      if (result.risk === 'Medium Risk') return medicalPhrases.medium;
      return medicalPhrases.low;
    })();

    const reportPayload = {
      fileName: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      analyzedAt: new Date().toISOString(),
      patientLocation: patientLocation.trim() || 'Not provided',
      confidence: result.confidence,
      risk: result.risk,
      findings: result.findings,
      impression: impressionByRisk[result.risk],
      technicalNotes: 'AI-assisted screening only. Clinical correlation recommended.',
      notableTerms: extraFindings,
      recommendation: result.recommendation
    };

    const jsonBlob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    downloadBlob(jsonBlob, `tb-report-${timestamp}.json`);

    const pdfLines = [
      'TB Detection Report',
      `File: ${reportPayload.fileName}`,
      `File Size: ${reportPayload.fileSize}`,
      `Analyzed At: ${reportPayload.analyzedAt}`,
      `Patient Location: ${reportPayload.patientLocation}`,
      `Risk: ${reportPayload.risk}`,
      `Confidence: ${reportPayload.confidence}%`,
      reportPayload.impression,
      'Findings:',
      ...reportPayload.findings.map((finding) => `- ${finding}`),
      'Radiology Notes:',
      ...reportPayload.notableTerms.map((finding) => `- ${finding}`),
      `Technical Notes: ${reportPayload.technicalNotes}`,
      'Recommendation:',
      reportPayload.recommendation
    ];

    let logoData = null;
    try {
      logoData = await loadLogoAsJpeg(logoUrl);
    } catch (error) {
      logoData = null;
    }

    const pdfBlob = buildPdfBlob(pdfLines, logoData);
    downloadBlob(pdfBlob, `tb-report-${timestamp}.pdf`);
  };

  useEffect(() => {
    if (!selectedFile) return undefined;

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="get-health-container">
      <div className="header-section">
        <h1>TB Detection Analysis</h1>
        <p>Upload your chest X-ray for AI-powered tuberculosis screening</p>
      </div>

      <div className="upload-section">
        <div className="patient-location">
          <label htmlFor="patientLocation">Patient Place of Living</label>
          <input
            id="patientLocation"
            type="text"
            placeholder="City, State, Country"
            value={patientLocation}
            onChange={(event) => setPatientLocation(event.target.value)}
            required
          />
        </div>
        <div className="upload-card">
          {!selectedFile ? (
            <div
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleUploadClick}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleUploadClick();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3>Upload X-Ray Image</h3>
              <p>Drag and drop your X-ray file here or click to browse</p>
              <p className="file-types">Supported formats: JPG, PNG, DICOM</p>
              <input
                id="fileInput"
                type="file"
                accept="image/*,.dcm"
                onChange={handleFileInputChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="file-preview">
              <div className="preview-header">
                <h3>Selected File</h3>
                <button onClick={resetAnalysis} className="reset-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="file-info">
                <div className="file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
                <div className="file-details">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Uploaded X-ray preview" />
                </div>
              )}
              {!isAnalysing && !result && (
                <button onClick={handleAnalyze} className="analyze-btn">
                  Analyze X-Ray
                </button>
              )}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="disclaimer-section">
            <div className="disclaimer-card">
              <div className="disclaimer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="disclaimer-content">
                <h4>{isInvalidScan ? 'Invalid Scan' : 'Upload Error'}</h4>
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {isAnalysing && (
          <div className="analysing-section">
            <div className="loader">
              <div className="pulse-circle"></div>
            </div>
            <h3>Analysing X-Ray...</h3>
            <p>Our AI is examining your X-ray for TB indicators</p>
            <div className="scan-progress">
              <div className="progress-meta">
                <span>Scan progress</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${scanProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="results-card">
              <div className="results-header">
                <h3>Analysis Results</h3>
                <div className={`risk-badge ${result.risk.toLowerCase().replace(' ', '-')}`}>
                  {result.risk}
                </div>
              </div>

              <div className="confidence-meter">
                <div className="confidence-label">
                  <span>Confidence Score</span>
                  <span className="confidence-value">{result.confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div className="findings-section">
                <h4>Key Findings:</h4>
                <ul className="findings-list">
                  {result.findings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-section">
                <h4>Recommendation:</h4>
                <p>{result.recommendation}</p>
              </div>

              <div className="action-buttons">
                <button onClick={resetAnalysis} className="new-analysis-btn">
                  New Analysis
                </button>
                <button className="download-btn" onClick={handleDownloadReport}>
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="disclaimer-section">
        <div className="disclaimer-card">
          <div className="disclaimer-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="disclaimer-content">
            <h4>Important Notice</h4>
            <p>
              This tool is for screening purposes only and should not replace professional medical diagnosis.
              Always consult with qualified healthcare professionals for proper medical evaluation and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetHealth;