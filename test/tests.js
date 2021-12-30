const { expect } = require("chai")
const { time } = require('@openzeppelin/test-helpers');

const expectFailure = async (fn, err) => {
  let failure
  try {
    await fn()
  } catch (e) {
    failure = e
  }
  expect(failure?.message || '').to.include(err)
}

const num = n => Number(ethers.utils.formatEther(n))
const uint = n => Number(n)
const parseMetadata = metadata => JSON.parse(Buffer.from(metadata.split(',')[1], 'base64').toString('utf-8'))


xdescribe('Base Free Contract', () => {
  it('minting should work', async () => {
    const [
      _, __,
      owner1,
      owner2,
      ...signers
    ] = await ethers.getSigners()
    const FreeBaseFactory = await ethers.getContractFactory('Free', owner1)
    const FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner1)
    const Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()


    await FreeBase.connect(owner1).createCollection(owner1.address, '', '', '', '', '')
    await FreeBase.connect(owner1).createCollection(owner2.address, '', '', '', '', '')

    await FreeBase.connect(owner1).mint(0, owner1.address)
    await FreeBase.connect(owner1).mint(0, owner1.address)
    await FreeBase.connect(owner2).mint(1, owner1.address)

    await expectFailure(() =>
      FreeBase.connect(owner2).mint(0, owner2.address),
      'Caller is not the minting address'
    )

    await expectFailure(() =>
      FreeBase.connect(owner1).mint(1, owner1.address),
      'Caller is not the minting address'
    )


    await FreeBase.connect(owner1).setMintingAddress(0, Free0.address)
    await Free0.connect(owner1).claim()
    await Free0.connect(owner2).claim()

    await expectFailure(() =>
      FreeBase.connect(owner1).mint(0, owner1.address),
      'Caller is not the minting address'
    )

    expect(await FreeBase.connect(owner1).tokenIdToCollectionId(0)).to.equal(0)
    expect(await FreeBase.connect(owner1).tokenIdToCollectionId(1)).to.equal(0)
    expect(await FreeBase.connect(owner1).tokenIdToCollectionId(2)).to.equal(1)

    expect(await FreeBase.connect(owner1).tokenIdToCollectionCount(0)).to.equal(0)
    expect(await FreeBase.connect(owner1).tokenIdToCollectionCount(1)).to.equal(1)
    expect(await FreeBase.connect(owner1).tokenIdToCollectionCount(2)).to.equal(0)

  })

  it('metadata should work', async () => {
    const [
      _, __,
      owner1,
      owner2,
      minter,
      ...signers
    ] = await ethers.getSigners()
    const FreeBaseFactory = await ethers.getContractFactory('Free', owner1)
    const FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner1)
    const Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()


    await FreeBase.connect(owner1).createCollection(owner1.address, 'Free0 #', 'website.com', 'ipfs://afadsf', '.jpg', 'if its free its for me')
    await FreeBase.connect(owner1).createCollection(owner1.address, 'Free1 #', 'website.com', 'ipfs://afadsf', '.jpg', 'free for all')
    await FreeBase.connect(owner1).mint(0, owner1.address)
    await FreeBase.connect(owner1).mint(0, owner1.address)
    await FreeBase.connect(owner1).mint(1, owner1.address)



    const metadata0 = await FreeBase.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: 'Free0 #0',
      description: 'if its free its for me',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?collectionId=0&tokenId=0',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })

    const metadata1 = await FreeBase.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: 'Free0 #1',
      description: 'if its free its for me',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?collectionId=0&tokenId=1',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })

    const metadata2 = await FreeBase.connect(owner1).tokenURI(2)
    expect(parseMetadata(metadata2)).to.deep.equal({
      name: 'Free1 #0',
      description: 'free for all',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?collectionId=1&tokenId=2',
      attributes: [ { trait_type: 'Collection', value: '1' } ]
    })



    await FreeBase.connect(owner1).updateMetadataParams(0, 'renamed ', 'new.website', 'arweave://123', '.png', 'free as in beer')
    // console.log(await FreeBase.connect(owner1).seriesIdToMetadata(0))

    const metadata0_1 = await FreeBase.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0_1)).to.deep.equal({
      name: 'renamed 0',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?collectionId=0&tokenId=0',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })

    const metadata1_1 = await FreeBase.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1_1)).to.deep.equal({
      name: 'renamed 1',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?collectionId=0&tokenId=1',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })

    await expectFailure(() =>
      FreeBase.connect(owner2).updateMetadataParams(0, 'renamed ', 'new.website', 'arweave://123', '.png', 'free as in beer'),
      'Ownable:'
    )

    await FreeBase.connect(owner1).setMintingAddress(0, minter.address)

    await FreeBase.connect(minter).appendAttributeToToken(0, 'likes beer', 'true')

    const metadata0_2 = await FreeBase.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0_2)).to.deep.equal({
      name: 'renamed 0',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?collectionId=0&tokenId=0',
      attributes: [ { trait_type: 'Collection', value: '0' },  { trait_type: 'likes beer', value: true }]
    })

    const metadata1_2 = await FreeBase.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1_2)).to.deep.equal({
      name: 'renamed 1',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?collectionId=0&tokenId=1',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })
  })
})

