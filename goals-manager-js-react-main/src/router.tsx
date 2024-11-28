import { createBrowserRouter } from 'react-router-dom'
import { SignInWithGithub } from './pages/sign-in-from-github'
import { Application } from './pages/application'
import { SignInWithGithubCallback } from './pages/sign-in-callback'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <SignInWithGithub/>
    },
    {
        path: '/app',
        element: <Application/>
    },
    {
        path: '/auth/github/callback',
        element: <SignInWithGithubCallback/>,
    }
])