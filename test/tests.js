const { expect } = require("chai")
const { expectRevert, time, snapshot } = require('@openzeppelin/test-helpers')

const expectFailure = async (fn, err) => {
  let failure
  try {
    await fn()
  } catch (e) {
    failure = e
  }
  expect(failure?.message || '').to.include(err)
}

const bnToN = bn => Number(bn.toString())
const num = n => Number(ethers.utils.formatEther(n))
const uint = n => Number(n)
const parseMetadata = metadata => JSON.parse(Buffer.from(metadata.split(',')[1], 'base64').toString('utf-8'))
const toETH = val => ethers.utils.parseEther(val)

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

const safeTransferFrom = 'safeTransferFrom(address,address,uint256)'

const encodeWithSignature = (functionName, argTypes, params) => {
  const iface = new ethers.utils.Interface([`function ${functionName}(${argTypes.join(',')})`])
  return iface.encodeFunctionData(functionName, params)
}







describe.only('Free Series 3', () => {
  const zeroAddr = '0x0000000000000000000000000000000000000000'
  const altFree0 = 4377

  let signers, steviep, steveip, banker, minter, notMinter, _start
  let FreeSeries3CollectionCreator, FreeBase, Free21, Free22, Free23, Free24, Free25, Free26, Free27, Free28, Free29, Free30, Free31, Free32, Free33

  beforeEach(async () => {
    _start = await snapshot()

    steviep = await ethers.getImpersonatedSigner('0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4')
    steveip = await ethers.getImpersonatedSigner('0x8D55ccAb57f3Cba220AB3e3F3b7C9F59529e5a65')

    signers = await ethers.getSigners()
    banker = signers[0]
    minter = signers[1]
    notMinter = signers[2]

    const Metadata = '(uint256 collectionId, string namePrefix, string externalUrl, string imgUrl, string imgExtension, string description)'
    const FreeBaseFactory = await ethers.getContractFactory('Free', steviep)
    FreeBase = await FreeBaseFactory.attach('0x30b541f1182ef19c56a39634B2fdACa5a0F2A741')

    await banker.sendTransaction({ to: steveip.address, value: toETH('5.0') })
    await FreeBase.connect(steveip)[safeTransferFrom](steveip.address, steviep.address, altFree0)

    const FreeSeries3CollectionCreatorFactory = await ethers.getContractFactory('FreeSeries3CollectionCreator', steviep)

    FreeSeries3CollectionCreator = await FreeSeries3CollectionCreatorFactory.deploy()
    await FreeSeries3CollectionCreator.deployed()
  })

  afterEach(() => _start.restore())



  async function expectPreCheckCalled(mintFn, freeNumber) {
    await expectRevert(
      mintFn(),
      'This Free0 has already been used to mint a Free' + freeNumber
    )
  }


  async function expect0MetadataToBeCorrect(free0Id, freeNumber) {
    const metadata0 = parseMetadata(await FreeBase.connect(steviep).tokenURI(free0Id))
    expect(metadata0.attributes).to.deep.include({ trait_type: `Used For Free${freeNumber} Mint`, value: true })
  }


  async function expectPostCheckCalled(free0Id, freeNumber) {
    await expect0MetadataToBeCorrect(free0Id, freeNumber)
  }


  async function expectMintToBeCorrect(mintFn, free0Id, freeNumber) {
    const totalSupply = bnToN(await FreeBase.connect(steviep).totalSupply())
    await mintFn()
    await expectPreCheckCalled(mintFn, freeNumber)
    expect(await FreeBase.connect(steviep).totalSupply()).to.equal(totalSupply + 1)
    await expectPostCheckCalled(free0Id, freeNumber)

    const newMetadata = parseMetadata(await FreeBase.connect(steviep).tokenURI(totalSupply))
    expect(newMetadata.attributes).to.deep.include({ trait_type: `Collection`, value: `${freeNumber}` })
  }

  let FREE_CONTRACT_ADDRS

  async function deployFreeContracts() {
    const Free21Factory = await ethers.getContractFactory('Free21', steviep)
    Free21 = await Free21Factory.deploy()
    await  Free21.deployed()

    const Free22Factory = await ethers.getContractFactory('Free22', steviep)
    Free22 = await Free22Factory.deploy()
    await  Free22.deployed()

    const Free23Factory = await ethers.getContractFactory('Free23', steviep)
    Free23 = await Free23Factory.deploy()
    await  Free23.deployed()

    const Free24Factory = await ethers.getContractFactory('Free24', steviep)
    Free24 = await Free24Factory.deploy()
    await  Free24.deployed()

    const Free25Factory = await ethers.getContractFactory('Free25', steviep)
    Free25 = await Free25Factory.deploy()
    await Free25.deployed()

    const Free26Factory = await ethers.getContractFactory('Free26', steviep)
    Free26 = await Free26Factory.deploy()
    await Free26.deployed()

    const Free27Factory = await ethers.getContractFactory('Free27', steviep)
    Free27 = await Free27Factory.deploy()
    await Free27.deployed()

    const Free28Factory = await ethers.getContractFactory('Free28', steviep)
    Free28 = await Free28Factory.deploy()
    await Free28.deployed()

    const Free29Factory = await ethers.getContractFactory('Free29', steviep)
    Free29 = await Free29Factory.deploy()
    await Free29.deployed()

    const Free30Factory = await ethers.getContractFactory('Free30', steviep)
    Free30 = await Free30Factory.deploy()
    await Free30.deployed()

    const Free31Factory = await ethers.getContractFactory('Free31', steviep)
    Free31 = await Free31Factory.deploy()
    await Free31.deployed()


    FREE_CONTRACT_ADDRS = [
      Free21.address,
      Free22.address,
      Free23.address,
      Free24.address,
      Free25.address,
      Free26.address,
      Free27.address,
      Free28.address,
      Free29.address,
      Free30.address,
      Free31.address,
    ]

  }

  async function deployFrees() {

    await deployFreeContracts()

    await FreeBase.connect(steviep).transferOwnership(FreeSeries3CollectionCreator.address)
    await FreeSeries3CollectionCreator.connect(steviep).register(FREE_CONTRACT_ADDRS)
  }


  describe('FreeSeries3CollectionCreator', () => {
    it('should deploy', async () => {
      await deployFrees()

      await expectRevert(
        FreeBase.connect(notMinter).transferOwnership(FreeSeries3CollectionCreator.address),
        'Ownable: caller is not the owner'
      )

      await FreeBase.connect(steviep).transferOwnership(FreeSeries3CollectionCreator.address)
      expect(await FreeBase.connect(steviep).owner()).to.equal(FreeSeries3CollectionCreator.address)

      await expectRevert.unspecified(
        FreeSeries3CollectionCreator.connect(notMinter).reclaimFreeOwnership()
      )


      expect(await FreeBase.connect(steviep).owner()).to.equal(FreeSeries3CollectionCreator.address)
      await FreeSeries3CollectionCreator.connect(steviep).reclaimFreeOwnership()

      expect(await FreeBase.connect(steviep).owner()).to.equal(steviep.address)
      await FreeBase.connect(steviep).transferOwnership(FreeSeries3CollectionCreator.address)

      await FreeSeries3CollectionCreator.connect(steviep).register(FREE_CONTRACT_ADDRS)

      const expectedIPFS = '...................................'

      for (let collectionId = 21; collectionId < 30; collectionId++) {
        const metadata = await FreeBase.connect(steviep).collectionIdToMetadata(collectionId)
        expect(metadata.namePrefix).to.equal(`Free${collectionId} #`)
        expect(metadata.externalUrl).to.equal(`https://steviep.xyz/free`)
        expect(metadata.imgUrl).to.equal(`ipfs://${expectedIPFS}/${collectionId}`)
        expect(metadata.imgExtension).to.equal(`.jpg`)
      }

    })
  })


  describe('Free22', () => {
    let start, ABContract, DMFCVaultContract
    beforeEach(async () => {
      start = await snapshot()
      await deployFrees()


      ABContract = await ethers.getContractAt(
        [
          'function tokenIdToProjectId(uint256 tokenId) external returns (uint256 projectId)',
          'function ownerOf(uint256 tokenId) external returns (address owner)',
          'function safeTransferFrom(address from, address to, uint256 tokenId)',
        ],
        '0x99a9B7c1116f9ceEB1652de04d5969CcE509B069'
      )
      DMFCVaultContract = await ethers.getContractAt(
        [
          'function redemptions(uint256 tokenId) external view returns (bool redeemed)'
        ],
        '0x56FF4F826795f2dE13A89F60ea7B1cF14c714252'
      )
    })


    afterEach(() => start.restore())

    it('should work', async () => {
      const gumbo = 462000112
      const x113 = await ethers.getImpersonatedSigner('0x113d754Ff2e6Ca9Fd6aB51932493E4F9DabdF596')
      await banker.sendTransaction({ to: x113.address, value: toETH('5.0') })
      await ABContract.connect(x113)[safeTransferFrom](x113.address, steviep.address, 457000001)


      expect(await Free22.connect(steviep).dopamineMachineTokenIdUsed(457000000)).to.equal(false)

      await expectRevert(
        Free22.connect(steviep).claim(0, 457000002),
        'You must own this Dopamine Machine'
      )

      await expectRevert(
        Free22.connect(steviep).claim(0, 457000001),
        'Not redeemed for FastCash'
      )


      // make sure pre check functionality works properly
      await expectRevert(
        Free22.connect(steviep).claim(1, 457000000),
        'Invalid Free0'
      )
      await expectRevert(
        Free22.connect(notMinter).claim(0, 457000000),
        'You must be the owner of this Free0'
      )



      await expectMintToBeCorrect(
        () => Free22.connect(steviep).claim(0, 457000000),
        0,
        22
      )

      // make sure post check functionality works properly
      expect(await Free22.connect(steviep).free0TokenIdUsed(0)).to.equal(true)


      await expectRevert(
        Free22.connect(steviep).claim(altFree0, 457000000),
        'Dopamine Machine already used'
      )

      expect(await Free22.connect(steviep).dopamineMachineTokenIdUsed(457000000)).to.equal(true)
    })
  })

  describe('Free23', () => {

    let start, DancingMan, raptornews, momo, ficken, egli

    beforeEach(async () => {
      await deployFrees()

      raptornews = await ethers.getImpersonatedSigner('0x764aBE778aa96Cd04972444a8E1DB83dF13f7E66')
      momo = await ethers.getImpersonatedSigner('0x9197f339ccA98b2Bc14e98235ec1a59cb2090d77')
      ficken = await ethers.getImpersonatedSigner('0x88b72A454a8f834CF027d3AE57CE56fa3F2E4FC6')
      egli = await ethers.getImpersonatedSigner('0xfc3D126d801d5CE47DF73b533d82917854641282')
      await banker.sendTransaction({ to: egli.address, value: toETH('5.0') })

      DancingMan = await ethers.getContractAt(
        [
          'function safeTransferFrom(address, address, uint256, uint256, bytes) external',
          'function balanceOf(address, uint256) external view returns (uint256)',
        ],
        '0xC8D1a7814194aa6355727098448C7EE48f2a1e1C'
      )

    })




    it('should work', async () => {
      await Free22.connect(steviep).claim(0, 457000000)

      const free22Id = (await FreeBase.connect(steviep).totalSupply()) - 1

      await expectRevert(
        Free23.connect(steviep).claim(0, free22Id),
        'Dancin Man balance not >= 5'
      )

      await DancingMan.connect(steviep).safeTransferFrom(steviep.address, Free23.address, 1, 1, '0x')
      await DancingMan.connect(raptornews).safeTransferFrom(raptornews.address, Free23.address, 1, 1, '0x')
      await DancingMan.connect(momo).safeTransferFrom(momo.address, Free23.address, 1, 1, '0x')
      await DancingMan.connect(ficken).safeTransferFrom(ficken.address, Free23.address, 1, 1, '0x')
      await DancingMan.connect(egli).safeTransferFrom(egli.address, Free23.address, 1, 1, '0x')


      await expectRevert(
        Free23.connect(steviep).claim(0, 1),
        'Token collection mismatch'
      )

      await expectRevert(
        Free23.connect(egli).claim(467, free22Id),
        'Not owner of token'
      )

      await expectMintToBeCorrect(
        () => Free23.connect(steviep).claim(0, free22Id),
        0,
        23
      )

      await expectRevert(
        Free23.connect(steviep).claim(altFree0, free22Id),
        'Free22 already used'
      )
    })

    it('should error if sent a different 1155', async () => {
      RPAA = await ethers.getContractAt(
        [
          'function safeTransferFrom(address, address, uint256, uint256, bytes) external',
        ],
        '0x3c6fe936f6e050c243b901d809aea24084674687'
      )
      await expectRevert.unspecified(
        RPAA.connect(steviep).safeTransferFrom(steviep.address, Free23.address, 1, 1, '0x')
      )
    })

    it('should allow withdrawls', async () => {
      await DancingMan.connect(momo).safeTransferFrom(momo.address, steviep.address, 1, 1, '0x')
      await DancingMan.connect(raptornews).safeTransferFrom(raptornews.address, Free23.address, 1, 1, '0x')
      await DancingMan.connect(steviep).safeTransferFrom(steviep.address, Free23.address, 1, 2, '0x')

      expect(await DancingMan.connect(steviep).balanceOf(steviep.address, 1)).to.equal(0)
      expect(await DancingMan.connect(steviep).balanceOf(Free23.address, 1)).to.equal(3)

      await expectRevert(
        Free23.connect(steviep).withdrawDancingMan(3),
        'Dancing Man withdrawl too large'
      )

      await Free23.connect(steviep).withdrawDancingMan(2)

      expect(await DancingMan.connect(steviep).balanceOf(steviep.address, 1)).to.equal(2)
      expect(await DancingMan.connect(steviep).balanceOf(Free23.address, 1)).to.equal(1)
    })
  })

  describe('Free24', () => {
    beforeEach(async () => {
      await deployFrees()
    })

    it('should only allow minting within the 24 hour period', async () => {
      await time.increase(time.duration.hours(23.5))

      await expectMintToBeCorrect(
        () => Free24.connect(steviep).claim(0),
        0,
        24
      )

      await time.increase(time.duration.hours(1))

      await expectRevert(
        Free24.connect(steviep).claim(altFree0),
        'Outside of mint window'
      )
      await time.increase(time.duration.days(363))

      await expectRevert(
        Free24.connect(steviep).claim(altFree0),
        'Outside of mint window'
      )

      await time.increase(time.duration.days(1))

      await expectMintToBeCorrect(
        () => Free24.connect(steviep).claim(altFree0),
        0,
        24
      )

    })
  })

  describe('Free25', () => {
    let start, ColdHardCash, mymilkshakebringsalltheboystotheyard, georgeP

    beforeEach(async () => {
      await deployFrees()

      mymilkshakebringsalltheboystotheyard = await ethers.getImpersonatedSigner('0xFB6223EA050A0956cdf294129a00F66b5AE4f5a5')
      georgeP = await ethers.getImpersonatedSigner('0xbc3Ced9089e13C29eD15e47FFE3e0cAA477cb069')

      await banker.sendTransaction({ to: georgeP.address, value: toETH('5.0') })
      await banker.sendTransaction({ to: mymilkshakebringsalltheboystotheyard.address, value: toETH('5.0') })



      ColdHardCash = await ethers.getContractAt(
        [
          'function ownerOf(uint256 tokenId) external returns (address owner)',
        ],
        '0x6DEa3f6f1bf5ce6606054BaabF5452726Fe4dEA1'
      )

    })

    it('should only allow redeemed CASH holders to set a minter address', async () => {
      await expectRevert(
        Free25.connect(georgeP).setMinter(0, georgeP.address),
        'Not owner of CASH token'
      )
      await expectRevert(
        Free25.connect(georgeP).setMinter(6, georgeP.address),
        'CASH token not redeemed'
      )
      await Free25.connect(mymilkshakebringsalltheboystotheyard).setMinter(0, georgeP.address)
    })

    it('should allow ALed addresses to mint', async () => {

      await expectRevert(
        Free25.connect(georgeP).claim(383 ,0),
        'Address cannot mint'
      )
      await Free25.connect(mymilkshakebringsalltheboystotheyard).setMinter(0, georgeP.address)



      await expectMintToBeCorrect(
        () => Free25.connect(georgeP).claim(383 ,0),
        383,
        25
      )

    })
  })

  describe('Free26', () => {

    let OFFON, ficken, georgeP
    beforeEach(async () => {
      await deployFrees()
      OFFON = await ethers.getContractAt(
        [
          'function latestHash() external view returns (uint256)',
          'function lastTurnedOn() external view returns (uint256)',
          'function turnOff() external',
          'function turnOn() external',
        ],
        '0xA860D381A193A0811C77c8FCD881B3E9F245A419'
      )

      ficken = await ethers.getImpersonatedSigner('0xE6C66da8e190989c7582a61b584aF091c1e5E6C1')
      georgeP = await ethers.getImpersonatedSigner('0xbc3Ced9089e13C29eD15e47FFE3e0cAA477cb069')

      await banker.sendTransaction({ to: ficken.address, value: toETH('5.0') })
      await banker.sendTransaction({ to: georgeP.address, value: toETH('5.0') })


    })

    it('should only mint aftet OFFON has been turned off and on again', async () => {
      await expectMintToBeCorrect(
        () => Free26.connect(steviep).claim(0),
        0,
        26
      )

      await expectRevert(
        Free26.connect(georgeP).claim(383),
        'Have you tried turning it off?'
      )

      await OFFON.connect(ficken).turnOff()

      await expectRevert(
        Free26.connect(georgeP).claim(383),
        'Have you tried turning it on?'
      )

      await OFFON.connect(ficken).turnOn()

      await expectMintToBeCorrect(
        () => Free26.connect(georgeP).claim(383),
        383,
        26
      )

      await expectRevert(
        Free26.connect(steviep).claim(altFree0),
        'Have you tried turning it off?'
      )
    })

  })


  describe('Free27', () => {
    let FiefdomVassal0
    beforeEach(async () => {
      await deployFrees()
      FiefdomVassal0 = await ethers.getContractAt(
        [
          'function activate(string name_, string symbol_, string license_, uint256 maxSupply_, address tokenURIContract_, address erc721Hooks_)',
          'function setMinter(address) external',
          'function mint(address, uint256) external',
        ],
        '0xf94001aBe7F7Efa3215cED2C0487273Cd8494b4f'
      )

    })

    it('should only allow fiefdom 0 token holders to mint', async () => {
      await FiefdomVassal0.connect(steviep).activate('', '', '', 100, zeroAddr, zeroAddr)

      await expectRevert(
        Free27.connect(steviep).claim(0, 1),
        'You do not lord over this vassal'
      )

      await expectMintToBeCorrect(
        () => Free27.connect(steviep).claim(0, 0),
        0,
        27
      )

      await expectRevert(
        Free27.connect(steviep).claim(altFree0, 0),
        'Token already used'
      )
    })
  })


  describe('Free28', () => {

    let MMO, noohp
    beforeEach(async () => {
      await deployFrees()
      MMO = await ethers.getContractAt(
        [
          'function ownerOf(uint256) external view returns (address)',
          'function safeTransferFrom(address from, address to, uint256 tokenId)',

        ],
        '0x41d3d86a84c8507A7Bc14F2491ec4d188FA944E7'
      )

      noohp = await ethers.getImpersonatedSigner('0x65f7b79FF49b3E3774E0A556c13525F906778FB7')

      await MMO.connect(noohp).safeTransferFrom(noohp.address, steviep.address, 1)

    })

    it('should only allow fiefdom 0 token holders to mint', async () => {


      const yayVotes = [0, 2, 3, 4, 5, 6, 11, 99, 100, 1459]
      const yayVotesUnordered = [0, 0, 3, 4, 5, 6, 11, 99, 100, 1459]
      const nayVotes = [0, 1, 3, 4, 5, 6, 11, 99, 100, 1459]

      await expectRevert(
        Free28.connect(steviep).claim(0, 1, 0, 0, 0, yayVotes),
        'Must own Prop15 token'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 2, 0, 0, yayVotes),
        'Must own MMO token'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 2, 0, yayVotes),
        'Must own MMO token'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 0, 2, yayVotes),
        'Must own MMO token'
      )



      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 1459, 1459, yayVotes),
        'MMO has already been thrown overboard'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 0, 1459, nayVotes),
        'Not yay vote'
      )


      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 1, 0, 1459, yayVotes),
        'Did not vote for Prop15'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 0, 1459, yayVotesUnordered),
        'Yays unordered'
      )

      await expectRevert(
        Free28.connect(steviep).claim(0, 0, 0, 0, 0, yayVotes),
        'No settlement address proposed'
      )

      await expectMintToBeCorrect(
        () => Free28.connect(steviep).claim(
          0,
          0,
          0,
          0,
          1459,
          yayVotes
        ),
        0,
        28
      )
    })
  })

  describe('Free29', () => {
    let start, MMO, Free0
    beforeEach(async () => {
      start = await snapshot()


      await deployFrees()
      MMO = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256)'],
        '0x41d3d86a84c8507A7Bc14F2491ec4d188FA944E7'
      )

      Free0 = await ethers.getContractAt(
        [
          'function claim() external',
        ],
        '0x5E965A4B2b53AaeCFaB51368f064c98531947A26'
      )
    })

    afterEach(() => start.restore())

    it('should send the free0 to the contract', async () => {
      await expectRevert(
        MMO.connect(steviep).safeTransferFrom(steviep.address, Free29.address, 0),
        'Not a Free token'
      )

      await expectRevert(
        FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, 1),
        'Invalid Free0'
      )


      const blockNumber = await ethers.provider.getBlockNumber()
      await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, 0)
      expect(await Free29.connect(steviep).free0TokenIdToOwner(0)).to.equal(steviep.address)
      expect(await FreeBase.connect(steviep).ownerOf(0)).to.equal(Free29.address)
    })

    it('should work', async () => {
      await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, 0)
      await expectRevert(
        Free29.connect(notMinter).claim(0),
        'Not original owner'
      )

      expect(await Free29.connect(steviep).mints()).to.equal(0)
      await Free29.connect(steviep).claim(0)

      expect(await FreeBase.connect(steviep).ownerOf(0)).to.equal(steviep.address)
      expect(await Free29.connect(steviep).mints()).to.equal(1)

      await expect0MetadataToBeCorrect(0, 29)

      expect(bnToN(
        await FreeBase.connect(steviep).tokenIdToCollectionId(
          await FreeBase.connect(steviep).totalSupply() - 1
        )
      )).to.equal(29)

      expect(
        await FreeBase.connect(steviep).ownerOf(
          await FreeBase.connect(steviep).totalSupply() - 1
        )
      ).to.equal(steviep.address)
    })

    it('should use the correct probability', async () => {
      expect(await Free29.connect(steviep).currentThreshold(0)).to.equal(0)
      expect(await Free29.connect(steviep).currentThreshold(1)).to.equal(1)
      expect(await Free29.connect(steviep).currentThreshold(2)).to.equal(2)
      expect(await Free29.connect(steviep).currentThreshold(3)).to.equal(3)
      expect(await Free29.connect(steviep).currentThreshold(4)).to.equal(4)
      expect(await Free29.connect(steviep).currentThreshold(5)).to.equal(5)
      expect(await Free29.connect(steviep).currentThreshold(6)).to.equal(6)
      expect(await Free29.connect(steviep).currentThreshold(7)).to.equal(7)
      expect(await Free29.connect(steviep).currentThreshold(8)).to.equal(8)
      expect(await Free29.connect(steviep).currentThreshold(9)).to.equal(7)
      expect(await Free29.connect(steviep).currentThreshold(10)).to.equal(6)
      expect(await Free29.connect(steviep).currentThreshold(11)).to.equal(5)
      expect(await Free29.connect(steviep).currentThreshold(12)).to.equal(4)
      expect(await Free29.connect(steviep).currentThreshold(13)).to.equal(3)
      expect(await Free29.connect(steviep).currentThreshold(14)).to.equal(2)
      expect(await Free29.connect(steviep).currentThreshold(15)).to.equal(1)
      expect(await Free29.connect(steviep).currentThreshold(16)).to.equal(0)
      expect(await Free29.connect(steviep).currentThreshold(17)).to.equal(1)
      expect(await Free29.connect(steviep).currentThreshold(18)).to.equal(2)
      // etc...
    })

    it.skip('should hold onto my token at mint 8', async () => {

      for (let i = 0; i < 25; i++) {
        const tokenId = await FreeBase.connect(steviep).totalSupply()
        await Free0.connect(steviep).claim()
        await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, tokenId)
        await Free29.connect(steviep).claim(tokenId)
      }

      const blockNumber = await ethers.provider.getBlockNumber()

      await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, 0)

      await expectRevert(
        Free29.connect(steviep).withdraw(0),
        'Must wait 2900000 blocks'
      )

      await expectRevert(
        Free29.connect(notMinter).withdraw(0),
        'Not original owner'
      )

      await Free29.connect(steviep).claim(0)
      expect(await FreeBase.connect(steviep).ownerOf(0)).to.equal(Free29.address)

      await expectRevert(
        Free29.connect(steviep).withdraw(0),
        'Must wait 2900000 blocks'
      )

      const stakedBlock = bnToN(await Free29.connect(steviep).free0TokenIdToStakedBlock(0))
      await time.advanceBlockTo(stakedBlock + 28998)

      await expectRevert(
        Free29.connect(steviep).withdraw(0),
        'Must wait 2900000 blocks'
      )

      expect(await FreeBase.connect(steviep).ownerOf(0)).to.equal(Free29.address)

      await time.advanceBlock()

      await Free29.connect(steviep).withdraw(0)

      expect(await FreeBase.connect(steviep).ownerOf(0)).to.equal(steviep.address)
    })


    it.skip('should give me some breakdowns', async () => {
      const mapping = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
      }
      for (let i = 0; i < 1200; i++) {
        const tokenId = await FreeBase.connect(steviep).totalSupply()
        const mints = await Free29.connect(steviep).mints()
        await Free0.connect(steviep).claim()
        await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, Free29.address, tokenId)
        await Free29.connect(steviep).claim(tokenId)
        if (i%50 === 0) console.log(i)
        const owner = await FreeBase.connect(steviep).ownerOf(tokenId)
        if (owner == Free29.address) {
          mapping[mints % 16]++
        }
      }

      console.log(mapping)

    })

    /*
    {
      '0': 0,
      '1': 18,
      '2': 37,
      '3': 61,
      '4': 94,
      '5': 133,
      '6': 162,
      '7': 174,
      '8': 200,
      '9': 180,
      '10': 159,
      '11': 148,
      '12': 100,
      '13': 77,
      '14': 35,
      '15': 36
    }


    */


    // it should roughly follow the probability schedule (0 always works, 8 always holds)
    // it should require 2900000 blocks to retry on held free0
    // run this like 500 times and log results
  })

  describe('Free30', () => {
    const steviep19 = 4434
    let stevEIpAddress

    let Free19
    beforeEach(async () => {
      await deployFrees()
      Free19 = await ethers.getContractAt(
        [
          'function assign(address) external',
        ],
        '0xaBCeF3a4aDC27A6c962b4fC17181F47E62244EF0'
      )

      stevEIpAddress = steveip.address
    })


    it('free19TokenAssign should work', async () => {

      await expectRevert(
        Free30.connect(notMinter).free19TokenAssign(steviep19, notMinter.address),
        'Not owner of token'
      )

      await expectRevert(
        Free30.connect(steviep).free19TokenAssign(1, steviep.address),
        'Token collection mismatch'
      )

      await expectRevert(
        Free30.connect(steviep).free19TokenAssign(steviep19, stevEIpAddress),
        'Must be Free19 contract claimer'
      )

      await Free19.connect(steviep).assign(steviep.address)


      await expectRevert(
        Free30.connect(steviep).free19TokenAssign(steviep19, stevEIpAddress),
        'Must be Free19 contract claimer for > 30 hours'
      )

      await time.increase(time.duration.hours(30.1))

      await expectRevert(
        Free30.connect(steviep).free19TokenAssign(steviep19, steviep.address),
        'Free19 token claimer cannot be set to Free19 contract claimer'
      )

      await Free30.connect(steviep).free19TokenAssign(steviep19, stevEIpAddress)


      const blockNumBefore = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumBefore)
      const timestampBefore = blockBefore.timestamp

      expect(await Free30.connect(steviep).free19ToClaimer(steviep19)).to.equal(steveip.address)
      expect(await Free30.connect(steviep).free19ToClaimerLastAssigned(steviep19)).to.equal(timestampBefore)
    })

    // this one's all fucked up
    it.skip('assign should work', async () => {
      await expectRevert(
        Free30.connect(notMinter).assign(steviep19, notMinter.address),
        'Not owner of token'
      )

      await expectRevert(
        Free30.connect(steviep).assign(1, steviep.address),
        'Token collection mismatch'
      )

      await expectRevert(
        Free30.connect(steviep).assign(steviep19, steviep.address),
        'Must be Free19 contract claimer'
      )

      await Free19.connect(steviep).assign(steviep.address)


      await expectRevert(
        Free30.connect(steviep).assign(steviep19, steviep.address),
        'Must be Free19 contract claimer for > 30 hours'
      )

      await time.increase(time.duration.hours(30.1))

      await expectRevert(
        Free30.connect(steviep).assign(steviep19, steviep.address),
        'Must be Free19 token claimer'
      )

      await Free30.connect(steviep).free19TokenAssign(steviep19, stevEIpAddress)
      await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, stevEIpAddress, steviep19)
      await Free19.connect(steveip).assign(stevEIpAddress)

      await expectRevert(
        Free30.connect(steveip).assign(steviep19, stevEIpAddress),
        'Must be Free19 token claimer for > 30 hours'
      )

      await time.increase(time.duration.hours(30.1))



      await expectRevert(
        Free30.connect(steveip).assign(steviep19, stevEIpAddress),
        'Free30 claimer cannot be set to Free19 token claimer'
      )

      await time.increase(time.duration.hours(30.1))



      await Free30.connect(steveip).assign(steviep19, steviep.address)

      const blockNumBefore = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumBefore)
      const timestampBefore = blockBefore.timestamp

      expect(await Free30.connect(steviep).free30Claimer()).to.equal(steviep.address)
      expect(await Free30.connect(steviep).free30ClaimerLastAssigned()).to.equal(timestampBefore)
    })

    it('claim should work', async () => {
      await Free19.connect(steviep).assign(steviep.address)
      await time.increase(time.duration.hours(31))

      await Free30.connect(steviep).free19TokenAssign(steviep19, stevEIpAddress)
      await Free19.connect(steveip).assign(stevEIpAddress)
      await FreeBase.connect(steviep)[safeTransferFrom](steviep.address, stevEIpAddress, steviep19)
      await time.increase(time.duration.hours(31))

      await Free30.connect(steveip).assign(steviep19, steviep.address)
      await Free30.connect(steveip).free19TokenAssign(steviep19, steviep.address)
      await Free19.connect(steviep).assign(steviep.address)
      await FreeBase.connect(steveip)[safeTransferFrom](stevEIpAddress, steviep.address, steviep19)

      await time.increase(time.duration.hours(31))

      await expectMintToBeCorrect(
        () => Free30.connect(steviep).claim(0, steviep19),
        0,
        30
      )

      await expectRevert(
        Free30.connect(steviep).claim(altFree0, steviep19),
        'Free19 already used'
      )
    })
  })


  describe.only('Free31', () => {

    beforeEach(async () => {
      await deployFrees()
    })

    it('should work without any funny stuff', async () => {
      await Free31.connect(steviep).checkIn(0)

      await time.increase(time.duration.hours(24))

      await Free31.connect(steviep).checkIn(0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(2)

      await Free31.connect(steviep).checkIn(0)

      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(1)

      await time.increase(time.duration.hours(24.75))

      await Free31.connect(steviep).checkIn(0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(2)

      await time.increase(time.duration.hours(25.5))

      await Free31.connect(steviep).checkIn(0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(1)

      await time.increase(time.duration.hours(24))
      await Free31.connect(steviep).checkIn(0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(2)

      await time.increase(time.duration.hours(24))
      await Free31.connect(steviep).checkIn(altFree0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(1)

      for (let i = 0; i < 31; i++) {
        await Free31.connect(steviep).checkIn(0)
        await time.increase(time.duration.hours(24))
      }

      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(31)
      await Free31.connect(steviep).checkIn(0)
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(1)

      await expectRevert(
        Free31.connect(steviep).claim(0),
        'Must have 31 days of continuous checkins'
      )

      for (let i = 0; i < 31; i++) {
        await Free31.connect(steviep).checkIn(0)
        await time.increase(time.duration.hours(24))
      }
      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(31)


      await time.increase(time.duration.minutes(5))

      await expectRevert(
        Free31.connect(steviep).claim(0),
        'Must claim within 1 hour of last checkin'
      )

      for (let i = 0; i < 31; i++) {
        await time.increase(time.duration.hours(24))
        await Free31.connect(steviep).checkIn(0)
      }

      await expectMintToBeCorrect(
        () => Free31.connect(steviep).claim(0),
        0,
        31
      )

      expect(await Free31.connect(steviep).continuousCheckins(steviep.address)).to.equal(0)
    })
  })


})










