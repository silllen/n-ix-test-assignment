export class UnprocessableTransactionTypeError extends Error {
  constructor(type: string) {
    super(`Unprocessable transaction type: ${type}`);
  }
}
