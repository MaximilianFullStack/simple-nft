const { ethers, getNamedAccounts, deployments } = require("hardhat")

let catz, deployer, status
let loop = 0

const loopTracker = async () => {
    if (loop < 601) {
        loop++
        console.log(`Iteration: ${loop}.`)
        setTimeout(() => {
            batchMint()
        }, 100)
    } else {
        console.log("Loop limit reached.")
    }
}

const batchMint = async () => {
    deployer = (await getNamedAccounts()).deployer
    catz = await ethers.getContract("Catz", deployer)
    const accounts = await ethers.getSigners()
    const trippleMint = "150000000000000000"
    const quantity = "3"
    const mintvalue = ethers.utils.formatEther(trippleMint)

    console.log("Checking status...")
    status = (await catz.getStatus()).toString()
    if (status == "2") {
        console.log("Preparing batch mint...")
        for (i = 0; i < accounts.length; i++) {
            console.log(`Minting with ${accounts[i].address}`)
            console.log(`Atempting to mint ${quantity} NFTs...`)
            console.log(`With a total cost of ${mintvalue} ETH.`)

            try {
                await catz.connect(accounts[i]).mint(3, { value: trippleMint })
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
    } else {
        console.log("Status not public, trying again...")
        loopTracker()
    }
}

const start = async () => {
    console.log("Starting Batch Mint V1.0.")
    batchMint()
}
start()
