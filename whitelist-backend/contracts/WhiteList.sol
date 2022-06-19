// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract WhiteList {
    uint8 public s_maxWhiteListedAddresses;
    uint8 public s_numAddressesWhiteListed;

    mapping(address => bool) public s_whiteListedAddress;

    constructor(uint8 _maxWhiteListedAddresses) {
        s_maxWhiteListedAddresses = _maxWhiteListedAddresses;
    }

    function addAddressToWhiteList() external {
        require(!s_whiteListedAddress[msg.sender], "Sender already in whitelist");
        require(
            s_numAddressesWhiteListed < s_maxWhiteListedAddresses,
            "Maximum limit of whitelist exceeded"
        );
        s_whiteListedAddress[msg.sender] = true;
        s_numAddressesWhiteListed += 1;
    }
}
