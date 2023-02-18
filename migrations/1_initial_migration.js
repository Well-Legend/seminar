// //Migrations
// const Migrations = artifacts.require("Migrations");
// module.exports = function(deployer) {
//   deployer.deploy(Migrations);
// };

//const { Module } = require("module");

// //HelloWorld
// const HelloWorld = artifacts.require("HelloWorld");
// module.exports = function(deployer) {
//   deployer.deploy(HelloWorld, 'HelloWorld!');
// };

// //Store_example
// const Store = artifacts.require("Store");
// module.exports = function(deployer){
//   deployer.deploy(Store);
// };

// //String_lib and String_lib_test
// const String_lib = artifacts.require("StringLib");
// const Str = artifacts.require("Str");
// module.exports = function(deployer){
//   deployer.deploy(String_lib);
//   deployer.link(String_lib, Str);
//   deployer.deploy(Str);
// };

//Resume
const String_lib = artifacts.require("StringLib");
const Resume = artifacts.require("Resume");
module.exports = function(deployer){
    deployer.deploy(String_lib);
    deployer.link(String_lib, Resume);
    deployer.deploy(Resume, 'Well', '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a', 21, 0);
};

// //Note
// const Note = artifacts.require("NoteContract");
// module.exports = function(deployer){
//     deployer.deploy(Note);
// };