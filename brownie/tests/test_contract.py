from brownie import accounts
import pytest

from scripts.deploy_nft import deploy_nft
from scripts.helper import get_account


@pytest.mark.first
def test_nft_token_contract_basic():
    # Deploy Token
    account = get_account()
    nft = deploy_nft(account)
    # Mint nft
    nftName = "NFT TEST"
    tx = nft.mintNft(nftName)
    tx.wait(1)
    resultName = nft.nftItems("0")
    # check Id NFT
    assert resultName[0] == 0
    # check Name NFT
    assert resultName[1] == nftName
    # check Owner NFT
    resultOwner = nft.ownerOf("0")
    assert resultOwner == account.address


@pytest.mark.second
def test_nft_token_contract_advanced():
    # Deploy Token
    account = get_account()
    account2 = accounts[1]
    nft = deploy_nft(account)
    # Mint nft
    nftName = "NFT TEST"
    tx = nft.mintNft(nftName)
    tx.wait(1)
    # check approve
    tokenId = 0
    appr = nft.approve(account2.address, tokenId)
    appr.wait(1)
    getAppr = nft.getApproved(tokenId)
    assert getAppr == account2.address
    # check Transfer to account2
    trans = nft.transferFrom(account.address, account2.address, tokenId)
    trans.wait(1)
    ownerOf = nft.ownerOf(tokenId)
    assert ownerOf == account2.address


@pytest.mark.third
def test_nft_token_contract_advanced():
    # Deploy Token
    account = get_account()
    account2 = accounts[1]
    nft = deploy_nft(account)
    # Mint nft
    nftName = "NFT TEST"
    tx = nft.mintNft(nftName)
    tx.wait(1)
    # check approve
    tokenId = 0
    appr = nft.approve(account2.address, tokenId)
    appr.wait(1)
    getAppr = nft.getApproved(tokenId)
    assert getAppr == account2.address
    # check Transfer to account2
    trans = nft.transferFrom(account.address, account2.address, tokenId)
    trans.wait(1)
    ownerOf = nft.ownerOf(tokenId)
    assert ownerOf == account2.address
