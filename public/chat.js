const url = window.location.href;
const socket = io.connect(url);

const preview = document.getElementById('preview');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const chatWindow = document.getElementById('chat-window');
const join = document.querySelector('.join');
const amount = document.getElementById('amount');
let timeout;

socket.on('count members', (data) => {
  amount.innerText = data.length;
  const string = data.join(', ');
  document.getElementById('people-online').innerHTML = string;
})

const chatFunction = (e) => {
  const nickname = document.getElementById('nickname');
  e.preventDefault();
  const chatBlock = document.getElementById('chat-screen');
  const message = document.getElementById('message');

  const btn = document.getElementById('send');

  preview.style.display = 'none';
  chatBlock.style.display = 'block';
  socket.emit('new user', nickname.value);
  socket.emit('join', nickname.value);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat', {
      message: message.value,
      nickname: nickname.value,
    });
    message.value = '';
  });



  message.addEventListener('keydown', () => {
    socket.emit('typing', nickname.value);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000)
  });

  const timeoutFunction = () => {
    socket.emit("typing", false);
  }
  const scrollDown = () => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  socket.on('join', (data) => {
    output.innerHTML += '<p class="join">' + data + ' joined the chat.</p>';
  })

  socket.on('left', (data) => {
    if (data) {
      output.innerHTML += '<p class="join">' + data + ' left the chat.' + '</em></p>';
    }
  })

  socket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.nickname +': </strong>' + data.message + '</p>';
    scrollDown();
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
