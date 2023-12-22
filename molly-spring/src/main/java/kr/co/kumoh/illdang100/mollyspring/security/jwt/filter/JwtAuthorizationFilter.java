package kr.co.kumoh.illdang100.mollyspring.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtProcess;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.JwtVO;
import kr.co.kumoh.illdang100.mollyspring.dto.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 모든 주소에서 동작한다. (토큰 검증)
 * 예외가 발생하면 SecurityConfig 파일의 권한 실패 예외 발생
 */
@Slf4j
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private JwtProcess jwtProcess;

    private static final String COOKIE_TOKEN_PREFIX="Bearer+";

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, JwtProcess jwtProcess) {
        super(authenticationManager);
        this.jwtProcess = jwtProcess;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        log.debug("request Url={}", request.getRequestURL());

        // 토큰이 존재하는지 검사한다.
        if (isCookieVerify(request)) {

            String token = "";

            Cookie[] cookies = request.getCookies();
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals(JwtVO.ACCESS_TOKEN_HEADER) && cookie.getValue().startsWith(COOKIE_TOKEN_PREFIX)) {
                        token = cookie.getValue().replace(COOKIE_TOKEN_PREFIX, "");
                    }
            }

            log.debug("token={}", token);

            try {
                PrincipalDetails loginAccount = jwtProcess.verify(token);

                // 임시 세션
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                loginAccount,
                                null,
                                loginAccount.getAuthorities());

                // 강제 로그인이 진행된다.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                fail(response);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private static void fail(HttpServletResponse response) throws IOException {
        ObjectMapper om = new ObjectMapper();
        ResponseDto<String> responseDto = new ResponseDto<>(-1, "만료된 토큰입니다", null);
        String responseBody = om.writeValueAsString(responseDto);
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.getWriter().write(responseBody);
        response.getWriter().flush();
        response.getWriter().close();
    }

    private boolean isHeaderVerify(HttpServletRequest request) {
        String header = request.getHeader(JwtVO.ACCESS_TOKEN_HEADER);
        if (header == null || !header.startsWith(JwtVO.TOKEN_PREFIX)) {
            return false;
        } else {
            return true;
        }
    }

    private boolean isCookieVerify(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.debug("cookie name={}", cookie.getName());
                log.debug("cookie value={}", cookie.getValue());
                if (cookie.getName().equals(JwtVO.ACCESS_TOKEN_HEADER) && cookie.getValue().startsWith(COOKIE_TOKEN_PREFIX)) {
                    return true;
                }
            }
        }
        return false;
    }
}
