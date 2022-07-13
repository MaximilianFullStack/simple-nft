# Simple NFT Project

This is a simple nft project that uses openzepplin as a backbone. It has a set supply(1000), mint per person(3), and price to mint(0.05 ETH). It has three minting states: closed, allow list, and public. The contract allows the owner to input addresses into an allow list which will be able to mint separately from the general public. During any time (preferably after minting is complete), the owner has the abiliy to withdrawl all of the funds from the contract.

### URI

For implicity sake this project has a set URI for all tokens. However, the contract could easly be motified to have a secure and updatable URI to prevent minters from targeting the rarest assets.
