// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**  @title Simple NFT Project
 *   @author MaximilianFullStack
 */
contract Catz is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    enum MintStatus {
        CLOSED,
        ALLOWLIST,
        PUBLIC
    }
    MintStatus Status;

    //constant variables
    string private constant URI =
        "ipfs://bafybeidd4a4gbpyn7ofhkmajjr4ab2gavg4m6g5raluomrlujnm37fc24e";

    uint256 public constant MAX_SUPPLY = 100;
    uint8 public constant MAX_MINT = 10;
    uint256 public constant MINT_PRICE = 0.005 ether;

    //allow list mapping
    mapping(address => bool) public isAllowListAddress;

    event MintStatusChange(MintStatus);

    constructor() ERC721("Catz", "CATZ") {
        Status = MintStatus.CLOSED;
    }

    //add addresses to allow list
    function setAllowList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            isAllowListAddress[addresses[i]] = true;
        }
    }

    //set mint state
    function setMintStatus(uint8 n) public onlyOwner {
        require(n < 3, "Invalid input: 0 = Closed, 1 = AlowList, 2 = Public");
        if (n == 0) {
            Status = MintStatus.CLOSED;
        }
        if (n == 1) {
            Status = MintStatus.ALLOWLIST;
        } else {
            Status = MintStatus.PUBLIC;
        }
        emit MintStatusChange(Status);
    }

    //allowlist mint
    function mintAllowList(uint8 quantity) public payable {
        uint256 ts = totalSupply();
        if (Status != MintStatus.ALLOWLIST) {
            revert("Allow list mint is not open");
        }

        require(isAllowListAddress[msg.sender], "Address is not in allowlist");

        if ((MINT_PRICE * quantity) != msg.value) {
            revert("Invalid ETH value");
        }
        if ((ts + quantity) > MAX_SUPPLY) {
            revert("Exceeds max supply with mint quantity");
        }
        if ((balanceOf(msg.sender) + quantity) > MAX_MINT) {
            revert("Exceeds address's mint limit with mint quantity");
        }

        for (uint8 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, ts + i);
        }
    }

    //overrides
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //public mint
    function mint(uint8 quantity) public payable {
        uint256 ts = totalSupply();
        if (Status != MintStatus.PUBLIC) {
            revert("Public mint is not open");
        }
        if ((MINT_PRICE * quantity) != msg.value) {
            revert("Invalid ETH value");
        }
        if ((ts + quantity) > MAX_SUPPLY) {
            revert("Exceeds max supply with mint quantity");
        }
        if ((balanceOf(msg.sender) + quantity) > MAX_MINT) {
            revert("Exceeds address's mint limit with mint quantity");
        }

        for (uint8 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, ts + i);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        "/",
                        (tokenId + 1).toString(),
                        ".json"
                    )
                )
                : "";
    }

    function _baseURI() internal view override returns (string memory) {
        return URI;
    }

    //withdrawl
    function withdrawl() public onlyOwner {
        uint256 _balance = address(this).balance;
        payable(msg.sender).transfer(_balance);
    }

    //view
    function getStatus() public view returns (MintStatus) {
        return Status;
    }

    function getAllowListStatus() public view returns (bool) {
        return isAllowListAddress[msg.sender];
    }

    function getUBal() public view returns (uint256) {
        return address(msg.sender).balance;
    }
}
