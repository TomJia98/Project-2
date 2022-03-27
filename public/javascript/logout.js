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

async function dislike(event) {
  const postId = { id: event.target.dataset.id, react: false };
  const post = await fetch('api/posts/react', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postId),
  });

  if (post.ok) {
    console.log('likes updated');
  }
}

async function like(event) {
  const postId = { id: event.target.dataset.id, react: true };
  const post = await fetch('api/posts/react', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postId),
  });
  console.log(post);

  if (post.ok) {
    console.log('like updated');
  }
}

document.querySelector('#logout').addEventListener('click', logout);

document.querySelector('.like-react').addEventListener('click', like);
document.querySelector('.dislike-react').addEventListener('click', dislike);
