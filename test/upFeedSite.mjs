import { getUnixTime } from "./get-unixtime.mjs";

import { readFileSync, writeFileSync } from 'fs';

const feedsJSONPath = 'data/feeds.json';

export const getFeeds = () => {
	try{
		return JSON.parse(readFileSync(feedsJSONPath, 'utf-8'));
	}catch(e){
		return {};
	}
}
export const saveFeeds = (feeds) => {
	writeFileSync(feedsJSONPath, JSON.stringify(feeds, null, '\t'));
}

export const upFeedSite = (site) => {
	const feeds = getFeeds();

	const { id, feedUrl, link, title, description } = site;
	
	if(!feeds[id]){
		feeds[id] = {
			id,
			title,
			description,
			link,
			feedUrl,
		};
		feeds[id].created = getUnixTime();
	}
	else{
		
	}

	feeds[id].modified = getUnixTime();

	saveFeeds(feeds);
}
