// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Nft is ERC721 {
    struct NftProps {
        uint256 itemId;
        string name;
    }

    NftProps[] public nftItems;
    uint256 public tokenCounter;
    event requestedNft(uint256 indexed requestId, address requester);

    constructor() ERC721("New Nft", "MineLoop") {
        tokenCounter = 0;
    }

    function mintNft(string memory _itemName) public {
        require(
            keccak256(abi.encodePacked((_itemName))) !=
                keccak256(abi.encodePacked((""))),
            "Please Specify the name of an Item"
        );
        uint256 itemId = tokenCounter;
        _safeMint(msg.sender, itemId);
        nftItems.push(NftProps(itemId, _itemName));
        tokenCounter++;
        emit requestedNft(itemId, msg.sender);
    }

    function getAniwarItemOverView(uint256 _itemId)
        public
        view
        returns (string memory, uint256)
    {
        return (nftItems[_itemId].name, nftItems[_itemId].itemId);
    }

    function getTokenURI(uint256 _itemId) public view returns (string memory) {
        return tokenURI(_itemId);
    }

    function _burn(uint256 _itemId) internal override {
        super._burn(_itemId);
    }
}
