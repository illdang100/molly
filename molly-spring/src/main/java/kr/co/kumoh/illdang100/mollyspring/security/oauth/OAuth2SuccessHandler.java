package kr.co.kumoh.illdang100.mollyspring.security.oauth;

import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtProcess;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshToken;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshTokenRedisRepository;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProcess jwtProcess;

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();

        Account account = principal.getAccount();

        String additionalInputUri = "";

        // JwtToken(AccessToken) 생성
        String accessToken = jwtProcess.createAccessToken(principal);

        // Redis에 RefreshToken 저장
        String refreshToken = saveRefreshToken(account);

//        response.addHeader("authorization", jwtToken);
//        response.addHeader("accountId", account.getId().toString());

        if (account.getNickname() == null) {
            additionalInputUri = "home/signup";
        }

        String redirectUrl = makeRedirectUrl(additionalInputUri, principal, accessToken, refreshToken);
        log.debug("accessToken={}", accessToken);
        log.debug("redirectUrl={}", redirectUrl);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
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

    private String makeRedirectUrl(String uri, PrincipalDetails principal, String jwtToken, String refreshToken) {

        Account account = principal.getAccount();

        return UriComponentsBuilder.fromUriString("http://localhost:3000/" + uri)
                .queryParam("accountId", account.getId())
                .queryParam("accessToken", jwtToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();
    }
}
