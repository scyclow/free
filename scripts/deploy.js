async function main() {
    const [centralBanker, platform, charity, ...signers] = await ethers.getSigners();
    const FastCashMoneyPlus = await ethers.getContractFactory('FastCashMoneyPlus', centralBanker);
    const DiscountFastCash = await ethers.getContractFactory('DiscountFastCash', centralBanker);

    const deployedFastCashContract = await FastCashMoneyPlus.deploy();
    await deployedFastCashContract.deployed();


    const deployedDiscountFastCashContract = await DiscountFastCash.deploy(deployedFastCashContract.address, platform.address, charity.address);
    await deployedDiscountFastCashContract.deployed();


    await deployedFastCashContract.connect(centralBanker).transferFromBank(deployedDiscountFastCashContract.address, ethers.utils.parseEther('1'))
    await deployedFastCashContract.connect(centralBanker).transferFromBank(deployedDiscountFastCashContract.address, ethers.utils.parseEther('1'))
    await deployedFastCashContract.connect(centralBanker).transferFromBank(deployedDiscountFastCashContract.address, ethers.utils.parseEther('1'))



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });