// RefundComponent.jsx
import React from 'react';

const refundData = {
  refundId: 'RF987654321',
  method: 'UPI - GPay',
  status: 'Refund Credited',
  amount: '₹1,299',
  creditedOn: '2025-06-09',
};

const RefundComponent = () => {
  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Refund Details</h3>
      <div className="text-sm text-gray-700 space-y-1">
        <p>Refund ID: <span className="font-medium">{refundData.refundId}</span></p>
        <p>Amount: <span className="font-semibold text-green-600">{refundData.amount}</span></p>
        <p>Credited On: <span className="font-medium">{refundData.creditedOn}</span></p>
        <p>Refund Method: <span className="font-medium">{refundData.method}</span></p>
        <p>Status: <span className="text-green-600 font-semibold">{refundData.status}</span></p>
      </div>
    </div>
  );
};

export default RefundComponent;
