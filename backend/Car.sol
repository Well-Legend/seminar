//SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;

contract CE_store{
    string car_ID;
    mapping(string => my_data[]) public critical_data;
    struct my_data{
        string Data;
        string timestamp;
    }

    constructor() {
    }
    
    function write_ID(string memory input)  public {
        car_ID = input;
    }

    function read_ID() public view returns(string memory){
        return car_ID;
    }

    function write_data(my_data memory data) public{
        critical_data[car_ID].push(data);
    } 

    function read_data(string memory input)public view returns(my_data[] memory){
        return critical_data[input];
    }
}
