// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import { store } from "@app";
import * as actions from "@actions/WalletsActions";

import { aesGcmEncrypt } from "@utils/crypto";

import { Wallet, WalletNew, saveWallet, syncWallet, calculateAddress } from "..";

/**
 * Edits a new wallet, encrypting its privatekey and password, saving it to
 * local storage, and dispatching the changes to the Redux store.
 *
 * @param addressPrefix - The prefixes of addresses on this node.
 * @param masterPassword - The master password used to encrypt the wallet
 *   password and privatekey.
 * @param wallet - The old wallet information.
 * @param updated - The new wallet information.
 * @param password - The password of the updated wallet.
 */
export async function editWallet(
  addressPrefix: string,
  masterPassword: string,
  wallet: Wallet,
  updated: WalletNew,
  password: string
): Promise<void> {
  // Calculate the privatekey and address for the given wallet format
  const { privatekey, address } = await calculateAddress(addressPrefix, updated, password);

  // Encrypt the password and privatekey. These will be decrypted on-demand.
  const encPassword = await aesGcmEncrypt(password, masterPassword);
  const encPrivatekey = await aesGcmEncrypt(privatekey, masterPassword);

  const finalWallet = {
    ...wallet,

    label: updated.label?.trim() || undefined, // clean up empty strings
    category: updated.category?.trim() || undefined,

    address,
    username: updated.username,
    encPassword,
    encPrivatekey,
    format: updated.format
  };

  // Save the updated wallet to local storage
  saveWallet(finalWallet);

  // Dispatch the changes to the redux store
  store.dispatch(actions.updateWallet(wallet.id, finalWallet));

  syncWallet(finalWallet);
}
