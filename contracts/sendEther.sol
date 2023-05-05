pragma solidity ^0.8.0;

contract SendEther {

    function sendEther(address payable _recipient) public payable {
        _recipient.transfer(msg.value);
    }
    
}