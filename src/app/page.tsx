'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [fee, setFee] = useState<number>(2);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(selectedFile); // Read the file as Base64
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file.');
      return;
    }

    setLoading(true); // Start loader

    const payload = {
      files: [
        {
          name: 'example.png', // Name of the file
          dataURL: file,
          type: 'image/png' // File type, change if needed
        }
      ],
      receiveAddress,
      fee
    };

    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResponse(data); // Set response
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-gray-800 h-full flex flex-col justify-center">
        {response ? (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Inscription Details</h2>
            <p className="text-gray-800">
              Your inscription is in the queue. Send BTC to the address below to complete the process:
            </p>
            <p className="bg-gray-300 p-3 rounded-lg font-mono text-gray-900 mt-4 break-words">
             Address: {response.charge?.id}
            </p>
            <p className="bg-gray-300 p-3 rounded-lg font-mono text-gray-900 mt-4 break-words">
             Sats To sent: {response.charge?.amount}
            </p>
            {/* <div className="mt-4">
              <p><strong>Charge ID:</strong> {response.charge?.id}</p>
              <p><strong>Amount (Sats):</strong> {response.charge?.amount}</p>
            </div> */}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Ordinal Inscription</h1>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">File:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Receive Address:</label>
              <input
                type="text"
                value={receiveAddress}
                onChange={(e) => setReceiveAddress(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your BTC address"
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Fee:</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(parseInt(e.target.value))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Set your fee"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-lg font-semibold text-lg hover:bg-indigo-700 transition transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Inscribe'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
