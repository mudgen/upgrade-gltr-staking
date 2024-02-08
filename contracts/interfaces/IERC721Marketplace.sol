// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

address constant AAVEGOTCHI_DIAMOND = 0x86935F11C86623deC8a25696E1C19a8659CbF95d;

interface IERC721Marketplace {
    ///@param _owner Owner of the ERC721 token
    function updateERC721Listing(address _erc721TokenAddress, uint256 _erc721TokenId, address _owner) external;
}