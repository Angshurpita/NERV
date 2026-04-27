import React from 'react';

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-mesh py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="glass shadow-premium rounded-2xl p-8 md:p-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 text-gradient">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-gray-500 mb-8 pb-8 border-b border-gray-200">
              Last Updated: {lastUpdated}
            </p>
          )}
          
          <div className="prose prose-lg prose-blue max-w-none text-gray-700 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
