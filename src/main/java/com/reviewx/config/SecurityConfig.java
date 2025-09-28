package com.reviewx.config;

import com.reviewx.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 설정 (개발 환경에서는 비활성화, 실제 운영에서는 활성화)
            .csrf(csrf -> csrf.disable())

            // 권한 설정
            .authorizeHttpRequests(auth -> auth
                // 정적 리소스는 모든 사용자 접근 허용
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**", "/favicon.ico").permitAll()

                // 인증 없이 접근 가능한 페이지
                .requestMatchers("/", "/home", "/auth/**", "/error").permitAll()

                // 참여자(REVIEWER) 권한이 필요한 페이지
                .requestMatchers("/campaigns/**", "/reviews/my/**", "/withdrawals/**").hasRole("REVIEWER")

                // 파트너(PARTNER) 권한이 필요한 페이지
                .requestMatchers("/partner/**", "/campaigns/create", "/campaigns/manage/**").hasRole("PARTNER")

                // 일반관리자(ADMIN) 권한이 필요한 페이지
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // 최고관리자(SUPER_ADMIN) 권한이 필요한 페이지
                .requestMatchers("/super-admin/**").hasRole("SUPER_ADMIN")

                // 관리자(ADMIN 또는 SUPER_ADMIN) 권한이 필요한 페이지
                .requestMatchers("/management/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                // 나머지 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )

            // 로그인 설정
            .formLogin(form -> form
                .loginPage("/auth/login")
                .loginProcessingUrl("/auth/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .successHandler(authenticationSuccessHandler())
                .failureHandler(authenticationFailureHandler())
                .permitAll()
            )

            // 로그아웃 설정
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/auth/logout"))
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )

            // 접근 거부 처리
            .exceptionHandling(ex -> ex
                .accessDeniedPage("/error/403")
            )

            // 세션 관리
            .sessionManagement(session -> session
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
                .expiredUrl("/auth/login?expired")
            );

        return http.build();
    }

    /**
     * 로그인 성공 후 역할별 페이지로 리다이렉트
     */
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            CustomUserDetailsService.CustomUserPrincipal principal =
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();

            // 마지막 로그인 시간 업데이트는 별도 서비스에서 처리

            String redirectUrl = determineTargetUrl(principal);
            response.sendRedirect(redirectUrl);
        };
    }

    /**
     * 역할별 기본 리다이렉트 URL 결정
     */
    private String determineTargetUrl(CustomUserDetailsService.CustomUserPrincipal principal) {
        if (principal.isSuperAdmin()) {
            return "/super-admin/dashboard";
        } else if (principal.isAdmin()) {
            return "/admin/dashboard";
        } else if (principal.isPartner()) {
            return "/partner/dashboard";
        } else if (principal.isReviewer()) {
            return "/campaigns";
        } else {
            return "/home";
        }
    }

    /**
     * 로그인 실패 핸들러
     */
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            String errorMessage = "로그인에 실패하였습니다.";

            if (exception.getMessage().contains("Bad credentials")) {
                errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
            } else if (exception.getMessage().contains("User is not active")) {
                errorMessage = "계정이 비활성화되었습니다. 관리자에게 문의하세요.";
            } else if (exception.getMessage().contains("User not found")) {
                errorMessage = "존재하지 않는 사용자입니다.";
            }

            response.sendRedirect("/auth/login?error=" + java.net.URLEncoder.encode(errorMessage, "UTF-8"));
        };
    }
}