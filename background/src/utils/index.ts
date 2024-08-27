
import os from 'os'
export const getIp = () => {
  const netDict = os.networkInterfaces()
  for (const devName in netDict) {
    const netList = netDict[devName]
    for (let i = 0; i < netList.length; i++) {
      const { address, family, internal, mac } = netList[i]
      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address
      }
    }
  }
}
