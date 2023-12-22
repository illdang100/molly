package kr.co.kumoh.illdang100.mollyspring.security.oauth;

import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtProcess;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtVO;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshToken;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshTokenRedisRepository;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProcess jwtProcess;

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    private static final String REDIRECT_URL = "http://localhost:3000/home/signup";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();

        Account account = principal.getAccount();

        // JwtToken(AccessToken) 생성
        String accessToken = jwtProcess.createAccessToken(principal);

        // Redis에 RefreshToken 저장
        String refreshToken = saveRefreshToken(account);

        log.debug("accessToken={}", accessToken);

        addCookie(response, JwtVO.ACCESS_TOKEN_HEADER, accessToken);
        addCookie(response, JwtVO.REFRESH_TOKEN_HEADER, refreshToken);
        addCookie(response, JwtVO.PK_HEADER, account.getId());

        getRedirectStrategy().sendRedirect(request, response, REDIRECT_URL);
    }

    private static void addCookie(HttpServletResponse response, String name, String value, boolean httpOnly) {
        value = URLEncoder.encode(value, StandardCharsets.UTF_8);
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(httpOnly);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private static void addCookie(HttpServletResponse response, String name, String value) {
        addCookie(response, name, value, true);
    }

    private static void addCookie(HttpServletResponse response, String name, Long value) {
        addCookie(response, name, String.valueOf(value), true);
    }

    private String saveRefreshToken(Account account) {

        String accountId = account.getId().toString();
        String role = account.getRole().toString();

        String refreshToken =
                jwtProcess.createRefreshToken(accountId, role);

        log.debug("생성된 refreshToken={}", refreshToken);

        refreshTokenRedisRepository.save(RefreshToken.builder()
                .id(accountId)
                .role(role)
                .refreshToken(refreshToken)
                .build());

        return refreshToken;
    }
}
