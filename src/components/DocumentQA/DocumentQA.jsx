import React, { useState } from 'react';
import './DocumentQA.css';

const DocumentQA = () => {
  // --- State Management ---
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- THE CRITICAL FIX ---
  // We use an environment variable for the API URL.
  // This makes the component work both locally and when deployed.
 const API_ENDPOINT = `${process.env.REACT_APP_API_URL}/api/documents/process`;

  // --- Event Handlers ---
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // Clear previous results when a new file is chosen
    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation
    if (!file || !query) {
      setError('Please upload a file and enter a query.');
      return;
    }

    // Reset state for new submission
    setIsLoading(true);
    setResult(null);
    setError('');

    // Prepare data for sending
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      // Send the request to the backend
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      // Handle errors returned from the server
      if (!response.ok) {
        throw new Error(responseData.message || 'An unknown error occurred on the server.');
      }

      // On success, update the result state
      setResult(responseData);
    } catch (err) {
      // Handle network errors or other exceptions
      setError(err.message);
      console.error('Error processing document:', err);
    } finally {
      // Ensure the loading state is always turned off
      setIsLoading(false);
    }
  };

  // --- JSX for Rendering the Component ---
  return (
    <div className="doc-qa-container">
      <div className="doc-qa-header">
        <h2>Policy Document Analysis</h2>
        <p>Upload a policy PDF to get an AI-powered analysis based on its content.</p>
      </div>
      <form onSubmit={handleSubmit} className="doc-qa-form">
        <div className="form-group">
          <label htmlFor="document-file">1. Upload Policy Document</label>
          <input type="file" id="document-file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="query-text">2. Ask a Question</label>
          <input
            type="text"
            id="query-text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Is cataract surgery covered for a 46 year old?"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Analyze Policy'}
        </button>
      </form>

      <div className="results-section">
        {error && <div className="error-message">{error}</div>}
        {result && (
          <div className={`result-display ${result.decision.toLowerCase().replace(/\s+/g, '-')}`}>
            <h3>Analysis Complete</h3>
            <p className="narrative">{result.narrative_response}</p>
            
            {result.justification && result.justification.length > 0 && (
              <div className="justification-section">
                <h4>Supporting Clauses from Document:</h4>
                <ul>
                  {result.justification.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentQA;