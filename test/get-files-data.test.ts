import * as getFilesData from '../helpers/get-files-data.helper';
import fs from 'fs';
import { expect } from '@jest/globals';

describe('getFilesData', () => {
  test('should successfully read stock json', async () => {
    const readFile = jest.spyOn(fs.promises, 'readFile');
    const stockSku = await getFilesData.getStockSku();
    expect(Array.isArray(stockSku)).toBeTruthy();
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  test('should successfully read transaction json', async () => {
    const readFile = jest.spyOn(fs.promises, 'readFile');
    const transactions = await getFilesData.getTransactions();
    expect(Array.isArray(transactions)).toBeTruthy();
    expect(readFile).toHaveBeenCalledTimes(1)
  });
})
