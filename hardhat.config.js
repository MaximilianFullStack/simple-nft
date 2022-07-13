require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("dotenv").config()
require("hardhat-contract-sizer")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
            blockConfirmations: 1,
        },
        goerli: {
            chainId: 5,
            url: process.env.GOERLI_URL || "",
            accounts: [process.env.PRIVATE_KEY],
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        gasPrice: 100,
        noColors: true,
        outputFile: "gas-report.txt",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
        user2: {
            default: 2,
        },
        user3: {
            default: 3,
        },
    },
}
