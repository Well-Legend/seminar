//SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;

contract Store{
    struct goods_count{
        uint candy;
        uint cookie;
        uint bread;
    }

    goods_count internal stock;
    constructor(){
        stock = goods_count({
            candy: 100,
            cookie: 100,
            bread: 100
        });
    }

    function reduce(string memory name, uint quantity) internal{
        bytes32 input_name = keccak256(bytes(name));
        bytes32[3] memory goods_list = [keccak256(bytes("candy")), keccak256(bytes("cookie")), keccak256(bytes("bread"))];

        if(input_name == goods_list[0] && stock.candy >= quantity){
            stock.candy -= quantity;
        }
        else if(input_name == goods_list[1] && stock.cookie >= quantity){
            stock.cookie -= quantity;
        }
        else if(input_name == goods_list[2] && stock.bread >= quantity){
            stock.bread -= quantity;
        }
        else{
            revert("Stock is undefined or is not enough.");
        }
    }

    function raise(string memory name, uint quantity) internal{
        bytes32 input_name = keccak256(bytes(name));
        bytes32[3] memory goods_list = [keccak256(bytes("candy")), keccak256(bytes("cookie")), keccak256(bytes("bread"))];

        if(input_name == goods_list[0]){
            stock.candy += quantity;
        }
        else if(input_name == goods_list[1]){
            stock.cookie += quantity;
        }
        else if(input_name == goods_list[2]){
            stock.bread += quantity;
        }
    }
}


