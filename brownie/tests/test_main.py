from brownie import accounts
import pytest
from scripts.deploy_nft import (
    deploy_nft,
    deploy_market,
    update_front_end,
    deploy_staking,
    deploy_reward_token,
)
from scripts.helper import get_account


@pytest.mark.first
def test_main():
    account = get_account()
    nftToken = deploy_nft(account)
    deploy_market(account)
    reward_token = deploy_reward_token(account)
    deploy_staking(reward_token.address, nftToken.address, 500, 10, account)
