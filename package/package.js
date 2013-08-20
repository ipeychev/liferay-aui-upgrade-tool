(function() {
    'use strict';

    var fs = require('fs-extra'),
        http = require('http-get'),
        path = require('path'),
        program = require('commander'),
        targz = require('tar.gz'),
        YUI = require('yui').YUI,

        uri = {
            gnu32: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x86.tar.gz',
            gnu64: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x64.tar.gz',
            osx32: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x86.tar.gz',
            osx64: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x64.tar.gz',
            win32: 'http://nodejs.org/dist/v{version}/node.exe',
            win64: 'http://nodejs.org/dist/v{version}/x64/node.exe'
        },
        version;

    program
        .option('-n, --nodejs [nodejs version]', 'The version of NodeJS to wrap [0.10.16] by default', '0.10.16')
        .option('-d, --dist [destination folder]', 'The dist folder in which package should be created [dist] by default', path.resolve(__dirname, '../dist'))
        .option('-p, --platform [build platform]', 'The platform, on which NodeJS should run ["win32", "win64", "osx32", "osx64", "gnu32", "gnu64"]', function(value) {
            value = value.split(',');

            return value.map(
                function(item) {
                    return item.trim();
                }
            );
        }, ['win32', 'win64', 'osx32', 'osx64', 'gnu32', 'gnu64'])
        .version('0.0.1')
        .parse(process.argv);

    // download all dist files for the specified platforms

    YUI().use('promise', function(Y) {
        var outputDir;

        // create temp directory
        outputDir = path.resolve(program.dist, 'temp');

        fs.removeSync(outputDir);

        fs.mkdirsSync(outputDir);

        program.platform.forEach(
            function(platform) {
                var fileName,
                    platformURI,
                    request;

                platformURI = uri[platform];

                if (platformURI) {
                    platformURI = platformURI.replace(/\{version\}/g, program.nodejs);

                    fileName = path.resolve(outputDir + path.sep + platformURI.substring(platformURI.lastIndexOf(path.sep)));

                    console.log(platformURI);

                    request = http.get(platformURI, fileName, function(fileName, platformURI, error, result) {
                        var dirToWrap,
                            dirToWrapBin,
                            dirToWrapData,
                            extractedFileName,
                            tgz;

                        // file has been downloaded, extract it, if not Windows, copy it if so
                        extractedFileName = path.resolve(fileName + '_extracted');

                        fs.removeSync(extractedFileName);

                        fs.mkdirsSync(extractedFileName);

                        if (platform.indexOf('win') !== 0) {
                            console.log(extractedFileName);

                            tgz = new targz().extract(fileName, extractedFileName, function(error){
                                debugger;
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    console.log('The extraction has ended!');

                                    dirToWrap = path.resolve(fileName + '_wrapped');

                                    console.log(dirToWrap);

                                    dirToWrapBin = path.resolve(dirToWrap + '/bin');

                                    console.log(dirToWrapBin);

                                    dirToWrapData = path.resolve(dirToWrap + '/data');

                                    console.log(dirToWrapData);

                                    fs.mkdirsSync(dirToWrapBin);

                                    fs.createFileSync(path.resolve(dirToWrapBin + path.sep + 'run.sh'));

                                    fs.mkdirsSync(dirToWrapData);

                                    fs.copy(extractedFileName, dirToWrap, function(error) {
                                        if (error) {
                                            console.error(error);
                                        }
                                        else {
                                            fs.copy()

                                            console.log('Creating wrapped tar.gz file');

                                            tgz.compress(dirToWrap, path.resolve(program.dist + '/lut' + '_' + platform + '.tar.gz'), function(error) {

                                                if (error) {
                                                    console.log(error);
                                                }
                                                else {
                                                    console.log('The compression has ended!');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            console.log('');
                        }
                    }.bind(this, fileName, platformURI));
                }
                else {
                    console.log('Unsupported platform: ' + platform);
                }
            }
        );
    });
}());