var grunt = require('grunt');

grunt.loadNpmTasks('grunt-aws-lambda');
grunt.loadNpmTasks('grunt-aws-s3');

grunt.initConfig({
  aws_s3: {
    options: {
      region: 'eu-central-1',
      uploadConcurrency: 5, // 5 simultaneous uploads
      downloadConcurrency: 5, // 5 simultaneous downloads
    },
    staging: {
      options: {
        bucket: 'together-pact',
        differential: true, // Only uploads the files that have changed
        params: {
          ContentEncoding: 'gzip',
        }
      },
      files: [
        {dest: 'pacts/', cwd: 'pacts/', action: 'download'},
      ]
    }
  },
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
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])
