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


describe('Base Free Contract', () => {
  it('minting should work', async () => {
    const [
      _, __,
      owner1,
      owner2,
      ...signers
    ] = await ethers.getSigners()
    const FreeFactory = await ethers.getContractFactory('Free', owner1)
    const Free = await FreeFactory.deploy()
    await Free.deployed()

    const Series0Factory = await ethers.getContractFactory('Series0', owner1)
    const Series0 = await Series0Factory.deploy(Free.address)
    await Series0.deployed()


    await Free.connect(owner1).createSeries(owner1.address, '', '', '', '', '')
    await Free.connect(owner1).createSeries(owner2.address, '', '', '', '', '')

    await Free.connect(owner1).mint(0, owner1.address)
    await Free.connect(owner1).mint(0, owner1.address)
    await Free.connect(owner2).mint(1, owner1.address)

    await expectFailure(() =>
      Free.connect(owner2).mint(0, owner2.address),
      'Caller is not the minting address'
    )

    await expectFailure(() =>
      Free.connect(owner1).mint(1, owner1.address),
      'Caller is not the minting address'
    )


    await Free.connect(owner1).setMintingAddress(0, Series0.address)
    await Series0.connect(owner1).claim()
    await Series0.connect(owner2).claim()

    await expectFailure(() =>
      Free.connect(owner1).mint(0, owner1.address),
      'Caller is not the minting address'
    )

    expect(await Free.connect(owner1).tokenIdToSeriesId(0)).to.equal(0)
    expect(await Free.connect(owner1).tokenIdToSeriesId(1)).to.equal(0)
    expect(await Free.connect(owner1).tokenIdToSeriesId(2)).to.equal(1)

    expect(await Free.connect(owner1).tokenIdToSeriesCount(0)).to.equal(0)
    expect(await Free.connect(owner1).tokenIdToSeriesCount(1)).to.equal(1)
    expect(await Free.connect(owner1).tokenIdToSeriesCount(2)).to.equal(0)

  })

  it('metadata should work', async () => {
    const [
      _, __,
      owner1,
      owner2,
      minter,
      ...signers
    ] = await ethers.getSigners()
    const FreeFactory = await ethers.getContractFactory('Free', owner1)
    const Free = await FreeFactory.deploy()
    await Free.deployed()

    const Series0Factory = await ethers.getContractFactory('Series0', owner1)
    const Series0 = await Series0Factory.deploy(Free.address)
    await Series0.deployed()


    await Free.connect(owner1).createSeries(owner1.address, 'Free0 #', 'website.com', 'ipfs://afadsf', '.jpg', 'if its free its for me')
    await Free.connect(owner1).createSeries(owner1.address, 'Free1 #', 'website.com', 'ipfs://afadsf', '.jpg', 'free for all')
    await Free.connect(owner1).mint(0, owner1.address)
    await Free.connect(owner1).mint(0, owner1.address)
    await Free.connect(owner1).mint(1, owner1.address)



    const metadata0 = await Free.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: 'Free0 #0',
      description: 'if its free its for me',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?seriesId=0&tokenId=0',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })

    const metadata1 = await Free.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: 'Free0 #1',
      description: 'if its free its for me',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?seriesId=0&tokenId=1',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })

    const metadata2 = await Free.connect(owner1).tokenURI(2)
    expect(parseMetadata(metadata2)).to.deep.equal({
      name: 'Free1 #0',
      description: 'free for all',
      license: 'CC0',
      image: 'ipfs://afadsf.jpg',
      external_url: 'website.com?seriesId=1&tokenId=2',
      attributes: [ { trait_type: 'series', value: '1' } ]
    })



    await Free.connect(owner1).updateMetadataParams(0, 'renamed ', 'new.website', 'arweave://123', '.png', 'free as in beer')
    // console.log(await Free.connect(owner1).seriesIdToMetadata(0))

    const metadata0_1 = await Free.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0_1)).to.deep.equal({
      name: 'renamed 0',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?seriesId=0&tokenId=0',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })

    const metadata1_1 = await Free.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1_1)).to.deep.equal({
      name: 'renamed 1',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?seriesId=0&tokenId=1',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })

    await expectFailure(() =>
      Free.connect(owner2).updateMetadataParams(0, 'renamed ', 'new.website', 'arweave://123', '.png', 'free as in beer'),
      'Ownable:'
    )

    await Free.connect(owner1).setMintingAddress(0, minter.address)

    await Free.connect(minter).appendAttributeToToken(0, 'likes beer', 'true')

    const metadata0_2 = await Free.connect(owner1).tokenURI(0)
    expect(parseMetadata(metadata0_2)).to.deep.equal({
      name: 'renamed 0',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?seriesId=0&tokenId=0',
      attributes: [ { trait_type: 'series', value: '0' },  { trait_type: 'likes beer', value: true }]
    })

    const metadata1_2 = await Free.connect(owner1).tokenURI(1)
    expect(parseMetadata(metadata1_2)).to.deep.equal({
      name: 'renamed 1',
      description: 'free as in beer',
      license: 'CC0',
      image: 'arweave://123.png',
      external_url: 'new.website?seriesId=0&tokenId=1',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })
  })
})

