package kr.co.kumoh.illdang100.mollyspring.web;

import kr.co.kumoh.illdang100.mollyspring.util.MollyConfigUtil;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
@RestController
public class EnvRestController {
    private Environment env;
    private MollyConfigUtil mollyConfigUtil;

    @Builder
    public EnvRestController(Environment env, MollyConfigUtil mollyConfigUtil) {
        this.env = env;
        this.mollyConfigUtil = mollyConfigUtil;
    }

    @GetMapping("/molly-profile")
    public String getProfile() {
        String currentProfile = Arrays.stream(env.getActiveProfiles())
                .filter(mollyConfigUtil.getSERVICE_PROFILE_LIST()::contains)
                .collect(Collectors.joining());

        log.info("[Current Profile] : " + currentProfile);

        return currentProfile;
    }
}
