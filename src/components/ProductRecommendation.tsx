import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import Navigation from './Navigation';

// Fallback recommendations when API quota is exceeded
const mockRecommendations: { [key: string]: string[] } = {
  'Marketing Automation': ['HubSpot', 'Marketo', 'ActiveCampaign', 'GetResponse', 'Brevo'],
  'CRM Platform': ['Salesforce', 'Microsoft Dynamics 365', 'Zoho CRM', 'Pipedrive', 'HubSpot CRM'],
  'Email Marketing': ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Brevo', 'GetResponse'],
  'PPC Advertising': ['Google Ads', 'Microsoft Advertising', 'Facebook Ads Manager', 'Semrush', 'AdRoll'],
  'Social Media': ['Buffer', 'Hootsuite', 'Sprout Social', 'Later', 'Agorapulse'],
  'Analytics': ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'Crazy Egg'],
  'Content Management': ['WordPress', 'Contentful', 'Webflow', 'Wix', 'Squarespace'],
  'SEO Tools': ['Semrush', 'Ahrefs', 'Moz Pro', 'SE Ranking', 'Ubersuggest']
};

const categories = [
  'Marketing Automation',
  'CRM Platform',
  'Email Marketing',
  'PPC Advertising',
  'Social Media',
  'Analytics',
  'Content Management',
  'SEO Tools'
];

const ProductRecommendation: React.FC = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Marketing Automation',
    price: '',
    description: ''
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    const { name, category, price, description } = newProduct;
    if (!name || !price || !description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate a brief delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use mock recommendations (no API call)
    setRecommendations(mockRecommendations[category] || []);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="transition-all duration-300 lg:pl-80 lg:has-[.lg\\:w-20]:pl-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Add Product for AI Recommendations</h1>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="px-4 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-4 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Price (e.g., $49/month)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="px-4 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="px-4 py-3 border rounded-xl w-full md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddProduct}
              className="mt-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center transition duration-150"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product & Get Recommendations
            </button>

            {/* Recommendations Section */}
            <div className="mt-10">
              <div className="flex items-center mb-3">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Tools</h2>
              </div>

              {loading ? (
                <p className="text-gray-500">Fetching recommendations...</p>
              ) : recommendations.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="font-medium">{rec}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No recommendations yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendation;
