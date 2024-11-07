import { createBrowserRouter } from 'react-router-dom'
import { SignInWithGithub } from './pages/sign-in-from-github'
import { Application } from './pages/application'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SignInWithGithub/>
    },
    {
        path: '/app',
        element: <Application/>
    }
])