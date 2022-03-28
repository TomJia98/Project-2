async function loginFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-login');
  const password = document.querySelector('#password');
  console.log(password);

  if (username.value && password.value) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('you have successfully logged in');
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
}
document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
