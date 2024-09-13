
import axios from 'axios';
import { genUUID } from './gen-uuid.mjs';
import { getUnixTime } from './get-unixtime.mjs';
import { proxy } from './httpAgentProxy.mjs';
import { genUUIDByText } from './gen-uuid-by-text.mjs';
import { getRSSURLbyHTML } from './getRSSURLByHTML.mjs';
import { safeURLDecode } from './safeURLDecode.mjs';
import { safeHTMLDecode } from './safeHTMLDecode.mjs';

export const getURL = async (url,config) => {
	try{
		const response = await axios.get(url,{
			headers: {
				Request: 'GET',
				Referer: url,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
			proxy,
			...config
		});
		// console.log(response);
		return response.data;
	}catch(e){
		console.log(e);
	}
}
export const getTextByURL = async (url) => {

	const blob = await getURL(url,{
		responseType: 'arraybuffer',
	});

	if(!blob){
		return;
	}

	const utf8Decoder = new TextDecoder('utf-8');
	let html = utf8Decoder.decode(new Uint8Array(blob));

	if(html){
		const headString = html.split(/<\/head>/i)[0] || html;

		if(/Shift_JIS">/i.test(headString)){

			// 转换成 shift_jis
			const shiftJISDecoder = new TextDecoder('shift_jis');
			html = shiftJISDecoder.decode(new Uint8Array(blob));

			// console.log('shift_jis',html);
		}
	}
	return html;
}

export const getSiteTitleByHTML = (html) => {
	const titleMatch = html.match(/<title.*?>([^<]+?)<\/title>/i);
	if(titleMatch){
		let title = titleMatch[1].trim();
		return safeHTMLDecode(title);
	}
}

export const getSiteInfoFromURL = async (url) => {
	const html = await getTextByURL(url);
	if(!html){
		console.log('failed to get html',url);
		return;
	}
	const rssURL = getRSSURLbyHTML(html,url);
	const title = getSiteTitleByHTML(html);


	const created = getUnixTime()
	const id = genUUIDByText(url);
	return {
		id,
		title,
		url,
		rssURL,
		created,
	};
}