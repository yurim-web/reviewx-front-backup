package com.reviewx.dto.auth;

import com.reviewx.entity.User;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{6,}$",
             message = "비밀번호는 영문자와 숫자를 포함해야 합니다.")
    private String password;

    @NotBlank(message = "비밀번호 확인을 입력해주세요.")
    private String passwordConfirm;

    @NotBlank(message = "이름을 입력해주세요.")
    @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하여야 합니다.")
    private String name;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size(min = 2, max = 30, message = "닉네임은 2자 이상 30자 이하여야 합니다.")
    @Pattern(regexp = "^[가-힣a-zA-Z0-9_-]{2,30}$",
             message = "닉네임은 한글, 영문, 숫자, -, _만 사용 가능합니다.")
    private String nickname;

    @Pattern(regexp = "^01[016789]-\\d{3,4}-\\d{4}$",
             message = "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)")
    private String phone;

    private LocalDateTime birthDate;

    private User.Gender gender;

    private String address;
    private String detailAddress;
    private String zipCode;

    // 약관 동의
    @AssertTrue(message = "서비스 이용약관에 동의해주세요.")
    private boolean agreeTerms;

    @AssertTrue(message = "개인정보 처리방침에 동의해주세요.")
    private boolean agreePrivacy;

    private boolean agreeMarketing = false;

    // 비밀번호 확인 검증
    @AssertTrue(message = "비밀번호가 일치하지 않습니다.")
    public boolean isPasswordMatching() {
        return password != null && password.equals(passwordConfirm);
    }
}