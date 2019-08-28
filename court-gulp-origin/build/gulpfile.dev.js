let gulp = require('gulp')
let autoprefixer = require('gulp-autoprefixer') // 处理css中浏览器兼容的前缀  
let rename = require('gulp-rename') //重命名  
let cssnano = require('gulp-cssnano') // css的层级压缩合并
let less = require('gulp-less') //less
let jshint = require('gulp-jshint') //js检查 ==> npm install --save-dev jshint gulp-jshint

// let uglify = require('gulp-uglify'); //js压缩  
// let concat = require('gulp-concat'); //合并文件  

let imagemin = require('gulp-imagemin') //图片压缩 
let browserSync = require('browser-sync').create()
let reload = browserSync.reload
let Config = require('./gulpfile.config.js')

// 反向代理
let proxyMiddleware = require('http-proxy-middleware')

let proxy = proxyMiddleware('/api', {
  target: 'http://120.78.223.114:8688', //'http://114.115.133.183:8780',
//   target: 'http://47.105.189.44:8780', //'http://114.115.133.183:8780',
  pathRewrite: {
    '^/api': ''
  },
  changeOrigin: true
})

//======= gulp dev 开发环境下 ===============

function dev () {
  /**
   *   HTML 处理
   */
  gulp.task('html:dev', function () {
    return gulp.src(Config.html.src).pipe(gulp.dest(Config.html.dist)).pipe(reload({
      stream: true
    }))
  })

  /**
   *  assets 文件夹下所有文件处理
   */
  gulp.task('assets:dev', function () {
    return gulp.src(Config.assets.src).pipe(gulp.dest(Config.assets.dist)).pipe(reload({
      stream: true
    }))
  })

  /** 
   * CSS样式处理 
   */
  gulp.task('css:dev', function () {
    return gulp.src(Config.css.src).pipe(gulp.dest(Config.css.dist)).pipe(reload({
      stream: true
    }));
  });

  /** 
   * Less样式处理 
   */
  gulp.task('less:dev', function () {
    return gulp.src(Config.less.src).pipe(less()).pipe(gulp.dest(Config.less.dist)).pipe(reload({
      stream: true
    }));
  });
  /** 
   * js处理 
   */
  gulp.task('js:dev', function () {
    return gulp.src(Config.js.src).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(gulp.dest(Config.js.dist)).pipe(reload({
      stream: true
    }));
  });
  /** 
   * 图片处理 
   */
  gulp.task('images:dev', function () {
    return gulp.src(Config.img.src).pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })).pipe(gulp.dest(Config.img.dist)).pipe(reload({
      stream: true
    }));
  });

  gulp.task('dev', ['html:dev', 'css:dev', 'less:dev', 'js:dev', 'assets:dev', 'images:dev'], function () {
    browserSync.init({
      server: {
        baseDir: Config.dist,
        middleware: proxy
      },
      notify: false
    });
    // Watch .html files  
    gulp.watch(Config.html.src, ['html:dev']);
    // Watch .css files  
    gulp.watch(Config.css.src, ['css:dev']);
    // Watch .scss files  
    gulp.watch(Config.less.src, ['less:dev']);
    // Watch assets files  
    gulp.watch(Config.assets.src, ['assets:dev']);
    // Watch .js files  
    gulp.watch(Config.js.src, ['js:dev']);
    // Watch image files  
    gulp.watch(Config.img.src, ['images:dev']);
  })
}

//======= gulp dev 开发环境下 ===============
module.exports = dev