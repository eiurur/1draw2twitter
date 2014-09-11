(function() {
  exports.COOKIE_SECRET = process.env.COOKIE_SECRET;

  exports.TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;

  exports.TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_KEY;

  exports.CALLBACK_URL = process.env.CALLBACK_URL;

  exports.GRACE_TIME_SERVER = 0;

  exports.GRACE_TIME_CLEAR = 1 * 1000;

  exports.INTERVAL_TIME_CLEAR = 10 * 1000;

  exports.TAGS = ['#ラブライブ版深夜の真剣お絵描き10分一本勝負', '#アイカツ版深夜の真剣お絵描き10分一本勝負', '#艦これ版深夜の真剣お絵描き10分一本勝負', '#ゆるゆり版深夜の真剣お絵描き10分一本勝負', '#モバマス版深夜の真剣お絵かき10分一本勝負', '#ミリマス版深夜の真剣お絵描き10分一本勝負', '#深夜の真剣お絵描き10分一本勝負', '#ボカロ版深夜の真剣お絵描き10分一本勝負', '#創作版真剣お絵描き10分一本勝負'];

  exports.CATEGORIES = [
    {
      id: 'lovelive',
      tag: '#ラブライブ版深夜の真剣お絵描き10分一本勝負',
      startedAt: '20:00',
      numPresentation: 1,
      themes: ['高坂穂乃果', '園田海未', '南ことり', '1年生組', '2年生組', '3年生組', 'Printemps', 'BiBi', 'Lily White']
    }, {
      id: 'aikatsu',
      tag: '#アイカツ版深夜の真剣お絵描き10分一本勝負',
      startedAt: '20:20',
      numPresentation: 1,
      themes: ['星宮いちご', '霧矢あおい', '紫吹蘭', '有栖川おとめ', '藤堂ユリカ', '北大路さくら', '一ノ瀬かえで', '大空あかり', '氷上スミレ', '新条ひなき', '音城セイラ', '冴草きい', '風沢そら']
    }, {
      id: 'kancolle',
      tag: '#艦これ版深夜の真剣お絵描き10分一本勝負',
      startedAt: '21:00',
      numPresentation: 3,
      themes: ['長門', '暁', '伊401', '子日', '鬼怒', '阿武隈']
    }, {
      id: 'yuruyuri',
      tag: '#ゆるゆり版深夜の真剣お絵描き10分一本勝負',
      startedAt: '21:00',
      numPresentation: 1,
      themes: ['赤座あかり', '歳納京子', '船見結衣', '吉川ちなつ']
    }, {
      id: 'mobamas',
      tag: '#モバマス版深夜の真剣お絵かき10分一本勝負',
      startedAt: '21:20',
      numPresentation: 3,
      themes: ['相川千夏', '秋月律子', '浅利七海', 'アナスタシア']
    }, {
      id: 'millimas',
      tag: '#ミリマス版深夜の真剣お絵描き10分一本勝負',
      startedAt: '21:40',
      numPresentation: 3,
      themes: ['矢吹可奈', '北沢志保', '佐竹美奈子', '七尾百合子']
    }, {
      id: 'toho',
      tag: '#深夜の真剣お絵描き10分一本勝負',
      startedAt: '21:40',
      numPresentation: 1,
      themes: ['博麗霊夢', '霧雨魔理沙', 'アリス・マーガトロイド', '十六夜咲夜']
    }, {
      id: 'vocaloid',
      tag: '#ボカロ版深夜の真剣お絵描き10分一本勝負',
      startedAt: '21:40',
      numPresentation: 3,
      themes: ['初音ミク', '鏡音リン', '鏡音レン', '巡音ルカ']
    }, {
      id: 'sousaku',
      tag: '#創作版真剣お絵描き10分一本勝負',
      startedAt: '21:40',
      numPresentation: 3,
      themes: ['十五夜', 'おんぶ', 'ナザール・ボンジュウ', 'タイヤ', '時間泥棒']
    }
  ];

}).call(this);
