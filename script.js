/*CADASTRO*/

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarNome(nome) {
  return nome.trim().includes(" ");
}

async function registerUser(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!validarNome(nome)) {
    alert("Digite seu nome completo!");
    return;
  }

  if (!validarEmail(email)) {
    alert("Digite um e-mail válido!");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  try {
    const response = await fetch('/api/register', { // Rota do server.js
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha }) // Envia os dados como JSON
    });

    if (response.ok) { 
      console.log('Cadastro realizado com sucesso! Redirecionando para a tela de login.');
      window.location.href = "login.html"; // Redireciona para a página de login
    } else {
      // Se a resposta não for ok (ex: 400, 409, 500)
      const errorData = await response.json(); // Ainda precisamos ler o JSON para mensagens de erro
      alert("Erro no cadastro: " + errorData.message); // Exibe a mensagem de erro do servidor
      console.error('Detalhes do erro:', errorData); // Para depuração
    }
  } catch (error) {
    // Erro de rede ou outro problema de conexão
    console.error('Erro ao conectar com o servidor:', error);
    alert('Erro ao tentar cadastrar. Verifique sua conexão ou tente novamente mais tarde.');
  }
}

/*LOGIN*/

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = "index.html";
    } else {
      alert("Erro no login: " + data.message);
    }
  } catch (error) {
    console.error('Erro ao conectar com o servidor:', error);
    alert('Erro ao tentar fazer login. Verifique sua conexão ou tente novamente mais tarde.');
  }
}

/*SEARCH*/

const searchInput = document.getElementById('search-input');
const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById('result-playlists');

function requestApi(searchTerm) {
  const url = `http://localhost:3000/artists?name_like=${searchTerm}`
  fetch(url)
    .then((response) => response.json())
    .then((result) => displayResults(result))
}

function displayResults(result) {
  resultPlaylist.classList.add("hidden")
  const artistName = document.getElementById('artist-name');
  const artistImage = document.getElementById('artist-img');

  result.forEach(element => {
    artistName.innerText = element.name;
    artistImage.src = element.urlImg;
  });

  resultArtist.classList.remove('hidden');
}

document.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm === '') {
    resultPlaylist.classList.add('hidden');
    resultArtist.classList.remove('hidden');
    return
  }

  requestApi(searchTerm);
})
