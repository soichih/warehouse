const fs = require('fs');
const winston = require('winston');
const timeout = require('callback-timeout');
const child_process = require('child_process');

const mkdirp = require('mkdirp'); //for dc2
const pkgcloud = require('pkgcloud');

exports.mongodb = "mongodb://localhost/warehouse";

//used to post/poll health status from various services
exports.redis = {
    server: "localhost",
    //port: 6379,
}

exports.wf = {
    api: "https://dev1.soichi.us/api/wf",
}

exports.auth = {
    api: "https://dev1.soichi.us/api/auth",
    
    //jwt used to request auth service to issue new user jwt to be used to submit tasks for the user
    //~/git/auth/bin/auth.js issue --scopes '{ "sca": ["admin"] }' --sub 'warehouse'
    jwt: fs.readFileSync(__dirname+'/auth.jwt', 'ascii').trim(),
}

exports.warehouse = {
    //used by rule handler to submit dataset download request
    api: "https://dev1.soichi.us/api/warehouse",
}

//for archive service
exports.archive = {
    //remporary path used to store downloaded datasets before shipping to hsi
    tmp: "/mnt/scratch/hayashis/archive-tmp",
}

//for event handler
exports.event = {
    amqp: {
        url: "amqp://warehouse:gowarehouse123@localhost:5672/brainlife"
    },
}

//for rule handler
exports.rule = {
    max_task_per_rule: 30, //limit number of concurrently running tasks submission
}

exports.express = {
    port: 12501,
    //public key used to validate jwt token
    pubkey: fs.readFileSync('/home/hayashis/git/auth/api/config/auth.pub'),
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//  storage system where we can archive data
exports.storage_systems = {};

/*
//pick default storage
exports.storage_default = function() {
    return "jetstream";
}
*/

//
//  jetstream
//  //https://github.com/pkgcloud/pkgcloud/blob/master/examples/storage/rackspace.js
//
const js_config = require(__dirname+'/jetstream');
const js_storage = pkgcloud.storage.createClient(js_config);
exports.storage_systems.jetstream = {
    //TODO..
    test: cb=>{
        js_storage.getContainers((err,containers)=>{
            if(err) return cb(err);
            //console.dir(containers);
            cb();
        }); 
    },
    stat: (dataset, cb)=>{
        var name = dataset.project.toString();
        js_storage.getFile(name, dataset._id+'.tar.gz', (err,_stats)=>{
            if(err) return cb(err);
            cb(null, {
                size: _stats.size,
                mtime: _stats.lastModified,
            });
        });
    },
    upload: (dataset, cb)=>{
        //make sure container exists (if it exists, it's noop)
        var name = dataset.project.toString();
        console.log("creating container", name);
        js_storage.createContainer({
            name: name,
            metadata: {
                //TODO..
                //project_name:  
            },
        }, (err, container)=> {
            if(err) return cb(err);
            var stream = js_storage.upload({container: name, remote: dataset._id+'.tar.gz'});
            cb(null, stream);
        });
    },
    download: (dataset, cb)=>{
        var name = dataset.project.toString();
        var stream = js_storage.download({container: name, remote: dataset._id+'.tar.gz'});
        cb(null, stream);
    },
}

//
//  dc2
//
const dc2_path = "/mnt/dc2/projects/brainlife/dev1-warehouse/datasets/";
exports.storage_systems.dc2 = {
    //return archive_stream to pipe data to
    upload: (dataset, cb)=>{
        var dir = dc2_path+dataset.project;
        mkdirp(dir, (err)=>{
            if(err) return cb(err);
            cb(null, fs.createWriteStream(dir+'/'+dataset._id+'.tar.gz'));
        });
    },
    stat: (dataset, cb)=>{
        var dir = dc2_path+dataset.project;
        fs.stat(dir+'/'+dataset._id+'.tar.gz', cb);
    },
    download: (dataset, cb)=>{
        var dir = dc2_path+dataset.project;
        var stream = fs.createReadStream(dir+'/'+dataset._id+'.tar.gz');
        cb(null, stream);
    },
    test: cb=>{
        fs.stat(dc2_path, timeout((err,stats)=>{
            if(err) return cb(err);
            if(!stats.isDirectory()) return cb(new Error("datasets directory is not a directory")); 
            cb();
        }, 2000, 'failed to stat '+dc2_path)); 
    }, 
} 

//dcwan/hcp (read only)
const dcwan_hcp_path = "/mnt/dcwan/projects/brainlife/hcp/";
exports.storage_systems["dcwan/hcp"] = {
    //return archive_stream to pipe data to
    upload: (dataset, cb)=>{
        cb("no upload to dcwan/hcp");
    },
    stat: (dataset, cb)=>{
        //can't obtain stats for .tar.gz because we are creating it on the fly
        //but I can still check for the directory to exist and respond error
        var dir = dcwan_hcp_path+dataset.storage_config.subdir;
        fs.stat(dir, (err,stats)=>{
            //stats is for the directory.. so I can't return it
            cb(err, null); 
        });
    },
    download: (dataset, cb)=>{
        var dir = dcwan_hcp_path+dataset.storage_config.subdir;
        var child = child_process.spawn("tar", ["hc", "."], {cwd: dir});
        cb(null, child.stdout, dataset._id+".tar");
        child.stderr.on('data', function(data) {
            console.error(data.toString());
        });
        child.on('error', (err)=>{
            console.error(err);
        });
    },
    test: cb=>{
        fs.stat(dcwan_hcp_path, timeout((err,stats)=>{
            if(err) return cb(err);
            if(!stats.isDirectory()) return cb(new Error("datasets directory is not a directory")); 
            cb();
        }, 2000, 'failed to stat '+dcwan_hcp_path)); 
    }, 
}

exports.logger = {
    winston: {
        //hide headers which may contain jwt
        requestWhitelist: ['url', 'method', 'httpVersion', 'originalUrl', 'query'],
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    var d = new Date();
                    if(process.env.NODE_APP_INSTANCE) {
                        return process.env.NODE_APP_INSTANCE + "> "+ d.toString();
                    } else {
                        return d.toString();
                    }
                },
                level: 'debug',
                colorize: true
            }),
        ]
    },
}

