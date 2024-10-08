export const safeHTMLDecode = (str) => {
	return str.replace(/&#([0-9]{1,3});/gi, (match, numStr) => {
		var num = parseInt(numStr, 10); // read num as normal number
		return String.fromCharCode(num);
	});
};