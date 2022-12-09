const dotenv = require("dotenv").config();
const gnodemon = require('gulp-nodemon');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const { watch, task, series, dest } = require('gulp');

task('devel', async () => {
    gnodemon({
      script: "server.js",
      require: '.env',
      ignore: [ 'node_modules/**',
                'sessions/**',
                'uploads/**'
              ],
      ext: 'css js ejs',
      verbose: true,
      watch: [ 
               '*.js',
               './*.js',
               './**/*.js',
               './**/**/*.js',
                './public/*',
               './views/**/*.ejs',
               './config/*.*'
            ],
      env: {'NODE_ENV': 'development'}
    });
})

task('browserify', function() {
  return browserify('pub/js/bundle_lib.js')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(dest('pub/js/'));
});

task('production', async () => {
  gnodemon({
    script: "server.js",
    require: '.env',
    ignore: ['node_modules/**','views/**/**','./public/**/*.*'],
    ext: 'css js pug',
    verbose: true,
    watch: [ '*.js',
             './*.js',
             './**/*.js',
             './**/**/*.js',
             // './public/css/*.css',
             //'./views/**/*.pug',
             './config/*.*'
          ],
    env: {'NODE_ENV': 'production'}
  });
})

task('dev', series('browserify','devel'));
task('default', series('browserify','devel'));