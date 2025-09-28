package com.reviewx.security;

import com.reviewx.config.SecurityConfig;
import com.reviewx.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebMvc
public class SecurityConfigTest {

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private MockMvc mockMvc;

    @Test
    @WithAnonymousUser
    public void 익명사용자_홈페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/home"))
                .andExpect(status().isOk());
    }

    @Test
    @WithAnonymousUser
    public void 익명사용자_로그인페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/auth/login"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/auth/register"))
                .andExpect(status().isOk());
    }

    @Test
    @WithAnonymousUser
    public void 익명사용자_보호된_리소스_접근_거부() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // 캠페인 관련 페이지는 인증 필요
        mockMvc.perform(get("/campaigns"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/auth/login"));

        // 파트너 페이지는 인증 필요
        mockMvc.perform(get("/partner/dashboard"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/auth/login"));
    }

    @Test
    @WithMockUser(roles = "REVIEWER")
    public void 참여자_권한_페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/campaigns"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "PARTNER")
    public void 파트너_권한_페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/partner/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void 관리자_권한_페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "SUPER_ADMIN")
    public void 최고관리자_모든_페이지_접근_허용() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        mockMvc.perform(get("/super-admin/dashboard"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "REVIEWER")
    public void 권한없는_페이지_접근_거부() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // 참여자는 파트너 페이지 접근 불가
        mockMvc.perform(get("/partner/dashboard"))
                .andExpect(status().isForbidden());

        // 참여자는 관리자 페이지 접근 불가
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isForbidden());
    }
}