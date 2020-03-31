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
  secondsToLabelDate (seconds) {
    return new Date(seconds * 1000).toISOString().split('T')[0]
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
  parseCSV (str) {
    var arr = []
    var quote = false // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
      var cc = str[c], nc = str[c + 1] // current character, next character
      arr[row] = arr[row] || [] // create a new row if necessary
      arr[row][col] = arr[row][col] || '' // create a new column (start with empty string) if necessary

      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc === '"' && quote && nc === '"') {
        arr[row][col] += cc
        ++c
        continue
      }

      // If it's just one quotation mark, begin/end quoted field
      if (cc === '"') {
        quote = !quote
        continue
      }

      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc === ',' && !quote) {
        ++col
        continue
      }

      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc === '\r' && nc === '\n' && !quote) {
        ++row
        col = 0
        ++c
        continue
      }

      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc === '\n' && !quote) {
        ++row
        col = 0
        continue
      }
      if (cc === '\r' && !quote) {
        ++row
        col = 0
        continue
      }

      // Otherwise, append the current character to the current column
      arr[row][col] += cc
    }
    return arr
  },
  parseCSVtoObject (str) {
    const data = this.parseCSV(str)
    const array = []
    for (let y = 1; y < data.length; y++) {
      const obj = {}
      for (let x = 0; x < data[y].length; x++) {
        obj[data[0][x]] = data[y][x]
      }
      array.push(obj)
    }
    return array
  },
  loadCSV (path, callback) { // { path: '', callback: (data) => {}}
    $axios.get(path)
      .then((response) => {
        const data = this.parseCSVtoObject(response.data)
        callback(data)
      })
      .catch((error) => {
        this.error = error
      })
  }
}
