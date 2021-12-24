import os
from brownie import Nft, RewardToken, Staking, Market, config, network
import yaml
import json
import shutil


def deploy_nft(account):
    nft = Nft.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return nft


def deploy_market(account):
    market = Market.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return market


def deploy_reward_token(account):
    reward_token = RewardToken.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return reward_token


def deploy_staking(_rewardToken, _nftContract, _apr, _usdPerNftRate, account):
    staking = Staking.deploy(
        _rewardToken,
        _nftContract,
        _apr,
        _usdPerNftRate,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return staking


def update_front_end():
    # Send build to front end
    copy_build_to_client("./build", "../front_end/src/chain-info")

    # Send brownie config to front end
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("../front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)


def copy_build_to_client(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
