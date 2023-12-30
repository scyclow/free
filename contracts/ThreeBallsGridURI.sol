// SPDX-License-Identifier: CC0


/*

CC0 2023
*/

import "./Dependencies.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.23;

interface IThreeBallsGrid {
  function owner() external view returns (address);
  function tokenIdToBalls(uint256) external view returns (uint256 a, uint256 b, uint256 c);
}

interface IFree33 {
  function ballCoords(uint256) external view returns (uint256 x, uint256 y);
  function isLine(uint256, uint256, uint256) external view returns (bool);
}

contract ThreeBallsGridURI {
  using Strings for uint256;

  IThreeBallsGrid public baseContract;
  IFree33 public free33;
  string public description = '';
  string public externalUrl = 'https://steviep.xyz/three-balls';
  string public license = 'CC0';

  constructor(address free33Addr) {
    baseContract = IThreeBallsGrid(msg.sender);
    free33 = IFree33(free33Addr);
  }

  function tokenURI(uint256 tokenId) external view returns (string memory) {

    bytes memory json = abi.encodePacked(
      'data:application/json;utf8,',
      '{"name": "Three Balls Grid",'
      '"description": "', description, '",'
      '"license": "', license, '",'
      '"external_url": "', externalUrl, '",'
      '"attributes": ', attrs(tokenId),','
      '"image": "', encodedSVG(tokenId),
      '"}'
    );
    return string(json);
  }

  function encodedSVG(uint256 tokenId) public view returns (string memory) {
    return string(abi.encodePacked(
      'data:image/svg+xml;base64,',
      Base64.encode(rawSVG(tokenId))
    ));
  }

  function attrs(uint256 tokenId) public view returns (bytes memory) {
    (uint256 a, uint256 b, uint256 c) = baseContract.tokenIdToBalls(tokenId);
    bool isLine = free33.isLine(a, b, c);

    return abi.encodePacked(
      '[{"trait_type": "Ball A", "value": "',a.toString(),'"},',
      '{"trait_type": "Ball B", "value": "',b.toString(),'"},',
      '{"trait_type": "Ball C", "value": "',c.toString(),'"},',
      '{"trait_type": "Is Line", "value": "',isLine ? 'true' : 'false','"}]'
    );
  }

  function rawSVG(uint256 tokenId) public view returns (bytes memory) {
    (uint256 a, uint256 b, uint256 c) = baseContract.tokenIdToBalls(tokenId);
    bool isLine = free33.isLine(a, b, c);

    (uint256 ax, uint256 ay) = free33.ballCoords(a);
    (uint256 bx, uint256 by) = free33.ballCoords(b);
    (uint256 cx, uint256 cy) = free33.ballCoords(c);


    bytes memory svg = abi.encodePacked(
      '<svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">'
      '<style>.g{font-size:15;}.isline{stroke:#fff;stroke-width:2.5}line{stroke-dasharray:4;stroke:#fff}circle{stroke-width:2;fill:#000}#a{stroke:#ff005b}#b{stroke:#0079ff}#c{stroke:#dbec49}text{text-anchor:middle;dominant-baseline:middle;fill:#fff}.bg{fill:#000}text{font:12px monospace}</style>'
      '<rect class="bg" x="0" y="0" width="420" height="420" />'
      '<rect x="30" y="30" width="360" height="360" stroke="#fff" fill="none"/>'
    );


    for (uint256 i; i < 6; ++i) {
      uint256 p = 30 + i * 60;
      if (i > 0) svg = abi.encodePacked(
        svg,
        '<line class="line" y1="30" y2="390" x1="',
        p.toString(),
        '" x2="',
        p.toString(),
        '"></line><line class="line" x1="30" x2="390" y1="',
        p.toString(),
        '" y2="',
        p.toString(),
        '"></line>'
      );


      svg = abi.encodePacked(
        svg,
        '<text x="',(p+30).toString(),'" y="15">',(i+1).toString(),'</text>',
        '<text y="',(p+30).toString(),'" x="15">',(i+1).toString(),'</text>'
      );
    }

    if (isLine) {
      svg = abi.encodePacked(
        svg,
        '<path class="isline" d="M ',
        (60 + (ax-1)*60).toString(),
        ' ',
        (60 + (ay-1)*60).toString(),
        ' L',
        (60 + (bx-1)*60).toString(),
        ' ',
        (60 + (by-1)*60).toString(),
        ' ',
        (60 + (cx-1)*60).toString(),
        ' ',
        (60 + (cy-1)*60).toString(),
        '" />'
      );
    }

    for (uint256 x = 1; x < 7; ++x) {
      for (uint256 y = 1; y < 7; ++y) {
        uint256 r = 20;
        uint256 _cx = 60 + (x-1) * 60;
        uint256 _cy = 60 + (y-1) * 60;

        if (x == ax && y == ay) {
          svg = abi.encodePacked(
            svg,
            '<circle id="a" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
          r -= 8;
        }

        if (x == bx && y == by) {
          svg = abi.encodePacked(
            svg,
            '<circle id="b" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
          r -= 8;
        }

        if (x == cx && y == cy) {
          svg = abi.encodePacked(
            svg,
            '<circle id="c" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
        }
      }
    }

    svg = abi.encodePacked(
      svg,
      '<text x="150" y="405" class="g" style="fill:#ff005b">',a.toString(),'</text>',
      '<text x="210" y="405" class="g" style="fill:#0079ff">',b.toString(),'</text>',
      '<text x="270" y="405" class="g" style="fill:#dbec49">',c.toString(),'</text>'

    );


    return abi.encodePacked(svg, '</svg>');
  }


  function updateMetadata(string calldata _externalUrl, string calldata _description, string calldata _license) external {
    require(msg.sender == baseContract.owner(), 'Ownable: caller is not the owner');

    externalUrl = _externalUrl;
    description = _description;
    license = _license;
  }
}
