## **README.md**

### **Spotify Web**

**Sobre o projeto**

Este projeto é uma recriação do Spotify Web, desenvolvido para o projeto do semestre da matéria de Engenharia de Software. O projeto possui uma interface simples, filtragem de pesquisa vinculada a uma falsa API criada e tela de login e cadastro. O projeto foi desenvolvido com HTML, CSS e Javascript, juntamente com JSON-Server e ligado a um banco de dados usando MySQL.

**Funcionalidades**

- Barra de pesquisa funcional: Filtra os artistas registrados vinculados a pesquisa.
- Tela de login e cadastro funcional: Cadastro e login dos usuários com registro no banco de dados.
  
**Estrutura do projeto**

1. Pasta src/: Pasta para armazenar as subpastas "assets" e "styles".
2. Subpasta styles/: Subpasta que armazena os arquivos CSS do projeto, possibilitando a estilização da aplicação.
3. Subpasta assets/: Subpasta que armazena outras subpastas "icons" e "playlists".
4. Subpasta icons/: Subpasta que armazena os ícones utilizados no projeto.
5. Subpasta playlists/: Subpasta que armazena as imagens das playlists mostradas na parte principal do site.
6. Pasta public/: Pasta para o front-end.
7. index.html: Arquivo index do projeto, contendo a base da aplicação.
8. cadastro.html: Arquivo dedicado para a tela de cadastro.
9. login.html: Arquivo dedicado a tela de login.
10. script.js: Arquivo que contém a parte lógica feita para a filtragem de pesquisa.
11. artists.json: Arquivo dedicado a API falsa.
12. server.js: Arquivo dedicado a conexão entre o código e o banco de dados.
13. database.sql: Arquivo dedicado a armazenar os script do banco de dados.
    
**Pré-requisitos**

- Um navegador moderno como Google Chrome, Mozilla Firefox ou Microsoft Edge.
- Uma IDE como o VSCode.
- Acesso a todos arquivos corretamente vinculados ao projeto.
- Ter instalado o NodeJS e NPM.
- Versão JSON-Server requisitada: 0.17.0 ou 0.17.4.
- Ter baixado a extensão "Live Server" no VSCode.
- Instalar no terminal do arquivo server.js, com o comando "npm install" os seguintes comandos express, mysql2, bcrypt, dotenv, cors e path.
  
**Como usar**
1. Clone o repositório ou copie os arquivos para o seu computador.
2. Certifique-se de que todos os arquivos estejam na mesma pasta.
3. Baixe o NodeJS e NPM.
4. Instale o JSON-Server na versão aquisitada.
5. Selecionar o arquivo "cadastro.html" e clicar no botão "Go Live" para inicializar a aplicação.
6. No terminal da IDE, inicie o JSON-Server na porta 3000 com o comando "json-server --watch artists.json --port 3000".
7. Explore o projeto.
