var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-npm-install');

grunt.initConfig({
  lambda_invoke: {
    default: {
      options: {
        file_name: 'index.js',
      }
    }
  },
  lambda_deploy: {
    default: {
      function: 'TogetherTest',
      options: {
        region: 'eu-central-1',
        enableVersioning: true,
        aliases: 'beta',
        timeout: 30
      }
    }
  },
  lambda_package: {
    default: {
      options: {
      }
    }
  },
  mochaTest: {
    test: {
      options: {
        require: ['./node_modules/pact-js-mocha/src/index.js', './test/specHelper.js'],
      },
      src: ['test/**/*.js']
    }
  }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])
grunt.registerTask('test', ['npm-install:pact-js-mocha', 'mochaTest']);
