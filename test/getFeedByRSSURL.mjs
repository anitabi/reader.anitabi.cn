import Parser from 'rss-parser';
import { proxy } from './httpAgentProxy.mjs';
import { getTextByURL } from './getSiteInfoFromURL.mjs';

const parser = new Parser({
	requestOptions: {
		proxy
	}
});

export const getFeedByRSSURL = async (rssURL) => {
	const xml = await getTextByURL(rssURL);
	const feed = await parser.parseString(xml);
	if(feed){
		feed.rssURL = rssURL;
	}
	return feed;
}