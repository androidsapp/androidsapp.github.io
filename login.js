// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
        apiKey: "AIzaSyARUM95gOyKznC4LEACCoHxfSIQ8AjXwtU",
        authDomain: "androids-apps.firebaseapp.com",
        projectId: "androids-apps",
        storageBucket: "androids-apps.appspot.com",
        messagingSenderId: "964826260210",
        appId: "1:964826260210:web:7491c0a921f146df91a66b",
        measurementId: "G-83FX2K52JX"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verifica o estado de autenticação
function checkAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = '/sucesso.html';
    }
  });
}

// Exibe mensagem de sucesso
function showSuccessMessage(message) {
  const successMessageElement = document.getElementById('success-message');
  successMessageElement.textContent = message;
  successMessageElement.classList.remove('hidden');
  successMessageElement.classList.add('show');
  
  setTimeout(() => {
    successMessageElement.classList.remove('show');
    successMessageElement.classList.add('hidden');
  }, 5000);
}

// Login com Google
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    showSuccessMessage('Usuário conectado com o Google com sucesso!');
    setTimeout(() => {
      window.location.href = '/sucesso.html';
    }, 3500);
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Função para registro de usuário
async function registerUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(collection(db, 'users'), user.uid), {
      username: username,
      email: email,
      createdAt: serverTimestamp()
    });
    showSuccessMessage('Usuário cadastrado com sucesso!');
    setTimeout(() => {
      window.location.href = '/sucesso.html';
    }, 3500);
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Login do usuário
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showSuccessMessage('Usuário logado com sucesso!');
    setTimeout(() => {
      window.location.href = '/sucesso.html';
    }, 3500);
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Redefinir senha
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    showSuccessMessage('Enviamos um link para redefinir sua senha. Verifique seu email.');
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Listeners para formulários e botões
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    await registerUser(email, password, username);
  });

  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await loginUser(email, password);
  });

  document.getElementById('google-login').addEventListener('click', async () => {
    await loginWithGoogle();
  });

  document.getElementById('reset-password').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    if (email) {
      await resetPassword(email);
    } else {
      alert('Por favor, insira seu email para redefinir sua senha.');
    }
  });

  document.getElementById('show-register').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    clearErrorMessage();
  });

  document.getElementById('show-login').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    clearErrorMessage();
  });

  togglePasswordVisibility('register-password', 'register-eye-icon');
  togglePasswordVisibility('login-password', 'eye-icon');
});

// Função para alternar visibilidade da senha
function togglePasswordVisibility(inputId, eyeIconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(eyeIconId);
  eyeIcon.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    eyeIcon.setAttribute('name', isPasswordVisible ? 'eye-outline' : 'eye-off-outline');
  });
}

// Exibe mensagem de erro
function displayErrorMessage(errorCode) {
  const errorMessageElement = document.getElementById('error-message');
  const message = errorMessages[errorCode] || 'Ocorreu um erro. Por favor, tente novamente.';
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove('hidden');
  errorMessageElement.classList.add('show');
}

// Limpa a mensagem de erro
function clearErrorMessage() {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = '';
}

// Mapas de mensagens de erro
const errorMessages = {
  'auth/invalid-credential': 'Credenciais inválidas. Por favor, verifique e tente novamente.',
  'auth/user-not-found': 'Usuário não encontrado. Verifique o email e tente novamente.',
  'auth/wrong-password': 'Senha incorreta. Por favor, tente novamente.',
  'auth/email-already-in-use': 'Este email já está em uso. Por favor, use outro email.',
};

checkAuthState(); // Chamada inicial para verificar estado de autenticação
