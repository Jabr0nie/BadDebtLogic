//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    constructor(uint256 _storedData) {
        storedData = _storedData;
    }

    function set(uint256 _storedData) public {
        storedData = _storedData;
    }
}