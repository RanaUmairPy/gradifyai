import React from "react";

export const ShimmerCard = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 w-2/3 rounded-lg animate-shimmer" />
        <div className="h-5 w-16 rounded-full animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded-md animate-shimmer" />
        <div className="h-4 w-5/6 rounded-md animate-shimmer" />
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-4 w-1/3 rounded-md animate-shimmer" />
        <div className="h-8 w-8 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
};

export const ShimmerList = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ShimmerCard key={idx} />
      ))}
    </div>
  );
};

export const ShimmerDashboard = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title Shimmer */}
      <div className="h-16 w-1/3 rounded-2xl animate-shimmer" />
      
      {/* Stats Grid Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 h-28 space-y-3">
            <div className="h-4 w-1/2 rounded animate-shimmer" />
            <div className="h-8 w-1/3 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Main Grid Shimmer */}
      <div className="space-y-6">
        <div className="h-8 w-1/4 rounded animate-shimmer" />
        <ShimmerList count={4} />
      </div>
    </div>
  );
};
