import { StockSkuInterface } from './interfaces/stock-sku.interface';
import { TransactionInterface } from './interfaces/transaction.interface';
import { TransactionTypeEnum } from './enums/transaction-type.enum';
import { ActualSkuQuantityInterface } from './interfaces/actual-sku-quantity.interface';
import { getStockSku, getTransactions } from './helpers/get-files-data.helper';
import { NoSkuWithIdError } from './errors/no-sku-with-id.error';
import { UnprocessableTransactionTypeError } from './errors/unprocessable-transaction-type.error';
import { SkuQuantityLowerThenZeroError } from './errors/sku-quantity-lower-then-zero.error';

export const calculateSkuQuantity = async (sku: string): Promise<ActualSkuQuantityInterface> => {
  const stocks: Array<StockSkuInterface> = await getStockSku();
  const transactions: Array<TransactionInterface> = await getTransactions();

  const searchedStockSku = stocks.find(e => e.sku === sku);
  const searchedSkuTransactions = transactions.filter(e => e.sku === sku);

  if (!searchedStockSku && !searchedSkuTransactions.length) {
    throw new NoSkuWithIdError();
  }

  const resultQuantity = searchedSkuTransactions.reduce<number>((prev, acc) => {
    let result = prev;
    switch (acc.type) {
      case TransactionTypeEnum.ORDER:
        result -= acc.qty;
        break;
      case TransactionTypeEnum.REFUND:
        result += acc.qty;
        break;
      default:
        throw new UnprocessableTransactionTypeError(acc.type);
    }
    if (result < 0) {
      throw new SkuQuantityLowerThenZeroError();
    }

    return result;
  }, searchedStockSku ? searchedStockSku.stock : 0)

  return {sku, qty: resultQuantity};
}
/*
calculateSkuQuantity('KED089097/68/09')
    .then(res => console.log(res))
    .catch(err => console.error(err));
*/
