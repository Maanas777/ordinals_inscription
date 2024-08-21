import React from 'react';

interface InscriptionDetailsProps {
  response: any;
}

const InscriptionDetails: React.FC<InscriptionDetailsProps> = ({ response }) => {
  return (
    <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Inscription Details</h2>
      <p className="text-gray-800">
        Your inscription is in the queue. Send BTC to the address below to complete the process:
      </p>
      <p className="bg-gray-300 p-3 rounded-lg font-mono text-gray-900 mt-4 break-words">
        {response.receiveAddress}
      </p>
      <div className="mt-4">
        <p><strong>Charge ID:</strong> {response.charge?.id}</p>
        <p><strong>Amount (Sats):</strong> {response.charge?.amount}</p>
      </div>
    </div>
  );
};

export default InscriptionDetails;