xdescribe('Free1', function () {
  this.timeout(40000)
  let owner, minter, notMinter, FreeBase, Free0, Free1

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]
    notMinter = signers[4]

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free1Factory = await ethers.getContractFactory('Free1', owner)
    Free1 = await Free1Factory.deploy(FreeBase.address)
    await Free1.deployed()


    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
  })

  it('can claim', async () => {
    await Free0.connect(minter).claim()
    await Free1.connect(minter).claim(0)

    await expectFailure(() => Free1.connect(minter).claim(0), 'This Free0 has already been used to mint a Free1')
    await expectFailure(() => Free1.connect(minter).claim(1), 'Invalid Free0')

    await Free0.connect(minter).claim()
    await expectFailure(() => Free1.connect(notMinter).claim(2), 'You must be the owner of this Free0')
    await Free1.connect(minter).claim(2)

    expect(uint(await FreeBase.connect(minter).collectionSupply(0))).to.equal(2)
    expect(uint(await FreeBase.connect(minter).collectionSupply(1))).to.equal(2)

    expect(uint(await FreeBase.connect(minter).tokenIdToCollectionId(0))).to.equal(0)
    expect(uint(await FreeBase.connect(minter).tokenIdToCollectionId(2))).to.equal(0)

    expect(uint(await FreeBase.connect(minter).tokenIdToCollectionId(1))).to.equal(1)
    expect(uint(await FreeBase.connect(minter).tokenIdToCollectionId(3))).to.equal(1)
  })


  xit('cant mint mint more than 1000', async () => {

    let promises = []
    for (let i=0; i<1000; i++) {
      promises.push(Free0.connect(minter).claim())
    }
    await Promise.all(promises)

    promises = []
    for (let i=0; i<1000; i++) {
      promises.push(Free1.connect(minter).claim(i))
    }
    await Promise.all(promises)

    expect(uint(await FreeBase.connect(minter).totalSupply())).to.equal(2000)

    await Free0.connect(minter).claim()
    await expectFailure(() => Free1.connect(minter).claim(2000), 'Cannot mint more than 1000')

  })

  it('should update Free0 metadata', async () => {
    await Free0.connect(minter).claim()
    await Free0.connect(minter).claim()
    await Free1.connect(minter).claim(0)

    const metadata0 = await FreeBase.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=0',
      attributes: [ { trait_type: 'Collection', value: '0' },  { trait_type: 'Used For Free1 Mint', value: true }]
    })

    const metadata1 = await FreeBase.connect(owner).tokenURI(1)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: '1',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=1',
      attributes: [ { trait_type: 'Collection', value: '0' } ]
    })
  })
})

