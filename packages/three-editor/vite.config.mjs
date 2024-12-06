import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { vitePluginForArco } from '@arco-plugins/vite-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteImagemin from 'vite-plugin-imagemin';
// import { Plugin as viteCDNPlugin } from 'vite-plugin-cdn-import';
// import externalGlobals from 'rollup-plugin-external-globals';
import viteCompression from 'vite-plugin-compression';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  return {
    build: {
      rollupOptions: {
        // external: ['vue'],
        cache: true,
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]' // 资源文件像 字体，图片等
        },
        plugins: [
          // externalGlobals({
          //   vue: 'Vue'
          // })
          viteCompression({
            verbose: true, // 是否在控制台中输出压缩结果
            disable: false,
            threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
            algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
            ext: '.gz',
            deleteOriginFile: false // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了true)
          })
        ]
      },
      minify: 'esbuild',
      reportCompressedSize: false
    },
    esbuild: {
      pure: ['console.log'], // 删除 console.log
      drop: ['debugger'] // 删除 debugger
    },
    cacheDir: resolve(__dirname, `node_modules/.vite/${mode}`),
    base: '/threeModel-editor/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@packages': resolve(__dirname, '../'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@use': resolve(__dirname, 'src/use'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@components': resolve(__dirname, 'src/components'),
        '@axios': resolve(__dirname, 'src/feature/axios'),
        '@api': resolve(__dirname, 'src/api'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@examples': resolve(__dirname, 'src/examples'),
        '@request': resolve(__dirname, 'src/request'),
        '@feature': resolve(__dirname, 'src/feature'),
        '@font': resolve(__dirname, 'public/font')
      }
    },
    server: {
      host: true
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'arcoblue-6': '#ff7f00',
            'arcoblue-5': '#f88007'
          },
          javascriptEnabled: true
        }
      }
    },
    plugins: [
      vue(),
      // viteCDNPlugin({
      //   modules: [
      //     {
      //       name: 'vue',
      //       var: 'Vue',
      //       path: `https://cdn.jsdelivr.net/npm/vue@3.4.19`
      //     }
      //   ]
      // }),
      AutoImport({
        resolvers: [ArcoResolver()]
      }),
      vitePluginForArco({
        style: 'css'
      }),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true
          })
        ]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[name]'
      }),
      viteImagemin({
        // 无损压缩配置，无损压缩下图片质量不会变差
        optipng: {
          optimizationLevel: 7
        }
      })
    ]
  };
});
