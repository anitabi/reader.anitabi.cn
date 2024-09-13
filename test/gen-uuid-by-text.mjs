import { getHashByText } from './get-hash-by-text.mjs';

export const genUUIDByText = (text) => {
	return getHashByText(text).substring(0,8);
}