import { genUUIDByText } from "./gen-uuid-by-text.mjs";
import { genUUID } from "./gen-uuid.mjs";
import { getFeedByRSSURL } from "./getFeedByRSSURL.mjs";
import { getSiteInfoFromURL } from "./getSiteInfoFromURL.mjs";


import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { upFeedSite } from "./upFeedSite.mjs";
import { updateFeedById } from "./feedActions.mjs";


const feedPath = 'data/feeds/';

if(!existsSync(feedPath)){
	mkdirSync(feedPath, { recursive: true });
}

const upFeedBySiteHomeURL = async (siteHomeURL) => {
	const info = await getSiteInfoFromURL(siteHomeURL);
	if(!info){
		console.log('failed to get site info',siteHomeURL);
		return;
	}
	const { id, rssURL, url, title } = info;

	if(!title){
		console.log('没找到标题',info);
		return;
	}

	if(!rssURL){
		console.log('没找到RSS地址',info);
		return;
	}

	const feed = await getFeedByRSSURL(rssURL);
	const { items, link } = feed;

	for(const item of items){
		const { title, link, pubDate, contentSnippet, content, isoDate } = item;
		if(!item.id){
			item.id = genUUIDByText(link);
		}
		if(isoDate){
			item.unix = +new Date(isoDate);
		}
	}

	updateFeedById(id,feed);

	upFeedSite({
		...info,
		...feed,
		itemLength: items.length,
	});
	
	// console.log(feed);
}





const siteHomeURLs = [
	'https://anitora5050.com/',
	'https://seichinabi.themedia.jp/',
	'https://ameblo.jp/sukhoi31/',
	'https://note.com/mono2310',
	'https://ameblo.jp/sakurazaka128/',
	'https://mogusyoku.com/',
	'https://souljem.hateblo.jp/',
	'https://cycle-junrei.hatenablog.jp/',
	'https://note.com/sphere_2010',
	'https://touyokojunrei.com/',
	'https://mikuphotoseichi.blog.fc2.com/',
	'https://tensei-yabuki.hatenablog.com/',
	'http://tsurebashi.blog123.fc2.com/',
	'https://rica0867.livedoor.blog/',
	'http://vividorangefegi.web.fc2.com/',
	'https://blog.goo.ne.jp/ebosi624',
	'http://blog.livedoor.jp/gundam0130/',
	'https://terukun.blog/',
	'https://blog.pastak.net/',
	'https://tabi-log.blog.jp/',
	'https://minkara.carview.co.jp/userid/1697131/blog/',
	'http://ukatensei.blog50.fc2.com/',
	'http://blog.livedoor.jp/magicmaidcompany/',
	'http://626shin.blog.fc2.com/',
	'http://bradbury3404.blog.fc2.com/',
	'https://los-endos.hatenablog.com/',
	'https://negitap.hateblo.jp/',

	'https://ameblo.jp/2c850kawasaki/',
	'https://note.com/utokyo_yuri',
	'https://www.motsu-tanbou.com/',
	'https://note.com/tamayura_jpn',
	'https://yukhoeseichi.hatenablog.com',
	'https://astral-tanbou.com/',
	'https://deep-adultweet.blog.jp/',
	'https://xckb.hatenablog.com/',
	'https://www.niji-ashiato.tokyo/',
	'https://www.hidamarie.net/',
	'https://note.com/zacharylion',
	'https://ameblo.jp/tengutakao/',
	

];

const upAllFeeds = async () => {
	for(const siteHomeURL of siteHomeURLs){
		// await upFeedBySiteHomeURL(siteHomeURL);
		upFeedBySiteHomeURL(siteHomeURL);
	}
}

upAllFeeds();

// upFeedBySiteHomeURL('https://kbas.ifdef.jp/');