<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" height="64" width="64"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support">
          <ul ref="supports" v-if="seller.supports">
            <li v-for="item in seller.supports.concat([seller.supports[0]])" :key="item.id">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
        </div>
        <div class="support-count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-warpper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="150%"/>
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow" @click.stop="hideDetail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="1.5"></star>
            </div>
            <div v-if="seller.supports" class="title">
              <div class="line border"></div>
              <div class="text">优惠信息</div>
              <div class="line border"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="supports-item" v-for="item in seller.supports">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line border"></div>
              <div class="text">商家公告</div>
              <div class="line border"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click.stop="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapActions, mapMutations} from 'vuex'
  import star from '../star/Star'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        classMap: this.$store.state.classMap,
        detailShow: false
      }
    },
    methods: {
      ...mapActions(['startHeaderTransition', 'linstenTranstionEnd', 'transitionAgain']),
      ...mapMutations(['RECEIVE_LENGTH']),
      callback() {
        this.transitionAgain({obj: this.$refs.supports, modules: 'header'})
      },
      showDetail() {
        this.detailShow = true
      },
      hideDetail() {
        this.detailShow = false
      }
    },
    watch: {
      seller(val) {
        if (val.supports) {
          this.$nextTick(() => { // 等待整个页面渲染完毕之后再获取ul
            this.RECEIVE_LENGTH(val.supports.length)
            let obj = this.$refs.supports
            this.startHeaderTransition(obj)
            this.linstenTranstionEnd({obj, callback: this.callback})
          })
        }
      }
    },
    components: {
      star
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/mixin";

  @black: rgba(7, 17, 27, 0.5);
  .header {
    position: relative;
    overflow: hidden;
    color: #fff;
    background: @black;
    .content-wrapper {
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0;
      .avatar {
        display: inline-block;
        vertical-align: top;
        img {
          border-radius: 4px;
        }
      }
      .content {
        display: inline-block;
        margin-left: 16px;
        .title {
          margin: 2px 0 8px 0;
          .brand {
            display: inline-block;
            width: 30px;
            height: 18px;
            vertical-align: top;
            .device-image('../../common/img/brand');
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name {
            margin-left: 6px;
            font-size: 16px;
            line-height: 18px;
            font-weight: bold;
          }
        }
        .description {
          margin-bottom: 12px;
          font-weight: 200;
          line-height: 12px;
          font-size: 12px;
        }
        .support {
          height: 12px;
          overflow: hidden;
          li {
            margin-bottom: 4px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .icon {
            display: inline-block;
            margin-right: 4px;
            vertical-align: top;
            width: 12px;
            height: 12px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            .iconImg(1)
          }
          .text {
            display: inline-block;
            box-sizing: border-box;
            width: 180px;
            font-size: 10px;
            padding-top: 1px;
            line-height: 12px;
            height: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .support-count {
          position: absolute;
          right: 12px;
          bottom: 12px;
          padding: 0 5px 0 8px;
          height: 24px;
          text-align: center;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.2);
          .count {
            display: inline-block;
            vertical-align: top;
            padding-top: 1px;
            font-size: 10px;
            font-weight: 200;
            line-height: 24px;
          }
          .icon-keyboard_arrow_right {
            margin-left: 1px;
            font-size: 10px;
            line-height: 24px;
          }
        }
      }
    }
    .bulletin-warpper {
      display: flex;
      height: 28px;
      line-height: 28px;
      padding: 0 12px;
      font-size: 0;
      background: rgba(7, 17, 27, 0.2);
      .bulletin-title {
        flex: 0 0 22px;
        display: inline-block;
        vertical-align: top;
        margin-top: 8px;
        width: 22px;
        height: 12px;
        .device-image("../../common/img/bulletin");
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      .bulletin-text {
        flex: 1;
        display: inline-block;
        font-size: 10px;
        line-height: 28px;
        margin: 0 4px;
        padding-top: 1px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .icon-keyboard_arrow_right {
        flex: 0 0 3px;
        display: inline-block;
        font-size: 10px;
        padding-top: 1px;
        line-height: 28px;
      }

    }
    .background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      filter: blur(10px);
    }
    .detail {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.8);
      -webkit-backdrop-filter: blur(10px);
      overflow: auto;
      z-index: 100;
      transition: all 0.5s;
      &.fade-enter, &.fade-leave-to {
        opacity: 0;
      }
      .detail-wrapper {
        width: 100%;
        min-height: 100%;
        .detail-main {
          margin-top: 64px;
          padding-bottom: 64px;
          .name {
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
            text-align: center;
            color: #fff;
          }
          .star-wrapper {
            margin-top: 18px;
            text-align: center;
          }
          .title {
            display: flex;
            margin: 28px 0 24px;
            .line {
              flex: 1;
              position: relative;
              top: -6px;
              .border-1px(rgba(255, 255, 255, 0.2))
            }
            .text {
              padding: 0 12px;
              font-size: 14px;
              font-weight: 700;
              line-height: 14px;
              color: #fff;
            }
          }
          .supports, .title, .bulletin {
            width: 100%;
            box-sizing: border-box;
            padding: 0 36px;
          }
          .supports-item {
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 0;
            &:last-child {
              margin-bottom: 0;
            }
            .icon {
              display: inline-block;
              height: 16px;
              width: 16px;
              vertical-align: top;
              margin-right: 6px;
              background-size: 16px 16px;
              background-repeat: no-repeat;
              .iconImg(2)
            }
            .text {
              font-size: 12px;
              line-height: 16px;
              font-weight: 200;
            }
          }
          .content {
            padding: 0 12px;
            line-height: 24px;
            font-size: 12px;
          }
        }
      }
      .detail-close {
        position: relative;
        width: 32px;
        height: 32px;
        clear: both;
        font-size: 32px;
        margin: -64px auto 0;
      }
    }
  }
</style>
