import os
from brownie import Nft, Market
import yaml
import json
import shutil
from scripts.helper import get_account


def deploy_nft(account):
    nft = Nft.deploy({"from": account, "publish_sources": True})
    return nft


def deploy_market(account):
    market = Market.deploy({"from": account, "publish_sources": True})
    return market


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
