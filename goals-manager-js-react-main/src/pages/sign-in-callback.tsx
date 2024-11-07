import { useAuthenticateFromGithub } from "@/http/generated/api"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Navigate, useSearchParams, useNavigate } from "react-router-dom"
import Cookies from 'universal-cookie'

export function SignInWithGithubCallback(){
    const navigate = useNavigate()

    const { mutateAsync: authenticateFromGithub } = useAuthenticateFromGithub()

const [searchParams] = useSearchParams()
const code = searchParams.get('code')

if (!code) {
    return <Navigate to="/" />
}

useEffect(() => {
    authenticateFromGithub({ data: { code } }).then(response => {
        const token = response.data.token
        const cookies = new Cookies()

        cookies.set('goals-manager.token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 //24h
        })


        navigate('/app')
    })
}, [])

    return(
        <div className="h-screen flex items-center justify-center"> 
            <Loader2 className="size-8 text-green-50 animate-spin"/>
        </div>
    )
}