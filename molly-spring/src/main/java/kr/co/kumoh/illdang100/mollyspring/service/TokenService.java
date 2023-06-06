package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtProcess;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtVO;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshToken;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshTokenRedisRepository;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TokenService {

    private final JwtProcess jwtProcess;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Transactional
    public void reIssueToken(HttpServletResponse response, String refreshToken) {

        // 1. Request Header에서 JWT Token 추출
        String extractedToken = extractToken(refreshToken);

        // refresh token 유효성 검사
        try {
            jwtProcess.isSatisfiedToken(extractedToken);
        } catch (Exception e) {
            throw new CustomApiException("유효하지 않은 토큰입니다");
        }

        // 2. 저장된 refresh token 찾기
        RefreshToken findRefreshToken = refreshTokenRedisRepository
                .findByRefreshToken(refreshToken)
                .orElseThrow(() -> new CustomApiException("토큰 갱신에 실패했습니다"));

        // 3. 저장된 refresh token 정보를 바탕으로 새로운 JWT Token 생성
        String accountId = findRefreshToken.getId();
        String accountRole = findRefreshToken.getRole();

        String reAccessToken =
                jwtProcess.createNewAccessToken(Long.valueOf(accountId), accountRole);

        // 새로운 refresh token을 발급함으로써 refresh token이 탈취되어도 아무런 문제가 없게 된다.
        String reRefreshToken =
                jwtProcess.createRefreshToken(accountId, accountRole);

        findRefreshToken.changeRefreshToken(reRefreshToken);
        refreshTokenRedisRepository.save(findRefreshToken);

        response.addHeader(JwtVO.ACCESS_TOKEN_HEADER, reAccessToken);
        response.addHeader(JwtVO.REFRESH_TOKEN_HEADER, reRefreshToken);
    }

    private static String extractToken(String refreshToken) {
        return refreshToken.replace(JwtVO.TOKEN_PREFIX, "");
    }
}
