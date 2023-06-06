package kr.co.kumoh.illdang100.mollyspring.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtProcess;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtVO;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshToken;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.RefreshTokenRedisRepository;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.util.CustomResponseUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static kr.co.kumoh.illdang100.mollyspring.dto.account.AccountReqDto.*;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;

    private JwtProcess jwtProcess;

    private RefreshTokenRedisRepository refreshTokenRedisRepository;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager,
                                   JwtProcess jwtProcess, RefreshTokenRedisRepository refreshTokenRedisRepository) {
        super(authenticationManager);
        setFilterProcessesUrl("/api/login");
        this.authenticationManager = authenticationManager;
        this.jwtProcess = jwtProcess;
        this.refreshTokenRedisRepository = refreshTokenRedisRepository;
    }

    // Post: /api/login 일때 동작
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        try {

            ObjectMapper om = new ObjectMapper();
            LoginReqDto loginReqDto = om.readValue(request.getInputStream(), LoginReqDto.class);

            // 강제 로그인
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    loginReqDto.getUsername(), loginReqDto.getPassword(
            ));

            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            return authentication;
        } catch (Exception e) {
            throw new InternalAuthenticationServiceException(e.getMessage());
        }
    }

    // 로그인 실패 처리
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {

        CustomResponseUtil.fail(response, "로그인 실패", HttpStatus.BAD_REQUEST);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();

        String jwtToken = jwtProcess.createAccessToken(principalDetails);

        String refreshToken = saveRefreshToken(principalDetails.getAccount());

        response.addHeader(JwtVO.ACCESS_TOKEN_HEADER, jwtToken);
        response.addHeader(JwtVO.REFRESH_TOKEN_HEADER, refreshToken);

        CustomResponseUtil.success(response, null);
    }

    private String saveRefreshToken(Account account) {

        String accountId = account.getId().toString();
        String role = account.getRole().toString();

        String refreshToken =
                jwtProcess.createRefreshToken(accountId, role);

        refreshTokenRedisRepository.save(RefreshToken.builder()
                .id(accountId)
                .role(role)
                .refreshToken(refreshToken)
                .build());

        return refreshToken;
    }
}
