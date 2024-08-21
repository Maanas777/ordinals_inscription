'use client';
import React, { useState } from 'react';
import ErrorComponent from './ErrorComponent'; 

interface InscriptionFormProps {
  onSuccess: (response: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const InscriptionForm: React.FC<InscriptionFormProps> = ({ onSuccess, loading, setLoading }) => {
  const [file, setFile] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [fee, setFee] = useState<number>(2);
  const [error, setError] = useState<string | null>(null); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(selectedFile); 
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file.');
      return;
    }

    setLoading(true); 
    setError(null); 

    const payload = {
      files: [
        {
          name: 'example.png', 
          dataURL: file,
          type: 'image/png', 
        },
      ],
      receiveAddress,
      fee,
    };

    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to inscribe. Status: ${res.status}`);
      }

      const data = await res.json();
      onSuccess(data); 
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
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
      {error && <ErrorComponent message={error} />} 
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
  );
};

export default InscriptionForm;
