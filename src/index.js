import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/antd.css';
import App from './App'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'


const container = document.getElementById('root')
const root = createRoot(container)
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
)
