package kr.co.kumoh.illdang100.mollyspring.security.oauth;

import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomOAuth2AuthenticationException;
import kr.co.kumoh.illdang100.mollyspring.util.CustomResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        String errorMessage;
        if (exception instanceof CustomOAuth2AuthenticationException) {
            errorMessage = exception.getMessage();
        } else {
            errorMessage = "인증에 실패했습니다.";
        }

        CustomResponseUtil.fail(response, errorMessage, HttpStatus.BAD_REQUEST);
    }
}
