import crypto from 'crypto';

export const getHashByText = (text) => {
	return crypto.createHash('md5').update(text).digest('hex');
}