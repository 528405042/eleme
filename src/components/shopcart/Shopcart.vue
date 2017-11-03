<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="footer-content" @click="toggleList">
        <div class="content-left">
          <div class="logo-warper">
            <div class="logo" :class="{'highlight':num>0}"><i class="icon-shopping_cart"></i></div>
            <div class="num" v-show="num>0">{{num}}</div>
          </div>
          <div class="price" :class="{'highlight':num>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="{'enough':totalPrice>=minPrice }">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-wrapper">
        <div v-for="ball in getBalls">
          <transition name="drop" @before-enter="beforeDrop" @enter="droping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listshow">
          <div class="list-header"><h1 class="title">购物车</h1> <span class="empty">清空</span></div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border" v-for="food in cartProducts">
                <span class="name">{{food.name}}</span>
                <div class="price">¥<span>{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="bg">
      <div class="list-bg" v-show="listshow" @click="hiddenList"></div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import cartcontrol from '../cartcontrol/Cartcontrol'
  import IScroll from 'iscroll'
  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        fold: true
      }
    },
    computed: {
      ...mapGetters(['cartProducts', 'getBalls', 'getDropBalls']),
      num() {
        let count = 0
        this.cartProducts.forEach(item => {
          count += item.count
        })
        return count
      },
      totalPrice () {
        let total = 0
        this.cartProducts.forEach(item => {
          total += item.count * item.price
        })
        return total
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let dec = this.minPrice - this.totalPrice
          return `还差¥${dec}元起送`
        } else {
          return '去结算'
        }
      },
      listshow() {
        if (!this.num) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.listScroll) {
              this.listScroll = new IScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.listScroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      ...mapMutations({setTranslate: 'SET_TRANSLATE', dropEnd: 'DROP_END'}),
      ...mapActions({transtionEnd: 'linstenTranstionEnd'}),
      toggleList() {
        if (!this.num) {
          return
        }
        this.fold = !this.fold
      },
      hiddenList() {
        this.fold = true
      },
      beforeDrop(el) {
        this.getDropBalls.forEach(ball => {
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32 + 'px'
            let y = -(window.innerHeight - rect.top - 20) + 'px'
            this.setTranslate({x: 0, y, z: 0, obj: el})
            let inner = el.getElementsByClassName('inner')[0]
            this.setTranslate({x, y: 0, z: 0, obj: inner})
          }
        })
      },
      droping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.setTranslate({x: 0, y: 0, z: 0, obj: el})
        let inner = el.getElementsByClassName('inner')[0]
        this.setTranslate({x: 0, y: 0, z: 0, obj: inner})
        this.transtionEnd({obj: el, callback: done})
      },
      afterDrop(el) {
        this.dropEnd(el)
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/mixin";

  .shopcart {
    position: fixed;
    height: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 50;
    .footer-content {
      display: flex;
      background: #141d27;
      font-size: 0;
      .content-left {
        flex: 1;
        .logo-warper, .price, .desc {
          display: inline-block;
        }
        .logo-warper {
          position: relative;
          top: -10px;
          z-index: 55;
          margin: 0 12px;
          padding: 6px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          vertical-align: top;
          background: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            line-height: 44px;
            border-radius: 50%;
            text-align: center;
            font-size: 24px;
            background: #2B343C;
            color: rgba(255, 255, 255, 0.4);
            &.highlight {
              color: rgb(255, 255, 255);
              background: rgb(0, 160, 220);
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 8px;
            font-size: 9px;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rbga(0, 0, 0, 0.4);
          }
        }
        .price {
          margin: 12px 0;
          padding-right: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          line-height: 24px;
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          margin: 12px 0;
          padding-left: 12px;
          font-size: 10px;
          line-height: 24px;
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        background: #2B343C;
        .pay {
          padding: 0 8px;
          height: 48px;
          line-height: 48px;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          &.enough {
            background: #55da6c;
            color: #fff;
          }
        }
      }
    }

    .ball-wrapper .ball {
      position: fixed;
      left: 32px;
      bottom: 21px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.4, -0.53, 1, 0.385);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 240);
        transition: all 0.4s linear;
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transition: all 0.5s;
      transform: translate3D(0, -100%, 0);
      &.fold-enter, &.fold-leave-to {
        opacity: 0;
        transform: translate3D(0, 0, 0);
      }
      .list-header {
        padding: 0 18px;
        height: 40px;
        background: #f3f5f7;
        border-bottom: rgba(7, 17, 27, 0.1);
        line-height: 40px;
        .title {
          float: left;
          font-size: 14px;
          font-weight: 200;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 219px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          .border-1px(rgba(7, 17, 27, 0.1));
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 88px;
            bottom: 12px;
            font-size: 10px;
            font-weight: normal;
            line-height: 24px;
            color: rgb(240, 20, 20);
            span {
              font-size: 14px;
              font-weight: 700;
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
  }

  .list-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 44;
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    transition: all 0.4s;
    &.bg-enter, &.bg-leave-to {
      opacity: 0;
    }
  }
</style>
