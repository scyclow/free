const { expect } = require("chai")

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

