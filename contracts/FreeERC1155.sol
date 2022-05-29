// SPDX-License-Identifier: CC0


/*
 /$$$$$$$$ /$$$$$$$  /$$$$$$$$ /$$$$$$$$
| $$_____/| $$__  $$| $$_____/| $$_____/
| $$      | $$  \ $$| $$      | $$
| $$$$$   | $$$$$$$/| $$$$$   | $$$$$
| $$__/   | $$__  $$| $$__/   | $$__/
| $$      | $$  \ $$| $$      | $$
| $$      | $$  | $$| $$$$$$$$| $$$$$$$$
|__/      |__/  |__/|________/|________/



 /$$
| $$
| $$$$$$$  /$$   /$$
| $$__  $$| $$  | $$
| $$  \ $$| $$  | $$
| $$  | $$| $$  | $$
| $$$$$$$/|  $$$$$$$
|_______/  \____  $$
           /$$  | $$
          |  $$$$$$/
           \______/
  /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$    /$$ /$$$$$$ /$$$$$$$$ /$$$$$$$
 /$$__  $$|__  $$__/| $$_____/| $$   | $$|_  $$_/| $$_____/| $$__  $$
| $$  \__/   | $$   | $$      | $$   | $$  | $$  | $$      | $$  \ $$
|  $$$$$$    | $$   | $$$$$   |  $$ / $$/  | $$  | $$$$$   | $$$$$$$/
 \____  $$   | $$   | $$__/    \  $$ $$/   | $$  | $$__/   | $$____/
 /$$  \ $$   | $$   | $$        \  $$$/    | $$  | $$      | $$
|  $$$$$$/   | $$   | $$$$$$$$   \  $/    /$$$$$$| $$$$$$$$| $$
 \______/    |__/   |________/    \_/    |______/|________/|__/


CC0 2021
*/

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */

import "./ERC1155Dependencies.sol";




interface IERC20Connection {
  function balanceOf(address _owner) external view returns (uint256 balance);
  function connectedTransferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract FreeERC1155 is Ownable, ERC165, IERC1155, IERC1155MetadataURI {
  using Address for address;

  mapping(uint256 => address) tokenIdToERC20Address;
  mapping(address => mapping(address => bool)) private _operatorApprovals;


  function connectERC20(address erc20Addr, uint256 id) public onlyOwner {
    tokenIdToERC20Address[id] = erc20Addr;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    return
      interfaceId == type(IERC1155).interfaceId ||
      interfaceId == type(IERC1155MetadataURI).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function balanceOf(address account, uint256 id) public view returns (uint256) {
    return IERC20Connection(tokenIdToERC20Address[id]).balanceOf(account);
  }


  function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
    public
    view
    virtual
    override
  returns (uint256[] memory) {
    require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");

    uint256[] memory batchBalances = new uint256[](accounts.length);

    for (uint256 i = 0; i < accounts.length; ++i) {
      batchBalances[i] = balanceOf(accounts[i], ids[i]);
    }

    return batchBalances;
  }

  function setApprovalForAll(address operator, bool approved) public virtual override {
    require(_msgSender() != operator, "ERC1155: setting approval status for self");

    _operatorApprovals[_msgSender()][operator] = approved;
    emit ApprovalForAll(_msgSender(), operator, approved);
  }

  function isApprovedForAll(address account, address operator) public view virtual override returns (bool) {
    return _operatorApprovals[account][operator];
  }


  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes calldata data
  ) external {
    require(
      from == _msgSender() || isApprovedForAll(from, _msgSender()),
      "ERC1155: caller is not owner nor approved"
    );
    require(to != address(0), "ERC1155: transfer to the zero address");

    address operator = _msgSender();

    IERC20Connection(tokenIdToERC20Address[id]).connectedTransferFrom(from, to, amount);

    emit TransferSingle(operator, from, to, id, amount);
    _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data);
  }


  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data
  ) external {
    require(
      from == _msgSender() || isApprovedForAll(from, _msgSender()),
      "ERC1155: transfer caller is not owner nor approved"
    );
    require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
    require(to != address(0), "ERC1155: transfer to the zero address");

    address operator = _msgSender();

    for (uint256 i = 0; i < ids.length; ++i) {
      uint256 id = ids[i];
      uint256 amount = amounts[i];

      IERC20Connection(tokenIdToERC20Address[id]).connectedTransferFrom(from, to, amount);
    }

    emit TransferBatch(operator, from, to, ids, amounts);
    _doSafeBatchTransferAcceptanceCheck(operator, from, to, ids, amounts, data);
  }

  function emitTransferEvent(address operator, address from, address to, uint256 id, uint256 amount) external {
    require(_msgSender() == tokenIdToERC20Address[id]);
    emit TransferSingle(operator, from, to, id, amount);
  }


  function uri(uint256 id) external view returns (string memory) {
    // ...
  }

  function _doSafeTransferAcceptanceCheck(
      address operator,
      address from,
      address to,
      uint256 id,
      uint256 amount,
      bytes memory data
  ) private {
    if (to.isContract()) {
      try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
        if (response != IERC1155Receiver(to).onERC1155Received.selector) {
          revert("ERC1155: ERC1155Receiver rejected tokens");
        }
      } catch Error(string memory reason) {
        revert(reason);
      } catch {
        revert("ERC1155: transfer to non ERC1155Receiver implementer");
      }
    }
  }

  function _doSafeBatchTransferAcceptanceCheck(
      address operator,
      address from,
      address to,
      uint256[] memory ids,
      uint256[] memory amounts,
      bytes memory data
  ) private {
    if (to.isContract()) {
      try IERC1155Receiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns (
        bytes4 response
      ) {
        if (response != IERC1155Receiver(to).onERC1155BatchReceived.selector) {
          revert("ERC1155: ERC1155Receiver rejected tokens");
        }
      } catch Error(string memory reason) {
        revert(reason);
      } catch {
        revert("ERC1155: transfer to non ERC1155Receiver implementer");
      }
    }
  }
}