import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-sage-200/90 shadow-card p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-[4/3] w-full rounded-xl bg-cream-200 mb-3" />
        <div className="h-3 w-1/3 bg-cream-300 rounded mb-2" />
        <div className="h-5 w-4/5 bg-cream-300 rounded mb-2" />
        <div className="h-3 w-full bg-cream-200 rounded mb-1" />
        <div className="h-3 w-2/3 bg-cream-200 rounded" />
      </div>
      <div className="pt-4 mt-3 border-t border-sage-100 flex items-center justify-between">
        <div className="h-4 w-1/2 bg-cream-200 rounded" />
        <div className="h-4 w-12 bg-cream-300 rounded" />
      </div>
    </div>
  );
};
