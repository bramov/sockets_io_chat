const socket = io.connect('http://localhost:4000');

const preview = document.getElementById('preview');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const chatWindow = document.getElementById('chat-window');
const join = document.querySelector('.join');
let timeout;

const chatFunction = (e) => {
  const nickname = document.getElementById('nickname');
  e.preventDefault();
  const chatBlock = document.getElementById('mario-chat');
  const message = document.getElementById('message');

  const btn = document.getElementById('send');

  preview.style.display = 'none';
  chatBlock.style.display = 'block';

  socket.emit('join', nickname.value);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat', {
      message: message.value,
      nickname: nickname.value,
    })
  });


  message.addEventListener('keydown', () => {
    socket.emit('typing', nickname.value);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000)
  });

  function timeoutFunction() {
    socket.emit("typing", false);
  }

  socket.on('join', (data) => {
    output.innerHTML += '<p class="join">' + data + ' joined the chat.</p>'
  })

  socket.on('chat', (data) => {
    feedback.innerHTML = '';
    message.value = '';
    output.innerHTML += '<p><strong>' + data.nickname +': </strong>' + data.message + '</p>';

  })

  socket.on('typing', (data) => {
    if (data) {
      feedback.innerHTML = '<p><em>' + data + ' is typing...' + '</em></p>'
    } else {
      feedback.innerHTML = '';
    }

  })
}





preview.addEventListener('submit', chatFunction);