import { useEffect, useState } from 'react';
import logo from '../assets/DALL_E-2024-09-27-21.10-removebg-preview (1) (1).png'
import BackgroundEmptyGoals from '../assets/EmptyGoalsBG.svg'
import { Button } from '@/components/ui/button'
import Github from '../assets/github-sign.png'

export function SignInWithGithub() {
  const [isMobile, setIsMobile] = useState(false);

  // Função para verificar o tamanho da tela
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 1024); // Considera 768px como limite para dispositivos móveis
  };

  //useEffect para adicionar o event listener quando o componente é montado
  useEffect(() => {
    checkIfMobile(); // Verifica na primeira renderização
    window.addEventListener('resize', checkIfMobile); // Adiciona o listener de resize

    // Limpeza do event listener
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const githubUrl = new URL('https://github.com/login/oauth/authorize');
  githubUrl.searchParams.set('client_id', 'Ov23li36ObqVlbeOVbBm');

  return (
    <main className="h-screen flex items-center justify-center gap-8 relative">
      {/* Exibe a parte do slogan apenas se não for dispositivo pequeno */}
      {!isMobile && (
        <div
          className="absolute left-0 top-1/3 transform -translate-y-1/3 text-5xl md:text-6xl sm:text-3xl font-serif text-left"
          style={{
            maxWidth: '60%',
            paddingLeft: '10%',
            fontFamily: 'Georgia',
            zIndex: 2,
            height: '35vh',
            lineHeight: '7vh',
            color: '#667390',
            opacity: 0.7,
          }}
        >
          Transforme seus
          <br />
          <span style={{ fontWeight: 'bold', color: 'white', opacity: 0.90 }}>sonhos</span>
          <br />
          em <span style={{ fontWeight: 'bold', color: 'white', opacity: 0.90 }}>conquistas.</span>
          <br />
          Organize,
          <br />
          Acompanhe e <span style={{ fontWeight: 'bold', color: 'white', opacity: 0.90 }}>alcance</span> seus
          <br />
          <span style={{ fontWeight: 'bold', color: 'white', opacity: 0.90 }}>objetivos</span> com facilidade.
        </div>
      )}

      {/* Exibe o background apenas se não for dispositivo pequeno */}
      {!isMobile && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${BackgroundEmptyGoals})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 1,
            filter: 'blur(5px)',
          }}
        ></div>
      )}

      {/* Container fixado com a logo e o botão */}
      <div
        style={{
          width: isMobile ? '100%' : '35%',
          height: isMobile ? 'auto' : '105vh',
          backgroundImage: isMobile ? 'none' : 'linear-gradient(60deg, #0F172A, #152A5C)',
          position: isMobile ? 'relative' : 'fixed',
          right: isMobile ? 'auto' : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 3,
          opacity: 0.92,
          boxShadow:
            `0px 0px 5px rgba(0, 0, 0, 0.2),` +
            `0px 0px 10px rgba(0, 0, 0, 0.15),` +
            `0px 0px 10px rgba(0, 0, 0, 0.1),` +
            `inset 0px 0px 4px rgba(255, 255, 255, 0.1)`,
          margin: isMobile ? '0' : '', // Remove o margem quando for mobile
        }}
      >
        {/* Nome do aplicativo sobre a logo */}
        <div
          className="text-5xl md:text-5xl sm:text-4xl font-extrabold mb-4"
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: "Monospace",
            fontWeight: 'bold',
            color: '#667390',
            opacity: 0.85,
          }}
        >
          GoalsManager
        </div>

        <img src={logo} alt="Goals-manager-logo" width={200} style={{ position: 'relative', zIndex: 1, opacity: 0.75 }} />

        {/* Botão de login com GitHub */}
        <Button
          className="bg-white text-slate-950 text-lg p-4 m-5 w-64 hover:bg-white hover:opacity-60"
          asChild
        >
          <a href={githubUrl.toString()} className="flex items-center justify-center gap-2">
            <img src={Github} alt="Github icon" className="min-w-5 max-w-10" />
            Entrar com Github
          </a>
        </Button>

        {/* Botões de Login e Criar Conta */}
        <div className="flex flex-col gap-1">
          <Button className="bg-white text-slate-950 text-lg py-2 px-8 w-64 hover:bg-white hover:opacity-70">
            Login
          </Button>
          <Button className="bg-white text-slate-950 text-lg py-2 px-8 w-64 hover:bg-white hover:opacity-70">
            Criar Conta
          </Button>
        </div>
      </div>
    </main>
  );
}
