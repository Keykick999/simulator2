package com.initial.first.restController;

import com.initial.first.dto.SignUpRequest;
import com.initial.first.entity.Member;
import com.initial.first.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // 정규식을 사용하여 아이디 유효성 검사
    private boolean isValidId(String memberId) {
        String idPattern = "^[a-zA-Z0-9!@#$%^&*()_+~`|}{\\[\\]:;?,./]{8,20}$";
        return Pattern.matches(idPattern, memberId);
    }

    // 정규식을 사용하여 비밀번호 유효성 검사
    private boolean isValidPassword(String memberPassword) {
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return Pattern.matches(passwordPattern, memberPassword);
    }

    // 회원 가입
    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest signUpRequest) {
        String memberId = signUpRequest.getMemberId();
        String memberPassword = signUpRequest.getMemberPassword();

        // 유효성 검사 추가
        if (!isValidId(memberId)) {
            return ResponseEntity.badRequest().body("Invalid memberId. It must be 8-20 characters long and can include letters, numbers, and special characters.");
        }

        if (!isValidPassword(memberPassword)) {
            return ResponseEntity.badRequest().body("Invalid password. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        // 비밀 번호 보안을 위해 인코딩해서 저장
        String encodedPassword = passwordEncoder.encode(memberPassword);

        // db에 저장
        memberRepository.save(new Member(memberId, encodedPassword));
        return ResponseEntity.ok("Successfully saved");
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SignUpRequest signUpRequest, HttpSession session) {
        System.out.println("api요청");
        System.out.println("signUpRequest = " + signUpRequest);
        String memberId = signUpRequest.getMemberId();
        String memberPassword = signUpRequest.getMemberPassword();

        Optional<Member> findMember = memberRepository.findById(memberId);
        if(findMember.isEmpty()) {  //회원 존재 x
            return ResponseEntity.notFound().build();
        }

        String originalPassword = findMember.get().getMemberPassword();
        //사용자 입력 비밀 번호랑 저장된 비밀 번호 비교
        if(passwordEncoder.matches(memberPassword, originalPassword)) {
            session.setAttribute("memberId", memberId);
            session.setMaxInactiveInterval(30 * 60);       //세션 만료 기간 30분으로 설정
            return ResponseEntity.ok("login succeeded");
        }
        return ResponseEntity.notFound().build(); //비밀 번호 다름
    }

    //로그아웃
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        String memberId = (String)session.getAttribute("memberId");
        if(memberId == null) {
            return ResponseEntity.badRequest().build();
        }
        session.setMaxInactiveInterval(0);
        return ResponseEntity.ok("logout succeeded");
    }

    //아이디 중복 체크
    @GetMapping("/idCheck")
    public ResponseEntity<String> isDuplicatedId(@RequestParam("memberId") String memberId) {
        Optional<Member> findMember = memberRepository.findById(memberId);
        if(findMember.isPresent()) {    //존재하는 id
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("valid id");
    }
}
