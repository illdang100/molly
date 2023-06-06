package kr.co.kumoh.illdang100.mollyspring.security.oauth;

import kr.co.kumoh.illdang100.mollyspring.security.auth.PrincipalDetails;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.provider.GoogleUserInfo;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.provider.KakaoUserInfo;
import kr.co.kumoh.illdang100.mollyspring.security.oauth.provider.OAuth2UserInfo;
import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AccountRepository accountRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        return processOAuth2User(userRequest, oAuth2User);
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Attribute를 파싱해서 공통 객체로 묶는다. 관리가 편함.
        OAuth2UserInfo oAuth2UserInfo = null;
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        String username = "";
        if (registrationId.equals("google")) {

            log.debug("구글 로그인 요청!");

            String providerId = oAuth2User.getAttribute("sub");
            username = registrationId + "_" + providerId;

            oAuth2UserInfo = new GoogleUserInfo(attributes);
        } else if (registrationId.equals("kakao")) {

            log.debug("카카오 로그인 요청!");

            long providerId = (long) attributes.get("id");
            username = registrationId + "_" + providerId;

            oAuth2UserInfo = new KakaoUserInfo(attributes);
        } else {
            log.error("지원하지 않는 소셜 로그인");
            throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인입니다");
        }

        Optional<Account> accountOptional = accountRepository.findByUsername(username);

        Account account;
        String oauthEmail = oAuth2UserInfo.getEmail();
        if (accountOptional.isEmpty()) {

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            account = Account.builder()
                    .username(username)
                    .email(oauthEmail)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(AccountEnum.CUSTOMER)
                    .build();
            accountRepository.save(account);
        } else {
            account = accountOptional.get();
        }

        return new PrincipalDetails(account, attributes);
    }
}
