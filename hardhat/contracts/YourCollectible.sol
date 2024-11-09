// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2; //Do not change the solidity version as it negatively impacts submission grading

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./verifier.sol";

contract YourCollectible is
	ERC721,
	ERC721Enumerable,
	ERC721URIStorage,
	Ownable
{
	using Counters for Counters.Counter;

	Counters.Counter public tokenIdCounter;

	Verifier public verifierContract;

	constructor() ERC721("YourCollectible", "YCB") {verifierContract = new Verifier();}

	function _baseURI() internal pure override returns (string memory) {
		return "";
	}

	modifier withProof(Verifier.Proof memory proof, uint[2] memory input, uint[2] memory proof_commitment) {
		require(verifierContract.verifyTx(proof, input, proof_commitment), "Valid proof required in order to mint");
		_;
	}

	modifier checkInputs(uint256 witness, bytes memory userData, uint32[8] memory memRootBefore, uint32[8] memory memRootAfter) {
		require(witness == verifierContract.calculatePublicInput(userData, memRootBefore, memRootAfter), "Invalid witness");
		_;
	}

	modifier checkDuplicateSubmission(bytes memory userData, uint32[8] memory memRootBefore, uint32[8] memory memRootAfter) {
		string memory newHash = Strings.toString(verifierContract.calculatePublicInput(userData, memRootBefore, memRootAfter));
		for (uint256 i = 0; i < tokenIdCounter.current(); i++) 
			require(keccak256(abi.encodePacked(newHash)) != keccak256(abi.encodePacked(tokenURI(i))), "Duplicate submission");
		_;		
	}

	function mintItem(address to, Verifier.Proof memory proof, uint[2] memory input, uint[2] memory proof_commitment, bytes memory userData, uint32[8] memory memRootBefore, uint32[8] memory memRootAfter) 
		public withProof(proof, input, proof_commitment) checkInputs(input[0], userData, memRootBefore, memRootAfter) checkDuplicateSubmission(userData, memRootBefore, memRootAfter) returns (uint256)  {
		tokenIdCounter.increment();
		uint256 tokenId = tokenIdCounter.current() - 1;
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, Strings.toString(verifierContract.calculatePublicInput(userData, memRootBefore, memRootAfter)));
		return tokenId;
	}

	// The following functions are overrides required by Solidity.

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 quantity
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId, quantity);
	}

	function _burn(
		uint256 tokenId
	) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721, ERC721Enumerable, ERC721URIStorage)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
