import { useEffect, useState } from "react";
import logo from "../assets/DALL_E-2024-09-27-21.10-removebg-preview (1) (1).png";
import { Button } from "@/components/ui/button";
import Github from "../assets/github-sign.png";

export function SignInWithGithub() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginRect, setShowLoginRect] = useState(false);
  const [showCreateAccountRect, setShowCreateAccountRect] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", "Ov23li36ObqVlbeOVbBm");

  const handleLoginClick = () => {
    setShowLoginRect(true);
    setShowCreateAccountRect(false);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccountRect(true);
    setShowLoginRect(false);
  };

  const closeRect = () => {
    setShowLoginRect(false);
    setShowCreateAccountRect(false);
    setErrorMessage("");
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }
    closeRect();
  };

  return (
    <main className="h-screen flex items-center justify-center gap-8 relative">
      {!isMobile && (
        <div
          className="absolute left-0 top-1/3 transform -translate-y-1/3 text-5xl md:text-6xl sm:text-3xl font-serif text-left"
          style={{
            maxWidth: "60%",
            paddingLeft: "10%",
            fontFamily: "Georgia",
            zIndex: 2,
            height: "35vh",
            lineHeight: "7vh",
            color: "#667390",
            opacity: 0.7,
          }}
        >
          Transforme seus
          <br />
          <span style={{ fontWeight: "bold", color: "white", opacity: 0.9 }}>
            sonhos
          </span>
          <br />
          em{" "}
          <span style={{ fontWeight: "bold", color: "white", opacity: 0.9 }}>
            conquistas.
          </span>
          <br />
          Organize,
          <br />
          Acompanhe e{" "}
          <span style={{ fontWeight: "bold", color: "white", opacity: 0.9 }}>
            alcance
          </span>{" "}
          seus
          <br />
          <span style={{ fontWeight: "bold", color: "white", opacity: 0.9 }}>
            objetivos
          </span>{" "}
          com facilidade.
        </div>
      )}

      {!isMobile && <div className="absolute top-0 left-0 w-full h-full" />}
      <div
        style={{
          width: isMobile ? "100%" : "35%",
          height: isMobile ? "100%" : "105vh",
          backgroundImage: isMobile
            ? "none"
            : "linear-gradient(60deg, #0F172A, #152A5C)",
          position: isMobile ? "relative" : "fixed",
          right: isMobile ? "auto" : 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          zIndex: 3,
          opacity: 0.92,
          boxShadow:
            `0px 0px 5px rgba(0, 0, 0, 0.2),` +
            `0px 0px 10px rgba(0, 0, 0, 0.15),` +
            `0px 0px 10px rgba(0, 0, 0, 0.1),` +
            `inset 0px 0px 4px rgba(255, 255, 255, 0.1)`,
          margin: isMobile ? "0" : "",
        }}
      >
        <div
          className="text-5xl md:text-5xl sm:text-4xl font-extrabold mb-4"
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "Georgia",
            fontWeight: "bold",
            color: "#667390",
            opacity: 0.85,
          }}
        >
          GoalsManager
        </div>
        <img
          className="m-11"
          src={logo}
          alt="Goals-manager-logo"
          width={200}
          style={{ position: "relative", zIndex: 1, opacity: 0.75 }}
        />

        <div className="flex flex-col gap-1">
          <Button
            className="bg-white text-slate-950 text-lg py-2 px-8 w-64 hover:bg-white hover:opacity-70"
            onClick={handleLoginClick}
          >
            Login
          </Button>

          <Button
            className="bg-white text-slate-950 text-lg py-2 px-8 w-64 hover:bg-white hover:opacity-70"
            onClick={handleCreateAccountClick}
          >
            Criar Conta
          </Button>
        </div>

        <Button
          className="bg-white text-slate-950 text-lg p-4 m-1 w-64 hover:bg-white hover:opacity-60"
          asChild
        >
          <a
            href={githubUrl.toString()}
            className="flex items-center justify-center gap-2"
          >
            <img src={Github} alt="Github icon" className="min-w-5 max-w-10" />
            Entrar com Github
          </a>
        </Button>
      </div>

      {showLoginRect && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-slate-950 flex justify-center items-center"
          style={{
            zIndex: 4,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="text-white text-3xl absolute top-5 font-bold">
            Login
          </div>

          <div className="bg-white p-8 rounded-lg w-96 text-slate-950">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-slate-950 font-semibold mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100 "
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-slate-950 font-semibold mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100"
                placeholder="Digite sua senha"
              />
            </div>

            <Button className="w-full bg-blue-950 text-white p-3 rounded-lg hover:bg-blue-00">
              Entrar
            </Button>
          </div>

          <button
            onClick={closeRect}
            className="absolute top-5 right-5 bg-white text-slate-950 p-3 rounded-full hover:bg-red-500"
            style={{
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            X
          </button>
        </div>
      )}

      {showCreateAccountRect && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-slate-950 flex justify-center items-center"
          style={{
            zIndex: 4,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="text-white text-3xl absolute top-5 font-bold">
            Criar Conta
          </div>

          <div className="bg-white p-8 rounded-lg w-96 text-slate-950">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-slate-950 font-semibold mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-slate-950 font-semibold mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-slate-950 font-semibold mb-2"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}

            <Button
              className="w-full bg-blue-950 text-white p-3 rounded-lg hover:bg-blue-800"
              onClick={handleCreateAccountSubmit}
            >
              Criar Conta
            </Button>
          </div>

          <button
            onClick={closeRect}
            className="absolute top-5 right-5 bg-white text-slate-950 p-3 rounded-full hover:bg-red-500"
            style={{
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            X
          </button>
        </div>
      )}
    </main>
  );
}
