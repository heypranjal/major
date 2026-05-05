# TB Detect AI

An AI-based tuberculosis (TB) detection system that estimates TB risk using two inputs:

- Place-of-living demographics (location and household context).
- Lung opacity metrics from medical imaging.

This frontend provides the user interface for collecting inputs and presenting the model output, backed by a production-ready AI model.

## Features

- Guided input flow for demographic and imaging-derived opacity data.
- Risk score output with a clear summary and next-step guidance.
- Responsive UI for desktop and mobile.

## Tech Stack

- React
- Vite
- CSS
- Python (model and inference service)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
frontend/
	public/
	src/
		components/
		pages/
		App.jsx
		main.jsx
```

## How It Works (High Level)

1. User provides location-based demographic inputs.
2. User provides a lung opacity score derived from imaging analysis.
3. The backend model calculates TB risk and returns the result.
4. The UI renders the prediction and guidance.

## Model Integration

The system includes a backend endpoint that accepts demographic details and opacity metrics and returns a risk score.

Example response shape:

```json
{
	"riskScore": 0.72,
	"riskLevel": "high",
	"message": "High likelihood of TB. Please consult a clinician."
}
```

## Disclaimer

This software is for educational and research purposes only. It is not a medical device and should not be used as a substitute for professional diagnosis or treatment.

## License

Specify the license for this project here.
