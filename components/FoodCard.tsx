"use client";

import React from "react";
import { Plus, Minus, AlertCircle } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

export interface FoodProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock_quantity?: number;
  remainingQuota?: number;
  image_url?: string;
  image?: string;
  vendor_id?: string;
  available?: boolean;
}

interface FoodCardProps {
  product: FoodProduct;
  quantityInCart: number;
  onAddToCart: (product: FoodProduct) => void;
  onRemoveFromCart: (product: FoodProduct) => void;
}

export default function FoodCard({
  product,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
}: FoodCardProps) {
  const stock = product.stock_quantity ?? product.remainingQuota ?? 10;
  const isOutOfStock = product.available === false || stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const imageUrl =
    product.image_url ||
    product.image ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80";

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between select-none">
      <div>
        {/* Product Image */}
        <div className="relative w-full h-36 sm:h-44 bg-slate-100 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 rounded-md bg-[#1E293B]/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 rounded-md bg-[#FF2B2B] text-white text-[10px] font-black tracking-tight shadow-xs flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Only {stock} left
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#377EE9] bg-blue-50 px-2 py-0.5 rounded-md">
              {product.category || "Meal"}
            </span>
          </div>

          <h3
            className="text-xs sm:text-sm font-extrabold text-[#1E293B] line-clamp-1 mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm font-black text-[#1E293B]">
            ₦{Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Cart Action Stepper / Add Button */}
      <div className="p-3 sm:p-4 pt-0">
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed text-center"
          >
            Unavailable
          </button>
        ) : quantityInCart === 0 ? (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="w-full py-2 px-3 rounded-xl bg-[#377EE9] hover:bg-blue-600 active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-slate-100/90 rounded-xl p-1 border border-slate-200/50">
            <button
              type="button"
              onClick={() => onRemoveFromCart(product)}
              className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs transition-colors cursor-pointer active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <span className="text-xs font-black text-[#1E293B] px-2">
              {quantityInCart}
            </span>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={stock > 0 && quantityInCart >= stock}
              className="w-8 h-8 rounded-lg bg-[#377EE9] text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-xs transition-colors cursor-pointer active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}