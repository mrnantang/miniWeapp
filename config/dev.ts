import type { UserConfigExport } from "@tarojs/cli";
export default {
  logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {},
  defineConstants: {
    TARO_APP_API_BASE: JSON.stringify('http://124.223.105.21:8080/api'),
  },
} satisfies UserConfigExport<'webpack5'>
