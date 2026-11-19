import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Providers from './pages/Providers'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AddProvider from './pages/AddProvider'
import ProviderDetails from './pages/ProviderDetails'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/providers' element={<Providers />} />
        <Route path='/providers/:providerId' element={<ProviderDetails />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/addprovider' element={<AddProvider />} />
      </Routes>
    </>



  )
}

export default App
