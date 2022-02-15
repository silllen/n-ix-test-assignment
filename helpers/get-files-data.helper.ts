import fs from 'fs';
import { StockSkuInterface } from '../interfaces/stock-sku.interface';
import { parseJson } from './parse-json';
import { TransactionInterface } from '../interfaces/transaction.interface';

export const getStockSku = async (): Promise<Array<StockSkuInterface>> => {
  const stocksData = await fs.promises.readFile('stock.json', 'utf-8');
  // Here we should probably validate data with joi or class-validator, but i skipped this step since its a test assignment
  // and normally we work with database
  const stocks: Array<StockSkuInterface> = parseJson(stocksData);
  return stocks;
}

export const getTransactions  = async (): Promise<Array<TransactionInterface>> => {
  const transactionsData = await fs.promises.readFile('transactions.json', 'utf-8');
  // Here we should probably validate data with joi or class-validator, but i skipped this step since its a test assignment
  // and normally we work with database
  const transactions: Array<TransactionInterface> = parseJson(transactionsData);
  return transactions;
}