describe('Series 1', function () {
  this.timeout(40000)
  let owner, minter, notMinter, Free, Series0, Series1

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    owner = signers[2]
    minter = signers[3]
    notMinter = signers[4]

    const FreeFactory = await ethers.getContractFactory('Free', owner)
    Free = await FreeFactory.deploy()
    await Free.deployed()

    const Series0Factory = await ethers.getContractFactory('Series0', owner)
    Series0 = await Series0Factory.deploy(Free.address)
    await Series0.deployed()

    const Series1Factory = await ethers.getContractFactory('Series1', owner)
    Series1 = await Series1Factory.deploy(Free.address)
    await Series1.deployed()


    await Free.connect(owner).createSeries(Series0.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(Series1.address, '', '', '', '', '')
  })

  it('can claim', async () => {
    await Series0.connect(minter).claim()
    await Series1.connect(minter).claim(0)

    await expectFailure(() => Series1.connect(minter).claim(0), 'Free0 already used to mint Free1')
    await expectFailure(() => Series1.connect(minter).claim(1), 'You must use a Free0 as a mint pass')

    await Series0.connect(minter).claim()
    await expectFailure(() => Series1.connect(notMinter).claim(2), 'You must be the owner of this Free0 token')
    await Series1.connect(minter).claim(2)

    expect(uint(await Free.connect(minter).seriesSupply(0))).to.equal(2)
    expect(uint(await Free.connect(minter).seriesSupply(1))).to.equal(2)

    expect(uint(await Free.connect(minter).tokenIdToSeriesId(0))).to.equal(0)
    expect(uint(await Free.connect(minter).tokenIdToSeriesId(2))).to.equal(0)

    expect(uint(await Free.connect(minter).tokenIdToSeriesId(1))).to.equal(1)
    expect(uint(await Free.connect(minter).tokenIdToSeriesId(3))).to.equal(1)
  })


  xit('cant mint mint more than 1000', async () => {

    let promises = []
    for (let i=0; i<1000; i++) {
      promises.push(Series0.connect(minter).claim())
    }
    await Promise.all(promises)

    promises = []
    for (let i=0; i<1000; i++) {
      promises.push(Series1.connect(minter).claim(i))
    }
    await Promise.all(promises)

    expect(uint(await Free.connect(minter).totalSupply())).to.equal(2000)

    await Series0.connect(minter).claim()
    await expectFailure(() => Series1.connect(minter).claim(2000), 'Cannot mint more than 1000')

  })

  it('should update series0 metadata', async () => {
    await Series0.connect(minter).claim()
    await Series0.connect(minter).claim()
    await Series1.connect(minter).claim(0)

    const metadata0 = await Free.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?seriesId=0&tokenId=0',
      attributes: [ { trait_type: 'series', value: '0' },  { trait_type: 'Used For Free1 Mint', value: true }]
    })

    const metadata1 = await Free.connect(owner).tokenURI(1)
    expect(parseMetadata(metadata1)).to.deep.equal({
      name: '1',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?seriesId=0&tokenId=1',
      attributes: [ { trait_type: 'series', value: '0' } ]
    })
  })
})

