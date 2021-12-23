from brownie import accounts, config, network

NETWORKS = ["ropsten", "rinkeby"]



def get_account():
    if network.show_active() in NETWORKS:
        account = accounts.add(config["wallets"]["private_key"])
    account = accounts[0]
    return account
