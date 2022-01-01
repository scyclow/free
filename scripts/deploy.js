async function main() {
    const signers = await ethers.getSigners()
    owner = signers[0]
    compromised1 = signers[1]
    compromised2 = signers[2]

    // const IOUContract = '0x13178ab07a88f065efe6d06089a6e6ab55ae8a15'
    // const NVCMinterContract = '0x4f857a92269dc9b42edb7fab491679decb46e848'
    // const ArtBlocksContract = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'
    // const FastCashContract = '0xca5228d1fe52d22db85e02ca305cddd9e573d752'
    // const FreeBaseContract = '0x30b541f1182ef19c56a39634B2fdACa5a0F2A741'

    // const CompromisedMinterAddress = '0x666eBFf14e0ADB8F1924dFd93ded3193E3296543'
    // const CompromisedMinterPrivateKey = '46de7b34147d095d82956309036e8fdf1f9fb92909c92a3769b25353eaaad619'

    // const CompromisedTargetAddress = '0x888875AE23b266a3845e62BB528C4ce2C133c9Af'
    // const CompromisedTargetPrivateKey = '9f430d93a7c4661dc4c8d5552911d62dbd199a83d5b1f3dc9707f1518df0a65d'

    ///////////////////
    const IOUFactory = await ethers.getContractFactory('MockIOU', owner)
    IOU = await IOUFactory.deploy()
    await IOU.deployed()

    const NVCMinterFactory = await ethers.getContractFactory('MockNVCMinter', owner)
    NVCMinter = await NVCMinterFactory.deploy()
    await NVCMinter.deployed()

    const IOUContract = IOU.address
    const NVCMinterContract = NVCMinter.address
    const ArtBlocksContract = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'
    const FastCashContract = '0xca5228d1fe52d22db85e02ca305cddd9e573d752'

    /////////////////

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free1Factory = await ethers.getContractFactory('Free1', owner)
    Free1 = await Free1Factory.deploy(FreeBase.address)
    await Free1.deployed()

    const Free2Factory = await ethers.getContractFactory('Free2', owner)
    Free2 = await Free2Factory.deploy(FreeBase.address, Free1.address, IOUContract, NVCMinterContract)
    await Free2.deployed()

    const Free3Factory = await ethers.getContractFactory('Free3', owner)
    Free3 = await Free3Factory.deploy(FreeBase.address, 5000, 5100)
    await Free3.deployed()

    const Free4Factory = await ethers.getContractFactory('Free4', owner)
    Free4 = await Free4Factory.deploy(FreeBase.address, owner.address, owner.address, 'key', 'key')
    await Free4.deployed()

    const Free5Factory = await ethers.getContractFactory('Free5', owner)
    Free5 = await Free5Factory.deploy(FreeBase.address, ArtBlocksContract)
    await Free5.deployed()

    const Free6Factory = await ethers.getContractFactory('Free6', owner)
    Free6 = await Free6Factory.deploy(FreeBase.address, ArtBlocksContract, FastCashContract)
    await Free6.deployed()



    await FreeBase.connect(owner).createCollection(Free0.address, 'Free0 #', 'https://steviep.xyz/free', 'ipfs://bafybeifilrekoefi5dyukmqqno4yxssejqjf2zfl22x5cb3nicnvblfjmq', '', "If it's free, it's for me")
    await FreeBase.connect(owner).createCollection(Free1.address, 'Free1 #', 'https://steviep.xyz/free', 'ipfs://bafybeiebr7brzhpmqmsjyqvq33upahzzshbsy6obbeo36n7wih77lfsrqe', '', "The best things in life are free")
    await FreeBase.connect(owner).createCollection(Free2.address, 'Free2 #', 'https://steviep.xyz/free', 'ipfs://bafybeidbkyc7nmibhtrshv4fojmyikd237iq4d52j4aeju3of62sgrfaua', '', "Buy one get one free")
    await FreeBase.connect(owner).createCollection(owner.address, 'Free3 #', 'https://steviep.xyz/free', 'ipfs://bafybeifquyfm6k64njikzvwkfcrh4vffirv72xcwms664f3dgkfr4gfwga', '', "It's a free country")
    await FreeBase.connect(owner).createCollection(owner.address, 'Free4 #', 'https://steviep.xyz/free', 'ipfs://bafybeif27l3wntncxelgmhtffydy6vy7szszvcbcoiy5bptscl4ywhi2le', '', "Live free or die")
    await FreeBase.connect(owner).createCollection(Free5.address, 'Free5 #', 'https://steviep.xyz/free', 'ipfs://bafybeiedegcdza6jst4mqe5l3625inq3tsk47ylx67ls3hhibkadpiu2fq', '', "Free as in speech")
    await FreeBase.connect(owner).createCollection(Free6.address, 'Free6 #', 'https://steviep.xyz/free', 'ipfs://bafybeif4ox5w33jmr4hudklzotohq4fbyyxugkeeov4254rymplmcuwqvm', '', "Free as in beer")

    await Free0.connect(owner).claim()
    await Free1.connect(owner).claim(0)
    await Free2.connect(owner).claim(0, 0)
    await FreeBase.connect(owner).mint(3, owner.address)
    await FreeBase.connect(owner).mint(4, owner.address)
    await Free5.connect(owner).claim(0, 0, 0, 0)
    await Free6.connect(owner).claim(0, 0)

    await FreeBase.connect(owner).setMintingAddress(3, owner.address)
    await FreeBase.connect(owner).setMintingAddress(4, owner.address)

    console.log('Freebase:', FreeBase.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });