```tsx

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { initVoxioAgent } from 'voxioagent'

const agent = await initVoxioAgent({
  apiKey: import.meta.env.VITE_VOXIO_API_KEY, 
    pos 
    icon = {     
    }
});

// Continuously process messages
(async () => {
  for await (const message of agent.messages()) {
    console.log(message.type)
    if (message.type === 'binary') {
      console.log('Audio:', message.data.byteLength, 'bytes');
    } else {
      con
      sole.log('JSON/Text:', message.data);
    }
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)


```