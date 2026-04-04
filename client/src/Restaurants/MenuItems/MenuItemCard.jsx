import React, { useState, useEffect } from "react";
import { Plus, Minus, ArrowRight, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../utils/cartSlice";
import { setAuthSidebarOpen } from "../../utils/userSlice";
import LazyImage from "../../LazyLoading/LazyImage";

const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
  const dispatch = useDispatch();
  
  // Check if item is already in global cart
  const cartItem = useSelector((store) => 
    store.cart.items.find((i) => i.menuItemId === item._id)
  );
  
  const { isAuthenticated } = useSelector((store) => store.user);

  const globalQuantity = cartItem ? cartItem.itemQuantity : 0;
  
  // Local state for the UI quantity before confirming
  const [localQty, setLocalQty] = useState(globalQuantity);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Sync local quantity if global quantity changes externally
  useEffect(() => {
    setLocalQty(globalQuantity);
  }, [globalQuantity]);

  const handleAdd = () => {
      if (!isAuthenticated) {
        dispatch(setAuthSidebarOpen(true));
        return;
      }
      setLocalQty(q => q + 1);
      setIsConfirmed(false);
  };
  
  const handleRemove = () => {
      setLocalQty(q => Math.max(0, q - 1));
      setIsConfirmed(false);
  };

  const handleConfirm = () => {
      if (localQty > 0) {
          dispatch(addItemToCart({
              menuItemId: item._id,
              menuItemName: item.menuItemName,
              menuItemPrice: item.menuItemPrice,
              itemQuantity: localQty,
              menuItemImage: item.menuItemImage,
              isMenuItemVeg: item.isMenuItemVeg,
              restaurantId: restaurantId,
              restaurantName: restaurantName,
          }));
      } else {
          dispatch(removeItemFromCart(item._id));
      }
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 2000); // Reset confirm animation
  };

  const showConfirmButton = localQty !== globalQuantity || (localQty === 0 && globalQuantity !== 0);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex p-4 gap-6">
      {/* Left Area: Image */}
      <div className="relative w-36 h-36 md:w-48 md:h-48 shrink-0 rounded-3xl overflow-hidden bg-gray-50">
        {item.menuItemImage ? (
          <LazyImage
            src={item.menuItemImage}
            alt={item.menuItemName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-xl font-black opacity-20">EATS</span>
          </div>
        )}

        {/* Tags Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {item.isMenuItemAvailable && (
            <div className={`text-[9px] font-black px-3 py-1 rounded-full shadow-md
                ${item.isMenuItemVeg ? "bg-white text-[#04b235]" : "bg-white text-red-700"}
            `}>
              {item.isMenuItemVeg ? "VEG" : "NON-VEG"}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight pr-4">
            {item.menuItemName}
          </h3>
          <span className="text-lg md:text-xl font-bold text-[#04b235] whitespace-nowrap">
            ₹{item.menuItemPrice}
          </span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed mt-2 mb-4">
          {item.menuItemDescription || "A delicious freshly prepared meal to satisfy your cravings."}
        </p>

        {/* Action Area */}
        <div className="mt-auto flex items-center justify-between">
          {!item.isMenuItemAvailable ? (
            <span className="text-red-500 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
              Sold Out
            </span>
          ) : localQty === 0 && !showConfirmButton ? (
            <button
              onClick={handleAdd}
              className="bg-[#04b235] hover:bg-[#03912b] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 text-sm flex items-center gap-2 shadow-sm cursor-pointer"
            >
              Add to Cart
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full justify-between">
              {/* Quantity Counter */}
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                <button
                  onClick={handleRemove}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-red-600 shadow-sm transition-all border border-gray-100 cursor-pointer"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
                <span className="w-10 text-center font-bold text-gray-800 text-base">
                  {localQty}
                </span>
                <button
                  onClick={handleAdd}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-[#04b235] hover:text-[#03912b] shadow-sm transition-all border border-gray-100 cursor-pointer"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Confirm / Success Button */}
              {showConfirmButton ? (
                  <button 
                    onClick={handleConfirm}
                    className="bg-[#04b235] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-[#03912b] transition-all shadow-md cursor-pointer"
                  >
                    Confirm
                  </button>
              ) : isConfirmed ? (
                  <div className="bg-green-100 text-[#04b235] px-5 py-2.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 transition-all">
                     <Check size={14} strokeWidth={3} /> Added
                  </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
