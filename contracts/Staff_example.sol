//SPDX-License-Inetifier: MIT
pragma solidity ^0.8.17;

import "./Store_example.sol";

contract Staff is Store {
    
    function sell(string memory name, uint quantity) public{
        reduce(name, quantity);
    }

    function purchase(string memory name, uint quantity) public{
        raise(name, quantity);
    }

    function show_stocks() external view returns(uint, uint, uint){
        return(stock.candy, stock.cookie, stock.bread);
    }
}