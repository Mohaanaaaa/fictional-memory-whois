import React, { useState } from 'react';
import './App.css';

const WhoisChecker = () => {
  const [domain, setDomain] = useState('example.com'); // Default domain value
  const [whoisResponse, setWhoisResponse] = useState(null);
  const [domainResponse, setDomainResponse] = useState(null);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // State to hold QR code image URL

  const handleFetchData = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    setError(''); // Reset any previous errors
    setWhoisResponse(null); // Clear previous WHOIS response data
    setDomainResponse(null); // Clear previous domain response data
    setQrCodeUrl(null); // Clear previous QR code URL

    // Construct the API URLs
    const whoisApiUrl = `https://api.api-ninjas.com/v1/whois?domain=${domain}`;
    const domainApiUrl = `https://api.api-ninjas.com/v1/domain?domain=${domain}`;
    const API='V6acywBV8zWqimywYB1NSO6cP1LpF0soxnP5xVps';

    try {
      // Fetch WHOIS data
      const whoisResponse = await fetch(whoisApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
        },
      });
    
      if (!whoisResponse.ok) {
        throw new Error(`Error fetching WHOIS data: ${whoisResponse.status} ${whoisResponse.statusText}`);
      }
    
      const whoisData = await whoisResponse.json();
      setWhoisResponse(whoisData); // Set WHOIS data to state
    
      // Fetch domain information
      const domainResponse = await fetch(domainApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
        },
      });
    
      if (!domainResponse.ok) {
        throw new Error(`Error fetching domain data: ${domainResponse.status} ${domainResponse.statusText}`);
      }
    
      const domainData = await domainResponse.json();
      setDomainResponse(domainData); // Set domain data to state
    
      // Generate QR code using WHOIS response data
      // Make sure to replace 'someRelevantField' with the actual field you need
      //const relevantWhoisData = whoisData.someRelevantField; // Specify the field to use from the WHOIS response
      const qrCodeApiUrl = `https://api.api-ninjas.com/v1/qrcode?data=${encodeURIComponent(whoisResponse)}&format=png`;
    
      const qrCodeResponse = await fetch(qrCodeApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
          'Accept': 'image/png',
        },
      });
    
      if (!qrCodeResponse.ok) {
        throw new Error(`Error fetching QR code: ${qrCodeResponse.status} ${qrCodeResponse.statusText}`);
      }
    
      // Get the URL of the QR code image
      const blob = await qrCodeResponse.blob();
      const qrCodeImageUrl = URL.createObjectURL(blob);
      setQrCodeUrl(qrCodeImageUrl); // Set QR code URL to state
    
    } catch (err) {
      // Handle any errors that occurred during the fetch
      setError('Error fetching data: ' + err.message);
      console.error('Error fetching data:', err.message); // Log the error for debugging
    }

    /*try {
      // Fetch WHOIS data
      const whoisResponse = await fetch(whoisApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
        },
      });

      if (!whoisResponse.ok) {
        throw new Error(`Error fetching WHOIS data: ${whoisResponse.status} ${whoisResponse.statusText}`);
      }

      const whoisData = await whoisResponse.json();
      setWhoisResponse(whoisData); // Set WHOIS data to state

      // Fetch domain information
      const domainResponse = await fetch(domainApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
        },
      });

      if (!domainResponse.ok) {
        throw new Error(`Error fetching domain data: ${domainResponse.status} ${domainResponse.statusText}`);
      }

      const domainData = await domainResponse.json();
      setDomainResponse(domainData); // Set domain data to state

      // Generate QR code with the relevant WHOIS data
      const relevantwhoisResponse = whoisResponse.someField; // Change 'someField' to the relevant detail you want from WHOIS
      const qrCodeApiUrl = `https://api.api-ninjas.com/v1/qrcode?data=${encodeURIComponent(relevantwhoisResponse)}&format=png`;

      // Generate QR code with the domain
      //const qrCodeApiUrl = `https://api.api-ninjas.com/v1/qrcode?data=${encodeURIComponent(domain)}&format=png`;
      const qrCodeResponse = await fetch(qrCodeApiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': API, // Your API key
          'Accept': 'image/png',
        },
      });

      if (!qrCodeResponse.ok) {
        throw new Error(`Error fetching QR code: ${qrCodeResponse.status} ${qrCodeResponse.statusText}`);
      }

      // Get the URL of the QR code image
      const blob = await qrCodeResponse.blob();
      const qrCodeImageUrl = URL.createObjectURL(blob);
      setQrCodeUrl(qrCodeImageUrl); // Set QR code URL to state

    } catch (err) {
      // Handle any errors that occurred during the fetch
      setError('Error fetching data: ' + err.message);
      console.error('Error fetching data:', err.message); // Log the error for debugging
    }*/
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
      <div style={{ fontSize: '14px', color: 'red', margin: '10px' }}>
          <strong>Important Note:</strong> This website is for educational purposes only. The data obtained from this website should not be used for any illegal or criminal activities. Respect data privacy.
        </div>
        <h1>WHOIS Checker</h1>
        <form onSubmit={handleFetchData}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain"
          />
          <button type="submit">Check WHOIS</button>
        </form>
        {whoisResponse && (
          <div>
            <h2>WHOIS Information</h2>
            <pre>{JSON.stringify(whoisResponse, null, 2)}</pre>
          </div>
        )}
        {domainResponse && (
          <div>
            <h2>Domain Information</h2>
            <p><strong>Domain:</strong> {domainResponse.domain || domain}</p>
            <p><strong>Available:</strong> {domainResponse.available ? 'Yes' : 'No'}</p>
            <p><strong>Creation Date:</strong> {domainResponse.creation_date ? new Date(domainResponse.creation_date * 1000).toLocaleString() : 'N/A'}</p>
            <p><strong>Registrar:</strong> {domainResponse.registrar || 'No registrar info available'}</p>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* QR code section */}
      {qrCodeUrl && (
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2>QR Code</h2>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default WhoisChecker;