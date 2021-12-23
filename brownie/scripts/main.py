from scripts.deploy_nft import deploy_nft, deploy_market, update_front_end
from scripts.helper import get_account


def nft_token_deploy():
    # Deploy Token
    account = get_account()
    nftToken = deploy_nft(account)
    update_front_end()
    return nftToken


def market_deploy():
    # Deploy Token
    account = get_account()
    market = deploy_market(account)
    update_front_end()
    return market


def main():
    nft_token_deploy()
    market_deploy()
    update_front_end()
