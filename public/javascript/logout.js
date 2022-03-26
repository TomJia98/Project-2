async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
}

async function like(event) {
  console.log(event.target);
}
document.querySelector('#logout').addEventListener('click', logout);

document.querySelector('.like-react').addEventListener('click', like);
