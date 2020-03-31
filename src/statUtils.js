import $axios from 'axios'

export default {
  sortToLabelDate (sortString) {
    const dateTime = sortString.split(' ')
    dateTime[0] = dateTime[0].split('-').reverse().join('.')
    return dateTime.join(' ')
  },
  labelToSortDate (labelString) {
    const dateTime = labelString.split(' ')
    dateTime[0] = dateTime[0].split('.').reverse().join('-')
    return dateTime.join(' ')
  },
  sortDateToSeconds (ddddmmyymmss) {
    return new Date(ddddmmyymmss).getTime() / 1000
  },
  todayInSeconds () {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date / 1000
  },
  nowInSeconds () {
    return Math.floor(new Date() / 1000)
  },
  formatNumber (number) {
    if (this.isNumeric(number)) {
      return number.toLocaleString('de-ch')
    }
    return number
  },
  loadCSV (path, callback) { // { path: '', callback: (data) => {}}
    $axios.get(path)
      .then((response) => {
        const lines = response.data.split('\n')
        const headers = lines[0].split(',')
        for (let i = 0; i < headers.length; i++) {
          headers[i] = headers[i].replace(/(^")|("$)/g, '')
        }

        // skip first header line and loop recursive
        const array = []
        for (let i = 1; i < lines.length; i++) {
          if (lines[i] !== '') {
            const line = lines[i].split(',')
            const obj = {}
            for (let e = 0; e < line.length; e++) {
              obj[headers[e]] = line[e].replace(/(^")|("$)/g, '')
            }
            array.push(obj)
          }
        }
        callback(array)
      })
      .catch((error) => {
        this.error = error
      })
  }
}
