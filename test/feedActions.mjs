import exp from 'constants';
import { existsSync, mkdirSync, writeFileSync } from 'fs';



const feedPath = 'data/feeds/';

if(!existsSync(feedPath)){
	mkdirSync(feedPath, { recursive: true });
}


export const setFeedById = (id,feed) => {
	try{
		return writeFileSync(`data/feeds/${id}.json`,JSON.stringify(feed,null,'\t'));
	}catch(e){
		return null;
	}
};

export const getFeedById = (id) => {
	try{
		return JSON.parse(readFileSync(`data/feeds/${id}.json`, 'utf-8'));
	}catch(e){
		return null;
	}
}

export const updateFeedById = (id,feed) => {
	feed.id = id;
	
	const oldFeed = getFeedById(id);
	if(oldFeed){
		const Items = {};
		for(const item of oldFeed.items){
			Items[item.id] = item;
		}
		for(const item of feed.items){
			Items[item.id] = item;
		}

		feed.items = Object.values(Items);
	}


	return setFeedById(id,feed);
}
