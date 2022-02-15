import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export interface TransactionInterface {
  sku: string;
  type: TransactionTypeEnum;
  qty: number;
}