xdescribe('Free2', () => {
  let owner, minter, notMinter, FreeBase, Free0, Free1, Free2, IOU, NVCMinter

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]
    notMinter = signers[4]

    const IOUFactory = await ethers.getContractFactory('MockIOU', owner)
    IOU = await IOUFactory.deploy()
    await IOU.deployed()

    const NVCMinterFactory = await ethers.getContractFactory('MockNVCMinter', owner)
    NVCMinter = await NVCMinterFactory.deploy()
    await NVCMinter.deployed()


    await IOU.connect(owner).__markOwner(0, minter.address)
    await IOU.connect(owner).__markOwner(1, minter.address)
    await IOU.connect(owner).__markOwner(2, notMinter.address)
    await IOU.connect(owner).__markOwner(3, minter.address)
    await NVCMinter.connect(owner).__markUsed(0)
    await NVCMinter.connect(owner).__markUsed(1)
    await NVCMinter.connect(owner).__markUsed(2)

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
    Free2 = await Free2Factory.deploy(FreeBase.address, Free1.address, IOU.address, NVCMinter.address)
    await Free2.deployed()


    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free2.address, '', '', '', '', '')
  })

  it('can claim', async () => {
    await Free0.connect(minter).claim() // 0
    await Free0.connect(minter).claim() // 1
    await Free0.connect(minter).claim() // 2
    await Free1.connect(minter).claim(0) // 3
    await Free1.connect(minter).claim(1) // 4

    await Free0.connect(notMinter).claim() // 5
    await Free1.connect(notMinter).claim(5) // 6

    await Free0.connect(minter).claim() // 7
    await Free1.connect(minter).claim(7) // 8



    await expectFailure(() => Free2.connect(notMinter).claim(2, 0), 'You must be the owner of this Free0')
    await expectFailure(() => Free2.connect(minter).claim(0, 2), 'You must use a Free0 that has already minted a Free1')
    await expectFailure(() => Free2.connect(minter).claim(0, 3), 'Invalid Free0')
    await Free2.connect(minter).claim(0, 0)
    await expectFailure(() => Free2.connect(minter).claim(1, 0), 'This Free0 has already been used to mint a Free2')

    await expectFailure(() => Free2.connect(notMinter).claim(0, 5), 'You must be the owner of this IOU')
    await expectFailure(() => Free2.connect(minter).claim(3, 1), 'You must use an IOU that has minted a NVC')
    await Free2.connect(minter).claim(1, 1)
    await expectFailure(() => Free2.connect(minter).claim(1, 7), 'This IOU has already minted a Free2')

    await Free2.connect(notMinter).claim(2, 5)


    const metadata0 = await FreeBase.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=0',
      attributes: [
        { trait_type: 'Collection', value: '0' },
        { trait_type: 'Used For Free1 Mint', value: true },
        { trait_type: 'Used For Free2 Mint', value: true }
      ]
    })

  })
})

