
let logger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

function info(...args) {
  // 本地打印
  console.info(...args)

  // 远程提交
  if (logger) {
    logger.info(...args)
  }
}

function error(...args) {
  console.error(...args)

  if (logger) {
    logger.error(...args)
  }
}

function warn(...args) {
  console.warn(...args)

  if (logger) {
    logger.warn(...args)
  }
}

export default { info, error, warn }
