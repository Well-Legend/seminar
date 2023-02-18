// SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;

contract HelloWorld{
    string public message;
    constructor(string memory text) {
        message = text;
    }

    function print(string memory name) public pure returns (string memory){
        return name;
    }

    function alert() public view returns (string memory){
        return message;
    }
}