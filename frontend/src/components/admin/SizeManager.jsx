import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_SIZES = ['0', '0.5', '0.75', '1', '2', '3', '4', '5'];

const SizeManager = ({ sizes, basePrice, onSizesChange }) => {
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customPriceInput, setCustomPriceInput] = useState('');

  const addDefaultSize = (size) => {
    if (sizes.find(s => s.size === size)) return;
    onSizesChange([...sizes, { size, price: basePrice || '0' }]);
  };

  const addCustomSize = () => {
    if (!customSizeInput.trim() || !customPriceInput) return;
    if (sizes.find(s => s.size === customSizeInput.trim())) {
      toast.error('Size already exists');
      return;
    }
    onSizesChange([...sizes, { size: customSizeInput.trim(), price: customPriceInput }]);
    setCustomSizeInput('');
    setCustomPriceInput('');
  };

  const updateSizePrice = (sizeValue, price) => {
    onSizesChange(sizes.map(s => s.size === sizeValue ? { ...s, price } : s));
  };

  const removeSize = (sizeValue) => {
    onSizesChange(sizes.filter(s => s.size !== sizeValue));
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4" data-testid="size-management-section">
      <label className="block text-sm font-semibold text-gray-900 mb-3">Sizes & Prices</label>

      {/* Quick add default sizes */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">Quick add default sizes:</p>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_SIZES.map(size => {
            const exists = sizes.find(s => s.size === size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => addDefaultSize(size)}
                disabled={!!exists}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${exists ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-[#E8A0A8] text-[#E8A0A8] hover:bg-[#E8A0A8] hover:text-white'}`}
                data-testid={`quick-add-size-${size}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current sizes list */}
      {sizes.length > 0 && (
        <div className="space-y-2 mb-3">
          {sizes.map((s) => (
            <div key={s.size} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm font-semibold text-gray-700 w-16">Size {s.size}</span>
              <span className="text-xs text-gray-400">&#8377;</span>
              <input
                type="number"
                value={s.price}
                onChange={(e) => updateSizePrice(s.size, e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#E8A0A8]"
                min="0"
                step="0.01"
                data-testid={`size-price-${s.size}`}
              />
              <button
                type="button"
                onClick={() => removeSize(s.size)}
                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                data-testid={`remove-size-${s.size}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom size input */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Custom size</p>
          <input
            type="text"
            value={customSizeInput}
            onChange={(e) => setCustomSizeInput(e.target.value)}
            placeholder="e.g. 6, XL"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E8A0A8]"
            data-testid="custom-size-input"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Price (&#8377;)</p>
          <input
            type="number"
            value={customPriceInput}
            onChange={(e) => setCustomPriceInput(e.target.value)}
            placeholder="&#8377;"
            min="0"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E8A0A8]"
            data-testid="custom-price-input"
          />
        </div>
        <button
          type="button"
          onClick={addCustomSize}
          className="px-4 py-1.5 text-sm bg-[#E8A0A8] text-white rounded-lg hover:bg-[#D8909C]"
          data-testid="add-custom-size-btn"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default SizeManager;
