document.getElementById('change-password-btn').addEventListener('click', function() {
  document.getElementById('password-change-modal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('password-change-modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('password-change-modal')) {
      document.getElementById('password-change-modal').style.display = 'none';
  }
});

window.onload = function() {
  fetch('/api/user')
      .then(response => response.json())
      .then(data => {
          document.getElementById('user-id').textContent = data.userId;
      })
      .catch(error => console.error('Error fetching user data:', error));
};

document.getElementById('view-records').addEventListener('click', function() {
  fetch('/api/records')
      .then(response => response.json())
      .then(data => {
      // Process and display records data
      })
      .catch(error => console.error('Error fetching records:', error));
});
