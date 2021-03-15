
const pages = require('../pages')

// 深度拷贝
export const deepCopy = x => JSON.parse(JSON.stringify(X))

// 获取当前页面配置
export const getPage = (router) => {
  return pages.filter(x => router.path.indexOf(x.page) > -1)[0]
}

/**
 * 压缩图片 80%, 最大宽度 750
 * @param {*} img
 */
export function transferImage(img) {
  if (!img) return img;

  const ossStr = 'oss-'

  if (img.indexOf(ossStr) > -1) {
    if (store.getState().system.systemInfo.platform !== "ios") {
      // ios 暂时不支持 webp
      return `${img.replace(
        ossPath,
        ossFastPath
      )}?x-oss-process=style/transwebp`;
    }

    return `${img.replace(
      ossPath,
      ossFastPath
    )}?x-oss-process=style/compress`;
  }

  return img;
}
