const toolclass = {
  FormatDate: (date = null, format = 'YY:MM:DD hh:mm:ss') => { // 格式化时间
    if (date !== null) {
      date = new Date(date)
      let YY = date.getFullYear()
      let MM = date.getMonth() + 1
      let DD = date.getDate()
      let hh = date.getHours()
      let mm = date.getMinutes()
      let ss = date.getSeconds()
      if (format === 'YY:MM:DD') {
        return `${YY}-${MM > 9 ? MM : `0${MM}`}-${DD > 9 ? DD : `0${DD}`}`
      }
      if (format === 'hh:mm:ss') {
        return `${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}:${ss > 9 ? ss : `0${ss}`}`
      }
      return `${YY}-${MM > 9 ? MM : `0${MM}`}-${DD > 9 ? DD : `0${DD}`} ${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}:${ss > 9 ? ss : `0${ss}`}`
    } else {
      return ''
    }
  }
}
export default toolclass