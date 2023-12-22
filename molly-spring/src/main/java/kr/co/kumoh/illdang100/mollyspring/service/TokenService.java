package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.SuspensionException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.suspension.SuspensionDateRepository;
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
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TokenService {

    private final JwtProcess jwtProcess;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final AccountRepository accountRepository;
    private final SuspensionDateRepository suspensionDateRepository;

    @Transactional
    public void reIssueToken(HttpServletResponse response, String refreshToken) {

        // TODO: 정지 검사하기!!

        // 1. Request Header에서 JWT Token 추출
        String extractedToken = extractToken(refreshToken);

        // refresh token 유효성 검사
        RefreshToken findRefreshToken = validateRefreshToken(refreshToken, extractedToken);

        // 저장된 refresh token 정보를 바탕으로 새로운 JWT Token 생성
        String accountId = findRefreshToken.getId();
        String accountRole = findRefreshToken.getRole();

        // 만약 정지된 사용자라면 예외 발생
        validateAccountNotSuspended(accountId);

        String reAccessToken = jwtProcess.createNewAccessToken(Long.valueOf(accountId), accountRole);
        String reRefreshToken =jwtProcess.createRefreshToken(accountId, accountRole);

        findRefreshToken.changeRefreshToken(reRefreshToken);
        refreshTokenRedisRepository.save(findRefreshToken);

        response.addHeader("AccountId", accountId);
        response.addHeader(JwtVO.ACCESS_TOKEN_HEADER, reAccessToken);
        response.addHeader(JwtVO.REFRESH_TOKEN_HEADER, reRefreshToken);

        log.debug("reIssue token");
    }

    private void validateAccountNotSuspended(String accountId) {
        Account findAccount = findAccountByIdOrThrowException(Long.valueOf(accountId));
        suspensionDateRepository.findByAccountEmail(findAccount.getEmail()).ifPresent(suspensionDate -> {
            log.info("정지된 사용자 계정입니다.");
            if (!LocalDate.now().isAfter(suspensionDate.getSuspensionExpiryDate())) {
                throw new SuspensionException("정지된 사용자 계정입니다. 정지 기간:" + suspensionDate.getSuspensionExpiryDate());
            }
        });
    }

    private RefreshToken validateRefreshToken(String refreshToken, String extractedToken) {
        try {
            jwtProcess.isSatisfiedToken(extractedToken);
        } catch (Exception e) {
            throw new CustomApiException("유효하지 않은 토큰입니다");
        }

        // 저장된 refresh token 찾기
        return refreshTokenRedisRepository
                .findByRefreshToken(refreshToken)
                .orElseThrow(() -> new CustomApiException("토큰 갱신에 실패했습니다"));

    }

    private static String extractToken(String refreshToken) {
        return refreshToken.replace(JwtVO.TOKEN_PREFIX, "");
    }

    private Account findAccountByIdOrThrowException(Long accountId) {
        return accountRepository
                .findById(accountId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 사용자입니다"));
    }
}
