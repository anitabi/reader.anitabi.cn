
// import translate from 'google-translate';

const headers = {
	"accept": "*/*",
	"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
	"content-type": "application/json+protobuf",
	"priority": "u=1, i",
	"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": "\"macOS\"",
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "cross-site",
	"x-goog-api-key": "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520",
	"Referer": "http://127.0.0.1:5500/",
	"Referrer-Policy": "strict-origin-when-cross-origin"
};

const bodyJSON = [
	[
		[
			"【聖地巡礼】響け！ユーフォニアム　宇治黄檗　許波多神社",
			"先月の桜シーズンに続き、5月GW最終日に再び宇治にいきました。もうね、アニメ放映中はどっぷりと 絵馬掛けの絵馬にはユーフォファンが書いたのが多数あった。 競馬発祥の地とされているらしい。",
			"京都の寺社・御所・離宮",
			"春　響け！ユーフォニアム宇治聖地巡礼",
			"いよいよ「響け！ユーフォニアム」の最終章第３期が始まりました。 マンション前の横断歩道を渡りあじろぎの道へ。",
			"オタ活",
			"大津線ユーフォーラッピング車とかキャンプとか",
			"うちの地元は先週に大雪となりまして、雪かきをやった翌日に京阪大津線にいき",
			"鉄道旅",
			"深秋の宇治へ　響け！ユーフォニアム聖地巡礼",
			"ここのところ月曜日の休みがあったので、11月中旬に隔年恒例の伊勢神宮に参拝、 宇治橋を渡って平等院参道を歩き、観光客が開門待ちしている平等院は今回はスルーして宇治川岸のあじろぎの道へ。 紅葉きれい 紅",
			"秋冬キャンプの始まり",
			"秋冬キャンプの始まり。 良き眺め。紅葉にはまだちょっと早かった。",
			"キャンプ",
			"夏のオタ活",
			"夏の暑さは苦手なんであんまり外を出歩きたくはないんだが 8月末には京都のMOVIXで再び、響けユーフォ鑑賞。 9月に入ってもぜんぜん秋の気配なくあっつい。んで9月17日は京まふの2日目に行ってきた。 ",
			"祇園祭　綾傘鉾の大原神社と三和町の大原神社のご朱印",
			"実に４年越しでした。祇園祭の綾傘鉾の会所でもある大原大神宮（神社）では",
			"金沢の長町武家屋敷とか金沢城",
			"2年前の秋はコロナ真っ只中だったから兼六園は閉園中だったような。",
			"金沢の神社",
			"２年前の秋、金沢への日帰り旅行で参拝した神社 石浦神社 金澤神社から出て兼六園沿いに西に歩くと見えてきます。 尾山神社 なんかいろんなトコのもんが詰め込まれた珍門。 ご祭神は前田利家・おまつ。大河では",
			"出雲　日御碕神社",
			"出雲の日御碕に鎮座まします日御碕神社。こちらも安寧天皇の御代の創建と 日沈宮拝殿と本殿 回廊から石段をあがると神の宮（上の宮） 境内を出るとすぐに漁港。その先の島に元宮とされる経島神社。",
		],
		"auto",
		"zh-CN"
	],
	"te"
];

// const xhr = new XMLHttpRequest();
// xhr.open("POST", "https://translate-pa.googleapis.com/v1/translateHtml", true);
// xhr.setRequestHeader('content-type', 'application/json+protobuf');
// xhr.setRequestHeader('x-goog-api-key', 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520');
// xhr.send(JSON.stringify(bodyJSON));



import axios from 'axios';
import { proxy } from './httpAgentProxy.mjs';

const response = await axios.post("https://translate-pa.googleapis.com/v1/translateHtml",{
	headers,
	proxy,
	body: JSON.stringify(bodyJSON),
});
// console.log(response);
console.log(response.data);

