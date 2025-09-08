# Marola WL Bot

O Marola WL Bot é um bot para Discord projetado para automatizar o processo de aplicação para a whitelist do servidor Marola RP.

## Funcionalidades

- Processo de aplicação via DM ou Modal do Discord.
- Perguntas customizáveis para avaliar os candidatos.
- Sistema de revisão de aplicações para a staff com botões de Aprovar/Reprovar.
- Notificações automáticas para os candidatos e para canais de log.
- Cooldown para evitar spam de aplicações.
- Fácil configuração através de um arquivo `.env` e `config.json`.

## Comandos

- `/whitelist`: Inicia o processo de aplicação via Mensagens Diretas (DM).
- `/whitelist_modal`: Inicia o processo de aplicação via um formulário (Modal).

## Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd marola-wl-bot
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o arquivo `.env`:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    # Token do seu Bot do Discord
    DISCORD_TOKEN=SEU_TOKEN_AQUI

    # ID da Aplicação do seu Bot
    APPLICATION_ID=SEU_APPLICATION_ID_AQUI

    # ID do Servidor (Guild) onde o bot vai operar
    GUILD_ID=SEU_GUILD_ID_AQUI
    ```

4.  **Configure o arquivo `config.json`:**
    Abra o arquivo `config.json` e edite as configurações do bot. É aqui que você pode adicionar, remover ou editar as perguntas da whitelist, e também configurar os canais e cargos.

5.  **Registre os comandos:**
    Execute o seguinte comando para registrar os slash commands (`/whitelist` e `/whitelist_modal`) no seu servidor:
    ```bash
    node deploy-commands.js
    ```

6.  **Inicie o bot:**
    ```bash
    node index.js
    ```

## Estrutura do Código

-   `index.js`: O arquivo principal do bot, contém toda a lógica para os comandos, interações e o fluxo de whitelist.
-   `deploy-commands.js`: Script para registrar os slash commands no Discord.
-   `package.json`: Define as dependências e scripts do projeto.
-   `.env`: Arquivo para armazenar as variáveis de ambiente (não versionado).
-   `config.json`: Arquivo de configuração principal do bot, onde você pode editar as perguntas e outras configurações.
-   `PRD.md`: Documento de Requisitos do Produto.