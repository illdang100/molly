package kr.co.kumoh.illdang100.mollyspring.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtProcess {

    @Value("${jwt.subject}")
    private String jwtSubject;

    @Value("${jwt.secret}")
    private String secret;

    public String createAccessToken(PrincipalDetails principalDetails) {

        Account account = principalDetails.getAccount();

        return createNewAccessToken(account.getId(), account.getRole().toString());
    }

    public String createNewAccessToken(Long accountId, String role) {
        String jwtToken = JWT.create()
                .withSubject(jwtSubject)
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtVO.ACCESS_TOKEN_EXPIRATION_TIME))
                .withClaim("id", accountId)
                .withClaim("role", role)
                .sign(Algorithm.HMAC512(secret));

        return JwtVO.TOKEN_PREFIX + jwtToken;
    }

    public String createRefreshToken(String accountId, String role) {
        String refreshToken = JWT.create()
                .withSubject(jwtSubject)
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtVO.REFRESH_TOKEN_EXPIRATION_TIME))
                .withClaim("id", accountId)
                .withClaim("role", role)
                .sign(Algorithm.HMAC512(secret));

        return JwtVO.TOKEN_PREFIX + refreshToken;
    }

    // 토큰 검증 (return 되는 LoginUser 객체를 강제로 시큐리티 세션에 직접 주입할 예정) - 강제 로그인
    public PrincipalDetails verify(String token) {

        DecodedJWT decodedJWT = isSatisfiedToken(token);

        Long id = decodedJWT.getClaim("id").asLong();
        String role = decodedJWT.getClaim("role").asString();

        Account account = Account.builder().id(id).role(AccountEnum.valueOf(role)).build();

        return new PrincipalDetails(account);
    }

    public DecodedJWT isSatisfiedToken(String token) {
        return JWT.require(Algorithm.HMAC512(secret)).build().verify(token);
    }
}
