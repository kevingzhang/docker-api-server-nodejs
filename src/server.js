/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/protos/docker.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var docker_proto = grpc.loadPackageDefinition(packageDefinition).docker_pb;
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

/**
 * Implements the SayHello RPC method.
 */
function getDockerInfo(call, callback) {
  console.log(`Incoming request getDockerInfo path:${call.request.path}`);
  docker.info((err, info)=>{
    if(call.request.path){
      callback(null, {info: info[path]});
    }else{
      callback(null, {info});
    }
    
  });
  
}
function getDockerImages(call, callback){
  console.log(`Incoming request getDockerImages req:${call.request.req}`);
  docker.listImages((err, data)=>{
    callback(null, {images:data})
  })
  
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(docker_proto.GetDocker.service, {GetDockerInfo: getDockerInfo, GetDockerImages: getDockerImages});
  const endpoint = '0.0.0.0:50051';
  server.bind(endpoint, grpc.ServerCredentials.createInsecure());
  console.log(`listening to ${endpoint} ...`);
  server.start();
}

main();
