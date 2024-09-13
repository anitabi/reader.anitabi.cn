// const iframeBox = Vue.component('iframe-box', {
// 	template: `<div class="iframe-box">
// 		<iframe :src="src" frameborder="0" allowfullscreen></iframe>
// 	</div>`,
// 	props: {
// 		text: String,
// 	},
// 	computed: {
// 		src(){
// 			const text = this.text;

// 		}
// 	}
// });

const fixContent = (item) => {
	let content = item['content:encoded'] || item.content || item.contentSnippet || '';
	content = content.replace(/<img[^>]+?src="([^"]+?)"[^>]*?>/g, (match,src) => {
		return match.replace(/width="[^"]+?"/,'').replace(/height="[^"]+?"/,'').replace(/<img /,'<img loading="lazy" ');
	});

	return convertToParagraphs(`<h1>${item['title']}</h1>` + content);
}


const itemContentSnippet = (item) => {
	let content = item.summary || item.contentSnippet || item.content || '';
	content = content.replace(/\s+/g,' ');
	if(content.length < 100){
		return content;
	}

	return content.slice(0,100)// + '...';
}

const getCoverFromContent = (content) => {
	const match = content.match(/<img[^>]+?src="([^"]+?)"[^>]*?>/);
	if(match){
		return match[1];
	}
}
const getCoverFromItem = (item) => {
	if(!item) return;

	if(item.enclosure){
		if(item.enclosure.url){
			return item.enclosure.url;
		}
	}
	const content = fixContent(item);

	return getCoverFromContent(content);
}


const fixFeed = (feed) => {
	const { items } = feed;
	for(const item of items){
		item.cover = getCoverFromItem(item);
	}
	return feed;
}




Vue.component('content-box', {
	template: `<div class="current-item-box" v-if="currentItem" :data-loading="loading">
		<!-- <iframe class="current-article-iframe" ref="current-article-iframe" :src="currentItem.link" frameborder="0"></iframe> -->
		<div class="translate-box">
			<button @click="contentTranslateTo('zh-CN')" v-if="!groups">{{ loading ? '翻译中…' : '翻译成简体中文' }}</button>
			<button @click="contentOrigin()" v-if="groups">显示原文</button>
		</div>
		<article class="current-article-content-box" @click="onArticleClick($event)">
			<div class="head">
				<div class="current-article-link" notranslate>
					{{currentItem['link']}}
				</div>
			</div>
			<!-- <base target="_blank"> -->
			<div class="content" v-html="fixContent(currentItem)"></div>
			<!-- <base target="_self"> -->
		</article>
	</div>`,
	data(){
		return {
			groups: null,
			loading: false,
		};
	},
	props: {
		currentItem: Object,
	},
	methods: {
		onArticleClick(e){
			const { target } = e;

			const { tagName } = target;

			if(tagName === 'A'){
				const href = target.getAttribute('href');

				if(/^#.+?/.test(href)){
					const id = href.slice(1);
					
					console.log('id',id)
					const articleEl = document.querySelector('.current-article-content-box .content');

					console.log('articleEl',articleEl)

					const targetEl = articleEl.querySelector(`[id="${id}"]`);

					if(targetEl){
						e.preventDefault();
						e.stopPropagation();
						
						const { top } = targetEl.getBoundingClientRect();

						this.setArticleScrollTop( this.getArticleScrollTop() + top - 30 );
					}
				}
			}

			else if(tagName === 'IMG'){
				const src = target.getAttribute('src');
				const imgBox = document.createElement('div');

				// 循环向上查找有没有链接
				let parent = target;
				while(parent){
					if(parent.tagName === 'A'){
						return;
					}
					parent = parent.parentElement;
				}


				imgBox.innerHTML = `<img src="${src}" />`;
				imgBox.className = 'img-box';
				document.body.appendChild(imgBox);
				document.documentElement.style.overflow = 'hidden';
				imgBox.addEventListener('click',() => {
					imgBox.remove();
					document.documentElement.style.overflow = '';
				});
			}
		},
		fixContent,
		itemContentSnippet,
		async contentTranslateTo(lang){
			this.loading = true;
			const articleEl = this.$el.querySelector('.content');
			this.groups = await translateEl(articleEl,lang);
			this.loading = false;
		},
		contentOrigin(){
			this.groups.forEach(group => {
				group.el.innerHTML = group.text;
				group.el.lang = group.originLang;
			});
			this.groups = null;
		}
	}
});

const v = new Vue({
	el: '.app',
	data: {
		feedInfos: [],
		feed: null,
		currentItem: null,
		keyword: '',
	},
	methods:{
		itemContentSnippet,
		getArticleScrollTop(){
			const bodyBox = this.$refs['body-box'];
			return bodyBox.scrollTop;
		},
		setArticleScrollTop(v){
			const bodyBox = this.$refs['body-box'];
			bodyBox.scrollTop = v;
		},
		setCurrentItem(item){
			this.currentItem = item;
			this.setArticleScrollTop(0);
		},
		setFeed(feedInfo){
			this.currentItem = null;
			fetch(`../data/feeds/${feedInfo.id}.json`).then(res => res.json()).then(feed => {
				v.feed = fixFeed(feed);
				if(feed.items.length){
					this.setCurrentItem(feed.items[0]);
				}
			});
		},
	}
});


fetch(`../data/feeds.json`).then(res => res.json()).then(Feeds => {
	v.feedInfos = Object.values(Feeds).sort((a,b) => (b.modified - a.modified) * 1 );
});



window.addEventListener('popstate',(e) => {
	const { state } = e;
	console.log('state',state);
	// if(state){
	// 	v.setCurrentItem(state);
	// }
});