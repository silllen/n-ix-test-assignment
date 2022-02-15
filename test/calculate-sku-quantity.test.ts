import { calculateSkuQuantity } from '../index';
import { StockSkuInterface } from '../interfaces/stock-sku.interface';
import { TransactionInterface } from '../interfaces/transaction.interface';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { ActualSkuQuantityInterface } from '../interfaces/actual-sku-quantity.interface';
import * as getFilesData from '../helpers/get-files-data.helper';
import { NoSkuWithIdError } from '../errors/no-sku-with-id.error';
import { UnprocessableTransactionTypeError } from '../errors/unprocessable-transaction-type.error';
import { SkuQuantityLowerThenZeroError } from '../errors/sku-quantity-lower-then-zero.error';

describe('calculateSkuQuantity', () => {
  afterEach(() => {
    jest.resetAllMocks();
  })
  test('should throw error if no sku was found both in transactions and stock files', async () => {
    const searchSku = "LTV719449/39/39";
    const stockSku: Array<StockSkuInterface> = [
      {sku: 'asd', stock: 8525},
      {sku: "qwe", stock: 8414},
    ];
    jest.spyOn(getFilesData, 'getStockSku').mockReturnValue(Promise.resolve(stockSku));
    const transactions: Array<TransactionInterface> = [
      {sku: 'zxc', qty: 5, type: TransactionTypeEnum.ORDER},
      {sku: 'asd', qty: 6, type: TransactionTypeEnum.ORDER},
      {sku: "asd", qty: 7, type: TransactionTypeEnum.ORDER},
      {sku: "qwe", qty: 8, type: TransactionTypeEnum.ORDER},
    ]
    jest.spyOn(getFilesData, 'getTransactions').mockReturnValue(Promise.resolve(transactions));
    await expect(calculateSkuQuantity(searchSku)).rejects.toThrowError(NoSkuWithIdError);
  });

  test('should throw error with unexpected transaction type', async () => {
    const searchSku = "LTV719449/39/39";
    const stockSku: Array<StockSkuInterface> = [
      {sku: searchSku, stock: 8525},
    ];
    jest.spyOn(getFilesData, 'getStockSku').mockReturnValue(Promise.resolve(stockSku));
    const transactions: Array<TransactionInterface> = [
      {sku: searchSku, qty: 5, type: TransactionTypeEnum.ORDER},
      {sku: searchSku, qty: 6, type: TransactionTypeEnum.REFUND},
      {sku: searchSku, qty: 7, type: 'qwe'},
    ] as Array<TransactionInterface>;
    jest.spyOn(getFilesData, 'getTransactions').mockReturnValue(Promise.resolve(transactions));
    await expect(calculateSkuQuantity(searchSku)).rejects.toThrowError(UnprocessableTransactionTypeError);
  });

  test('should throw error if after transaction sku quantity goes lower then zero ', async () => {
    const searchSku = "LTV719449/39/39";
    const stockSku: Array<StockSkuInterface> = [
      {sku: searchSku, stock: 1},
    ];
    jest.spyOn(getFilesData, 'getStockSku').mockReturnValue(Promise.resolve(stockSku));
    const transactions: Array<TransactionInterface> = [
      {sku: searchSku, qty: 5, type: TransactionTypeEnum.ORDER},
      {sku: searchSku, qty: 6, type: TransactionTypeEnum.REFUND},
      {sku: 'addsv', qty: 7, type: TransactionTypeEnum.ORDER},
    ];
    jest.spyOn(getFilesData, 'getTransactions').mockReturnValue(Promise.resolve(transactions));
    await expect(calculateSkuQuantity(searchSku)).rejects.toThrowError(SkuQuantityLowerThenZeroError);
  });

  test('should successfully return qty for given sku if sku was not found in stock', async () => {
    const searchSku = "LTV719449/39/39";
    const stockSku: Array<StockSkuInterface> = [
      {sku: 'zxc', stock: 1},
    ];
    jest.spyOn(getFilesData, 'getStockSku').mockReturnValue(Promise.resolve(stockSku));
    const transactions: Array<TransactionInterface> = [
      {sku: searchSku, qty: 6, type: TransactionTypeEnum.REFUND},
      {sku: searchSku, qty: 5, type: TransactionTypeEnum.ORDER},
      {sku: 'addsv', qty: 7, type: TransactionTypeEnum.ORDER},
    ];
    jest.spyOn(getFilesData, 'getTransactions').mockReturnValue(Promise.resolve(transactions));

    const expected: ActualSkuQuantityInterface = {sku: searchSku, qty: 1}
    const result = await calculateSkuQuantity(searchSku);
    expect<ActualSkuQuantityInterface>(result).toStrictEqual(expected);
  });

  test('should successfully return qty for given sku', async () => {
    const searchSku = "LTV719449/39/39";
    const stockSku: Array<StockSkuInterface> = [
      {sku: searchSku, stock: 8525},
      {sku: "CLQ274846/07/46", stock: 8414},
      {sku: "SXB930757/87/87", stock: 3552},
      {sku: "PGL751486/42/83", stock: 1484}
    ];
    jest.spyOn(getFilesData, 'getStockSku').mockReturnValue(Promise.resolve(stockSku));
    const transactions: Array<TransactionInterface> = [
      {sku: searchSku, qty: 5, type: TransactionTypeEnum.ORDER},
      {sku: searchSku, qty: 6, type: TransactionTypeEnum.ORDER},
      {sku: "asd", qty: 7, type: TransactionTypeEnum.ORDER},
      {sku: searchSku, qty: 1, type: TransactionTypeEnum.REFUND},
      {sku: searchSku, qty: 2, type: TransactionTypeEnum.REFUND},
      {sku: "qwe", qty: 8, type: TransactionTypeEnum.ORDER},
    ]
    jest.spyOn(getFilesData, 'getTransactions').mockReturnValue(Promise.resolve(transactions));

    const expected: ActualSkuQuantityInterface = {sku: searchSku, qty: 8517}
    const result = await calculateSkuQuantity(searchSku);
    expect<ActualSkuQuantityInterface>(result).toStrictEqual(expected);
  });
})
