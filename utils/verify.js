const { run } = require("hardhat")

const verify = async (contractAddress) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArgs: [],
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verfied!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
