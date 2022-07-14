const { Signer } = require("ethers")
const { ethers, getNamedAccounts, deployments } = require("hardhat")

const batchMint = async () => {
    let deployer, catz, minter
    const accounts = await ethers.getSigners()
    deployer = (await getNamedAccounts()).deployer
    catz = await ethers.getContract("Catz", deployer)
    await catz.setMintStatus(2)
    const trippleMint = "150000000000000000"
    const quantity = "3"
    const mintvalue = ethers.utils.formatEther(trippleMint)

    for (i = 0; i < accounts.length; i++) {
        console.log(`Minting with ${accounts[i].address}`)
        console.log("Preparing batch mint...")
        console.log(`Atempting to mint ${quantity} NFTs.`)
        console.log(`With a total cost of ${mintvalue} ETH.`)

        await catz.connect(accounts[i]).mint(3, { value: trippleMint })
        try {
            if ((await catz.balanceOf(accounts[i].address)) == quantity) {
                console.log(
                    `Successfully minted ${quantity} NFTs on account ${accounts[i].address}.`
                )
            } else {
                console.log("Mint Unsucessfull...")
            }
        } catch (e) {
            console.log(e)
        }
    }
}
batchMint().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
