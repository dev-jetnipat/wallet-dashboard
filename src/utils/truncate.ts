export const truncateWalletAddress = (
  address: string,
  startLength = 4,
  endLength = 4
) => {
  if (!address || address.length < startLength + endLength) {
    return address;
  }
  const start = address.substring(0, startLength);
  const end = address.substring(address.length - endLength);
  return `${start}...${end}`;
};
