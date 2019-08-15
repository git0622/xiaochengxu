var until = require('../../untils/until.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=4";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=4";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=4";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  onMoreTap: function(event) {
    console.log("event", event)
    var categoryTitle = event.currentTarget.dataset.categorytitle;
    console.log("categoryTitle", categoryTitle)
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + categoryTitle
    })
  },
  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值
      },
      success(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(error) {
        // fail
        console.log(error)
      }
    })
  },
  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        stars: until.convertToStarsArray(subject.rating.stars),
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
    this.setData({
      containerShow: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})