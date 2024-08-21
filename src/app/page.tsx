'use client';
import { useState } from 'react';
import InscriptionForm from './components/InscriptionForm';
import InscriptionDetails from './components/InscriptionDetails';

export default function Home() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-gray-800 h-full flex flex-col justify-center">
        {response ? (
          <InscriptionDetails response={response} />
        ) : (
          <InscriptionForm
            onSuccess={(data) => setResponse(data)}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}
