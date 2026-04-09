import React from 'react';

const StatCard = ({ title, value, icon: Icon, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-testid={`stat-card-${title.toLowerCase().replace(/\s/g, '-')}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className="text-gray-700" size={24} />
      </div>
    </div>
  </div>
);

export default StatCard;
