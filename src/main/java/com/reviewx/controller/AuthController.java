package com.reviewx.controller;

import com.reviewx.dto.auth.*;
import com.reviewx.exception.BusinessException;
import com.reviewx.service.CustomUserDetailsService;
import com.reviewx.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    /**
     * 로그인 페이지
     */
    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                          @RequestParam(value = "expired", required = false) String expired,
                          Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", error);
        }
        if (expired != null) {
            model.addAttribute("errorMessage", "세션이 만료되었습니다. 다시 로그인해주세요.");
        }

        model.addAttribute("loginRequest", new LoginRequest());
        return "auth/login";
    }

    /**
     * 회원가입 페이지
     */
    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "auth/register";
    }

    /**
     * 회원가입 처리
     */
    @PostMapping("/register")
    public String register(@Valid @ModelAttribute RegisterRequest request,
                          BindingResult bindingResult,
                          RedirectAttributes redirectAttributes,
                          Model model) {
        if (bindingResult.hasErrors()) {
            return "auth/register";
        }

        try {
            UserResponse userResponse = userService.registerUser(request);
            redirectAttributes.addFlashAttribute("successMessage",
                "회원가입이 완료되었습니다. 로그인해주세요.");
            return "redirect:/auth/login";
        } catch (BusinessException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "auth/register";
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            model.addAttribute("errorMessage", "회원가입 처리 중 오류가 발생했습니다.");
            return "auth/register";
        }
    }

    /**
     * 이메일 중복 확인 API
     */
    @PostMapping("/check-email")
    @ResponseBody
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.isEmailExists(email);
    }

    /**
     * 닉네임 중복 확인 API
     */
    @PostMapping("/check-nickname")
    @ResponseBody
    public boolean checkNicknameExists(@RequestParam String nickname) {
        return userService.isNicknameExists(nickname);
    }

    /**
     * 프로필 페이지
     */
    @GetMapping("/profile")
    public String profilePage(Model model) {
        try {
            UserResponse user = userService.getCurrentUser();
            model.addAttribute("user", user);
            return "auth/profile";
        } catch (BusinessException e) {
            return "redirect:/auth/login";
        }
    }

    /**
     * 프로필 수정 페이지
     */
    @GetMapping("/profile/edit")
    public String profileEditPage(Model model) {
        try {
            UserResponse user = userService.getCurrentUser();

            RegisterRequest request = new RegisterRequest();
            request.setEmail(user.getEmail());
            request.setName(user.getName());
            request.setNickname(user.getNickname());
            request.setPhone(user.getPhone());
            request.setBirthDate(user.getBirthDate());
            request.setGender(user.getGender());
            request.setAddress(user.getAddress());
            request.setDetailAddress(user.getDetailAddress());
            request.setZipCode(user.getZipCode());

            model.addAttribute("registerRequest", request);
            model.addAttribute("isEdit", true);
            return "auth/profile-edit";
        } catch (BusinessException e) {
            return "redirect:/auth/login";
        }
    }

    /**
     * 프로필 수정 처리
     */
    @PostMapping("/profile/edit")
    public String profileEdit(@Valid @ModelAttribute RegisterRequest request,
                            BindingResult bindingResult,
                            RedirectAttributes redirectAttributes,
                            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("isEdit", true);
            return "auth/profile-edit";
        }

        try {
            UserResponse currentUser = userService.getCurrentUser();
            userService.updateUser(currentUser.getId(), request);
            redirectAttributes.addFlashAttribute("successMessage", "프로필이 수정되었습니다.");
            return "redirect:/auth/profile";
        } catch (BusinessException e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("isEdit", true);
            return "auth/profile-edit";
        } catch (Exception e) {
            log.error("프로필 수정 처리 중 오류 발생", e);
            model.addAttribute("errorMessage", "프로필 수정 중 오류가 발생했습니다.");
            model.addAttribute("isEdit", true);
            return "auth/profile-edit";
        }
    }

    /**
     * 비밀번호 변경 페이지
     */
    @GetMapping("/password/change")
    public String passwordChangePage(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            CustomUserDetailsService.CustomUserPrincipal principal =
                (CustomUserDetailsService.CustomUserPrincipal) auth.getPrincipal();

            // 소셜 로그인 사용자는 비밀번호 변경 불가
            if (principal.getUser().isSocialUser()) {
                model.addAttribute("errorMessage", "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
                return "auth/profile";
            }
        }

        model.addAttribute("passwordChangeRequest", new PasswordChangeRequest());
        return "auth/password-change";
    }

    /**
     * 비밀번호 변경 처리
     */
    @PostMapping("/password/change")
    public String passwordChange(@Valid @ModelAttribute PasswordChangeRequest request,
                               BindingResult bindingResult,
                               RedirectAttributes redirectAttributes,
                               Model model) {
        if (bindingResult.hasErrors()) {
            return "auth/password-change";
        }

        if (!request.isNewPasswordMatching()) {
            model.addAttribute("errorMessage", "새 비밀번호가 일치하지 않습니다.");
            return "auth/password-change";
        }

        try {
            userService.changePassword(request);
            redirectAttributes.addFlashAttribute("successMessage", "비밀번호가 변경되었습니다.");
            return "redirect:/auth/profile";
        } catch (BusinessException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "auth/password-change";
        } catch (Exception e) {
            log.error("비밀번호 변경 처리 중 오류 발생", e);
            model.addAttribute("errorMessage", "비밀번호 변경 중 오류가 발생했습니다.");
            return "auth/password-change";
        }
    }

    /**
     * 계정 삭제 확인 페이지
     */
    @GetMapping("/delete-account")
    public String deleteAccountPage() {
        return "auth/delete-account";
    }

    /**
     * 계정 삭제 처리
     */
    @PostMapping("/delete-account")
    public String deleteAccount(@RequestParam(required = false) boolean confirm,
                              RedirectAttributes redirectAttributes) {
        if (!confirm) {
            redirectAttributes.addFlashAttribute("errorMessage", "계정 삭제에 동의해주세요.");
            return "redirect:/auth/delete-account";
        }

        try {
            userService.deleteAccount();
            return "redirect:/auth/logout";
        } catch (Exception e) {
            log.error("계정 삭제 처리 중 오류 발생", e);
            redirectAttributes.addFlashAttribute("errorMessage", "계정 삭제 중 오류가 발생했습니다.");
            return "redirect:/auth/delete-account";
        }
    }
}