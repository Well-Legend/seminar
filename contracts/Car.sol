//SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;

contract CE_store{
    string car_ID;
    mapping(string => string) public critical_data;

    constructor() {
    }
    
    function write_ID(string memory input)  public {
        car_ID = input;
    }

    function read_ID() public view returns(string memory){
        return car_ID;
    }

    function write_data(string memory data) public{
        critical_data[car_ID] = data;
    } 

    function read_data()public view returns(string memory){
        return critical_data[car_ID];
    }
}
