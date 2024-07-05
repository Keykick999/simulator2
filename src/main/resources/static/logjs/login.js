document.addEventListener("DOMContentLoaded", function() {
  const signUpForm = document.getElementById('signUpForm');
  const loginForm = document.getElementById('loginForm');
  const idCheckButton = document.getElementById('checkDuplicate');
  const signUpUserIdField = document.getElementById('signUpUserId');

  // 회원가입 폼 제출 처리
  if (signUpForm) {
    signUpForm.addEventListener("submit", function(event) {
      event.preventDefault();
      handleSignUp();
    });
  }

  // 로그인 폼 제출 처리
  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      handleLogin();
    });
  }

  // 아이디 중복 체크 처리
  if (idCheckButton) {
    idCheckButton.addEventListener('click', checkDuplicateId);
  }

  // 회원가입 처리 함수
  function handleSignUp() {
    const userIdField = document.getElementById("signUpUserId");
    const passwordField = document.getElementById("signUpPassword");

    const userId = userIdField.value;
    const password = passwordField.value;

    // 유효성 검사
    let isValid = true;

    const idValidationResult = validateId(userId);
    if (!idValidationResult.isValid) {
      userIdField.classList.add("invalid");
      document.getElementById("signUpUserId-error").textContent = idValidationResult.message;
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

    if (isValid) {
      const signUpData = {
        memberId: userId,
        memberPassword: password
      };

      fetch('/api/member/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            } else {
              alert('회원 가입이 완료되었습니다');
              window.location.reload(); //회원 가입 완료 -> 페이지 새로 고침
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }
  }

  // 로그인 처리 함수
  function handleLogin() {
    const userIdField = document.getElementById('loginUserId');
    const passwordField = document.getElementById('loginPassword');

    const userId = userIdField.value;
    const password = passwordField.value;

    const loginData = {
      memberId: userId,
      memberPassword: password
    };

    fetch('/api/member/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })
        .then(response => {
          if (response.ok) {
            window.location.href = '/';
          } else {
            alert('로그인 실패!!');
            throw new Error('Network response was not ok');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }

  // 아이디 유효성 검사 함수
  function validateId(id) {
    const result = {
      isValid: true,
      message: ''
    };

    // 유효성 조건: 최소 8자 이상 20자 이하, 알파벳, 숫자, 특수기호 포함 가능
    const idPattern = /^[a-zA-Z0-9!@#$%^&*()_+~`|}{[\]:;?,.\/]{8,20}$/;

    if (!idPattern.test(id)) {
      result.isValid = false;
      result.message = '아이디는 8자 이상 20자 이하의 알파벳, 숫자, 특수기호로 구성되어야 합니다.';
    }

    return result;
  }

  // 비밀번호 유효성 검사 함수
  function validatePassword(password) {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password);
  }

  // 아이디 중복 체크 처리 함수
  function checkDuplicateId() {
    const memberIdFiled = document.getElementById("signUpUserId");
    const memberId = document.getElementById('signUpUserId').value;

    //유효성 검사
    const idValidationResult = validateId(memberId);
    if (!idValidationResult.isValid) {
      memberIdFiled.classList.add("invalid");
      document.getElementById("signUpUserId-error").textContent = idValidationResult.message;
      document.getElementById("signUpUserId-error").style.display = "block";
      return;
    } else {
      memberIdFiled.classList.remove("invalid");
      document.getElementById("signUpUserId-error").style.display = "none";
    }

    //id 중복 검사
    fetch(`/api/member/idCheck?memberId=${memberId}`, {
      method: 'GET',
    })
        .then(response => {
          if (response.ok) {
            document.getElementById("signUpUserId-ok").style.display = "block";
            document.getElementById("signUpUserId-exists-error").style.display = "none";
          } else {
            signUpUserIdField.classList.add("invalid");
            document.getElementById("signUpUserId-exists-error").style.display = "block";
            document.getElementById("signUpUserId-ok").style.display = "none";
            throw new Error('Existing ID');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('사용 불가 아이디입니다.');
        });
  }
});
