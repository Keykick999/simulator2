document.addEventListener("DOMContentLoaded", function() {
  const signUpForm = document.getElementById('signUpForm');
  const loginForm = document.getElementById('loginForm');

  if (signUpForm) {
    signUpForm.addEventListener("submit", function(event) {
      event.preventDefault(); // 폼 제출을 막음

      const userIdField = document.getElementById("signUpUserId");
      const passwordField = document.getElementById("signUpPassword");

      const userId = userIdField.value;
      const password = passwordField.value;

      // 유효하지 않은 필드의 테두리를 빨간색으로 설정하고 에러 메시지 표시
      let isValid = true;

      if (!validateEmail(userId)) {
        userIdField.classList.add("invalid");
        document.getElementById("signUpUserId-error").style.display = "block";
        isValid = false;
      } else {
        userIdField.classList.remove("invalid");
        document.getElementById("signUpUserId-error").style.display = "none";
      }

      if (!validatePassword(password)) {
        passwordField.classList.add("invalid");
        document.getElementById("signUpPassword-error").style.display = "block";
        isValid = false;
      } else {
        passwordField.classList.remove("invalid");
        document.getElementById("signUpPassword-error").style.display = "none";
      }

      // 모든 검사를 통과하면 폼을 제출
      if (isValid) {
        const signUpData = {
          studentId: userId,
          studentPassword: password
        };

        fetch('http://localhost:8080/api/member/signUp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signUpData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Sign up successful:', data);
          alert("회원가입이 완료되었습니다!");
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault(); // 폼 제출을 막음

      const userIdField = document.getElementById('loginUserId');
      const passwordField = document.getElementById('loginPassword');

      const userId = userIdField.value;
      const password = passwordField.value;

      const loginData = {
        memberId: userId,
        memberPassword: password
      };

      fetch('http://localhost:8080/api/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      })
      .then(response => {
        if (response.ok) {
          window.location.href = '/home';
        } else {
          alert('로그인 실패!!');
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }

  function validateEmail(email) {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
  }

  function validatePassword(password) {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password);
  }

  // 아이디 중복 체크
  const idCheckButton = document.getElementById('checkDuplicate');
  const signUpUserIdField = document.getElementById('signUpUserId');

  if (idCheckButton) {
    idCheckButton.addEventListener('click', function() {
      fetch('/checkId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId: signUpUserIdField.value
        })
      })
      .then(response => {
        if (response.ok) {
          alert('사용 가능한 아이디입니다.');
        } else {
          signUpUserIdField.classList.add("invalid");
          document.getElementById("signUpUserId-exists-error").style.display = "block";
          throw new Error('Existing ID');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('사용 불가 아이디입니다.');
      });
    });
  }
});
