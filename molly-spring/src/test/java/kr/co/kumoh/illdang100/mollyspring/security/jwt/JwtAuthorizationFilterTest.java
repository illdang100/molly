package kr.co.kumoh.illdang100.mollyspring.security.jwt;

import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
class JwtAuthorizationFilterTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JwtProcess jwtProcess;

    @Test
    public void authorization_success_test() throws Exception {

        // given
        Account account = Account.builder()
                .id(1L)
                .username("google_432987432987")
                .nickname("일당백")
                .role(AccountEnum.CUSTOMER)
                .build();

        PrincipalDetails loginUser = new PrincipalDetails(account);
        String jwtToken = jwtProcess.createAccessToken(loginUser);
        System.out.println("jwtToken = " + jwtToken);

        // when
        ResultActions resultActions = mvc.perform(get("/api/auth/hello/test").header(JwtVO.ACCESS_TOKEN_HEADER, jwtToken));

        // then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    public void authorization_fail_test() throws Exception {

        // given

        // when
        ResultActions resultActions = mvc.perform(get("/api/auth/hello/test"));

        // then
        resultActions.andExpect(status().isUnauthorized());
    }

    @Test
    public void authorization_admin_test() throws Exception {

        // given
        Account account = Account.builder()
                .id(1L)
                .username("google_432987432987")
                .nickname("일당백")
                .role(AccountEnum.CUSTOMER)
                .build();

        PrincipalDetails loginUser = new PrincipalDetails(account);
        String jwtToken = jwtProcess.createAccessToken(loginUser);
        System.out.println("jwtToken = " + jwtToken);

        // when
        ResultActions resultActions = mvc.perform(get("/api/admin/hello/test").header(JwtVO.ACCESS_TOKEN_HEADER, jwtToken));

        // then
        resultActions.andExpect(status().isForbidden());
    }
}