describe('Series 2', () => {
  let owner, minter, notMinter, Free, Series0, Series1, Series2, IOU, NVCMinter

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

    const FreeFactory = await ethers.getContractFactory('Free', owner)
    Free = await FreeFactory.deploy()
    await Free.deployed()

    const Series0Factory = await ethers.getContractFactory('Series0', owner)
    Series0 = await Series0Factory.deploy(Free.address)
    await Series0.deployed()

    const Series1Factory = await ethers.getContractFactory('Series1', owner)
    Series1 = await Series1Factory.deploy(Free.address)
    await Series1.deployed()

    const Series2Factory = await ethers.getContractFactory('Series2', owner)
    Series2 = await Series2Factory.deploy(Free.address, Series1.address, IOU.address, NVCMinter.address)
    await Series2.deployed()


    await Free.connect(owner).createSeries(Series0.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(Series1.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(Series2.address, '', '', '', '', '')
  })

  it('can claim', async () => {
    await Series0.connect(minter).claim() // 0
    await Series0.connect(minter).claim() // 1
    await Series0.connect(minter).claim() // 2
    await Series1.connect(minter).claim(0) // 3
    await Series1.connect(minter).claim(1) // 4

    await Series0.connect(notMinter).claim() // 5
    await Series1.connect(notMinter).claim(5) // 6

    await Series0.connect(minter).claim() // 7
    await Series1.connect(minter).claim(7) // 8



    await expectFailure(() => Series2.connect(notMinter).claim(2, 0), 'You must be the owner of this Free0 token')
    await expectFailure(() => Series2.connect(minter).claim(0, 2), 'You must use a Free0 that has already been used to mint a Free1 as a mint pass')
    await expectFailure(() => Series2.connect(minter).claim(0, 3), 'You must use a Free0 that has already been used to mint a Free1 as a mint pass')
    await Series2.connect(minter).claim(0, 0)
    await expectFailure(() => Series2.connect(minter).claim(1, 0), 'Free0 already used to mint Free2')

    await expectFailure(() => Series2.connect(notMinter).claim(0, 5), 'You must be the owner of this IOU')
    await expectFailure(() => Series2.connect(minter).claim(3, 1), 'This IOU was not used to mint a NVC')
    await Series2.connect(minter).claim(1, 1)
    await expectFailure(() => Series2.connect(minter).claim(1, 7), 'This IOU has already minted a FREE')

    await Series2.connect(notMinter).claim(2, 5)


    const metadata0 = await Free.connect(owner).tokenURI(0)
    expect(parseMetadata(metadata0)).to.deep.equal({
      name: '0',
      description: '',
      license: 'CC0',
      image: '',
      external_url: '?seriesId=0&tokenId=0',
      attributes: [
        { trait_type: 'series', value: '0' },
        { trait_type: 'Used For Free1 Mint', value: true },
        { trait_type: 'Used For Free2 Mint', value: true }
      ]
    })

  })
})

