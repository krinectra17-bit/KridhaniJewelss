import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#F5E6E8] flex gap-4" data-testid={`cart-item-${item.cartKey}`}>
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#2C1810] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {item.category}
        </p>
        {item.selectedSize && (
          <p className="text-xs font-semibold text-[#E8A0A8] mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid={`cart-size-${item.cartKey}`}>
            Size: {item.selectedSize}
          </p>
        )}
        <p className="text-lg font-bold text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          &#8377;{item.price}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.cartKey)}
          className="text-gray-400 hover:text-[#E8A0A8] transition-colors"
          data-testid={`remove-item-${item.cartKey}`}
        >
          <Trash2 size={18} />
        </button>
        <div className="flex items-center gap-2 bg-[#FFF9FA] rounded-lg px-3 py-1">
          <button
            onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
            className="text-[#E8A0A8] hover:text-[#D8909C]"
            data-testid={`decrease-qty-${item.cartKey}`}
          >
            <Minus size={16} />
          </button>
          <span className="font-semibold text-[#2C1810] w-8 text-center" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
            className="text-[#E8A0A8] hover:text-[#D8909C]"
            data-testid={`increase-qty-${item.cartKey}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
