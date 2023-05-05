pragma solidity ^0.5.0;

contract SponsorAnimals{
	address[8] public adopters;
	// Adopting a AnimalId
	
    function adopt(uint AnimalId) public returns (uint) {
  		require(AnimalId >= 0 && AnimalId <= 7);
  		adopters[AnimalId] = msg.sender;
  		return AnimalId;
	}
	// Retrieving the adopters
	function getAdopters() public view returns (address[8] memory) {
  		return adopters;
	}
}