const { ethers, getNamedAccounts } = require("hardhat")

const set = async () => {
    deployer = (await getNamedAccounts()).deployer
    catz = await ethers.getContract("Catz", deployer)
    await catz.setMintStatus(2)
    console.log("Status set to public.")
}
set()
