const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const catz = await deploy("Catz", {
        from: deployer,
        gasLimit: 10000000,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(catz.address)
    }
}

module.exports.tags = ["all", "catz"]
