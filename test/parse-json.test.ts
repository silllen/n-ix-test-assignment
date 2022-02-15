import { parseJson } from '../helpers/parse-json';
import { JsonParseError } from '../errors/json-parse.error';

describe('parseJson', () => {
  test('should throw an error for invalid json', async () => {
    const invalidJson = '{"invalid: "json", "number": 5}';
    expect(() => parseJson(invalidJson)).toThrowError(JsonParseError);
  });

  test('should successfully parse valid json', async () => {
    const validJson = '{"valid": "json", "number": 5}';
    const expected = {valid: 'json', number: 5}
    const result = parseJson(validJson);
    expect(result).toStrictEqual(expected);
  });
})
