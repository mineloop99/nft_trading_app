from brownie import network, config, exceptions
import pytest

from scripts.deploy_nft import deploy_nft
from scripts.helper import get_account


@pytest.mark.first
def test_ani_token_deploy():
    # Deploy Token
    account = get_account()
    nft = deploy_nft(account)
    tx = nft.transfer(config["networks"][network.show_active()]["recipient"], 5000000)
