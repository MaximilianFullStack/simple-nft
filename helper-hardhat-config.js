const networkConfig = {
    4: {
        name: "rinkeby",
    },
    5: {
        name: "goerli",
    },
    1337: {
        name: "hardhat",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
