
const pTags = [
	'P',
]
const blockTags = [
	'H3',
	'P',
	'DIV',
	'H4',
	'H5',
	'H6',
	'UL',
	'OL',
	'LI',
];

const breakTags = [
	'BR',
	'HR',
];

function convertToParagraphs(htmlContent) {
    // 创建一个临时 DOM 元素
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

	const parseEl = (el) => {
		const { tagName } = el;
		const childNodes = [...el.childNodes];
		if(!childNodes.length) return el;	

		// 克隆一个空的 DOM 元素
		const dom = el.cloneNode(false);

		let currentParagraph;
		const createParagraph = () => {
			currentParagraph = document.createElement('p');
			dom.appendChild(currentParagraph);
		};
		createParagraph();


		for (let i = 0; i < childNodes.length; i++) {
			const child = childNodes[i];

			if (child.nodeType === 3) { // 文本节点
				currentParagraph.appendChild(child);
				continue;
			}
			


			// 元素节点
			if (blockTags.includes(child.tagName)) { // 需要换行的标签
				dom.appendChild(parseEl(child));
				createParagraph();
				continue;
			} 
			else if (breakTags.includes(child.tagName)) { // 换行标签
				// console.log(child);

				createParagraph();
				continue;
			}
			else {
				currentParagraph.appendChild(child);
				continue;
			}
		}
		// createParagraph();
		return dom;
	};
    const dom = parseEl(tempDiv);

	return dom.innerHTML;

}





const fetchTranslate = async (texts,lang = 'zh-CN') => {
	const bodyJSON = [
		[
			texts,
			"auto",
			lang
		],
		"te"
	];
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://translate-pa.googleapis.com/v1/translateHtml", true);
	xhr.setRequestHeader('content-type', 'application/json+protobuf');
	xhr.setRequestHeader('x-goog-api-key', 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520');
	xhr.send(JSON.stringify(bodyJSON));

	return new Promise((resolve, reject) => {
		xhr.onload = () => {
			try{
				const res = JSON.parse(xhr.responseText);
				resolve(res);
			}catch(e){
				resolve();
			}
		};
	});
};

const genTranslatedTextsByText = text=>{
	if(text.substr(0,2) !== '<a') return [text];
	return text.match(/<a[^>]*>[^<]*<\/a>/g).map(str=>str.replace(/<a[^>]*>/,'').replace(/<\/a>/,''));
}

const genTextsGroupByEl = el=>{
	return [...el.querySelectorAll('p,h1,h2,h3,h4')].map(el=>{
		const text = el.innerHTML.trim();
		return {
			el,
			text,
		};
	}).filter(group=>group.el.innerText.trim());
}
const translateEl = async el=>{
	const groups = genTextsGroupByEl(el);
	console.log(groups);

	const texts = groups.map(group=>group.text);

	const lang = 'zh-CN';

	const res = await fetchTranslate(texts,lang);
	if(!res) return;
	const [ translatedTexts, originLang  ] = res;
	el.groups = groups;
	groups.forEach((group,index)=>{
		group.translatedText = translatedTexts[index];
		group.originLang = originLang[index];

		const { el } = group;

		el.lang = lang;
		el.innerHTML = group.translatedText;
	});

	console.log(groups);

	return groups;
}
