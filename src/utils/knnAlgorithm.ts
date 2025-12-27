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

export class KNNAlgorithm {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  private normalizeValue(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  private getMinMax(
    products: Product[],
    key: keyof Product
  ): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;

    products.forEach(product => {
      const val = product[key] as number;
      if (val < min) min = val;
      if (val > max) max = val;
    });

    return { min, max };
  }

  private euclideanDistance(product1: Product, product2: Product): number {
    const priceRange = this.getMinMax(this.products, 'price');
    const qualityRange = this.getMinMax(this.products, 'quality');
    const ratingRange = this.getMinMax(this.products, 'rating');
    const stockRange = this.getMinMax(this.products, 'stock');
    const displayRange = this.getMinMax(this.products, 'display');

    const priceDiff = this.normalizeValue(
      product1.price,
      priceRange.min,
      priceRange.max
    ) - this.normalizeValue(
      product2.price,
      priceRange.min,
      priceRange.max
    );

    const qualityDiff = this.normalizeValue(
      product1.quality,
      qualityRange.min,
      qualityRange.max
    ) - this.normalizeValue(
      product2.quality,
      qualityRange.min,
      qualityRange.max
    );

    const ratingDiff = this.normalizeValue(
      product1.rating,
      ratingRange.min,
      ratingRange.max
    ) - this.normalizeValue(
      product2.rating,
      ratingRange.min,
      ratingRange.max
    );

    const stockDiff = this.normalizeValue(
      product1.stock,
      stockRange.min,
      stockRange.max
    ) - this.normalizeValue(
      product2.stock,
      stockRange.min,
      stockRange.max
    );

    const displayDiff = this.normalizeValue(
      product1.display,
      displayRange.min,
      displayRange.max
    ) - this.normalizeValue(
      product2.display,
      displayRange.min,
      displayRange.max
    );

    return Math.sqrt(
      priceDiff * priceDiff * 0.25 +
      qualityDiff * qualityDiff * 0.25 +
      ratingDiff * ratingDiff * 0.2 +
      stockDiff * stockDiff * 0.15 +
      displayDiff * displayDiff * 0.15
    );
  }

  findNearestNeighbors(targetProduct: Product, k: number = 10): Product[] {
    const similarities: SimilarProduct[] = this.products
      .filter(p => p.id !== targetProduct.id)
      .map(product => ({
        product,
        distance: this.euclideanDistance(targetProduct, product)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);

    return similarities.map(s => s.product);
  }

  findNearestNeighborsWithDistance(
    targetProduct: Product,
    k: number = 10
  ): SimilarProduct[] {
    const similarities: SimilarProduct[] = this.products
      .filter(p => p.id !== targetProduct.id)
      .map(product => ({
        product,
        distance: this.euclideanDistance(targetProduct, product)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);

    return similarities;
  }
}

export function getKNNRecommendations(
  products: Product[],
  selectedProduct: Product,
  k: number = 10
): Product[] {
  const knn = new KNNAlgorithm(products);
  return knn.findNearestNeighbors(selectedProduct, k);
}

export function getKNNRecommendationsWithDistances(
  products: Product[],
  selectedProduct: Product,
  k: number = 10
): SimilarProduct[] {
  const knn = new KNNAlgorithm(products);
  return knn.findNearestNeighborsWithDistance(selectedProduct, k);
}