xdescribe('Free3', () => {
  let owner, minter1, minter2, FreeBase, Free0, Free3

  const stakeValue = ethers.utils.parseEther('0.25')
  const payableEth = { value: stakeValue }
  const getBlock = async () => (await time.latestBlock()).words[0]
  const setBlock = async (blockNumber) => time.advanceBlockTo(blockNumber)

  const stakePeriod = 100
  const progressPeriodExpiration = 105

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter1 = signers[3]
    minter2 = signers[4]

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free3Factory = await ethers.getContractFactory('Free3', owner)
    Free3 = await Free3Factory.deploy(FreeBase.address, stakePeriod, progressPeriodExpiration)
    await Free3.deployed()

    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free3.address, '', '', '', '', '')

    await Free0.connect(minter1).claim() // 0
    await Free0.connect(minter1).claim() // 1
    await Free0.connect(minter2).claim() // 2
  })

  describe('claiming', () => {

    it('first stake should work', async () => {
      await expectFailure(() => Free3.connect(minter1).firstStake(), 'You must stake at least 0.25 ether')
      await Free3.connect(minter1).firstStake(payableEth)
      await expectFailure(() => Free3.connect(minter1).firstStake(payableEth), 'You have already attempted a first stake')
    })

    it('second stake should work after 5000 blocks', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod - 1)
      await expectFailure(() => Free3.connect(minter1).secondStake(payableEth), 'You must wait between 5000 and 5100 blocks to make your second stake')
      await Free3.connect(minter1).secondStake(payableEth)
    })

    it('second stake should not work after 5100 blocks', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)
      await expectFailure(() => Free3.connect(minter1).secondStake(payableEth), 'You must wait between 5000 and 5100 blocks to make your second stake')
    })

    it('second stake should not work before first stake', async () => {
      await expectFailure(() => Free3.connect(minter1).secondStake(payableEth), 'You have not attempted a first stake')
    })

    it('second stake should require 0.25 eth + not allow a duplicate stake', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await expectFailure(() => Free3.connect(minter1).secondStake(), 'You must stake at least 0.25 ether')
      await Free3.connect(minter1).secondStake(payableEth)
      await expectFailure(() => Free3.connect(minter1).secondStake(payableEth), 'You have already attempted a second stake')
    })


    it('claim should work with a valid Free0 within the claim period', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      const startingEthBalance = num(await minter1.getBalance())
      await Free3.connect(minter1).claim(0)
      const endingEthBalance = num(await minter1.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.5, 0.01)


      const metadata1 = await FreeBase.connect(minter1).tokenURI(0)
      expect(parseMetadata(metadata1)).to.deep.equal({
        name: '0',
        description: '',
        license: 'CC0',
        image: '',
        external_url: '?collectionId=0&tokenId=0',
        attributes: [
          { trait_type: 'Collection', value: '0' },
          { trait_type: 'Used For Free3 Mint', value: true }
        ]
      })

      await expectFailure(() => Free3.connect(minter1).claim(1), 'You have already minted')
    })

    it('claim should not work with an already used Free0', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).secondStake(payableEth)
      let secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await Free3.connect(minter1).claim(0)

      await FreeBase.connect(minter1).transferFrom(minter1.address, minter2.address, 0)


      await Free3.connect(minter2).firstStake(payableEth)
      firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter2).secondStake(payableEth)
      secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await expectFailure(() => Free3.connect(minter2).claim(0), 'This Free0 has already been used to mint a Free3')

    })
    it('claim should not work with a Free > 0', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).secondStake(payableEth)
      let secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await Free3.connect(minter1).claim(0)

      await FreeBase.connect(minter1).transferFrom(minter1.address, minter2.address, 3)


      await Free3.connect(minter2).firstStake(payableEth)
      firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter2).secondStake(payableEth)
      secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await expectFailure(() => Free3.connect(minter2).claim(3), 'Invalid Free0')
    })

    it('claim should not work with an unowned Free0', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await FreeBase.connect(minter1).transferFrom(minter1.address, minter2.address, 0)
      await expectFailure(() => Free3.connect(minter1).claim(0), 'You must be the owner of this Free0')
    })

    it('claim should not work outside of the claiming window', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await expectFailure(() => Free3.connect(minter1).claim(0), 'You must wait between 5000 and 5100 blocks to claim')
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)
      await expectFailure(() => Free3.connect(minter1).claim(0), 'You must wait between 5000 and 5100 blocks to claim')
    })
  })

  describe('withdrawing', () => {
    it('cant withdraw before first stake or second stake period is expired, or after claim', async () => {
      await expectFailure(
        () => Free3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()

      await expectFailure(
        () => Free3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()

      await expectFailure(
        () => Free3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await setBlock(secondStakeStartingBlock + stakePeriod)
      await Free3.connect(minter1).claim(0)

      await expectFailure(
        () => Free3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )
    })



    it('can withdraw after first stake expires', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)

      const startingEthBalance = num(await owner.getBalance())
      await Free3.connect(owner).withdraw(minter1.address)
      const endingEthBalance = num(await owner.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.25, 0.01)
    })

    it('can withdraw after second stake expires', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)

      await Free3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + + progressPeriodExpiration + 1)


      const startingEthBalance = num(await owner.getBalance())
      await Free3.connect(owner).withdraw(minter1.address)
      const endingEthBalance = num(await owner.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.5, 0.01)
    })

    it('can transfer administraction', async () => {
      await Free3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)

      await expectFailure(
        () => Free3.connect(minter1).transferAdministratorship(minter1.address),
        'Admin only'
      )
      await Free3.connect(owner).transferAdministratorship(minter1.address)

      const startingEthBalance = num(await minter1.getBalance())
      await Free3.connect(minter1).withdraw(minter1.address)
      const endingEthBalance = num(await minter1.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.25, 0.01)
    })
  })
})

