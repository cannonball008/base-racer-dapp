//@ts-check
import { Button } from "@chakra-ui/react"
import { useAccount } from 'wagmi'
import useChainId from "../../hooks/useChainId"
import { useWeb3Modal } from "@web3modal/wagmi/react"

export const clampAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`

export const WalletBtn = () => {
  const { isConnected, address } = useAccount()
  const { unsupported} = useChainId()
  const web3Modal = useWeb3Modal()

  return <WalletButton account={{ displayName: address && clampAddress(address) }}
    chain={{ unsupported }}
    openAccountModal={() => web3Modal.open()}
    openChainModal={() => web3Modal.open()}
    openConnectModal={() => web3Modal.open()}
    authenticationStatus={isConnected ? "authenticated" : "not"}
  />
};

const WalletButton = ({
  account,
  chain,
  openAccountModal,
  openChainModal,
  openConnectModal,
  authenticationStatus,
}) => {
  const ready = authenticationStatus !== "loading";
  const connected =
    ready &&
    account &&
    chain &&
    (!authenticationStatus || authenticationStatus === "authenticated");
  return (
    <div
      {...(!ready && {
        "aria-hidden": true,
        style: {
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
        },
      })}
    >
      {(() => {
        if (!connected) {
          return (
            <Button
              fontSize={"1rem"}
              color={"white"}
              p={"1rem"}
              bg={"brand.100"}
              //@ts-ignore
              href={"#"}
              rounded={"5px"}
              fontWeight={900}
              _hover={{
                bg: "brand.300",
                color: "white",
              }}
              onClick={openConnectModal}
              type="button"
            >
              Connect Wallet
            </Button>
          );
        }
        if (chain.unsupported) {
          return (
            <Button
              fontSize={"1rem"}
              color={"white"}
              p={"1rem"}
              bg={"brand.100"}
              //@ts-ignore
              href={"#"}
              rounded={"5px"}
              fontWeight={900}
              _hover={{
                bg: "brand.300",
                color: "white",
              }}
              onClick={openChainModal}
              type="button"
            >
              Wrong network
            </Button>
          );
        }
        return (
          <div style={{ display: "flex", gap: 12 }}>
            {/* <button
              onClick={openChainModal}
              style={{ display: "flex", alignItems: "center" }}
              type="button"
            >
              {chain.hasIcon && (
                <div
                  style={{
                    background: chain.iconBackground,
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    overflow: "hidden",
                    marginRight: 4,
                  }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      style={{ width: 12, height: 12 }}
                    />
                  )}
                </div>
              )}
              {chain.name}
            </button> */}
            <Button
              fontSize={"1rem"}
              color={"white"}
              p={"1rem"}
              bg={"brand.100"}
              //@ts-ignore
              href={"#"}
              rounded={"5px"}
              fontWeight={900}
              _hover={{
                bg: "brand.300",
                color: "white",
              }}
              onClick={openAccountModal}
              type="button"
            >
              {account.displayName}
              {/* {account.displayBalance
                ? ` (${account.displayBalance})`
                : ""} */}
            </Button>
          </div>
        );
      })()}
    </div>
  );
}
