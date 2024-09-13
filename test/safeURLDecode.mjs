export const safeURLDecode = (text) => {
	try{
		return decodeURIComponent(text);
	}catch(e){
		return text;
	}
}