import { useState } from 'react';
import './GetHealth.css';

function GetHealth() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/dicom')) {
      setSelectedFile(file);
      setResult(null);
    } else {
      alert('Please select a valid image file (JPG, PNG, DICOM)');
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
    if (!selectedFile) return;

    setIsAnalysing(true);

    // Simulate API call delay
    setTimeout(() => {
      setResult({
        confidence: 92.5,
        risk: 'Low Risk',
        findings: [
          'No obvious signs of tuberculosis detected',
          'Lung fields appear clear',
          'Heart and mediastinum normal',
          'No pleural effusion observed'
        ],
        recommendation: 'Based on the analysis, no immediate TB indicators were found. However, please consult with a healthcare professional for a complete evaluation.'
      });
      setIsAnalysing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setResult(null);
    setIsAnalysing(false);
  };

  return (
    <div className="get-health-container">
      <div className="header-section">
        <h1>TB Detection Analysis</h1>
        <p>Upload your chest X-ray for AI-powered tuberculosis screening</p>
      </div>

      <div className="upload-section">
        <div className="upload-card">
          {!selectedFile ? (
            <div
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('fileInput').click()}
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
                  <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!isAnalysing && !result && (
                <button onClick={handleAnalyze} className="analyze-btn">
                  Analyze X-Ray
                </button>
              )}
            </div>
          )}
        </div>

        {isAnalysing && (
          <div className="analysing-section">
            <div className="loader">
              <div className="pulse-circle"></div>
            </div>
            <h3>Analysing X-Ray...</h3>
            <p>Our AI is examining your X-ray for TB indicators</p>
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
                <button className="download-btn">
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