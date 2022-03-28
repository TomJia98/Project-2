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
    location.reload();
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
    location.reload();
  }
}

document.querySelector('#logout').addEventListener('click', logout);

let likeReact = document.querySelectorAll('.like-react');

// .addEventListener('click', like);
let dislikeReact = document.querySelectorAll('.dislike-react');
// .addEventListener('click', dislike);
likeReact.forEach((e) => {
  e.addEventListener('click', like);
});

dislikeReact.forEach((e) => {
  e.addEventListener('click', dislike);
});
