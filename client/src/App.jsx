// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Layout from './pages/Layout'
// import Dashboard from './pages/Dashboard'
// import WriteArticle from './pages/WriteArticle'
// import BlogTitles from './pages/BlogTitles'
// import GenerateImages from './pages/GenerateImages'
// import RemoveBackground from './pages/RemoveBackground'
// import RemoveObject from './pages/RemoveObject'
// import ReviewResume from './pages/ReviewResume'
// import Community from './pages/Community'
// //import { useAuth } from '@clerk/clerk-react'
// import {Toaster} from 'react-hot-toast'

// const App = () => {

  

//   return (
//     <div>
//       <Toaster/>
//       <Routes>
//         <Route path = '/' element={<Home/>}/>
//         <Route path = '/ai' element={<Layout/>}>
//           <Route index element = {<Dashboard/>}/>
//           <Route path = 'write-Article' element = {<WriteArticle/>}/>
//           <Route path = 'blog-titles' element = {<BlogTitles/>}/>
//           <Route path = 'generate-images' element = {<GenerateImages/>}/>
//           <Route path = 'remove-background' element = {<RemoveBackground/>}/>
//           <Route path = 'remove-object' element = {<RemoveObject/>}/>
//           <Route path = 'review-resume' element = {<ReviewResume/>}/>
//           <Route path = 'community' element = {<Community/>}/>

//         </Route>
//       </Routes>
//     </div>
//   )
// }

// export default App
import React from 'react'
import { Route, Routes } from 'react-router-dom'
// NOTE: Assuming all component files (e.g., Home.jsx, Layout.jsx) are correctly cased
// and located in the './pages/' directory.
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { SignIn, SignUp } from '@clerk/clerk-react' 
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster/>
      <Routes>
        {/* Public Routes for Landing and Authentication */}
        <Route path = '/' element={<Home/>}/>
        
        {/* Dedicated Clerk Routes - MUST be outside the Layout component's conditional logic */}
        <Route 
          path="/sign-in/*" 
          element={
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0b0f19]">
              <SignIn routing="path" path="/sign-in" redirectUrl="/ai" />
            </div>
          }
        />
        <Route 
          path="/sign-up/*" 
          element={
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0b0f19]">
              <SignUp routing="path" path="/sign-up" redirectUrl="/ai" />
            </div>
          }
        />

        {/* Protected AI Dashboard Route (uses Layout component with useUser check) */}
        <Route path = '/ai' element={<Layout/>}>
          <Route index element = {<Dashboard/>}/>
          <Route path = 'write-Article' element = {<WriteArticle/>}/>
          <Route path = 'blog-titles' element = {<BlogTitles/>}/>
          <Route path = 'generate-images' element = {<GenerateImages/>}/>
          <Route path = 'remove-background' element = {<RemoveBackground/>}/>
          <Route path = 'remove-object' element = {<RemoveObject/>}/>
          <Route path = 'review-resume' element = {<ReviewResume/>}/>
          <Route path = 'community' element = {<Community/>}/>
        </Route>

        {/* Catch-all for 404 - Optional but Recommended */}
        <Route path="*" element={<h1 className="text-center p-10">404: Page Not Found</h1>} />
      </Routes>
    </div>
  )
}

export default App
