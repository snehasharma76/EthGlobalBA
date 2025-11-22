// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CreatorToken.sol";

contract CreatorTokenFactory {
    mapping(address => address) public creatorToToken;
    mapping(address => bool) public hasToken;
    
    event TokenCreated(address indexed creator, address indexed token, string name, string symbol);
    
    function createCreatorToken(string memory username) external returns (address) {
        require(!hasToken[msg.sender], "Creator already has a token");
        
        string memory name = string(abi.encodePacked(username, " Token"));
        string memory symbol = string(abi.encodePacked(
            "CR",
            _substring(username, 0, 4)
        ));
        
        CreatorToken token = new CreatorToken(name, symbol, msg.sender);
        address tokenAddress = address(token);
        
        creatorToToken[msg.sender] = tokenAddress;
        hasToken[msg.sender] = true;
        
        emit TokenCreated(msg.sender, tokenAddress, name, symbol);
        
        return tokenAddress;
    }
    
    function getCreatorToken(address creator) external view returns (address) {
        return creatorToToken[creator];
    }
    
    function _substring(string memory str, uint256 startIndex, uint256 length) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(length);
        
        uint256 end = startIndex + length;
        if (end > strBytes.length) {
            end = strBytes.length;
        }
        
        for (uint256 i = startIndex; i < end; i++) {
            result[i - startIndex] = strBytes[i];
        }
        
        return string(result);
    }
}
