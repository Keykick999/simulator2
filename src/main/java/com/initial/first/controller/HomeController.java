package com.initial.first.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Home");
        return "home"; // 홈 페이지 템플릿 경로
    }

    @GetMapping("/simulator")
    public String simulator(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Simulator");
        return "simulator"; // 시뮬레이터 페이지 템플릿 경로
    }

    @GetMapping("/description")
    public String description(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Description");
        return "description"; // 설명 페이지 템플릿 경로
    }

    @GetMapping("/result")
    public String result(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Result");
        return "result"; // 결과 페이지 템플릿 경로
    }

    @GetMapping("/index")
    public String index(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Index");
        return "index";
    }

    @GetMapping("/mypage")
    public String mypage(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "My Page");
        return "myPage";
    }

    @GetMapping("/select")
    public String select(Model model, HttpSession session) {
        if(!isValid(session)) {
            return "redirect:/login";
        }
        model.addAttribute("pageTitle", "Select");
        return "select";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("pageTitle", "Login");
        return "login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }


    //세션 유효성 검사
    public static boolean isValid(HttpSession session) {
        String memberId = (String) session.getAttribute("memberId");
        if(memberId == null) {
            return false;
        }
        else {
            return true;
        }
    }
}
