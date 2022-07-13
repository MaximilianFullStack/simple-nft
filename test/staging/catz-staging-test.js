const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Catz Staging Tests", function () {
          let catz, deployer
          const sValue = "50000000000000000" // 0.05 eth
          const sValue2X = "100000000000000000" // 0.1 eth
          const sValue3X = "150000000000000000" // 0.15 eth

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              catz = await ethers.getContract("Catz", deployer)
          })

          describe("The contract", async function () {
              it("functions on a real blockchain", async function () {
                  console.log("Setting up test...")
                  const accounts = await ethers.getSigners()
                  await catz.setAllowList([accounts[1]])
                  await catz.setMintStatus(1)
                  catz = catzContract.connect(accounts[1])
                  await catz.mintAllowList(1, { value: sValue })

                  catz = catzContract.connect(accounts[0])
                  await catz.setMintStatus(2)
                  catz = catzContract.connect(accounts[2])
                  await catz.mint(2, { value: sValue2X })
                  catz = catzContract.connect(accounts[3])
                  await catz.mint(3, { value: sValue3X })

                  catz = catzContract.connect(accounts[0])
                  await catz.setMintStatus(0)
                  await catz.withdrawl()

                  await new Promise(async (resolve, reject) => {
                      try {
                          const depBal = await catz.getUBal()
                          const u1 = await catz.balanceOf(accounts[1])
                          const u2 = await catz.balanceOf(accounts[2])
                          const u3 = await catz.balanceOf(accounts[3])
                          await assert(u1, "1")
                          await assert(u2, "2")
                          await assert(u3, "3")
                          await assert(depBal, sValue + sValue2X + sValue3X)
                          resolve()
                      } catch (e) {
                          console.log(e)
                          reject(error)
                      }
                  })
              })
          })
      })
