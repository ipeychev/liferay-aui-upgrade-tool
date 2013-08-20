(function() {
    'use strict';

    var fs = require('fs-extra'),
        http = require('http-get'),
        path = require('path'),
        program = require('commander'),
        targz = require('tar.gz'),

        outputDir,
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
        .option('-d, --dist [destination folder]', 'The dist folder in which package should be created [dist] by default', __dirname + '../dist')
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

    // create temp directory
    outputDir = path.normalize(__dirname + path.sep + 'temp');

    fs.removeSync(outputDir);

    fs.mkdirsSync(outputDir);

    // download all dist files for the specified platforms

    program.platform.forEach(
        function(platform) {
            var fileName,
                platformURI,
                request;

            platformURI = uri[platform];

            if (platformURI) {
                platformURI = platformURI.replace(/\{version\}/g, program.nodejs);

                fileName = path.normalize(outputDir + path.sep + platformURI.substring(platformURI.lastIndexOf(path.sep)));

                console.log(platformURI);

                request = http.get(platformURI, fileName, function(fileName, platformURI, error, result) {
                    debugger;
                    var dirToWrap,
                        dirToWrapBin,
                        dirToWrapData,
                        extractedFileName,
                        tgz;

                    // file has been downloaded, extract it, if not Windows, copy it if so
                    extractedFileName = path.normalize(fileName + '_extracted');

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

                                dirToWrap = path.normalize(outputDir + path.sep + fileName + '_wrapped');

                                dirToWrapBin = dirToWrap + '/bin';
                                dirToWrapData = dirToWrap + '/bin';

                                fs.mkdirsSync(dirToWrapBin);

                                fs.createFileSync(path.normalize(dirToWrapBin + path.sep + 'run.sh'));

                                fs.mkdirsSync(dirToWrapData);

                                fs.copy(extractedFileName, dirToWrapData, function(error) {
                                    if (error) {
                                        console.error(error);
                                    }
                                    else {
                                        console.log('Creating wrapped tar.gz file');

                                        tgz.compress(dirToWrap, path.normalize(program.dist + '/lut' + '_' + platform + '.tar.gz'), function(error){

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
}());