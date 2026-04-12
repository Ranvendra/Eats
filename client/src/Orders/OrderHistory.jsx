import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import OrderHero from "./OrderHero";
import LazyImage from "../LazyLoading/LazyImage";
import { Clock, Package, Loader2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCart } from "../utils/cartSlice";
import { useToast } from "../Toast/ToastContext";

// 1 minute = simulated delivery time
const DELIVERY_TIME_MS = 60 * 1000;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── ACTIVE (Current) Order Card ─────────────────────────────────────────────
const ActiveOrderCard = ({ order, onDelivered }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const createdAt = new Date(order.createdAt).getTime();
    return Math.max(0, DELIVERY_TIME_MS - (Date.now() - createdAt));
  });

  useEffect(() => {
    const createdAt = new Date(order.createdAt).getTime();
    if (timeLeft <= 0) {
      onDelivered(order._id);
      return;
    }
    const interval = setInterval(() => {
      const newLeft = Math.max(0, DELIVERY_TIME_MS - (Date.now() - createdAt));
      setTimeLeft(newLeft);
      if (newLeft <= 0) {
        clearInterval(interval);
        onDelivered(order._id);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [order._id, order.createdAt, onDelivered, timeLeft]);

  const seconds = Math.ceil(timeLeft / 1000);
  const progress = ((DELIVERY_TIME_MS - timeLeft) / DELIVERY_TIME_MS) * 100;

  const restaurantName = order.restaurantName || order.restaurantId?.restaurantName || "Restaurant";
  const restaurantAddress = order.restaurantId?.restaurantCity || order.restaurantId?.restaurantAddress || "";
  const items = order.orderItems?.map(i => i.itemName || "Item").filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-[#04b235]/20 shadow-md overflow-hidden">
      {/* Live progress bar */}
      <div className="h-1.5 bg-gray-100 w-full">
        <div
          className="h-full bg-[#04b235] transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5 flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-12 h-12 bg-[#04b235]/10 rounded-xl flex items-center justify-center shrink-0">
          <Package size={22} className="text-[#04b235]" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-black text-gray-900 text-lg leading-tight">{restaurantName}</h3>
              {restaurantAddress && <p className="text-gray-400 text-xs mt-0.5">{restaurantAddress}</p>}
            </div>
            <span className="font-black text-gray-900 text-lg">₹{order.orderTotalAmount}</span>
          </div>

          {items?.length > 0 && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
              {items.join(" · ")}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#04b235] font-bold text-sm">
              <Clock size={14} />
              <span>{timeLeft > 0 ? `Arriving in ${seconds}s` : "Delivered!"}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#04b235]/10 text-[#04b235] px-3 py-1 rounded-full">
              Preparing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAST Order Card — Your Original Design ──────────────────────────────────
const PastOrderItem = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleReorder = () => {
    let totalQuantity = 0;
    let totalAmount = 0;
    
    const newItems = (order.orderItems || []).map(item => {
        totalQuantity += item.itemQuantity;
        totalAmount += item.itemQuantity * item.itemPrice;
        
        return {
           menuItemId: item.menuItemId,
           menuItemName: item.itemName || "Item",
           menuItemPrice: item.itemPrice,
           itemQuantity: item.itemQuantity,
           isMenuItemVeg: item.isVeg !== undefined ? item.isVeg : true,
           menuItemImage: undefined 
        };
    });

    const restId = order.restaurantId?._id || order.restaurantId;

    const newCartPayload = {
       items: newItems,
       totalQuantity,
       totalAmount,
       restaurantId: restId,
       restaurantName: order.restaurantName || order.restaurantId?.restaurantName || "",
    };

    dispatch(loadCart(newCartPayload));
    addToast("Cart replaced with your previous order!");
    
    if (restId) {
      navigate("/restaurants/" + restId);
    }
  };

  const restaurantName = order.restaurantName || order.restaurantId?.restaurantName || "Restaurant";
  const restaurantAddress = order.restaurantId?.restaurantCity || order.restaurantId?.restaurantAddress || "";
  const restaurantImage = order.restaurantId?.restaurantImage || null;
  const items = order.orderItems?.map(i => i.itemName || "Item").filter(Boolean) || [];
  const date = formatDate(order.createdAt);

  return (
    <div className="group bg-white border-b border-gray-200 py-8 hover:bg-stone-50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Left: Image Block — greyscale, colourises on hover (your original design) */}
        <div className="w-full md:w-56 h-40 relative shrink-0">
          {restaurantImage ? (
            <LazyImage
              src={restaurantImage}
              alt={restaurantName}
              className="w-full h-full object-cover rounded-4xl group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-300 group-hover:text-[#04b235] transition-colors duration-500" />
            </div>
          )}
          {/* Status Tag */}
          <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
            Delivered
          </div>
        </div>

        {/* Right: Content Block */}
        <div className="flex-grow flex flex-col justify-between h-40">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl text-black tracking-tight mb-1 group-hover:text-[#12b603] transition-colors">
                {restaurantName}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {date}{restaurantAddress ? ` — ${restaurantAddress}` : ""}
              </p>
            </div>
            <span className="text-xl font-medium text-gray-700">₹{order.orderTotalAmount}</span>
          </div>

          {/* Items List */}
          <div className="mt-4 md:mt-0">
            <p className="text-sm pt-2 text-gray-600 max-w-xl leading-relaxed">
              {items.join(`, `, " ")}
            </p>
          </div>

          {/* Action Bottom Row — animated line + Reorder button */}
          <div className="mt-auto pt-4 flex justify-between items-end">
            <div className="h-px w-24 bg-gray-300 group-hover:w-full group-hover:bg-[#12b603] transition-all duration-700 ease-in-out"></div>
            <button className="flex items-center p-3 bg-[#d9ffd7] gap-2 rounded-t-xl text-black text-sm tracking-widest hover:text-[#0b8a00] transition-colors cursor-pointer">
              Reorder
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveredIds, setDeliveredIds] = useState(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/v1/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelivered = useCallback((orderId) => {
    setDeliveredIds(prev => new Set([...prev, orderId]));
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pb-24">
        <OrderHero />
        <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="font-medium">Loading your orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen pb-24">
        <OrderHero />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button onClick={fetchOrders} className="text-[#04b235] underline text-sm font-medium cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white min-h-screen pb-24">
        <OrderHero />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <ShoppingBag size={56} className="text-gray-200 mb-5" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-8 max-w-xs">Looks like you haven't placed any orders. Start exploring and add something delicious!</p>
          <Link to="/restaurants" className="bg-[#04b235] text-white font-bold px-8 py-3 rounded-full hover:bg-[#03912b] transition-colors">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  // Compute now at render time (after orders are loaded) so the split is always accurate.
  // Using a regular const here (not a hook) is safe because this code only runs
  // after all early returns, meaning orders are available.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = Date.now();
  const activeOrders = orders.filter(o => {
    const age = now - new Date(o.createdAt).getTime();
    return age < DELIVERY_TIME_MS && !deliveredIds.has(o._id);
  });
  const pastOrders = orders.filter(o => {
    const age = now - new Date(o.createdAt).getTime();
    return age >= DELIVERY_TIME_MS || deliveredIds.has(o._id);
  });

  return (
    <div className="bg-white min-h-screen pb-24">
      <OrderHero />
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#04b235] animate-pulse"></div>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Current Orders</h2>
            </div>
            <div className="flex flex-col gap-4">
              {activeOrders.map(order => (
                <ActiveOrderCard key={order._id} order={order} onDelivered={handleDelivered} />
              ))}
            </div>
            <div className="mt-10 mb-4 w-full h-px bg-gray-100"></div>
          </div>
        )}

        {/* Past Orders — your original design */}
        {pastOrders.length > 0 && (
          <div className="flex flex-col">
            {activeOrders.length > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Past Orders</h2>
              </div>
            )}
            {pastOrders.map((order, index) => (
              <div
                key={order._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <PastOrderItem order={order} />
              </div>
            ))}
          </div>
        )}

        {/* Footer line — your original */}
        <div className="w-full h-px bg-black mt-12"></div>
        <div className="mt-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
          <span>End of Archive</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
