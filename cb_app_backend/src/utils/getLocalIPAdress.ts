import os from 'os';

function getLocalIPAddress(): string | undefined {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaceInfos = networkInterfaces[interfaceName];
    for (const interfaceInfo of interfaceInfos || []) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
  return 'localhost'; // Fallback if no IP found
}

export default getLocalIPAddress;
