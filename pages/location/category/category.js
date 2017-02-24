// pages/location/category/category.js
var app = getApp();
Page({
  data: {
    locId: "",
    showCategory: false,
    isTypeTap: false,
    isDateTap: false,
    events: {},
    g_eventCategory: {},
    districtsCategory: {},
    dateCategory: {},
    typeCategory: {},
    eventCategory: {},
    "current": "",
    "type": "all",
    "date": "future",
    'district': "all"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var locId = options.locId;
    var eventType = options.type;
    var typeCategory = {
      "all": { "id": "all", "name": "all", "title": "全部" },
      "music": { "id": "music", "name": "music", "title": "音乐" },
      "film": { "id": "film", "name": "film", "title": "电影" },
      "drama": { "id": "drama", "name": "drama", "title": "戏剧 " },
      "commonweal": { "id": "commonweal", "name": "commonweal", "title": "公益" },
      "salon": { "id": "salon", "name": "salon", "title": "讲座 " },
      "exhibition": { "id": "exhibition", "name": "exhibition", "title": "展览" },
      "party": { "id": "party", "name": "party", "title": "聚会" },
      "sports": { "id": "sports", "name": "sports", "title": "运动" },
      "travel": { "id": "travel", "name": "travel", "title": "旅行" },
      "course": { "id": "course", "name": "course", "title": "课程" }
    };
    var dateCategory = {
      "future": { "id": "future", "name": "future", "title": "全部" },
      "today": { "id": "today", "name": "today", "title": "今天" },
      "tomorrow": { "id": "tomorrow", "name": "tomorrow", "title": "明天" },
      "weekend": { "id": "weekend", "name": "weekend", "title": "周末" },
      "week": { "id": "week", "name": "week", "title": "近期" },
    };

    var g_eventCategory = app.globalData.eventCategory;

    this.setData({ "locId": locId, "eventCategory": typeCategory, "current": this.data.type, "typeCategory": typeCategory, "dateCategory": dateCategory, "g_eventCategory": g_eventCategory });

    // 请求活动列表
    this.getEventListData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /** 重置标签页状态 */
  resetMenuTap: function (menu) {
    var readyData = { "isTypeTap": false, "isDateTap": false };
    this.setData(readyData);
  },
  /** 选择类型 */
  handleType: function (event) {
    this.setData({ "eventCategory": this.data.typeCategory, "current": this.data.type, "showCategory": true });
    this.resetMenuTap();
    this.setData({ "isTypeTap": true });
    console.log("handleType");
  },
  /** 选择时间 */
  handleTime: function (event) {
    this.setData({ "eventCategory": this.data.dateCategory, "current": this.data.date, "showCategory": true });
    this.resetMenuTap();
    this.setData({ "isDateTap": true });
    console.log("handleTime");
  },
  /** 选择地点，地点接口不支持，这里查找该城市所有区域的活动 */
  handleLoc: function (event) {

    this.setData({ "eventCategory": this.data.districtsCategory, "current": 'all', "showCategory": true });
    console.log("handleLoc");
  },
  /** 点击类型 */
  handleCategory: function (event) {
    var id = event.currentTarget.dataset.id;
    var readyData = { "showCategory": false };
    this.data.isTypeTap && (readyData["type"] = id);
    this.data.isDateTap && (readyData["date"] = id);
    this.setData(readyData);

    // var param = "?";
    // this.data.type && (param += "type=" + this.data.type);
    // this.data.date && (param += "&&day_type=" + this.data.date);
    // var url = app.globalData.doubanBase + app.globalData.event_list_url + this.data.locId + param;
    this.getEventListData();
    this.resetMenuTap();
  },
  /** 点击类别外的区域，取消显示类别信息 */
  handleCoverTap: function (event) {
    this.setData({ "showCategory": false });
  },
  /** 搜索活动   */
  getEventListData: function () {
    // 组装URL
    var that = this;
    var params = "?";
    this.data.locId && (params += "loc=" + this.data.locId);
    this.data.type && (params += "&&type=" + this.data.type);
    this.data.date && (params += "&&day_type=" + this.data.date);
    var url = app.globalData.doubanBase + app.globalData.event_list_url + params + "&&start=0&&count=20";
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        var data = res.data;
        that.processDistrictsData(data.districts);
        that.processEventListData(data.events);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /** 组装区域数据 */
  processDistrictsData: function (districts) {
    // 接口不支持区域搜索，这里搜索该城市的所有区域
    var districts = {
      "all": { "id": "all", "name": "all", "title": "全部" }
    }
    this.setData({ "districtsCategory": districts });
  },
  /** 组装活动数据 */
  processEventListData: function (events) {
    //events
    var list = [];
    for (let idx in events) {
      var event = events[idx];
      // 装饰event对象
      var time_str = event.time_str;
      var time = "";

      if (typeof time_str == 'string') {
        var time_arr = time_str.split(" ");
        time = time_arr[0];
      }

      var temp = {
        id: event.id,
        image: event.image,
        loc_name: event.loc_name,
        owner: event.owner,
        category: event.category,
        title: event.title,
        wisher_count: event.wisher_count,
        has_ticket: event.has_ticket,
        content: event.content,
        can_invite: event.can_invite,
        time_str: time,
        album: event.album,
        participant_count: event.participant_count,
        tags: event.tags,
        image_hlarge: event.image_hlarge,
        begin_time: event.begin_time,
        price_range: event.price_range,
        geo: event.geo,
        image_lmobile: event.image_lmobile,
        loc_id: event.loc_id,
        end_time: event.end_time,
        address: event.address,
      };
      list.push(temp);
    }
    this.setData({ "events": list });
    console.log(this.data);
  },
  /** 查看活动详情 */
  handleEventTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/location/event/event?id=' + id
    });
  },
})