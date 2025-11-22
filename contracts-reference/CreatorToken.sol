// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorToken is ERC20, Ownable {
    address public creator;
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    
    constructor(
        string memory name,
        string memory symbol,
        address _creator
    ) ERC20(name, symbol) Ownable(_creator) {
        creator = _creator;
        _mint(_creator, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
