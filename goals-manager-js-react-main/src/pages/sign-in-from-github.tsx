import logo from '../assets/Goal-Manager-Logo.png'
import BackgroundEmptyGoals from '../assets/DALL_E-2024-09-27-21.10-removebg-preview (1) (1).png'
import { Button } from '@/components/ui/button'
import  Github from '../assets/github-sign.png'

export function SignInWithGithub() {
const githubUrl = new URL('https://github.com/login/oauth/authorize')
githubUrl.searchParams.set('client_id', 'Ov23li36ObqVlbeOVbBm')

    return(
        <main
      className="h-screen flex flex-col items-center justify-center gap-8"
      style={{
        backgroundImage: `url(${BackgroundEmptyGoals})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      

        <img src={logo} alt="Goals-manager-logo" width={300}/>

        <Button className='bg-white text-slate-950 text-lg p-4 m-8 w-64 hover:bg-white hover:opacity-60' asChild>
          <a href={githubUrl.toString()}>
            <img src={Github} alt="Github icons" className='min-w-5 max-w-10'/>
            Entrar com Github
          </a>
        </Button>

    </main>
    )
    
}