xdescribe('Free4', () => {
  let owner, minter, target, FreeBase, Free0, Free1, Free4

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]
    target = signers[4]

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free1Factory = await ethers.getContractFactory('Free1', owner)
    Free1 = await Free1Factory.deploy(FreeBase.address)
    await Free1.deployed()

    const Free4Factory = await ethers.getContractFactory('Free4', minter)
    Free4 = await Free4Factory.deploy(FreeBase.address, minter.address, target.address)
    await Free4.deployed()

    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free4.address, '', '', '', '', '')
  })

  it('works', async () => {
    await Free0.connect(owner).claim()
    await Free0.connect(minter).claim()
    await Free1.connect(minter).claim(1)

    await expectFailure(() => Free4.connect(owner).claim(0), 'Only the minter can mint')

    await Free4.connect(minter).claim(1)
    expect(await FreeBase.connect(target).balanceOf(target.address)).to.equal(1)

    await expectFailure(() => Free4.connect(minter).claim(1), 'This Free0 has already been used to mint a Free4')
    await expectFailure(() => Free4.connect(minter).claim(0), 'You must be the owner of this Free0')
    await expectFailure(() => Free4.connect(minter).claim(2), 'Invalid Free0')

    const metadata1 = await FreeBase.connect(owner).tokenURI(1)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: '1',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=1',
      attributes: [
        { trait_type: 'Collection', value: '0' },
        { trait_type: 'Used For Free1 Mint', value: true },
        { trait_type: 'Used For Free4 Mint', value: true }
      ]
    })
  })
})

xdescribe('Free5', () => {
  let owner, minter, FreeBase, Free0, Free1, ArtBlocks, Free5

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free1Factory = await ethers.getContractFactory('Free1', owner)
    Free1 = await Free1Factory.deploy(FreeBase.address)
    await Free1.deployed()

    const ArtBlocksFactory = await ethers.getContractFactory('MockGenArt721Core', owner)
    ArtBlocks = await ArtBlocksFactory.deploy()
    await ArtBlocks.deployed()

    const Free5Factory = await ethers.getContractFactory('Free5', minter)
    Free5 = await Free5Factory.deploy(FreeBase.address, ArtBlocks.address)
    await Free5.deployed()

    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free5.address, '', '', '', '', '')
  })

  it('should only allow valid cgk, isid, fim, and free0 tokens to mint', async () => {
    // valid tokens
    await Free0.connect(minter).claim() // 0
    await ArtBlocks.connect(minter).__markOwner(44000000, 44, minter.address) // cgk
    await ArtBlocks.connect(minter).__markOwner(102000000, 102, minter.address) // isid
    await ArtBlocks.connect(minter).__markOwner(152000000, 152, minter.address) // fim

    await Free0.connect(minter).claim() // 1
    await ArtBlocks.connect(minter).__markOwner(44000001, 44, minter.address) // cgk
    await ArtBlocks.connect(minter).__markOwner(102000001, 102, minter.address) // isid
    await ArtBlocks.connect(minter).__markOwner(152000001, 152, minter.address) // fim


    // invalid tokens
    await ArtBlocks.connect(minter).__markOwner(0, 0, minter.address) // fim
    await Free1.connect(minter).claim(0) // 2

    // unowned tokens
    await ArtBlocks.connect(owner).__markOwner(44000002, 44, owner.address) // cgk
    await ArtBlocks.connect(owner).__markOwner(102000002, 102, owner.address) // isid
    await ArtBlocks.connect(owner).__markOwner(152000002, 152, owner.address) // fim
    await Free0.connect(owner).claim() // 3

    // incorrect collections
    await expectFailure(
      () => Free5.connect(minter).claim(2, 44000000, 102000000, 152000000),
      'Invalid Free0'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 0, 102000000, 152000000),
      'Invalid CGK'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000000, 0, 152000000),
      'Invalid ISID'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000000, 102000000, 0),
      'Invalid FIM'
    )


    // unowned
    await expectFailure(
      () => Free5.connect(minter).claim(3, 44000000, 102000000, 152000000),
      'You must be the owner of this Free0'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000002, 102000000, 152000000),
      'You must be the owner of this CGK'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000000, 102000002, 152000000),
      'You must be the owner of this ISID'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000000, 102000000, 152000002),
      'You must be the owner of this FIM'
    )

    // success
    await Free5.connect(minter).claim(0, 44000000, 102000000, 152000000)

    // reused
    await expectFailure(
      () => Free5.connect(minter).claim(0, 44000001, 102000001, 152000001),
      'This Free0 has already been used to mint a Free5'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(1, 44000000, 102000001, 152000001),
      'This CGK has already been used to mint a Free5'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(1, 44000001, 102000000, 152000001),
      'This ISID has already been used to mint a Free5'
    )

    await expectFailure(
      () => Free5.connect(minter).claim(1, 44000001, 102000001, 152000000),
      'This FIM has already been used to mint a Free5'
    )

    // success
    await Free5.connect(minter).claim(1, 44000001, 102000001, 152000001)

    const metadata1 = await FreeBase.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=0',
      attributes: [
        { trait_type: 'Collection', value: '0' },
        { trait_type: 'Used For Free1 Mint', value: true },
        { trait_type: 'Used For Free5 Mint', value: true }
      ]
    })
  })
})


