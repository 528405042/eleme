/**
 * Created by newuser on 2017/9/22.
 */
import * as types from '../mutation-types'

const state = {
  added: [], // 把商品中count>0的商品添加进该数组
  balls: [
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    }
  ],
  dropBalls: []
}

const getters = {
  cartProducts: state => state.added,
  getBalls: state => state.balls,
  getDropBalls: state => state.dropBalls
}

const mutations = {
  [types.RECEIVE_CARTS](state, allGoods) { // 刷新购物车列表数组
    let arr = []
    allGoods.forEach(item => {
      if (item.count > 0) {
        arr.push(item)
      }
    })
    state.added = arr
  },
  [types.DROP_START](state, addEl) { // 该事件是被cartcontrol触发的 我们应该通过该事件获取到用户点击的加号元素
    for (let i = 0; i < state.balls.length; i++) {
      let ball = state.balls[i]
      if (!ball.show) {
        ball.show = true
        ball.el = addEl
        state.dropBalls.push(ball)
        return
      }
    }
  },
  [types.DROP_END](state, el) {
    let ball = state.dropBalls.shift()
    if (ball) {
      // 将小球设置为空闲状态
      ball.show = false
      // 隐藏小球
      el.style.display = 'none'
    }
  }
}

export default {
  state,
  getters,
  mutations
}
