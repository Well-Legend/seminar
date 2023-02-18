//SPDX-License-Indetifier: MIT
pragma solidity ^0.8.17;

import "./String_lib.sol";

contract Str {
  function strCompare(string memory s, string memory t) public pure returns (bool) {
    return StringLib.compare(s, t);
  }
}