describe('Free6', () => {
  let owner, minter, FreeBase, Free0, Free1, ArtBlocks, FastCash, Free6

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]

    const FreeBaseFactory = await ethers.getContractFactory('Free', owner)
    FreeBase = await FreeBaseFactory.deploy()
    await FreeBase.deployed()

    const Free0Factory = await ethers.getContractFactory('Free0', owner)
    Free0 = await Free0Factory.deploy(FreeBase.address)
    await Free0.deployed()

    const Free1Factory = await ethers.getContractFactory('Free1', owner)
    Free1 = await Free1Factory.deploy(FreeBase.address)
    await Free1.deployed()

    const ArtBlocksFactory = await ethers.getContractFactory('MockGenArt721Core', owner)
    ArtBlocks = await ArtBlocksFactory.deploy()
    await ArtBlocks.deployed()

    const FastCashFactory = await ethers.getContractFactory('MockFastCash', owner)
    FastCash = await FastCashFactory.deploy()
    await FastCash.deployed()

    const Free6Factory = await ethers.getContractFactory('Free6', minter)
    Free6 = await Free6Factory.deploy(FreeBase.address, ArtBlocks.address, FastCash.address)
    await Free6.deployed()

    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(owner.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free6.address, '', '', '', '', '')
  })

  it('should only allow minst for valid free0s, fims with # <= 125 and addresses with >= 1 FastCash balances', async () => {
    // valid tokens
    await Free0.connect(minter).claim() // 0
    await Free0.connect(minter).claim() // 1
    await ArtBlocks.connect(minter).__markOwner(152000000, 152, minter.address)
    await ArtBlocks.connect(minter).__markOwner(152000125, 152, minter.address)


    // invalid tokens
    await ArtBlocks.connect(minter).__markOwner(0, 0, minter.address)
    await ArtBlocks.connect(minter).__markOwner(152000126, 152, minter.address)
    await Free1.connect(minter).claim(0) // 2

    // unowned tokens
    await ArtBlocks.connect(owner).__markOwner(152000002, 152, owner.address)
    await Free0.connect(owner).claim() // 3

    // incorrect collections
    await expectFailure(
      () => Free6.connect(minter).claim(2, 152000000),
      'Invalid Free0'
    )

    await expectFailure(
      () => Free6.connect(minter).claim(0, 0),
      'Invalid FIM'
    )

    await expectFailure(
      () => Free6.connect(minter).claim(0, 152000126),
      'You must use a FIM that was minted with FastCash'
    )

    // unowned
    await expectFailure(
      () => Free6.connect(minter).claim(3, 152000000),
      'You must be the owner of this Free0'
    )

    await expectFailure(
      () => Free6.connect(minter).claim(0, 152000002),
      'You must be the owner of this FIM'
    )

    // not enough fastcash
    await expectFailure(
      () => Free6.connect(minter).claim(0, 152000000),
      'You must have a balance of at least 1 FastCash'
    )

    await FastCash.connect(owner).__setBalance(minter.address, ethers.utils.parseEther('1'))

    // success
    await Free6.connect(minter).claim(0, 152000000)

    // reused
    await expectFailure(
      () => Free6.connect(minter).claim(0, 152000125),
      'This Free0 has already been used to mint a Free6'
    )

    await expectFailure(
      () => Free6.connect(minter).claim(1, 152000000),
      'This FIM has already been used to mint a Free6'
    )

    // success
    await Free6.connect(minter).claim(1, 152000125)

    const metadata1 = await FreeBase.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?collectionId=0&tokenId=0',
      attributes: [
        { trait_type: 'Collection', value: '0' },
        { trait_type: 'Used For Free1 Mint', value: true },
        { trait_type: 'Used For Free6 Mint', value: true }
      ]
    })
  })
})