import React from "react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeItemFromCart } from "../utils/cartSlice";
import LazyImage from "../LazyLoading/LazyImage";
import OrderSuccess from "../Animations/OrderSuccess";
import DummyCheckout from "./DummyCheckout";

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isDummyCheckoutOpen, setIsDummyCheckoutOpen] = React.useState(false);
  const cartItems = useSelector((store) => store.cart.items);
  const totalAmount = useSelector((store) => store.cart.totalAmount);
  const cartRestaurantId = useSelector((store) => store.cart.restaurantId);

  const handleDelete = (id) => {
    dispatch(removeItemFromCart(id));
  };

  // Hardcode small flat delivery fee for aesthetics if cart has items
  const deliveryFee = cartItems.length > 0 ? 49 : 0;
  const finalTotal = totalAmount + deliveryFee;

  const handleUpdate = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeItemFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (finalTotal <= 0) return;
    setIsDummyCheckoutOpen(true);
  };

  // Build the order payload to send to backend
  const orderPayload = cartRestaurantId ? {
    restaurantId: cartRestaurantId,
    orderTotalAmount: finalTotal,
    deliveryFee: deliveryFee,
    orderItems: cartItems.map(item => ({
      menuItemId: item.menuItemId,
      itemName: item.menuItemName,   // snapshot name at order time
      itemPrice: item.menuItemPrice,
      itemQuantity: item.itemQuantity,
      isVeg: item.isMenuItemVeg,
    })),
  } : null;

  return (
    <>
      <OrderSuccess isVisible={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <DummyCheckout 
        isOpen={isDummyCheckoutOpen} 
        onClose={() => setIsDummyCheckoutOpen(false)} 
        amount={finalTotal} 
        orderPayload={orderPayload}
        onSuccess={() => {
          setIsSuccessOpen(true);
          onClose();
        }} 
      />

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <ShoppingBag className="text-[#04b235]" size={24} strokeWidth={2.5} />
             <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full text-gray-400 transition-colors cursor-pointer"
          >
            <X size={20} className="stroke-2" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                 <ShoppingBag size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cart is empty</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">Looks like you haven't added any delicious food yet.</p>
              <button 
                onClick={onClose}
                className="mt-8 text-[#04b235] font-bold border border-[#04b235]/30 px-6 py-2.5 rounded-full hover:bg-[#04b235]/10 transition-colors"
                >
                  Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.menuItemId} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                     {item.menuItemImage && (
                        <LazyImage src={item.menuItemImage} alt={item.menuItemName} className="w-full h-full object-cover" />
                     )}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-start justify-between">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 pr-2">{item.menuItemName}</h4>
                        <span className="font-bold text-[#04b235] text-sm">₹{item.menuItemPrice * item.itemQuantity}</span>
                     </div>
                     <div className="text-[10px] text-gray-400 mb-3">{item.isMenuItemVeg ? 'Veg' : 'Non-Veg'}</div>
                     
                     <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-full p-1 border border-gray-200">
                            <button 
                              onClick={() => handleUpdate(item.menuItemId, item.itemQuantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-red-500 shadow-sm transition-colors cursor-pointer"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800 text-xs">
                              {item.itemQuantity}
                            </span>
                            <button 
                              onClick={() => handleUpdate(item.menuItemId, item.itemQuantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-green-700 hover:text-green-800 shadow-sm transition-colors cursor-pointer"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                          
                          {/* Direct delete button */}
                          <button
                            onClick={() => handleDelete(item.menuItemId)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white">
               <div className="space-y-3 mb-6">
                 <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">₹{totalAmount}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-800">₹{deliveryFee}</span>
                 </div>
                 <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between mt-1">
                    <span className="font-bold text-gray-800">Total to Pay</span>
                    <span className="text-xl font-black text-[#04b235]">₹{finalTotal}</span>
                 </div>
               </div>
               
               <button 
                 onClick={handleCheckout}
                 className="w-full bg-[#04b235] hover:bg-[#03912b] text-white font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
               >
                 Checkout Securely 
               </button>
            </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
