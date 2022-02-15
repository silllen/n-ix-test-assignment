export class NoSkuWithIdError extends Error {
  constructor() {
    super(`No sku with provided sku id was found`);
  }
}