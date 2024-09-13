

export const repairURL = (url,origin) => {
	// console.log('url',url,origin);
	const _url = new URL(url,origin);

	return _url.href;
}

{/* <link rel="alternate" type="application/atom+xml" title="聖地巡礼案内所" href="https://seichinabi.themedia.jp/atom.xml"/> */}

export const getRSSURLbyHTML = (html,url) => {
	const atomURL = html.match(/<link.*?type="application\/atom\+xml".*?href="(.*?)".*?>/i);
	if(atomURL){
		return repairURL(atomURL[1],url);
	}

	const rssURL = html.match(/<link.*?type="application\/rss\+xml".*?href="(.*?)".*?>/i);
	if(rssURL){
		return repairURL(rssURL[1],url);
	}

	const xmlURL = html.match(/href="([^"]+\.xml)"/i);
	if(xmlURL){
		return repairURL(xmlURL[1],url);
	}
}