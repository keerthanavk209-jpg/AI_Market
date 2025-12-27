// src/components/range.tsx

import { useState, useMemo } from 'react';
import { Zap, Heart } from 'lucide-react';
import datasetJSON from '../data/marketDataset.json';
import { getKNNRecommendationsWithDistances } from '../utils/knnAlgorithm';
import Navigation from './Navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quality: number;
  brand: string;
  rating: number;
  stock: number;
  processor: string;
  display: number;
}

interface SimilarProduct {
  product: Product;
  distance: number;
}

function Range() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [knnResults, setKnnResults] = useState<SimilarProduct[]>([]);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const products: Product[] = datasetJSON.products;

  const priceRangeProducts = useMemo(() => {
    if (minPrice === '' || maxPrice === '') return [];

    const min = parseInt(minPrice);
    const max = parseInt(maxPrice);

    if (isNaN(min) || isNaN(max)) return [];

    return products.filter(p => p.price >= min && p.price <= max);
  }, [minPrice, maxPrice, products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const recommendations = getKNNRecommendationsWithDistances(products, product, 10);
    setKnnResults(recommendations);
  };

  const getSimilarityPercentage = (distance: number) => {
    const similarity = Math.max(0, 100 - distance * 100);
    return Math.round(similarity);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-600 bg-green-50';
    if (quality >= 80) return 'text-blue-600 bg-blue-50';
    if (quality >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 90) return 'Premium';
    if (quality >= 80) return 'Excellent';
    if (quality >= 70) return 'Good';
    return 'Standard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* ⭐ SHOW SIDEBAR ALWAYS (like Dashboard) */}
      <Navigation />

      {/* ⭐ PUSH CONTENT TO RIGHT SIDE */}
      <div className="lg:pl-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* HEADER */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-amber-500" />
              <h1 className="text-4xl font-bold text-slate-800">
                Price Range Product Finder
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Filter items between your desired price range
            </p>
          </header>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT SIDE — PRICE INPUT + PRODUCT LIST */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Enter Price Range
                </h2>

                {/* MIN PRICE */}
                <div className="mb-6">
                  <input
                    type="number"
                    placeholder="Starting Price (e.g., 10000)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* MAX PRICE */}
                <div className="mb-6">
                  <input
                    type="number"
                    placeholder="Ending Price (e.g., 15000)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  Items in Price Range
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-3">
                  {priceRangeProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedProduct?.id === product.id
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-slate-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-500">{product.brand} • {product.category}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getQualityColor(product.quality)}`}>
                          {getQualityLabel(product.quality)}
                        </span>
                      </div>

                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-amber-600 font-semibold">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-slate-600">★ {product.rating}/5</span>
                      </div>
                    </button>
                  ))}

                  {priceRangeProducts.length === 0 && (
                    <p className="text-slate-500 text-center py-4">
                      No products found in this range.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — KNN RESULTS */}
            <div className="space-y-6">
              {selectedProduct && knnResults.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-6 h-6 text-red-500" />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">KNN Similar Products</h2>
                      <p className="text-sm text-slate-600">Based on: {selectedProduct.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-3">
                    {knnResults.map((item, index) => {
                      const similarity = getSimilarityPercentage(item.distance);
                      return (
                        <div
                          key={item.product.id}
                          className="border-2 border-slate-200 rounded-lg p-4 hover:border-red-400 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </span>
                                <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
                              </div>
                              <p className="text-sm text-slate-500 ml-8">{item.product.brand}</p>
                            </div>

                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getQualityColor(item.product.quality)}`}>
                              {getQualityLabel(item.product.quality)}
                            </span>
                          </div>

                          <div className="ml-8 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-grow bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition"
                                  style={{ width: `${similarity}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-red-600 w-12 text-right">
                                {similarity}%
                              </span>
                            </div>
                          </div>

                          <div className="ml-8 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 rounded p-2">
                              <p className="text-slate-600">Price</p>
                              <p className="font-semibold text-blue-600">
                                ₹{item.product.price.toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-green-50 rounded p-2">
                              <p className="text-slate-600">Quality</p>
                              <p className="font-semibold text-green-600">
                                {item.product.quality}/100
                              </p>
                            </div>

                            <div className="bg-yellow-50 rounded p-2">
                              <p className="text-slate-600">Rating</p>
                              <p className="font-semibold text-yellow-600">
                                ★ {item.product.rating}
                              </p>
                            </div>

                            <div className="bg-slate-50 rounded p-2">
                              <p className="text-slate-600">Stock</p>
                              <p className="font-semibold text-slate-600">
                                {item.product.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!selectedProduct && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-amber-200">
                  <Zap className="w-12 h-12 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Select a Product</h3>
                  <p className="text-slate-700 mb-4">
                    Click any product from the left list to find similar products using KNN.
                  </p>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-2">What is KNN Algorithm?</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>K-Nearest Neighbors (KNN)</strong> compares product features and finds
                      the closest matches. Lower distance = higher similarity.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DATASET STATS */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Dataset Statistics</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Total Products</p>
                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Categories</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Price Range</p>
                <p className="text-3xl font-bold text-yellow-600">₹15K - ₹125K</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Avg Quality Score</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(products.reduce((sum, p) => sum + p.quality, 0) / products.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Range;
