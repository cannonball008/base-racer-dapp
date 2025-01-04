// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useAccount } from "wagmi"

export const useUser = () => {
  const { isConnected } = useAccount()

  return !!isConnected
}
