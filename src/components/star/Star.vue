<template>
  <div class="star">
    <span v-for="item in starsClass" :class="[item,starName]" class="star-item"></span>
  </div>
</template>

<script>
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starName() {
        return `star${this.size}`
      },
      starRating() {
        return Math.floor(this.score * 2) / 2
      },
      starsClass() {
        let arr = []
        let score = Math.floor(this.starRating)
        for (let i = 0; i < 5; i++) {
          if (i < score) {
            arr.push('on')
          } else if (i >= score && i < this.starRating) {
            arr.push('half')
          } else {
            arr.push('off')
          }
        }
        return arr
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/mixin";

  .star {
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    .star48 {
      width: 22px;
      height: 21px;
      background-size: 22px 21px;
      margin-right: 25px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        .device-image('../../common/img/star48_on')
      }
      &.half {
        .device-image('../../common/img/star48_half')
      }
      &.off {
        .device-image('../../common/img/star48_off')
      }
    }
    .star36 {
      width: 18px;
      height: 18px;
      background-size: 18px 18px;
      &.on {
        .device-image('../../common/img/star36_on')
      }
      &.half {
        .device-image('../../common/img/star36_half')
      }
      &.off {
        .device-image('../../common/img/star36_off')
      }
    }
    .star24 {
      width: 12px;
      height: 12px;
      background-size: 12px 12px;
      &.on {
        .device-image('../../common/img/star24_on')
      }
      &.half {
        .device-image('../../common/img/star24_half')
      }
      &.off {
        .device-image('../../common/img/star24_off')
      }
    }

  }
</style>
