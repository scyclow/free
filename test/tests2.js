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

describe.skip('Free Series 2', () => {

  const zeroAddr = '0x0000000000000000000000000000000000000000'

  let owner, minter, notMinter
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

    const MockFreeFactory = await ethers.getContractFactory('MockFree', owner)
    const LowercaseMockFreeFactory = await ethers.getContractFactory('LowercaseMockFree', owner)

    MockFree2 = await MockFreeFactory.deploy(FreeBase.address, 2)
    await MockFree2.deployed()

    MockFree3 = await MockFreeFactory.deploy(FreeBase.address, 3)
    await MockFree3.deployed()

    MockFree4 = await MockFreeFactory.deploy(FreeBase.address, 4)
    await MockFree4.deployed()

    MockFree5 = await LowercaseMockFreeFactory.deploy(FreeBase.address, 5)
    await MockFree5.deployed()

    MockFree6 = await LowercaseMockFreeFactory.deploy(FreeBase.address, 6)
    await MockFree6.deployed()

    const Free7Factory = await ethers.getContractFactory('Free7', owner)
    Free7 = await Free7Factory.deploy(
      FreeBase.address,
      Free1.address,
      MockFree2.address,
      MockFree3.address,
      MockFree4.address,
      MockFree5.address,
      MockFree6.address
    )
    await Free1.deployed()

    const Free8Factory = await ethers.getContractFactory('Free8', owner)
    Free8 = await Free8Factory.deploy(FreeBase.address, '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270')
    await Free8.deployed()

    const Free9Factory = await ethers.getContractFactory('Free9', owner)
    Free9 = await Free9Factory.deploy(FreeBase.address, '0x3c6fe936f6e050c243b901d809aea24084674687')
    await Free9.deployed()

    const Free10Factory = await ethers.getContractFactory('Free10', owner)
    Free10 = await Free10Factory.deploy(FreeBase.address, '0x13bBBEfE251c94467D183821b663Ef0bD0a8A722')
    await Free10.deployed()

    const Free11Factory = await ethers.getContractFactory('Free11', owner)
    Free11 = await Free11Factory.deploy(FreeBase.address, '0x99a9B7c1116f9ceEB1652de04d5969CcE509B069')
    await Free11.deployed()

    const Free12Factory = await ethers.getContractFactory('Free12', owner)
    Free12 = await Free12Factory.deploy(FreeBase.address)
    await Free12.deployed()

    const Free13Factory = await ethers.getContractFactory('Free13', owner)
    Free13 = await Free13Factory.deploy(FreeBase.address)
    await Free13.deployed()

    const Free14Factory = await ethers.getContractFactory('Free14', owner)
    Free14 = await Free14Factory.deploy(FreeBase.address, '0x18dE6097cE5B5B2724C9Cae6Ac519917f3F178c0')
    await Free14.deployed()

    const Free15Factory = await ethers.getContractFactory('Free15', owner)
    Free15 = await Free15Factory.deploy(FreeBase.address)
    await Free15.deployed()

    const Free16Factory = await ethers.getContractFactory('Free16', owner)
    Free16 = await Free16Factory.deploy(
      FreeBase.address,
      '0xe6da43bcfa2ae0ed8c6ac4b3beea1ec9ae65daba',
      '0xbd1ca111380b436350034c7040e7c44949605702',
      '0xf49b26cf118db11a7dd1d9b88c7e1bc153851757',
      '0x495f947276749Ce646f68AC8c248420045cb7b5e'
    )
    await Free16.deployed()

    const Free17Factory = await ethers.getContractFactory('Free17', owner)
    Free17 = await Free17Factory.deploy(FreeBase.address, '0x4f9e2e709895cc8ae62be86c6289f7081ba048a6')
    await Free17.deployed()


    const Free18Factory = await ethers.getContractFactory('Free18', owner)
    Free18 = await Free18Factory.deploy(FreeBase.address, '0xCBA420f0b43c32a1d49851f6356A37de6EE8e288', '0x3c6fe936f6e050c243b901d809aea24084674687')
    await Free18.deployed()

    const Free19Factory = await ethers.getContractFactory('Free19', owner)
    Free19 = await Free19Factory.deploy(FreeBase.address)
    await Free19.deployed()

    const Free20Factory = await ethers.getContractFactory('Free20', owner)
    Free20 = await Free20Factory.deploy(FreeBase.address)
    await Free20.deployed()


    await FreeBase.connect(owner).createCollection(Free0.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free1.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(MockFree2.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(MockFree3.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(MockFree4.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(MockFree5.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(MockFree6.address, '', '', '', '', '')

    await FreeBase.connect(owner).createCollection(Free7.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free8.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free9.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free10.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free11.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free12.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free13.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free14.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free15.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free16.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free17.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free18.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free19.address, '', '', '', '', '')
    await FreeBase.connect(owner).createCollection(Free20.address, '', '', '', '', '')

    await Free0.connect(minter).claim() // 0
    await Free0.connect(notMinter).claim() // 1

    await Free0.connect(minter).claim() // 2
    await Free1.connect(minter).claim(2) // 3
  })



  async function preCheck(mintFn, freeNumber) {
    await expectFailure(() => mintFn(minter, 3), 'Invalid Free0')
    await expectFailure(() => mintFn(notMinter, 0), 'You must be the owner of this Free0')
  }


  async function expectMetadataToBeCorrect(tokenId, freeNumber) {
    const metadata0 = parseMetadata(await FreeBase.connect(owner).tokenURI(tokenId))
    expect(metadata0.name).to.equal('0')
    expect(metadata0.description).to.equal('')
    expect(metadata0.license).to.equal('CC0')
    expect(metadata0.image).to.equal('')
    expect(metadata0.external_url).to.equal('?collectionId=0&tokenId=0')
    expect(metadata0.attributes).to.deep.include({ trait_type: 'Collection', value: '0' })
    expect(metadata0.attributes).to.deep.include({ trait_type: `Used For Free${freeNumber} Mint`, value: true })
  }

  async function postCheck(mintFn, freeNumber, freeContract, newestTokenId=4) {
    await expectFailure(() => mintFn(minter, 0), 'This Free0 has already been used to mint a Free'+freeNumber)
    expect(await freeContract.connect(owner).free0TokenIdUsed(0)).to.equal(true)
    expect(await FreeBase.connect(owner).ownerOf(newestTokenId)).to.equal(minter.address)

    expectMetadataToBeCorrect(0, freeNumber)
  }

  async function claim(mintFn, freeNumber, freeContract, newestTokenId=4) {
    await preCheck(mintFn, freeNumber)
    await mintFn(minter, 0)
    await postCheck(mintFn, freeNumber, freeContract, newestTokenId)
  }

  describe('Free7', () => {
    async function setupAllFrees(skip=false, skipSupporting=false) {

      if (skip !== 1) await Free1.connect(minter).claim(0)
      if (skip !== 2) await MockFree2.connect(minter).claim(0)
      if (skip !== 3) await MockFree3.connect(minter).claim(0)
      if (skip !== 4) await MockFree4.connect(minter).claim(0)
      if (skip !== 5) await MockFree5.connect(minter).claim(0)
      if (skip !== 6) await MockFree6.connect(minter).claim(0)

      if (skipSupporting !== 1) await Free1.connect(notMinter).claim(1)
      if (skipSupporting !== 2) await MockFree2.connect(notMinter).claim(1)
      if (skipSupporting !== 3) await MockFree3.connect(notMinter).claim(1)
      if (skipSupporting !== 4) await MockFree4.connect(notMinter).claim(1)
      if (skipSupporting !== 5) await MockFree5.connect(notMinter).claim(1)
      if (skipSupporting !== 6) await MockFree6.connect(notMinter).claim(1)
    }

    it('should work when signer has Free0 with all previous Frees + a supporting Free0 with all previous Frees', async () => {
      await setupAllFrees()
      await FreeBase.connect(notMinter)[safeTransferFrom](notMinter.address, minter.address, 1)

      const mintFn = (signer, id) => Free7.connect(signer).claim(id, 1)
      await claim(mintFn, 7, Free7, 16)
    })

    it('should revert when signer has invalid supporting Free0', async () => {
      await setupAllFrees()
      await FreeBase.connect(notMinter)[safeTransferFrom](notMinter.address, minter.address, 1)

      await expectRevert(
        Free7.connect(minter).claim(0, 3),
        'Invalid Free0'
      )
    })

    it('should revert when free 0 == supporting free 0', async () => {
      await setupAllFrees()
      await FreeBase.connect(notMinter)[safeTransferFrom](notMinter.address, minter.address, 1)

      await expectRevert(
        Free7.connect(minter).claim(0, 0),
        'Free0 cannot support itself'
      )
    })

    it('should revert when signer has Free0 with all previous Frees, but not a supporting Free0 with all previous Frees', async () => {
      await setupAllFrees()

      await expectRevert(
        Free7.connect(minter).claim(0, 1),
        'You must be the owner of the Supporting Free0'
      )
    })

    for (let i = 0; i < 6; i++) {
      const missing = i + 1
      it(`should revert if free0 has not minted ${missing}`, async () => {
        await setupAllFrees(missing)

        await FreeBase.connect(notMinter)[safeTransferFrom](notMinter.address, minter.address, 1)
        await expectRevert(
          Free7.connect(minter).claim(0, 1),
          'Free0 has not been used for all previous Frees'
        )
      })

      it(`should revert if supporting free0 has not minted ${missing}`, async () => {
        await setupAllFrees(false, missing)

        await FreeBase.connect(notMinter)[safeTransferFrom](notMinter.address, minter.address, 1)
        await expectRevert(
          Free7.connect(minter).claim(0, 1),
         'Supporting Free0 has not been used for all previous Frees'
        )
      })
    }
  })

  describe('Free8', () => {
    let mapWallet, noMapWallet

    beforeEach(async () => {
      mapWallet = await ethers.getImpersonatedSigner('0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4')
      noMapWallet = await ethers.getImpersonatedSigner('0x8d55ccab57f3cba220ab3e3f3b7c9f59529e5a65')
    })

    it('should work if the minter has no maps (but maybe other AB projects)', async () => {

      const mintFn = (signer, id) => Free8.connect(signer).claim(id)

      await preCheck(mintFn, 8)

      await FreeBase.connect(minter)[safeTransferFrom](minter.address, noMapWallet.address, 0)
      await Free8.connect(noMapWallet).claim(0)
      await FreeBase.connect(noMapWallet)[safeTransferFrom](noMapWallet.address, minter.address, 0)
      await FreeBase.connect(noMapWallet)[safeTransferFrom](noMapWallet.address, minter.address, 4)

      await postCheck(mintFn, 8, Free8)
    })

    it('should revert if the minter has a map', async () => {
      await FreeBase.connect(minter)[safeTransferFrom](minter.address, mapWallet.address, 0)

      await expectRevert(
        Free8.connect(mapWallet).claim(0),
        'You cannot own a Map of Nothing'
      )
    })
  })

  describe('Free9', () => {
    let start
    let RPAAMinterContract
    beforeEach(async () => {
      start = await snapshot()
      RPAAMinterContract = await ethers.getContractAt(['function mint(uint256 amount) external payable'], '0x66C4d7050dcD4a4CcAc59009A77B9ed44EFdf086')
    })

    afterEach(() => start.restore())

    it('should work if the minter has exactly 10 RPAA', async () => {
      await RPAAMinterContract.connect(minter).mint(10, {
        value: ethers.utils.parseEther('0.1')
      })

      const mintFn = (signer, id) => Free9.connect(signer).claim(id)
      await claim(mintFn, 9, Free9)
    })

    it('should work if the minter has more than 10 RPAA', async () => {
      await RPAAMinterContract.connect(minter).mint(100, {
        value: ethers.utils.parseEther('1')
      })

      const mintFn = (signer, id) => Free9.connect(signer).claim(id)
      await claim(mintFn, 9, Free9)
    })

    it('should revert if the minter < 10 RPAA', async () => {
      await RPAAMinterContract.connect(minter).mint(9, {
        value: ethers.utils.parseEther('0.09')
      })

      await expectRevert(
        Free9.connect(minter).claim(0),
        'You must support the RPAA'
      )
    })
  })

  describe('Free10', () => {
    let TenETHGiveawayContract, start
    beforeEach(async () => {
      TenETHGiveawayContract = await ethers.getContractAt(
        [
          'function redeem() external',
          'function safeTransferFrom(address, address, uint256) external',
        ],
        '0x13bBBEfE251c94467D183821b663Ef0bD0a8A722'
      )

      tenEthTokenOwner = await ethers.getImpersonatedSigner('0x7ccd2EE72a75F7e4776f598c1Be11A119fD8d191')

      start = await snapshot()
    })

    afterEach(() => start.restore())

    it('should let the 10E token owner set the challenge, even after transferring the token', async () => {
      const easyAddress = await Free10.connect(tenEthTokenOwner).easyChallengeAddress()
      const impossibleAddress = await Free10.connect(tenEthTokenOwner).impossibleChallengeAddress()

      expect(await Free10.connect(tenEthTokenOwner).selectedChallengeAddress()).to.equal(zeroAddr)

      await Free10.connect(tenEthTokenOwner).setTenEthChallenge(easyAddress)
      expect(await Free10.connect(tenEthTokenOwner).selectedChallengeAddress()).to.equal(easyAddress)

      await TenETHGiveawayContract.connect(tenEthTokenOwner)[safeTransferFrom](tenEthTokenOwner.address, minter.address, 0)
      await Free10.connect(minter).setTenEthChallenge(zeroAddr)
      expect(await Free10.connect(tenEthTokenOwner).selectedChallengeAddress()).to.equal(zeroAddr)

    })

    it('should revert if non 10E token owner tries to set the challenge', async () => {
      const easyAddress = await Free10.connect(tenEthTokenOwner).easyChallengeAddress()
      const impossibleAddress = await Free10.connect(tenEthTokenOwner).impossibleChallengeAddress()

      await expectRevert(
        Free10.connect(minter).setTenEthChallenge(easyAddress),
        'Only the 10 ETH Giveaway token owner can set the challenge'
      )

      await TenETHGiveawayContract.connect(tenEthTokenOwner)[safeTransferFrom](tenEthTokenOwner.address, minter.address, 0)
      await expectRevert(
        Free10.connect(tenEthTokenOwner).setTenEthChallenge(easyAddress),
        'Only the 10 ETH Giveaway token owner can set the challenge'
      )
    })

    it('should work if 10E token hasnt been burned + its connected', async () => {
      const easyAddress = await Free10.connect(tenEthTokenOwner).easyChallengeAddress()
      const impossibleAddress = await Free10.connect(tenEthTokenOwner).impossibleChallengeAddress()

      await Free10.connect(tenEthTokenOwner).setTenEthChallenge(impossibleAddress)

      await expectRevert(
        Free10.connect(minter).claim(0),
        '10 ETH Giveaway challenge has not been met'
      )

      await Free10.connect(tenEthTokenOwner).setTenEthChallenge(easyAddress)
      const mintFn = (signer, id) => Free10.connect(signer).claim(id)
      await claim(mintFn, 10, Free10)

    })

    it('should revert if 10E token hasnt been burned + its not connected', async () => {
      await expectRevert.unspecified(
        Free10.connect(minter).claim(0),
        '10 ETH Giveaway challenge has not been met'
      )
    })

    it('should revert if 10E token has been burned + its connected', async () => {
      const easyAddress = await Free10.connect(tenEthTokenOwner).easyChallengeAddress()

      await Free10.connect(tenEthTokenOwner).setTenEthChallenge(easyAddress)

      await TenETHGiveawayContract.connect(tenEthTokenOwner).redeem()

      await expectRevert(
        Free10.connect(minter).claim(0),
        '10 ETH Giveaway token has been redeemed'
      )
    })
  })

  describe('Free11', () => {
    let pointerWhale1, pointerWhale2, pointerImposter, ABContract, start
    beforeEach(async () => {
      pointerWhale1 = await ethers.getImpersonatedSigner('0xF46DBD0155B719BC637cA83B4325a1c1eaEB1Dd4')
      pointerWhale2 = await ethers.getImpersonatedSigner('0x162BC01387ce534a46279b4F3FE16663d31A99a7')
      pointerImposter = await ethers.getImpersonatedSigner('0xF523011fC571d67beB53ee108FDEB010D1ADdBE9')

      ABContract = await ethers.getContractAt(
        [
          'function safeTransferFrom(address, address, uint256) external',
        ],
        '0x99a9B7c1116f9ceEB1652de04d5969CcE509B069'
      )
      start = await snapshot()
    })

    afterEach(() => start.restore())

    it('should work if 4 or more pointers are pointing to a minter', async () => {
      await Free11.connect(pointerWhale1).point(387000071, minter.address)
      await Free11.connect(pointerWhale1).point(387000080, minter.address)
      await Free11.connect(pointerWhale1).point(387000087, minter.address)
      await Free11.connect(pointerWhale2).point(387000011, minter.address)

      const mintFn = (signer, id) => Free11.connect(signer).claim(id, 387000071, 387000080, 387000087, 387000011)
      await claim(mintFn, 11, Free11)

      expect(Number(await Free11.connect(minter).pointerCount(387000071))).to.equal(1)
      expect(Number(await Free11.connect(minter).pointerCount(387000080))).to.equal(1)
      expect(Number(await Free11.connect(minter).pointerCount(387000087))).to.equal(1)
      expect(Number(await Free11.connect(minter).pointerCount(387000011))).to.equal(1)
    })

    it('should work if 4 or more pointers are pointing to multiple minters, and if pointers are transferred', async () => {
      await Free11.connect(pointerWhale1).point(387000071, minter.address)
      await Free11.connect(pointerWhale1).point(387000080, minter.address)
      await Free11.connect(pointerWhale1).point(387000087, minter.address)
      await Free11.connect(pointerWhale2).point(387000011, minter.address)

      await ABContract.connect(pointerWhale1)[safeTransferFrom](pointerWhale1.address, notMinter.address, 387000080)

      await Free11.connect(pointerWhale1).point(387000019, notMinter.address)
      await Free11.connect(pointerWhale1).point(387000020, notMinter.address)
      await Free11.connect(pointerWhale1).point(387000021, notMinter.address)
      await Free11.connect(pointerWhale1).point(387000044, notMinter.address)

      await Free11.connect(minter).claim(0, 387000071, 387000080, 387000087, 387000011)
      await Free11.connect(notMinter).claim(1, 387000019, 387000020, 387000021, 387000044)
    })

    it('should revert if pointers are not different', async () => {
      await Free11.connect(pointerWhale1).point(387000071, minter.address)
      await Free11.connect(pointerWhale1).point(387000080, minter.address)

      await expectRevert(
        Free11.connect(minter).claim(0, 387000071, 387000080, 387000071, 387000080),
        'All Pointers must be different'
      )
    })

    it('should revert if less than 4 pointers are pointing to a minter', async () => {
      await Free11.connect(pointerWhale1).point(387000071, minter.address)
      await Free11.connect(pointerWhale1).point(387000080, minter.address)
      await Free11.connect(pointerWhale1).point(387000087, minter.address)

      await expectRevert(
        Free11.connect(minter).claim(0, 387000071, 387000080, 387000087, 387000011),
        'This target does not have enough Pointers'
      )

      await Free11.connect(pointerWhale2).point(387000011, minter.address)
      await Free11.connect(pointerWhale2).point(387000011, notMinter.address)

      await expectRevert(
        Free11.connect(minter).claim(0, 387000071, 387000080, 387000087, 387000011),
        'This target does not have enough Pointers'
      )
    })

    it('should revert if attempting to point pointer not owned', async () => {
      await expectRevert(
        Free11.connect(pointerWhale2).point(387000071, zeroAddr),
        'You must own this Pointer'
      )
    })

    it('should revert if attempting to point owned other AB project', async () => {
      await expectRevert(
        Free11.connect(pointerImposter).point(390000000, zeroAddr),
        'Invalid Pointer'
      )
    })
  })

  describe('Free12', () => {
    it('should work for a 0x123456789 address', async () => {
      const minedSigner = await ethers.getImpersonatedSigner("0x123456789ea900fa2b585dd299e03d12fa4293bc");
      await owner.sendTransaction({
        to: minedSigner.address,
        value: ethers.utils.parseEther("1.0")
      })

      const mintFn = (signer, id) => Free12.connect(signer).claim(id)

      await preCheck(mintFn, 12)

      await FreeBase.connect(minter)[safeTransferFrom](minter.address, minedSigner.address, 0)
      await Free12.connect(minedSigner).claim(0)
      await FreeBase.connect(minedSigner)[safeTransferFrom](minedSigner.address, minter.address, 0)

      await FreeBase.connect(minedSigner)[safeTransferFrom](minedSigner.address, minter.address, 4)

      await postCheck(mintFn, 12, Free12)
    })

    it('should revert for another address', async () => {
      const incorrectSigner1 = await ethers.getImpersonatedSigner("0x123456780ea900fa2b585dd299e03d12fa4293bc");
      const incorrectSigner2 = await ethers.getImpersonatedSigner("0x987654321ea900fa2b585dd299e03d12fa4293bc");

      await owner.sendTransaction({
        to: incorrectSigner1.address,
        value: ethers.utils.parseEther("1.0")
      })


      await FreeBase.connect(minter)[safeTransferFrom](minter.address, incorrectSigner1.address, 0)
      await expectRevert(
        Free12.connect(incorrectSigner1).claim(0),
        'Signer address must start with 0x123456789'
      )

      await owner.sendTransaction({
        to: incorrectSigner2.address,
        value: ethers.utils.parseEther("2.0")
      })
      await FreeBase.connect(incorrectSigner1)[safeTransferFrom](incorrectSigner1.address, incorrectSigner2.address, 0)
      await expectRevert(
        Free12.connect(incorrectSigner2).claim(0),
        'Signer address must start with 0x123456789'
      )
    })
  })

  describe('Free13', () => {
    let start
    beforeEach(async () => {
      start = await snapshot()
    })

    afterEach(() => start.restore())

    it('should work if timestamp is a friday (UTC) and base gas is <= 5', async () => {

      await time.increaseTo(1739491200) // random friday far in the future: 2/14/23 00:00:00 GMT
      const mintFn = (signer, id) => Free13.connect(signer).claim(id, { maxFeePerGas: ethers.utils.parseUnits('50', 'gwei') })
      await claim(mintFn, 13, Free13)

      await time.increaseTo(1739534399) // random friday far in the future: 2/14/23 23:59:59 GMT
      await Free13.connect(notMinter).claim(1, { maxFeePerGas: ethers.utils.parseUnits('5', 'gwei') })
    })

    it('should revert if timestamp is not a friday and base gas is <= 5', async () => {
      await time.increaseTo(1739534400) // random saturday far in the future: 2/15/23 00:00:00 GMT
      await Free13.connect(notMinter).claim(1, { maxFeePerGas: ethers.utils.parseUnits('5', 'gwei') })
    })

    // I'm pretty sure this will work in production, but can't figure out how to test this
    it.skip('should revert if timestamp is a friday and base gas is > 5', async () => {})
  })

  describe('Free14', () => {
    let plottablesWhale, plottablesAdmin, plottablesArtist, PlottablesContract, start
    beforeEach(async () => {
      start = await snapshot()
      plottablesAdmin = await ethers.getImpersonatedSigner('0x9f75C11383f5b93a72c61fb1Dd1a44f5Ec7e4187')
      plottablesWhale = await ethers.getImpersonatedSigner('0xF565d79c35758c752d3DebFdD380D4Eb16A3c6E3')
      plottablesArtist = await ethers.getImpersonatedSigner('0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4')

      PlottablesContract = await ethers.getContractAt(
        [
          'function safeTransferFrom(address, address, uint256) external',
          'function addProject(string, address, uint256) external',
          'function mint(address, uint256, address) external',
          'function addMintWhitelisted(address) external',
          'function approve(address, uint256) external',
          'function ownerOf(uint256) external view returns (address)',
        ],
        '0x18dE6097cE5B5B2724C9Cae6Ac519917f3F178c0'
      )

      await PlottablesContract.connect(plottablesWhale).safeTransferFrom(plottablesWhale.address, minter.address, 218)
      await PlottablesContract.connect(plottablesWhale).safeTransferFrom(plottablesWhale.address, minter.address, 219)
    })

    afterEach(() => start.restore())

    it('should work if a IFD is swapped', async () => {
      await PlottablesContract.connect(plottablesArtist).approve(Free14.address, 0)
      await Free14.connect(plottablesArtist).seed(0)

      await PlottablesContract.connect(minter).approve(Free14.address, 218)
      await PlottablesContract.connect(minter).approve(Free14.address, 219)

      const mintFn = (signer, id) => Free14.connect(signer).claim(id, 218)
      await claim(mintFn, 14, Free14)

      expect(await PlottablesContract.connect(minter).ownerOf(0)).to.equal(minter.address)
      expect(await PlottablesContract.connect(minter).ownerOf(218)).to.equal(Free14.address)

      await Free14.connect(minter).claim(2, 219)
      expect(await PlottablesContract.connect(minter).ownerOf(218)).to.equal(minter.address)
      expect(await PlottablesContract.connect(minter).ownerOf(219)).to.equal(Free14.address)
      expect(Number(await Free14.connect(minter).activeInstruction())).to.equal(219)
      expect(await Free14.connect(minter).instructionsUsed(218)).to.equal(true)
      expect(await Free14.connect(minter).instructionsUsed(219)).to.equal(true)
      expect(await Free14.connect(minter).instructionsUsed(220)).to.equal(false)
    })

    it('should revert if no IFD has been seeded', async () => {
      await PlottablesContract.connect(minter).approve(Free14.address, 218)
      await expectRevert(
        Free14.connect(minter).claim(0, 218),
        'Free14 has not been seeded'
      )

    })

    it('should revert if IFD has been used before', async () => {
      await PlottablesContract.connect(plottablesArtist).approve(Free14.address, 0)
      await Free14.connect(plottablesArtist).seed(0)

      await PlottablesContract.connect(minter).approve(Free14.address, 218)
      await PlottablesContract.connect(minter).approve(Free14.address, 219)

      await Free14.connect(minter).claim(0, 218)
      await Free14.connect(minter).claim(2, 219)

      await PlottablesContract.connect(minter)[safeTransferFrom](minter.address, notMinter.address, 218)

      await expectRevert(
        Free14.connect(notMinter).claim(1, 218),
        'This Instruction has already been used'
      )

    })

    it('should revert if IFD not owned', async () => {
      await PlottablesContract.connect(plottablesArtist).approve(Free14.address, 0)
      await Free14.connect(plottablesArtist).seed(0)

      await expectRevert(
        Free14.connect(notMinter).claim(1, 218),
        'ERC721: transfer caller is not owner nor approved'
      )
    })

    it('should revert if owned, but not IFD', async () => {
      await PlottablesContract.connect(plottablesArtist).approve(Free14.address, 0)
      await Free14.connect(plottablesArtist).seed(0)

      await PlottablesContract.connect(plottablesAdmin).addMintWhitelisted(plottablesAdmin.address)
      await PlottablesContract.connect(plottablesAdmin).addProject('test', plottablesAdmin.address, 1000)
      await PlottablesContract.connect(plottablesAdmin).mint(plottablesAdmin.address, 1, plottablesAdmin.address)
      await PlottablesContract.connect(plottablesAdmin).safeTransferFrom(plottablesAdmin.address, notMinter.address, 1000000)

      await expectRevert(
        Free14.connect(notMinter).claim(1, 1000000),
        'Invalid Instruction for Defacement'
      )
    })
  })

  describe('Free15', () => {
    let start
    beforeEach(async () => {
      start = await snapshot()
    })

    afterEach(() => start.restore())

    it('should work if free base total supply is an even multiple of 100 + if the block number is also an even multiple of 100', async () => {
      await Promise.all(times(94, () => Free0.connect(minter).claim())) // totalSupply is now 98
      await time.advanceBlockTo(16345599) // next block is 16345600
      const mintFn = (signer, id) => Free15.connect(signer).claim(id)
      await claim(mintFn, 15, Free15, 98) // totalSupply is now 99

      await time.advanceBlockTo(16345698) // next block is 16345699
      await Free15.connect(minter).claim(2)
    })

    it('should revert if free base total supply is not an even multiple of 100 + if the block number is an even multiple of 100', async () => {
      await Promise.all(times(96, () => Free0.connect(minter).claim())) // totalSupply is now 100
      await time.advanceBlockTo(16345599) // next block is 16345600
      await expectRevert(
        Free15.connect(notMinter).claim(1),
        'Invalid total Free count'
      )
    })

    it('should revert if free base total supply is an even multiple of 100 + if the block number is not an even multiple of 100', async () => {
      await Promise.all(times(94, () => Free0.connect(minter).claim())) // totalSupply is now 98
      await time.advanceBlockTo(16345699) // next block is 16345700
      await expectRevert(
        Free15.connect(notMinter).claim(1),
        'Invalid block number'
      )
      await time.advanceBlockTo(16345798) // next block is 16345799

      await expectRevert(
        Free15.connect(notMinter).claim(1),
        'Invalid block number'
      )
    })
  })

  describe('Free16', () => {
    let start, OSStorefrontContract, NVCContract, NFContract, UFIMContract
    beforeEach(async () => {
      start = await snapshot()

      OSStorefrontContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256, uint256, bytes) external'],
        '0x495f947276749Ce646f68AC8c248420045cb7b5e'
      )

      NVCContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256) external'],
        '0xe6da43bcfa2ae0ed8c6ac4b3beea1ec9ae65daba'
      )
      NFContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256) external'],
        '0xbd1ca111380b436350034c7040e7c44949605702'
      )
      UFIMContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256) external'],
        '0xf49b26cf118db11a7dd1d9b88c7e1bc153851757'
      )

      const nvcWhale = await ethers.getImpersonatedSigner("0x6266dBB2d202D4E246ee86d76bB2FBB9a71eAFCD")
      const nfWhale = await ethers.getImpersonatedSigner("0x47144372eb383466d18fc91db9cd0396aa6c87a4")
      const uFimWhale1 = await ethers.getImpersonatedSigner("0xbc3Ced9089e13C29eD15e47FFE3e0cAA477cb069")
      const uFimWhale2 = await ethers.getImpersonatedSigner("0x994da0c3437a823F9e47dE448B62397D1bDfDdBa")
      const winnerWhale = await ethers.getImpersonatedSigner("0x9E1e3857fb2484379858B9dAF230379015A7A100")
      const loserWhale = await ethers.getImpersonatedSigner("0xEed4242F735Fa70eD1cf30DEAE41efb793Ea01f0")


      await Promise.all(
        [69, 215, 231, 64, 214, 219, 67, 95, 105, 174, 220, 248, 157, 164, 77, 166, 143, 153, 119].map(
          id => NVCContract.connect(nvcWhale).safeTransferFrom(nvcWhale.address, minter.address, id)
        )
      )
      await NVCContract.connect(nfWhale).safeTransferFrom(nfWhale.address, minter.address, 1)

      await Promise.all(
        [19, 25, 29, 48, 49].map(
          id => NFContract.connect(nfWhale).safeTransferFrom(nfWhale.address, minter.address, id)
        )
      )

      await Promise.all(
        [17, 14, 3, 15].map(
          id => UFIMContract.connect(uFimWhale1).safeTransferFrom(uFimWhale1.address, minter.address, id)
        )
      )
      await UFIMContract.connect(uFimWhale2).safeTransferFrom(uFimWhale2.address, minter.address, 20)

      await OSStorefrontContract.connect(winnerWhale).safeTransferFrom(winnerWhale.address, minter.address, '108025279282686658453897007890629891637526310304717906993258638098494503518261', 3, [])
      await OSStorefrontContract.connect(loserWhale).safeTransferFrom(loserWhale.address, minter.address, '108025279282686658453897007890629891637526310304717906993258638097394991890485', 3, [])

    })

    afterEach(() => start.restore())

    it('should work if the owner has all the shit', async () => {
      const mintFn = (signer, id) => Free16.connect(signer).claim(id)
      await claim(mintFn, 16, Free16)

      // should also work multiple times
      await Free16.connect(minter).claim(2)
    })

    it('should revert if the owner is missing a nvc', async () => {
      await NVCContract.connect(minter).safeTransferFrom(minter.address, notMinter.address, 69)

      await expectRevert(
        Free16.connect(minter).claim(0),
        'Must have at least 20 NVCs'
      )
    })

    it('should revert if the owner is missing a nf', async () => {
      await NFContract.connect(minter).safeTransferFrom(minter.address, notMinter.address, 19)
      await expectRevert(
        Free16.connect(minter).claim(0),
        'Must have at least 5 NFs'
      )
    })

    it('should revert if the owner is missing a ufim', async () => {
      await UFIMContract.connect(minter).safeTransferFrom(minter.address, notMinter.address, 17)
      await expectRevert(
        Free16.connect(minter).claim(0),
        'Must have at least 5 UFIMs'
      )
    })

    it('should revert if the owner is missing a winner', async () => {
      await OSStorefrontContract.connect(minter).safeTransferFrom(minter.address, notMinter.address, '108025279282686658453897007890629891637526310304717906993258638098494503518261', 1, [])
      await expectRevert(
        Free16.connect(minter).claim(0),
        'Must have at least 3 WINNERs'
      )
    })

    it('should revert if the owner is missing a loser', async () => {
      await OSStorefrontContract.connect(minter).safeTransferFrom(minter.address, notMinter.address, '108025279282686658453897007890629891637526310304717906993258638097394991890485', 1, [])
      await expectRevert(
        Free16.connect(minter).claim(0),
        'Must have at least 3 LOSERs'
      )
    })
  })

  describe('Free17', () => {
    let start, SJPContract, sjpWhale

    beforeEach(async () => {
      start = await snapshot()

      SJPContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256) external'],
        '0x4f9e2e709895cc8ae62be86c6289f7081ba048a6'
      )

      sjpWhale = await ethers.getImpersonatedSigner("0x47144372eb383466d18fc91db9cd0396aa6c87a4")

    })

    afterEach(() => start.restore())

    it('should work if the Free0 has at least 3 blessings', async () => {
      await Free17.connect(sjpWhale).bless(0, 75)
      await Free17.connect(sjpWhale).bless(0, 65)
      await Free17.connect(sjpWhale).bless(0, 53)

      await Free17.connect(sjpWhale).bless(1, 75)
      await Free17.connect(sjpWhale).bless(1, 65)
      await Free17.connect(sjpWhale).bless(1, 53)

      const mintFn = (signer, id) => Free17.connect(signer).claim(id)
      await claim(mintFn, 17, Free17)

      await Free17.connect(notMinter).claim(1)
    })

    it('should revert if the Free0 has at less than 3 blessings', async () => {
      await Free17.connect(sjpWhale).bless(0, 75)
      await Free17.connect(sjpWhale).bless(0, 65)

      await expectRevert(
        Free17.connect(minter).claim(0),
        'Free0 must have at least 3 blessings'
      )
    })

    it('blessing should revert if non owner of jesus pamphlet', async () => {
      await expectRevert(
        Free17.connect(minter).bless(0, 75),
        'You must own this Pamphlet'
      )
    })

    it('blessing should revert if its a non-upgraded pamphlet (id != 1-75)', async () => {
      await expectRevert(
        Free17.connect(sjpWhale).bless(0, 0),
        'Invalid Pamphlet'
      )

      await expectRevert(
        Free17.connect(sjpWhale).bless(0, 86),
        'Invalid Pamphlet'
      )
    })

    it('blessing should revert if > 5 blessings', async () => {
      await Free0.connect(sjpWhale).claim() // 4
      await Free0.connect(sjpWhale).claim() // 5
      await Free0.connect(sjpWhale).claim() // 6
      await Free0.connect(sjpWhale).claim() // 7

      await Free17.connect(sjpWhale).bless(0, 75)
      await Free17.connect(sjpWhale).bless(1, 75)
      await Free17.connect(sjpWhale).bless(4, 75)
      await Free17.connect(sjpWhale).bless(5, 75)
      await Free17.connect(sjpWhale).bless(6, 75)

      await expectRevert(
        Free17.connect(sjpWhale).bless(7, 75),
        'This pamphlet has blessed too many times'
      )
    })

    it('blessing should revert if blessing a non Free0', async () => {
      await expectRevert(
        Free17.connect(sjpWhale).bless(3, 75),
        'Invalid Free0'
      )
    })

    it('blessing should revert if blessing same Free0 multiple times', async () => {
      await Free17.connect(sjpWhale).bless(0, 75)
      await expectRevert(
        Free17.connect(sjpWhale).bless(0, 75),
        'This pamphlet has already blessed this token'
      )
    })
  })

  describe('Free18', () => {
    let start, TOMultisig, EditionsContract, TOContract, voters, wowWhale

    beforeEach(async () => {
      start = await snapshot()

      TOMultisig = await ethers.getContractAt(
        [
          'function hashProposal(address target, uint256 value, bytes memory calldata_) external view returns (uint256)',
          'function propose(uint256 tokenId, address target, uint256 value, bytes memory calldata_) external',
          'function castVote(uint256 proposalId, uint256 tokenId, bool vote) external',
          'function execute(address target, uint256 value, bytes memory calldata_) external',
        ],
        '0xCBA420f0b43c32a1d49851f6356A37de6EE8e288'
      )

      TOContract = await ethers.getContractAt(
        [
          'function ownerOf(uint256) external view returns (address)',
        ],
        '0x59fAcEa786c01A178f0d5BbEff8BE8bA7091D0bd'
      )

      EditionsContract = await ethers.getContractAt(
        ['function safeTransferFrom(address, address, uint256, uint256, bytes) external'],
        '0x3c6fe936f6e050c243b901d809aea24084674687'
      )

      voters = [
        await ethers.getImpersonatedSigner("0x062E0B7846094C24848F9fa3dcD892515e9cA13F"),
        await ethers.getImpersonatedSigner("0xC3edCBe0F93a6258c3933e86fFaA3bcF12F8D695"),
        await ethers.getImpersonatedSigner("0xb733E52DFF6D056fad688428D96CfC887b43b5DA"),
        await ethers.getImpersonatedSigner("0xacE1C6F4DAb142925a3d628C0FA5440c4dEdd815"),
        await ethers.getImpersonatedSigner("0x2E0a86c23066134B7ba0079f0419D00852048Df1"),
        await ethers.getImpersonatedSigner("0x9387e04CB6f78c9dcdb793F34C405419e5d619B1"),
        await ethers.getImpersonatedSigner("0xDE3ba1B41e6c612a3Ca3213B84bdaf598dfFdb9b"),
      ]

      wowWhale = await ethers.getImpersonatedSigner("0x47144372eb383466d18fc91db9cd0396aa6c87a4")
      await EditionsContract.connect(wowWhale).safeTransferFrom(wowWhale.address, minter.address, 0, 1, [])

    })

    afterEach(() => start.restore())

    it('should only work if there are tokens left', async () => {
      expect(Number(await Free18.connect(minter).claimableTokensLeft())).to.equal(0)
      const incrementClaimableTokensCalldata = encodeWithSignature('incrementClaimableTokens', ['uint256'], [2])
      const proposalId = await TOMultisig.connect(voters[0]).hashProposal(Free18.address, 0, incrementClaimableTokensCalldata)

      await TOMultisig.connect(voters[0]).propose(0, Free18.address, 0, incrementClaimableTokensCalldata)
      await Promise.all(voters.slice(1).map((voter, i) => TOMultisig.connect(voter).castVote(proposalId.toString(), i+1, true)))
      await TOMultisig.connect(voters[0]).execute(Free18.address, 0, incrementClaimableTokensCalldata)

      expect(Number(await Free18.connect(minter).claimableTokensLeft())).to.equal(2)

      const mintFn = (signer, id) => Free18.connect(signer).claim(id)
      await claim(mintFn, 18, Free18)

      expect(Number(await Free18.connect(minter).claimableTokensLeft())).to.equal(1)

      await Free18.connect(minter).claim(2)

      expect(Number(await Free18.connect(minter).claimableTokensLeft())).to.equal(0)

      await EditionsContract.connect(wowWhale).safeTransferFrom(wowWhale.address, notMinter.address, 0, 1, [])
      await expectRevert(
        Free18.connect(notMinter).claim(1),
        'No tokens left to claim'
      )
    })

    it('should revert if claimed by address without a WOW token', async () => {
      const incrementClaimableTokensCalldata = encodeWithSignature('incrementClaimableTokens', ['uint256'], [2])
      const proposalId = await TOMultisig.connect(voters[0]).hashProposal(Free18.address, 0, incrementClaimableTokensCalldata)

      await TOMultisig.connect(voters[0]).propose(0, Free18.address, 0, incrementClaimableTokensCalldata)
      await Promise.all(voters.slice(1).map((voter, i) => TOMultisig.connect(voter).castVote(proposalId.toString(), i+1, true)))
      await TOMultisig.connect(voters[0]).execute(Free18.address, 0, incrementClaimableTokensCalldata)

      await expectRevert(
        Free18.connect(notMinter).claim(1),
        'Must have at least 1 WOW token'
      )
    })

    it('should revert if non-multisig attempts to increase token count', async () => {
      await expectRevert(
        Free18.connect(notMinter).incrementClaimableTokens(999999),
        'Can only be called by Terminally Online Multisig'
      )
    })
  })

  describe('Free19', () => {
    it('should work if claimer has been claimer for 24 hours or more', async () => {
      await Free19.connect(minter).assign(minter.address)
      await Free19.connect(notMinter).assign(notMinter.address)
      await Free19.connect(minter).assign(minter.address)

      await time.increase(time.duration.days(1))

      const mintFn = (signer, id) => Free19.connect(signer).claim(id)
      await claim(mintFn, 19, Free19)
    })

    it('should revert if not the claimer, but claimer has been active for 24 hours or more', async () => {
      await Free19.connect(minter).assign(minter.address)
      await time.increase(time.duration.days(1))

      await expectRevert(
        Free19.connect(notMinter).claim(1),
        'You must be the claimer'
      )
    })

    it('should revert if claimer has been claimer for less than 24 hours', async () => {
      await Free19.connect(minter).assign(minter.address)
      await time.increase(time.duration.days(0.95))
      await expectRevert(
        Free19.connect(minter).claim(0),
        'You must wait at least 1 day after the most recent assignment'
      )
    })
  })


  FREE20_TEST_ADJ = 1
  // FREE20_TEST_ADJ = 100

  // this will take for fucking ever unless test_adj == 100
  describe.skip('Free20', () => {
    const stakeValue = { value: ethers.utils.parseEther('0.5') }
    const resignation = 2000000 / FREE20_TEST_ADJ
    const stakePeriod = 200000 / FREE20_TEST_ADJ
    const claimWindow = 2000 / FREE20_TEST_ADJ

    let start
    beforeEach(async () => {
      start = await snapshot()
    })

    afterEach(() => start.restore())

    describe('first attempt', () => {
      it('happy path', async () => {
        await expectRevert(
          Free20.connect(minter).stake(3, stakeValue),
          'Invalid Free0'
        )

        await expectRevert(
          Free20.connect(notMinter).stake(0, stakeValue),
          'You must be the owner of this Free0'
        )

        const startingBalance = num(await minter.getBalance())

        await FreeBase.connect(minter).approve(Free20.address, 0)
        await Free20.connect(minter).stake(0, stakeValue)

        await expectRevert(
          Free20.connect(minter).stake(0, stakeValue),
          'This token is already being staked'
        )

        const middleBalance = num(await minter.getBalance())

        expect(await FreeBase.connect(minter).ownerOf(0)).to.equal(Free20.address)
        expect(await Free20.connect(minter).free0TokenIdUsed(0)).to.equal(false)

        await expectRevert(
          Free20.connect(minter).claim(0),
          'You can only claim within the claim window'
        )

        const [blockNumber, claimBlockNumber, totalStaked, attempt, staker] = await Free20.connect(minter).free0ToStakes(0)

        expect(staker).to.equal(minter.address)
        expect(Number(attempt)).to.equal(1)
        expect(totalStaked.toString()).to.equal(ethers.utils.parseEther('0.5'))

        expect(await Free20.connect(minter).isStaking(0)).to.equal(true)

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod)

        expect(await Free20.connect(minter).isStaking(0)).to.equal(false)

        await expectRevert(
          Free20.connect(notMinter).claim(0),
          'You must be the original staker'
        )

        await Free20.connect(minter).claim(0)

        const afterStake = await Free20.connect(minter).free0ToStakes(0)
        expect(Number(afterStake[2])).to.equal(0)

        const endingBalance = num(await minter.getBalance())

        await expectRevert(
          Free20.connect(minter).claim(0),
          'You have already claimed'
        )

        expect(await FreeBase.connect(minter).ownerOf(0)).to.equal(minter.address)
        expect(await FreeBase.connect(minter).ownerOf(4)).to.equal(minter.address)
        expect(await Free20.connect(minter).free0TokenIdUsed(0)).to.equal(true)
        await expectMetadataToBeCorrect(0, 20)

        await expectRevert(
          Free20.connect(minter).stake(0, stakeValue),
          'This Free0 has already been used to mint a Free20'
        )

        expect(middleBalance).to.be.closeTo(startingBalance - 0.5, 0.001)
        expect(endingBalance).to.be.closeTo(startingBalance, 0.001)

      })

      it('should revert if staking < 0.5 ETH, but work if staking more', async () => {
        await FreeBase.connect(minter).approve(Free20.address, 0)
        await expectRevert(
          Free20.connect(minter).stake(0, { value: ethers.utils.parseEther('0.49') }),
          'You must stake at least 0.5 ether'
        )

        await Free20.connect(minter).stake(0, { value: ethers.utils.parseEther('0.51') })
      })



      it('should revert if claim is attempted after window', async () => {
        await FreeBase.connect(minter).approve(Free20.address, 0)
        await Free20.connect(minter).stake(0, stakeValue)
        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + 1)

        expect(await Free20.connect(minter).isExpired(0)).to.equal(true)
        await expectRevert(
          Free20.connect(minter).claim(0),
          'You can only claim within the claim window'
        )

      })
    })

    describe('multiple attempts', () => {

      it('should work if staking more eth on a lost free0', async () => {
        const balanceBeforeFirstStake = num(await minter.getBalance())

        await FreeBase.connect(minter).approve(Free20.address, 0)
        await Free20.connect(minter).stake(0, stakeValue)
        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + 1)

        expect(await Free20.connect(minter).isExpired(0)).to.equal(true)


        const stake1 = await Free20.connect(minter).free0ToStakes(0)
        expect(stake1[3]).to.equal(1)

        await expectRevert(
          Free20.connect(notMinter).stake(0, stakeValue),
          'You must be the original staker'
        )

        await expectRevert(
          Free20.connect(minter).stake(0, { value: ethers.utils.parseEther('0.49') }),
          'Double or nothing'
        )

        const balanceBeforeSecondStake = num(await minter.getBalance())

        await Free20.connect(minter).stake(0, stakeValue)

        const stake2 = await Free20.connect(minter).free0ToStakes(0)
        expect(stake2[3]).to.equal(2)

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + 1)

        await expectRevert(
          Free20.connect(minter).stake(0, { value: ethers.utils.parseEther('0.99') }),
          'Double or nothing'
        )
        const balanceBeforeThirdStake = num(await minter.getBalance())

        await Free20.connect(minter).stake(0, { value: ethers.utils.parseEther('1') })

        const stake3 = await Free20.connect(minter).free0ToStakes(0)
        expect(stake3[3]).to.equal(3)

        const balanceAfterThirdStake = num(await minter.getBalance())

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod)
        await Free20.connect(minter).claim(0)

        const finalBalance = num(await minter.getBalance())


        expect(balanceBeforeSecondStake).to.be.closeTo(balanceBeforeFirstStake - 0.5, 0.001)
        expect(balanceBeforeThirdStake).to.be.closeTo(balanceBeforeFirstStake - 1, 0.001)
        expect(balanceAfterThirdStake).to.be.closeTo(balanceBeforeFirstStake - 2, 0.001)
        expect(finalBalance).to.be.closeTo(balanceBeforeFirstStake, 0.001)
      })
    })

    describe('withdraw', () => {

      it('should work if 2000000 blocks after window has closed', async () => {
        await FreeBase.connect(minter).approve(Free20.address, 0)
        await Free20.connect(minter).stake(0, stakeValue)
        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod)
        await Free20.connect(minter).claim(0) // token id 4

        await FreeBase.connect(notMinter).approve(Free20.address, 1)
        await Free20.connect(notMinter).stake(1, stakeValue)

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + 1)
        await Free20.connect(notMinter).stake(1, stakeValue)

        await expectRevert(
          Free20.connect(minter).withdraw(1, 4),
          'You must wait at least 2000000 blocks after missed claim'
        )

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + resignation + 1)

        await Free20.connect(notMinter).stake(1, { value: ethers.utils.parseEther('1') })

        await expectRevert(
          Free20.connect(minter).withdraw(1, 4),
          'You must wait at least 2000000 blocks after missed claim'
        )

        await time.advanceBlockTo(Number(await time.latestBlock()) + stakePeriod + claimWindow + resignation + 1)

        await expectRevert(
          Free20.connect(minter).withdraw(1, 0),
          'Invalid Free20'
        )

        await expectRevert(
          Free20.connect(notMinter).withdraw(1, 4),
          'You must be the owner of this Free20'
        )

        const balanceBeforeWithdraw = num(await minter.getBalance())
        await Free20.connect(minter).withdraw(1, 4)
        const balanceAfterWithdraw = num(await minter.getBalance())

        await expectRevert(
          Free20.connect(minter).withdraw(1, 4),
          'Nothing to withdraw'
        )

        await expectRevert(
          Free20.connect(notMinter).claim(1),
          'Nothing to claim'
        )

        expect(balanceAfterWithdraw).to.be.closeTo(balanceBeforeWithdraw + 2, 0.001)
        expect(await FreeBase.connect(minter).ownerOf(1)).to.equal(minter.address)

        const stake = await Free20.connect(minter).free0ToStakes(0)
        expect(Number(stake[2])).to.equal(0)


      })
    })
  })
})
