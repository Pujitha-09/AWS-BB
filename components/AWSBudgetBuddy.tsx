"use client";

// components/AWSBudgetBuddy.tsx
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Cloud, Lightbulb, Moon, Sun, Share2, Download } from 'lucide-react';
import { AWS_PRICING } from '@/data/awsPricing';
import { SAVINGS_TIPS } from '@/data/savingsTips';
import { ServiceKey, SelectedServices, UsageData } from '@/types';

export default function AWSBudgetBuddy() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({});
  const [usage, setUsage] = useState<UsageData>({});
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedServices, usage]);

  const calculateTotalCost = (): void => {
    let total = 0;
    Object.keys(selectedServices).forEach((service: string) => {
      const serviceKey = service as ServiceKey;
      if (selectedServices[serviceKey] && usage[serviceKey]) {
        const serviceConfig = AWS_PRICING[serviceKey];
        let cost = 0;
        
        if (serviceKey === 'lambda') {
          const billableRequests = Math.max(0, usage[serviceKey] - (serviceConfig.freeRequests || 0));
          cost = billableRequests * serviceConfig.basePrice;
        } else if (serviceKey === 'ec2' || serviceKey === 'rds') {
          cost = usage[serviceKey] * serviceConfig.basePrice * 24 * 30;
        } else {
          cost = usage[serviceKey] * serviceConfig.basePrice;
        }
        
        total += cost;
      }
    });
    setTotalCost(total);
  };

  const handleServiceToggle = (service: ServiceKey): void => {
    setSelectedServices((prev: SelectedServices) => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleUsageChange = (service: ServiceKey, value: string): void => {
    setUsage((prev: UsageData) => ({
      ...prev,
      [service]: parseFloat(value) || 0
    }));
  };

  const getRelevantTips = (): string[] => {
    const tips: string[] = [];
    Object.keys(selectedServices).forEach((service: string) => {
      const serviceKey = service as ServiceKey;
      if (selectedServices[serviceKey] && usage[serviceKey] > 0) {
        tips.push(...SAVINGS_TIPS[serviceKey].slice(0, 2));
      }
    });
    return tips.slice(0, 6);
  };

  const shareEstimate = (): void => {
    const estimate = {
      services: selectedServices,
      usage: usage,
      totalCost: totalCost.toFixed(2)
    };
    navigator.clipboard.writeText(`My AWS cost estimate: $${totalCost.toFixed(2)}/month`);
    alert('Cost estimate copied to clipboard!');
  };

  const exportPDF = (): void => {
    alert('PDF export would be implemented with html2pdf.js or jsPDF');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AWS Budget Buddy</h1>
                <p className="text-sm opacity-70">Smart cloud cost estimator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={shareEstimate}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Share estimate"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={exportPDF}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Export PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Selector & Usage Input */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl p-6 shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-blue-500" />
                Select AWS Services
              </h2>
              
              <div className="space-y-4">
                {(Object.entries(AWS_PRICING) as [ServiceKey, typeof AWS_PRICING[ServiceKey]][]).map(([key, service]) => (
                  <div key={key} className={`p-4 rounded-lg border transition-all ${
                    selectedServices[key] 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedServices[key] || false}
                          onChange={() => handleServiceToggle(key)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm opacity-70">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-sm opacity-70">
                        ${service.basePrice}/{service.unit}
                      </div>
                    </div>
                    
                    {selectedServices[key] && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <label className="block text-sm font-medium mb-2">
                          Usage per month ({service.unit}):
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={usage[key] || ''}
                          onChange={(e) => handleUsageChange(key, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                          placeholder={`Enter ${service.unit}...`}
                        />
                        {key === 'lambda' && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            First 1M requests are free!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cost Summary & Tips */}
          <div className="space-y-8">
            {/* Cost Summary */}
            <div className={`rounded-xl p-6 shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Monthly Estimate
              </h2>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  ${totalCost.toFixed(2)}
                </div>
                <p className="text-sm opacity-70">Estimated monthly cost</p>
              </div>

              {totalCost > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-3">Cost Breakdown:</h3>
                  <div className="space-y-2">
                    {Object.keys(selectedServices).map((service: string) => {
                      const serviceKey = service as ServiceKey;
                      if (!selectedServices[serviceKey] || !usage[serviceKey]) return null;
                      
                      const serviceConfig = AWS_PRICING[serviceKey];
                      let cost = 0;
                      
                      if (serviceKey === 'lambda') {
                        const billableRequests = Math.max(0, usage[serviceKey] - (serviceConfig.freeRequests || 0));
                        cost = billableRequests * serviceConfig.basePrice;
                      } else if (serviceKey === 'ec2' || serviceKey === 'rds') {
                        cost = usage[serviceKey] * serviceConfig.basePrice * 24 * 30;
                      } else {
                        cost = usage[serviceKey] * serviceConfig.basePrice;
                      }
                      
                      return (
                        <div key={serviceKey} className="flex justify-between text-sm">
                          <span>{serviceConfig.name.split(' ')[0]}</span>
                          <span>${cost.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Savings Tips */}
            {getRelevantTips().length > 0 && (
              <div className={`rounded-xl p-6 shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Cost Saving Tips
                </h2>
                
                <div className="space-y-3">
                  {getRelevantTips().map((tip: string, index: number) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <p className="text-sm">
                    <strong>💰 Pro Tip:</strong> AWS offers a free tier with limited usage for 12 months. 
                    Perfect for learning and small projects!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm opacity-70">
            AWS Budget Buddy v1.0 - Simplifying cloud cost estimation
          </p>
          <p className="text-xs opacity-50 mt-2">
            Pricing data is simplified for estimation purposes. Actual AWS costs may vary.
          </p>
        </footer>
      </div>
    </div>
  );
}