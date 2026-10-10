"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import { MenuItem } from "@/context/AppContext";

interface FoodCardProps {
  item: MenuItem;
  inCart: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  lowQuotaThreshold?: number;
}

export default function FoodCard({
  item,
  inCart,
  onAdd,
  onRemove,
  lowQuotaThreshold = 8,
}: FoodCardProps) {
  const isLowQuota = item.remainingQuota <= lowQuotaThreshold;
  const isSoldOut = item.remainingQuota <= 0;
  const isMaxInCart = inCart >= item.remainingQuota;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Food Image Container */}
      <div className="relative aspect-[16/11] sm:aspect-[16/10] bg-slate-100 overflow-hidden">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Digital Quota Badge (Prominently displayed) */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
          {isSoldOut ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-sm text-[#FF2B2B] text-[10px] sm:text-[11px] font-black shadow-sm border border-red-200">
              Sold out
            </span>
          ) : isLowQuota ? (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-sm text-[#FF2B2B] text-[10px] sm:text-[11px] font-extrabold shadow-sm border border-red-100"
              title={`Only ${item.remainingQuota} remaining in stock`}
            >
              {item.remainingQuota} left
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] sm:text-[11px] font-semibold shadow-sm border border-slate-100">
              {item.remainingQuota} left
            </span>
          )}
        </div>

        {/* Prep Time Badge */}
        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-sm text-slate-700 text-[10px] sm:text-[11px] font-medium shadow-sm">
            {item.prepTime}
          </span>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <h3
            className="text-xs sm:text-sm font-bold text-[#1E293B] leading-tight line-clamp-1 group-hover:text-[#377EE9] transition-colors"
            title={item.name}
          >
            {item.name}
          </h3>
          <p
            className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1"
            title={item.vendor}
          >
            {item.vendor}
          </p>
        </div>

        {/* Price and Dynamic Stepper / Add button */}
        <div className="flex flex-col min-[360px]:flex-row min-[360px]:items-center justify-between gap-2 pt-1 border-t border-slate-50">
          <span className="text-xs sm:text-sm font-black text-[#1E293B]">
            ₦{item.price.toLocaleString()}
          </span>

          {inCart > 0 ? (
            /* Dynamic Quantity Stepper */
            <div className="inline-flex items-center self-end min-[360px]:self-auto bg-[#F8FAFC] rounded-xl border border-slate-200/90 shadow-sm overflow-hidden h-7 sm:h-8">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="w-7 sm:w-8 h-full flex items-center justify-center text-slate-600 hover:text-[#FF2B2B] hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              <span
                className="text-xs sm:text-sm font-bold text-[#1E293B] min-w-[20px] sm:min-w-[24px] text-center select-none"
                aria-label={`Current quantity in cart: ${inCart}`}
              >
                {inCart}
              </span>

              <button
                type="button"
                onClick={() => onAdd(item.id)}
                disabled={isMaxInCart || isSoldOut}
                className="w-7 sm:w-8 h-full flex items-center justify-center text-[#377EE9] hover:text-[#2f6fd4] hover:bg-blue-50 active:scale-90 disabled:text-slate-300 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            /* + Add Button */
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              disabled={isSoldOut}
              className="self-end min-[360px]:self-auto h-7 sm:h-8 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
