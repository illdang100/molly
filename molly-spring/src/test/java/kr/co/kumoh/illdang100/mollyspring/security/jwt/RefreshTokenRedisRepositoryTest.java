package kr.co.kumoh.illdang100.mollyspring.security.jwt;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
class RefreshTokenRedisRepositoryTest {

    @Autowired
    RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Test
    public void test() {

        RefreshToken refreshToken = RefreshToken.builder()
                .id("testId")
                .role("CUSTOMER")
                .refreshToken("testToken")
                .build();

        refreshTokenRedisRepository.save(refreshToken);

        Optional<RefreshToken> findTokenOpt = refreshTokenRedisRepository.findByRefreshToken("testToken");

        RefreshToken findToken = findTokenOpt.get();

        Assertions.assertThat(findToken.getId()).isEqualTo("testId");
        Assertions.assertThat(findToken.getRole()).isEqualTo("CUSTOMER");
        Assertions.assertThat(findToken.getRefreshToken()).isEqualTo("testToken");
    }
}