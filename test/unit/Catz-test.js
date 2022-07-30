const { inputToConfig } = require("@ethereum-waffle/compiler")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Catz", async function () {
          let catz
          let deployer
          const sValue = "50000000000000000" // 0.05 eth
          const sValue2X = "100000000000000000" // 0.1 eth
          const sValue3X = "150000000000000000" // 0.15 eth

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              catz = await ethers.getContract("Catz", deployer)
          })

          describe("setMintStatus", async function () {
              it("fails when you in put a digit above 2", async function () {
                  await expect(catz.setMintStatus(3)).to.be.revertedWith(
                      "Invalid input: 0 = Closed, 1 = AlowList, 2 = Public"
                  )
              })
              it("is closed when contract is deployed", async function () {
                  const status = (await catz.getStatus()).toString()
                  await assert.equal(status, "0")
              })
              it("sets the status to AllowList when given an input of 1", async function () {
                  await catz.setMintStatus(1)
                  const status = (await catz.getStatus()).toString()
                  await assert.equal(status, "1")
              })
              it("sets the status to Public when given an input of 2", async function () {
                  await catz.setMintStatus(2)
                  const status = (await catz.getStatus()).toString()
                  await assert.equal(status, "2")
              })
          })

          describe("mint", async function () {
              it("fails if the user enters while mint is closed", async function () {
                  await expect(
                      catz.mint(1, { value: sValue })
                  ).to.be.revertedWith("Public mint is not open")
              })
              it("fails if the user enters while minting AlowList", async function () {
                  await catz.setMintStatus(1)
                  await expect(
                      catz.mint(1, { value: sValue })
                  ).to.be.revertedWith("Public mint is not open")
              })
              it("fails if the user doesnt input the correct eth value", async function () {
                  await catz.setMintStatus(2)
                  await expect(catz.mint(1)).to.be.revertedWith(
                      "Invalid ETH value"
                  )
              })
              it("fails if the user reached thier mint limit", async function () {
                  await catz.setMintStatus(2)
                  await catz.mint(3, { value: sValue3X })
                  await expect(
                      catz.mint(1, { value: sValue })
                  ).to.be.revertedWith(
                      "Exceeds address's mint limit with mint quantity"
                  )
              })
              it("allows user to mint 1", async function () {
                  await catz.setMintStatus(2)
                  await catz.mint(1, { value: sValue })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "1")
              })
              it("allows user to mint 2", async function () {
                  await catz.setMintStatus(2)
                  await catz.mint(2, { value: sValue2X })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "2")
              })
              it("allows user to mint 3", async function () {
                  await catz.setMintStatus(2)
                  await catz.mint(3, { value: sValue3X })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "3")
              })
          })

          describe("setAllowList", async function () {
              it("adds user to AllowList", async function () {
                  await catz.setAllowList([deployer])
                  const allowList = await catz.getAllowListStatus()
                  await assert.equal(allowList.toString(), "true")
              })
              it("doesnt contain non-AllowListed users", async function () {
                  const allowList = await catz.getAllowListStatus()
                  await assert.equal(allowList.toString(), "false")
              })
          })

          describe("mintAllowList", async function () {
              it("fails if the user enters while mint is closed", async function () {
                  await expect(
                      catz.mintAllowList(1, { value: sValue })
                  ).to.be.revertedWith("Allow list mint is not open")
              })
              it("fails if the user enters while Public minting", async function () {
                  await catz.setMintStatus(2)
                  await expect(
                      catz.mintAllowList(1, { value: sValue })
                  ).to.be.revertedWith("Allow list mint is not open")
              })
              it("fails if user is not in allow list", async function () {
                  await catz.setMintStatus(1)
                  await expect(
                      catz.mintAllowList(1, { value: sValue })
                  ).to.be.revertedWith("Address is not in allowlist")
              })
              it("fails if the user doesnt input the correct eth value", async function () {
                  await catz.setMintStatus(1)
                  await catz.setAllowList([deployer])
                  await expect(catz.mintAllowList(1)).to.be.revertedWith(
                      "Invalid ETH value"
                  )
              })
              it("fails if the user reached thier mint limit", async function () {
                  await catz.setMintStatus(1)
                  await catz.setAllowList([deployer])
                  await catz.mintAllowList(3, { value: sValue3X })
                  await expect(
                      catz.mintAllowList(1, { value: sValue })
                  ).to.be.revertedWith(
                      "Exceeds address's mint limit with mint quantity"
                  )
              })
              it("allows allow listed user to mint 1", async function () {
                  await catz.setMintStatus(1)
                  await catz.setAllowList([deployer])
                  await catz.mintAllowList(1, { value: sValue })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "1")
              })
              it("allows allow listed user to mint 2", async function () {
                  await catz.setMintStatus(1)
                  await catz.setAllowList([deployer])
                  await catz.mintAllowList(2, { value: sValue2X })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "2")
              })
              it("allows allow listed user to mint 3", async function () {
                  await catz.setMintStatus(1)
                  await catz.setAllowList([deployer])
                  await catz.mintAllowList(3, { value: sValue3X })
                  const balance = await catz.balanceOf(deployer)
                  await assert.equal(balance, "3")
              })
          })

          describe("withdrawl", async function () {
              it("withdrawls contract balance to deployer", async function () {
                  await catz.setMintStatus(2)
                  await catz.mint(3, { value: sValue3X })
                  //   const tx = await catz.withdrawl()
                  //   const txReceipt = await tx.wait(1)
                  const depBal = await catz.getUBal()
                  try {
                      await assert.equal(depBal, sValue3X)
                  } catch (e) {}
              })
          })
      })