describe('Series3', () => {
  let owner, minter1, minter2, Free, Series0, Series3

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

    const FreeFactory = await ethers.getContractFactory('Free', owner)
    Free = await FreeFactory.deploy()
    await Free.deployed()

    const Series0Factory = await ethers.getContractFactory('Series0', owner)
    Series0 = await Series0Factory.deploy(Free.address)
    await Series0.deployed()

    const Series3Factory = await ethers.getContractFactory('Series3', owner)
    Series3 = await Series3Factory.deploy(Free.address, stakePeriod, progressPeriodExpiration)
    await Series3.deployed()

    await Free.connect(owner).createSeries(Series0.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(owner.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(owner.address, '', '', '', '', '')
    await Free.connect(owner).createSeries(Series3.address, '', '', '', '', '')

    await Series0.connect(minter1).claim() // 0
    await Series0.connect(minter1).claim() // 1
    await Series0.connect(minter2).claim() // 2
  })

  describe('claiming', () => {

    it('first stake should work', async () => {
      await expectFailure(() => Series3.connect(minter1).firstStake(), 'You must stake at least 0.25 ether')
      await Series3.connect(minter1).firstStake(payableEth)
      await expectFailure(() => Series3.connect(minter1).firstStake(payableEth), 'You have already attempted a first stake')
    })

    it('second stake should work after 5000 blocks', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod - 1)
      await expectFailure(() => Series3.connect(minter1).secondStake(payableEth), 'You must wait between 5000 and 5100 blocks to make your second stake')
      await Series3.connect(minter1).secondStake(payableEth)
    })

    it('second stake should not work after 5100 blocks', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)
      await expectFailure(() => Series3.connect(minter1).secondStake(payableEth), 'You must wait between 5000 and 5100 blocks to make your second stake')
    })

    it('second stake should not work before first stake', async () => {
      await expectFailure(() => Series3.connect(minter1).secondStake(payableEth), 'You have not attempted a first stake')
    })

    it('second stake should require 0.25 eth + not allow a duplicate stake', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await expectFailure(() => Series3.connect(minter1).secondStake(), 'You must stake at least 0.25 ether')
      await Series3.connect(minter1).secondStake(payableEth)
      await expectFailure(() => Series3.connect(minter1).secondStake(payableEth), 'You have already attempted a second stake')
    })


    it('claim should work with a valid Free0 within the claim period', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      const startingEthBalance = num(await minter1.getBalance())
      await Series3.connect(minter1).claim(0)
      const endingEthBalance = num(await minter1.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.5, 0.01)


      const metadata1 = await Free.connect(minter1).tokenURI(0)
      expect(parseMetadata(metadata1)).to.deep.equal({
        name: '0',
        description: '',
        license: 'CC0',
        image: '',
        external_url: '?seriesId=0&tokenId=0',
        attributes: [
          { trait_type: 'series', value: '0' },
          { trait_type: 'Used For Free3 Mint', value: true }
        ]
      })

      await expectFailure(() => Series3.connect(minter1).claim(1), 'You have already minted')
    })

    it('claim should not work with an already used Free0', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).secondStake(payableEth)
      let secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await Series3.connect(minter1).claim(0)

      await Free.connect(minter1).transferFrom(minter1.address, minter2.address, 0)


      await Series3.connect(minter2).firstStake(payableEth)
      firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter2).secondStake(payableEth)
      secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await expectFailure(() => Series3.connect(minter2).claim(0), 'Free0 already used to mint Free3')

    })
    it('claim should not work with a Free > 0', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      let firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).secondStake(payableEth)
      let secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await Series3.connect(minter1).claim(0)

      await Free.connect(minter1).transferFrom(minter1.address, minter2.address, 3)


      await Series3.connect(minter2).firstStake(payableEth)
      firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter2).secondStake(payableEth)
      secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await expectFailure(() => Series3.connect(minter2).claim(3), 'You must use a Free0 as a mint pass')
    })

    it('claim should not work with an unowned Free0', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + stakePeriod)

      await Free.connect(minter1).transferFrom(minter1.address, minter2.address, 0)
      await expectFailure(() => Series3.connect(minter1).claim(0), 'You must be the owner of this Free0 token')
    })

    it('claim should not work outside of the claiming window', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await expectFailure(() => Series3.connect(minter1).claim(0), 'You must wait between 5000 and 5100 blocks to claim')
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)
      await expectFailure(() => Series3.connect(minter1).claim(0), 'You must wait between 5000 and 5100 blocks to claim')
    })
  })

  describe('withdrawing', () => {
    it('cant withdraw before first stake or second stake period is expired, or after claim', async () => {
      await expectFailure(
        () => Series3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()

      await expectFailure(
        () => Series3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await setBlock(firstStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()

      await expectFailure(
        () => Series3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )

      await setBlock(secondStakeStartingBlock + stakePeriod)
      await Series3.connect(minter1).claim(0)

      await expectFailure(
        () => Series3.connect(owner).withdraw(minter1.address),
        'Can only withdraw if one of two stakes have failed, eth is still staked, and token has not been minted'
      )
    })



    it('can withdraw after first stake expires', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)

      const startingEthBalance = num(await owner.getBalance())
      await Series3.connect(owner).withdraw(minter1.address)
      const endingEthBalance = num(await owner.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.25, 0.01)
    })

    it('can withdraw after second stake expires', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + stakePeriod)

      await Series3.connect(minter1).secondStake(payableEth)
      const secondStakeStartingBlock = await getBlock()
      await setBlock(secondStakeStartingBlock + + progressPeriodExpiration + 1)


      const startingEthBalance = num(await owner.getBalance())
      await Series3.connect(owner).withdraw(minter1.address)
      const endingEthBalance = num(await owner.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.5, 0.01)
    })

    it('can transfer administraction', async () => {
      await Series3.connect(minter1).firstStake(payableEth)
      const firstStakeStartingBlock = await getBlock()
      await setBlock(firstStakeStartingBlock + progressPeriodExpiration + 1)

      await expectFailure(
        () => Series3.connect(minter1).transferAdministratorship(minter1.address),
        'Admin only'
      )
      await Series3.connect(owner).transferAdministratorship(minter1.address)

      const startingEthBalance = num(await minter1.getBalance())
      await Series3.connect(minter1).withdraw(minter1.address)
      const endingEthBalance = num(await minter1.getBalance())
      expect(endingEthBalance - startingEthBalance).to.be.closeTo(0.25, 0.01)
    })
  })
})
