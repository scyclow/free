async function main() {
    const [
      owner,
      notOwner,
    ] = await ethers.getSigners()

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    const FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const FreeERC20Factory = await ethers.getContractFactory('FreeERC20', owner)
    const FreeERC20 = await FreeERC20Factory.deploy(FreeBase.address)
    await FreeERC20.deployed()

    const FreeERC1155Factory = await ethers.getContractFactory('FreeERC1155', owner)
    const FreeERC1155 = await FreeERC1155Factory.deploy(FreeBase.address)
    await FreeERC1155.deployed()

    await FreeERC20.connect(owner).connectERC1155(FreeERC1155.address, 0)
    await FreeERC1155.connect(owner).connectERC20(FreeERC20.address, 0)

    await FreeERC20.connect(owner).mint(owner.address, 1000)
    await FreeERC20.connect(owner).transfer(notOwner.address, 25)

    console.log('FreeBase:', FreeBase.address)
    console.log('FreeERC20:', FreeERC20.address)
    console.log('FreeERC1155:', FreeERC1155.address)
    console.log('owner:', owner.address)
    console.log('notOwner:', notOwner.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });