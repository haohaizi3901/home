var gulp=require('gulp');
var browserify=require('browserify'); //打包脚本的库
var sequence=require('run-sequence'); //执行task的库
var fs=require('fs');
var watchify=require('watchify'); //在用browserify构建的时候监控文件的变化

//压缩文件
var uglify=require('gulp-uglify');
var source=require('vinyl-source-stream');
var buffer=require('vinyl-buffer');

//转换es6语法插件
var babel=require('gulp-babel'); 

gulp.task('default',function(){
    //执行task
    //sequence('mainjs','watch');
    sequence('babel','babelwatch','mainjs');
});

gulp.task('mainjs',function(){
   
    //编译文件
    //方法一
    //browserify().add('index.js').bundle().pipe(fs.createWriteStream('mian.js'));

    //方法二，用户wactchify
   var b= browserify({
       entries:['index.js'],
       cache:{},
       packageCache:{},
       plugin:[watchify]
   });
    
   var bundle=function(){
    b.bundle().pipe(fs.createWriteStream('mian.js'));
  

   //压缩文件
    //  b.bundle().pipe(source('main.js'))
    //  .pipe(buffer())
    //  .pipe(uglify())
    //  .pipe(gulp.dest('./js'));
   };
   bundle();
   b.on('update',bundle);

    

});

//定于监控任务
gulp.task('watch',function(){
    //监控文件变化
  gulp.watch(['*.js'],function(){
    sequence('mainjs');
  });  
});


//打包第三方的js类库
gulp.task('vendorjs',function(){
   var b=browserify().require('./bower_components/jquery/dist/jquery.js',{expose:'jquery'}).bundle().pipe
   (fs.createWriteStream('vendor.js'));

});

gulp.task('babel',function(){
   gulp.src('*.js')
   .pipe(babel({presets:["es2015"]}))
   .pipe(gulp.dest('./build/js/'));

});

//把es6语法转化成es5语法
gulp.task('babelwatch',function(){
   gulp.watch('*.js',function(){
       sequence('babel');
   })
});