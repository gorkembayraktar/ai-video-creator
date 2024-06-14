import React, { useState } from 'react'





function Versions(): JSX.Element {
  const [versions] = useState(window.electron.process.versions)
  console.log(versions);
  return (
    <ul className="versions" style={{ position: 'fixed', bottom: 10, right: 0, display: 'block' }}>

      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="node-version">React v{React.version}</li>
    </ul>
  )
}

export default Versions
