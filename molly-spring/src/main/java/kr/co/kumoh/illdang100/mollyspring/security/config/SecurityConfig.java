package kr.co.kumoh.illdang100.mollyspring.security.config;

import kr.co.kumoh.illdang100.mollyspring.security.jwt.*;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.filter.JwtAuthenticationFilter;
import kr.co.kumoh.illdang100.mollyspring.security.jwt.filter.JwtAuthorizationFilter;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.CustomOAuth2UserService;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.OAuth2FailureHandler;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.OAuth2SuccessHandler;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.util.CustomResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final JwtProcess jwtProcess;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public class CustomSecurityFilterManager extends AbstractHttpConfigurer<CustomSecurityFilterManager, HttpSecurity> {
        @Override
        public void configure(HttpSecurity http) throws Exception {
            AuthenticationManager authenticationManager = http.getSharedObject(AuthenticationManager.class);
            http.addFilter(new JwtAuthenticationFilter(authenticationManager, jwtProcess, refreshTokenRedisRepository));
            http.addFilter(new JwtAuthorizationFilter(authenticationManager, jwtProcess));
        }
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.headers().frameOptions().disable(); // iframe 허용안함
        http.csrf().disable(); // csrf 허용안함

        http.cors().configurationSource(configurationSource());

        // 인증 실패 처리
        http.exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
            // CustomResponseUtil.fail() 메서드 호출하기 -> 리액트에서 자동 로그인 페이지로 이동
            CustomResponseUtil.fail(response, "로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        });

        // 권한 실패
        http.exceptionHandling().accessDeniedHandler((request, response, e) -> {
            CustomResponseUtil.fail(response, "권한이 없습니다", HttpStatus.FORBIDDEN);
        });

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.formLogin().disable();
        http.httpBasic().disable();

        // 필터 적용
        http.apply(new CustomSecurityFilterManager());

        http.authorizeHttpRequests()
                .antMatchers("/api/auth/**").authenticated()
                .antMatchers("/api/admin/**").hasRole("" + AccountEnum.ADMIN)
                .anyRequest().permitAll();

        http
                .oauth2Login().loginPage("/token/expired")
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
                .userInfoEndpoint().userService(oAuth2UserService);

        return http.build();
    }

    public CorsConfigurationSource configurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*"); // GET, POST, PUT, DELETE (Javascript 요청 허용)
        configuration.addAllowedOriginPattern("*"); // 모든 IP 주소 허용 (프론트 엔드 ip만 허용하도록 할 수도 있다.)
        configuration.setAllowCredentials(true); // 클라이언트에서 쿠키 요청 허용

        configuration.addExposedHeader(JwtVO.ACCESS_TOKEN_HEADER);
        configuration.addExposedHeader(JwtVO.REFRESH_TOKEN_HEADER);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 주소요청에 위 설정을 적용

        return source;
    }
}
