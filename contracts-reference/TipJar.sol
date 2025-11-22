// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TipJar is ReentrancyGuard {
    struct Tip {
        address tipper;
        address creator;
        uint256 amount;
        address token;
        uint256 timestamp;
    }
    
    mapping(address => uint256) public totalTipsReceived;
    mapping(address => Tip[]) public creatorTips;
    
    event TipSent(
        address indexed tipper,
        address indexed creator,
        uint256 amount,
        address indexed token,
        uint256 timestamp
    );
    
    function tipWithToken(
        address creator,
        address token,
        uint256 amount
    ) external nonReentrant {
        require(creator != address(0), "Invalid creator address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).transferFrom(msg.sender, creator, amount);
        
        totalTipsReceived[creator] += amount;
        
        creatorTips[creator].push(Tip({
            tipper: msg.sender,
            creator: creator,
            amount: amount,
            token: token,
            timestamp: block.timestamp
        }));
        
        emit TipSent(msg.sender, creator, amount, token, block.timestamp);
    }
    
    function tipWithETH(address creator) external payable nonReentrant {
        require(creator != address(0), "Invalid creator address");
        require(msg.value > 0, "Amount must be greater than 0");
        
        (bool success, ) = creator.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        totalTipsReceived[creator] += msg.value;
        
        creatorTips[creator].push(Tip({
            tipper: msg.sender,
            creator: creator,
            amount: msg.value,
            token: address(0),
            timestamp: block.timestamp
        }));
        
        emit TipSent(msg.sender, creator, msg.value, address(0), block.timestamp);
    }
    
    function getCreatorTips(address creator) external view returns (Tip[] memory) {
        return creatorTips[creator];
    }
    
    function getTotalTipsReceived(address creator) external view returns (uint256) {
        return totalTipsReceived[creator];
    }
}
