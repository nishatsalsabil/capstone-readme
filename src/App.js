import { Route, Routes } from "react-router-dom"
import SignIn from "./Components/Authentication/SignIn"
import Signup from "./Components/Authentication/Signup"
import Outline from "./Components/Outline/Outline"
import { ToastContainer } from 'react-toastify';
import Loading from "./Components/Loading/Loading";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	HomeOutlined,
	PlusOutlined,
	DownOutlined,
	MoreOutlined,
} from '@ant-design/icons'; //importing icons from ant design 


function App() {

	return (
		// Routes: based on these paths components will be shown 
		<>
			<Routes>
				<Route path={'/'} element={<SignIn />} />	
				<Route path={'/signup'} element={<Signup />} />
				<Route path={'/index'} element={<Outline />} />
				<Route path={'/loading'} element={<Loading />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
			/>
		</>
	)
}

export default App
