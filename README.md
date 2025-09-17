<div align="center">
  <img src="bot-whitelist.png" alt="bot-whitelist WL Bot" width="600" />
  
  <p>Automatize o processo de whitelist do seu servidor Discord com eficiência, segurança e experiência moderna.</p>
  <p>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/discord.js-v14-blue?logo=discord" alt="discord.js"></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E=18.0.0-green?logo=node.js" alt="Node.js"></a>
    <img src="https://img.shields.io/github/license/Samurai33/bot-whitelist" alt="License">
    <img src="https://img.shields.io/github/languages/top/Samurai33/bot-whitelist" alt="Top Language">
  </p>
</div>

---

## ✨ Visão Geral

O **Bot WL** é um bot para Discord focado em automatizar o processo de whitelist de servidores RP, tornando a experiência de aplicação mais justa, rápida e transparente para candidatos e staff.

---

## 🚀 Demonstração

```text
  ______    ______   __       __  __    __  _______    ______   ______ 
 /      \  /      \ |  \     /  \|  \  |  \|       \  /      \ |      \
|  $$$$$$\|  $$$$$$\| $$\   /  $$| $$  | $$| $$$$$$$\|  $$$$$$\ \$$$$$$
| $$___\$$| $$__| $$| $$$\ /  $$$| $$  | $$| $$__| $$| $$__| $$  | $$  
 \$$    \ | $$    $$| $$$$\  $$$$| $$  | $$| $$    $$| $$    $$  | $$  
 _\$$$$$$\| $$$$$$$$| $$\$$ $$ $$| $$  | $$| $$$$$$$\| $$$$$$$$  | $$  
|  \__| $$| $$  | $$| $$ \$$$| $$| $$__/ $$| $$  | $$| $$  | $$ _| $$_ 
 \$$    $$| $$  | $$| $$  \$ | $$ \$$    $$| $$  | $$| $$  | $$|   $$ \
  \$$$$$$  \$$   \$$ \$$      \$$  \$$$$$$  \$$   \$$ \$$   \$$ \$$$$$$
```

---

## 🛠️ Funcionalidades

- Processo de whitelist via DM ou Modal (formulário Discord)
- Perguntas customizáveis (JSON)
- Sistema de revisão para staff com botões de Aprovar/Reprovar
- Notificações automáticas para candidatos e canais de log
- Cooldown para evitar spam
- Logging moderno (Pino)
- Fácil configuração via `.env` e `config.json`

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Acesso ao Discord Developer Portal

### Passos
```bash
git clone https://github.com/Samurai33/bot-whitelist.git
cd bot-whitelist
npm install
```

1. Crie um arquivo `.env` na raiz:
   ```env
   DISCORD_TOKEN=SEU_TOKEN_AQUI
   APPLICATION_ID=SEU_APPLICATION_ID_AQUI
   GUILD_ID=SEU_GUILD_ID_AQUI
   ```
2. Edite o `config.json` conforme seu servidor (perguntas, canais, cargos).
3. Registre os comandos:
   ```bash
   node deploy-commands.js
   ```
4. Inicie o bot:
   ```bash
   node index.js
   ```

---

## 💡 Uso

- `/whitelist` — Inicia o processo via DM
- `/whitelist_modal` — Inicia via formulário Modal

O bot irá guiar o usuário, enviar as respostas para o canal da staff e permitir aprovação/reprovação com feedback automático.

---

## 🗂️ Estrutura do Projeto

```
├── src/
│   ├── config.js
│   ├── constants.js
│   ├── dmFlow.js
│   ├── errors.js
│   ├── helpers.js
│   ├── index.js
│   ├── interactions.js
│   └── session.js
├── config.json
├── deploy-commands.js
├── index.js
├── package.json
├── PRD.md
├── README.md
└── asciiart
```

---

## 🛣️ Roadmap

- [ ] Dashboard web para staff
- [ ] Banco de perguntas dinâmico
- [ ] Suporte a múltiplos idiomas
- [ ] Analytics e métricas
- [ ] Checagens automáticas (idade da conta, etc)

Veja mais em [`PRD.md`](./PRD.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja as [issues](https://github.com/Samurai33/bot-whitelist/issues) ou abra um PR.

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: Nova funcionalidade'`)
4. Push na branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença ISC. Veja [`LICENSE`](./LICENSE).

---

## 📬 Contato

Samurai33 — [@samurai33](https://github.com/Samurai33)

---

## 🙏 Agradecimentos

- [discord.js](https://discord.js.org/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- Comunidade open source Discord

---

## 🔒 Security & Sensitive Data

> **Never commit your `.env` file or any sensitive data (like Discord tokens) to the repository!**
>
> - The `.env` file is already included in `.gitignore` and will not be tracked by git.
> - Always store secrets and tokens in environment variables or secret managers.
> - If you accidentally commit a secret, **revoke it immediately** and generate a new one.

---
