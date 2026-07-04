// ============================================
// 菜單資料設定檔
// 店家只要修改這個檔案就能更新菜單,不用碰其他程式碼
// ============================================

const STORE_NAME = "外省麵";
const STORE_NOTICE = "高雄市鼓山區華榮路344號 · TEL:552-8999 · 星期四公休";

const MENU_CATEGORIES = [
  {
    id: "beef",
    name: "牛肉類",
    items: [
      { id: "b1", name: "牛肉麵(大)", price: 120, desc: "可選湯或乾,請於備註說明" },
      { id: "b2", name: "牛肉麵(小)", price: 110, desc: "可選湯或乾,請於備註說明" },
      { id: "b3", name: "牛肉湯麵-無牛肉(大)", price: 80, desc: "" },
      { id: "b4", name: "牛肉湯麵-無牛肉(小)", price: 70, desc: "" },
      { id: "b5", name: "牛肉湯餃(大15顆)", price: 90, desc: "" },
      { id: "b6", name: "牛肉湯餃(小10顆)", price: 70, desc: "" },
      { id: "b7", name: "牛肉湯(大)", price: 110, desc: "" },
      { id: "b8", name: "牛肉湯(小)", price: 90, desc: "" },
      { id: "b9", name: "牛肉清湯-無牛肉", price: 30, desc: "" },
    ],
  },
  {
    id: "noodle",
    name: "麵食",
    items: [
      { id: "n1", name: "水餃(韭菜口味)", price: 5, desc: "每顆5元,請點10顆以上" },
      { id: "n2", name: "榨菜肉絲湯麵(大)", price: 70, desc: "" },
      { id: "n3", name: "榨菜肉絲湯麵(小)", price: 60, desc: "" },
      { id: "n4", name: "陽春湯麵(大)", price: 60, desc: "" },
      { id: "n5", name: "陽春湯麵(小)", price: 50, desc: "" },
      { id: "n6", name: "榨菜肉絲乾麵(大)", price: 70, desc: "" },
      { id: "n7", name: "榨菜肉絲乾麵(小)", price: 60, desc: "" },
      { id: "n8", name: "炸醬乾麵-肉燥(大)", price: 60, desc: "" },
      { id: "n9", name: "炸醬乾麵-肉燥(小)", price: 50, desc: "" },
      { id: "n10", name: "麻醬乾麵-芝麻醬(大)", price: 70, desc: "" },
      { id: "n11", name: "麻醬乾麵-芝麻醬(小)", price: 60, desc: "" },
      { id: "n12", name: "麻醬榨菜乾麵(大)", price: 75, desc: "" },
      { id: "n13", name: "麻醬榨菜乾麵(小)", price: 65, desc: "" },
      { id: "n14", name: "餛飩麵(大)", price: 80, desc: "可選湯或乾,請於備註說明" },
      { id: "n15", name: "餛飩麵(小)", price: 70, desc: "可選湯或乾,請於備註說明" },
      { id: "n16", name: "豬腳麵(大)", price: 100, desc: "可選湯或乾,請於備註說明(請店家確認大份價格)" },
      { id: "n17", name: "豬腳麵(小)", price: 90, desc: "可選湯或乾,請於備註說明" },
      { id: "n18", name: "酸辣湯麵(大)", price: 80, desc: "" },
      { id: "n19", name: "酸辣湯麵(小)", price: 70, desc: "" },
      { id: "n20", name: "酸辣湯餃(大13顆)", price: 90, desc: "" },
      { id: "n21", name: "酸辣湯餃(小8顆)", price: 70, desc: "請店家確認小份價格是否正確" },
    ],
  },
  {
    id: "side",
    name: "小菜",
    items: [
      { id: "s1", name: "滷豬腳(份)", price: 60, desc: "" },
      { id: "s2", name: "皮蛋豆腐", price: 35, desc: "" },
      { id: "s3", name: "黃瓜(份)", price: 40, desc: "" },
      { id: "s4", name: "木耳(份)", price: 30, desc: "" },
      { id: "s5", name: "泡菜(份)", price: 30, desc: "" },
      { id: "s6", name: "燙青菜", price: 30, desc: "可備註想要的青菜種類" },
    ],
  },
  {
    id: "soup",
    name: "湯品",
    items: [
      { id: "p1", name: "酸辣湯", price: 30, desc: "" },
      { id: "p2", name: "餛飩湯", price: 30, desc: "" },
      { id: "p3", name: "榨菜湯", price: 30, desc: "" },
      { id: "p4", name: "貢丸湯", price: 30, desc: "" },
      { id: "p5", name: "蛋花湯", price: 30, desc: "" },
    ],
  },
];
