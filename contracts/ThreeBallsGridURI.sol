// SPDX-License-Identifier: CC0


/*
████████ ██   ██ ██████  ███████ ███████
   ██    ██   ██ ██   ██ ██      ██
   ██    ███████ ██████  █████   █████
   ██    ██   ██ ██   ██ ██      ██
   ██    ██   ██ ██   ██ ███████ ███████


██████   █████  ██      ██      ███████
██   ██ ██   ██ ██      ██      ██
██████  ███████ ██      ██      ███████
██   ██ ██   ██ ██      ██           ██
██████  ██   ██ ███████ ███████ ███████


 ██████  ██████  ██ ██████
██       ██   ██ ██ ██   ██
██   ███ ██████  ██ ██   ██
██    ██ ██   ██ ██ ██   ██
 ██████  ██   ██ ██ ██████



CC0 2023 - steviep.eth
*/

import "./Dependencies.sol";

pragma solidity ^0.8.23;

interface IThreeBallsGrid {
  function owner() external view returns (address);
  function tokenIdToBalls(uint256) external view returns (uint256 a, uint256 b, uint256 c);
  function isLight(uint256) external view returns (bool);
}

interface IFree33 {
  function THREE_BALLS(uint256) external view returns (bool);
  function ballCoords(uint256) external view returns (uint256 x, uint256 y);
  function isLine(
    int[2] memory ball_a,
    int[2] memory ball_b,
    int[2] memory ball_c
  ) external view returns (bool);
}

contract ThreeBallsGridURI {
  using Strings for uint256;

  IThreeBallsGrid public baseContract;
  IFree33 public free33;
  string public description = 'A visualizer for Free33. Call `setBalls(uint256 tokenId, uint256 a, uint256 b, uint256 c)` to display the position of balls A, B, and C. Call `isLight(uint256 tokenId, bool val)` to display in Light Mode.';
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

    (uint256 ax, uint256 ay) = free33.ballCoords(a);
    (uint256 bx, uint256 by) = free33.ballCoords(b);
    (uint256 cx, uint256 cy) = free33.ballCoords(c);

    bool isLine = free33.isLine([int(ax), int(ay)], [int(bx), int(by)], [int(cx), int(cy)]);
    bool isLight = baseContract.isLight(tokenId);

    return abi.encodePacked(
      '[{"trait_type": "Ball A", "value": "',a.toString(),'"},',
      '{"trait_type": "Ball B", "value": "',b.toString(),'"},',
      '{"trait_type": "Ball C", "value": "',c.toString(),'"},',
      '{"trait_type": "Is Line", "value": "',isLine ? 'true' : 'false','"},',
      '{"trait_type": "Light Mode", "value": "',isLight ? 'true' : 'false','"}]'
    );
  }

  function genStyle(uint256 tokenId) internal view returns (bytes memory) {
    bool isLight = baseContract.isLight(tokenId);
    string memory colorA = isLight ? '#d12c00' : '#ff005b';
    string memory colorB = isLight ? '#2800ff' : '#0079ff';
    string memory colorC = isLight ? '#04b700' : '#dbec49';
    string memory colorLight = isLight ? '#000' : '#fff';
    string memory colorDark = isLight ? '#fff' : '#000';

    bytes memory colorStrokes = abi.encodePacked('.strokeA{stroke:',colorA,'}.strokeB{stroke:',colorB,'}.strokeC{stroke:',colorC,'}');
    bytes memory colorFills = abi.encodePacked('.fillA{fill:',colorA,'}.fillB{fill:',colorB,'}.fillC{fill:',colorC,'}');
    bytes memory bw = abi.encodePacked('.strokeLight{stroke:',colorLight,'}.fillLight{fill:',colorLight,'}.fillDark{fill:',colorDark,'}');

    return abi.encodePacked(
      '<style>',
      colorStrokes,
      colorFills,
      bw,
      '.g{font-size:15}.isline{stroke-width:2.5}line{stroke-dasharray:4}circle{stroke-width:2}text{text-anchor:middle;dominant-baseline:middle}text{font:12px monospace}</style>'
    );
  }

  function rawSVG(uint256 tokenId) public view returns (bytes memory) {
    (uint256 a, uint256 b, uint256 c) = baseContract.tokenIdToBalls(tokenId);
    (uint256 ax, uint256 ay) = free33.ballCoords(a);
    (uint256 bx, uint256 by) = free33.ballCoords(b);
    (uint256 cx, uint256 cy) = free33.ballCoords(c);

    bool isLine = free33.isLine([int(ax), int(ay)], [int(bx), int(by)], [int(cx), int(cy)]);

    bytes memory svg = abi.encodePacked(
      '<svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">',
      genStyle(tokenId),
      '<rect class="fillDark" x="0" y="0" width="420" height="420" /><rect x="30" y="30" width="360" height="360" class="strokeLight" fill="none"/>'
    );

    for (uint256 i; i < 6; ++i) {
      uint256 p = 30 + i * 60;
      if (i > 0) svg = abi.encodePacked(
        svg,
        '<line class="strokeLight" y1="30" y2="390" x1="',
        p.toString(),
        '" x2="',
        p.toString(),
        '"></line><line class="strokeLight" x1="30" x2="390" y1="',
        p.toString(),
        '" y2="',
        p.toString(),
        '"></line>'
      );

      svg = abi.encodePacked(
        svg,
        '<text class="fillLight" x="',(p+30).toString(),'" y="15">',(i+1).toString(),'</text>',
        '<text class="fillLight" y="',(p+30).toString(),'" x="15">',(i+1).toString(),'</text>'
      );
    }

    if (isLine) {
      svg = abi.encodePacked(
        svg,
        '<path class="isline strokeLight" d="M ',
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
            '<circle class="strokeA fillDark" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
          r -= 8;
        }

        if (x == bx && y == by) {
          svg = abi.encodePacked(
            svg,
            '<circle class="strokeB fillDark" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
          r -= 8;
        }

        if (x == cx && y == cy) {
          svg = abi.encodePacked(
            svg,
            '<circle class="strokeC fillDark" cx="', _cx.toString(),'" cy="', _cy.toString(),'" r="', r.toString(),'"/>'
          );
        }
      }
    }

    bytes memory aId = abi.encodePacked('<text x="150" y="405" class="g fillA">', (free33.THREE_BALLS(a) ? a.toString() : ''), '</text>');
    bytes memory bId = abi.encodePacked('<text x="210" y="405" class="g fillB">', (free33.THREE_BALLS(b) ? b.toString() : ''), '</text>');
    bytes memory cId = abi.encodePacked('<text x="270" y="405" class="g fillC">', (free33.THREE_BALLS(c) ? c.toString() : ''), '</text>');
    svg = abi.encodePacked(
      svg,
      aId,
      bId,
      cId
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
