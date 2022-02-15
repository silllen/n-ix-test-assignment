export class SkuQuantityLowerThenZeroError extends Error {
  constructor() {
    super(`Total quantity of sku\'s cannot be lower then 0`);
  }
}