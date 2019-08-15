var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  data: {},
  onLoad: function(option) {
    this.data.backgroundAudioManager = wx.getBackgroundAudioManager();

    var postId = option.id;
    var postData = postsData.postList[postId];
    this.data.currentPostId = postId;
    this.setData({
      postData: postData,
    })
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    if (app.g_isPlayingMusic && app.g_currentMusicPostId === this.data.currentPostId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();

  },
  setMusicMonitor: function() {
    var backgroundAudioManager = this.data.backgroundAudioManager
    var that = this;
    backgroundAudioManager.onPlay(function() {
      console.log("onplay")
      that.setData({
        isPlayingMusic: true
      })
      app.g_isPlayingMusic = true;
      app.g_currentMusicPostId = that.data.currentPostId;
    });
    backgroundAudioManager.onPause(function() {
      console.log("onPause")
      that.setData({
        isPlayingMusic: false
      })
      app.g_isPlayingMusic = false;
      app.g_currentMusicPostId = null;
    });
    backgroundAudioManager.onEnded(function() {
      console.log("onEnded")
      that.setData({
        isPlayingMusic: false
      })
    })
    // wx.onBackgroundAudioPlay(function () {
    //   that.setData({
    //     isPlayingMusic: true
    //   })
    // })
    // wx.onBackgroundAudioPause(function () {
    //   that.setData({
    //     isPlayingMusic: false
    //   })
    // })
  },
  onCollectionTap: function() {
    this.getPostsCollectedAsy();
    // this.getPostCollectedSyc();
  },

  getPostsCollectedAsy: function() {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = !postsCollected[that.data.currentPostId];
        postsCollected[that.data.currentPostId] = postCollected;

        that.showToast(postsCollected, postCollected);
      }
    })
  },
  getPostCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = !postsCollected[this.data.currentPostId];
    postsCollected[this.data.currentPostId] = postCollected;

    this.showToast(postsCollected, postCollected);
  },
  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      icon: "success",
      duration: 1000
    })
  },
  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章" : "取消收藏该文章",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  onshareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否取消" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },

  onMUsicTap: function(event) {
    console.log('event', event)
    var currentPostId = this.data.currentPostId;
    console.log(currentPostId)
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    var backgroundAudioManager = this.data.backgroundAudioManager;
    const that = this;
    if (isPlayingMusic) {
      backgroundAudioManager.pause()
      // wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {

      backgroundAudioManager.title = postData.music.title
      backgroundAudioManager.epname = postData.music.title
      // backgroundAudioManager.singer = '许巍'
      backgroundAudioManager.coverImgUrl = postData.music.coverImgUrl;
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = postData.music.url
      // wx.playBackgroundAudio({
      //   dataUrl: postData.music.url,
      //   title: postData.music.title,
      //   coverImgUrl: postData.music.coverImgUrl
      // })

      this.setData({
        isPlayingMusic: true
      })
    }

  }
})