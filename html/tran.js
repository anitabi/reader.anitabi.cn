// ==UserScript==
// @name         网页翻译
// @author       Kaiter-Plus
// @namespace    https://gitee.com/Kaiter-Plus/TampermonkeyScript/tree/master/Translate
// @description  给每个非中文的网页右下角（可以调整到左下角）添加一个google翻译图标,直接调用 Google 的翻译接口对非中文网页进行翻译
// @version      1.68
// @license      BSD-3-Clause
// @include      *://*
// @exclude      /.*duyaoss\.com/
// @exclude      /.*lanzous\.com/
// @exclude      /.*w3school.*cn/
// @exclude      /.*iqiyi\.com/
// @exclude      /.*baidu.*/
// @exclude      /.*cnblogs\.com/
// @exclude      /.*csdn\.net/
// @exclude      /.*zhku\.edu\.cn/
// @exclude      /.*zhihuishu\.com/
// @exclude      /.*aliyuncs\.com/
// @exclude      /.*chaoxing\.com/
// @exclude      /.*youku\.com/
// @exclude      /.*examcoo\.com/
// @exclude      /.*mooc\.com/
// @exclude      /.*bilibili\.com/
// @exclude      /.*qq\.com/
// @exclude      /.*yy\.com/
// @exclude      /.*huya\.com/
// @exclude      /localhost/
// @exclude      /.*acfun\.cn/
// @exclude      /.*eleme\.cn/
// @exclude      /.*douyin\.com/
// @noframes
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/398746/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/398746/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

// 获取 head
const head = document.head;
// 获取body
const body = document.body;

const createElement = (id, tagName, attrName, parent) => {
	const element = document.createElement(tagName);
	element.setAttribute(attrName, id);
	parent.appendChild(element);
}

// 初始化
function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{
			pageLanguage: 'auto',
			//包括的语言，中文简体，中文繁体，英语，日语，俄语
			includedLanguages: 'zh-CN,zh-TW,en,ja,ru',
			/*
				* 0，原生select，并且谷歌logo显示在按钮下方。
				* 1，原生select，并且谷歌logo显示在右侧。
				* 2，完全展开语言列表，适合pc。
				*/
			layout: 0
		},
		'google_translate_element'
	)
}

// 导入翻译接口
createElement(
	"https://translate.google.com/translate_a/element.js?&cb=googleTranslateElementInit",
	"script",
	"src",
	head
);

// 排除一些代码的翻译
const noTranslateArray = [
	".bbCodeCode",
	"tt",
	'pre[translate="no"]',
	"pre",
	".post_spoiler_show",
	".c-article-section__content sub",
	".c-article-section__content sup",
	".c-article-equation",
	".mathjax-tex",
];
noTranslateArray.forEach((selectorName) => {
	[...document.querySelectorAll(selectorName)].forEach((node) => {
		if (node.className.indexOf("notranslate") === -1) {
			node.classList.add("notranslate");
		}
	});
});

// 针对一些网站排除一些无需翻译的文字
const noTranslateList = [
	{
		site: "cratchapixel.com",
		selector: ["span.MathJax"],
	},
];
noTranslateList.forEach((item) => {
	if (~document.domain.indexOf(item.site)) {
		item.selector.forEach((selectorName) => {
			let timer = null;
			let classList = document.querySelectorAll(selectorName);
			if (!classList[0]) {
				timer = setInterval(() => {
					classList = document.querySelectorAll(selectorName);
					if (classList[0]) {
						clearInterval(timer);
						[...classList].forEach((node) => {
							if (!~node.className.indexOf("notranslate")) {
								node.classList.add("notranslate");
							}
						});
					}
				});
			}
		});
	}
});