<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :viewBox="`0, 0, ${width}, ${height}`">
    <desc>{{ this.label }}</desc>
    <g>
      <path :d="line" stroke-width=".5" stroke="#000" fill-opacity="0" />
      <circle v-if="dot > 0" :cx="cx" :cy="cy" :r="dot" fill="#F00" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'UiSparkline',
  props: {
    label: {
      type: String,
      default: 'Sparkline'
    },
    data: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 20
    },
    dot: {
      type: Number,
      default: 0
    }
  },
  methods: {
    point (i) {
      const x = (this.width - this.dot) * i / (this.count - 1)
      const y = (this.linePlotHeight - (this.linePlotHeight * (this.data[i] - this.min) / this.h)) + this.dot
      return { x: x, y: y }
    }
  },
  computed: {
    linePlotHeight () {
      return this.height - 2 * this.dot
    },
    cx () {
      return this.point(this.count - 1).x
    },
    cy () {
      return this.point(this.count - 1).y
    },
    min () {
      return Math.min(...this.data)
    },
    h () {
      return Math.max(...this.data) - this.min
    },
    count () {
      return this.data.length
    },
    line () {
      let line = ''
      for (let i = 0; i < this.count; i++) {
        const p = this.point(i)
        line += ` L ${p.x} ${p.y}`
      }
      return 'M' + line.substr(2)
    }
  }
}
</script>
